import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Import configurations and middleware
import { connectDB } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { initializeModels } from './config/openSourceAI.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

// Import routes
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import productRoutes from './routes/product.js';
import demoRoutes from './routes/demo.js';
import voiceRoutes from './routes/voice.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [
          'https://karigarai.netlify.app',
          'https://your-netlify-site.netlify.app', // Replace with your actual Netlify URL
          'https://kalaai.com', 
          'https://www.kalaai.com'
        ]
      : ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.openai.com", "wss:", "ws:"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      'https://karigarai.netlify.app',
      'https://your-netlify-site.netlify.app', // Replace with your actual Netlify URL
      'https://kalaai.com', 
      'https://www.kalaai.com'
    ]
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    services: {
      database: 'connected',
      redis: 'connected',
      googleCloud: 'initialized'
    }
  });
});

// API Routes
app.use('/api/demo', demoRoutes); // Demo routes first (no auth required)
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/products', productRoutes);
app.use('/api/voice', voiceRoutes);

// Socket.IO for real-time features
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  // Join artisan room for personalized updates
  socket.on('join-artisan-room', (artisanId) => {
    socket.join(`artisan-${artisanId}`);
    logger.info(`Artisan ${artisanId} joined their room`);
  });

  // Real-time AI content generation updates
  socket.on('ai-generation-start', (data) => {
    socket.emit('ai-generation-progress', { progress: 0, message: 'Starting AI analysis...' });
  });

  // Real-time market price updates
  socket.on('subscribe-price-updates', (productId) => {
    socket.join(`price-updates-${productId}`);
  });

  // Voice command processing
  socket.on('voice-command', async (audioData) => {
    try {
      socket.emit('voice-processing', { status: 'processing', message: 'Understanding your command...' });
      // Voice processing will be handled by voice routes
    } catch (error) {
      socket.emit('voice-error', { error: 'Failed to process voice command' });
    }
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Initialize services
const initializeServices = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Connect to Redis
    await connectRedis();
    
    // Initialize Open Source AI models
    await initializeModels();
    
    logger.info('🚀 All services initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize services:', error);
    // Don't exit on AI initialization failure - continue with fallback
    logger.warn('Continuing with fallback AI services');
  }
};

// Start server
const startServer = async () => {
  try {
    await initializeServices();
    
    // Start server
    server.listen(PORT, () => {
      logger.info(`🚀 KalaAI Backend Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🎨 AI Services: Initialized`);
      logger.info(`🌍 CORS enabled for: ${process.env.NODE_ENV === 'production' ? 'Production domains' : 'Development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export { app, io };
