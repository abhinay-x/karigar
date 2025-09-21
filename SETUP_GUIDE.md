# KalaAI Complete Setup Guide
## 🚀 No Signup Required - Open Source AI Powered

![KalaAI Demo](https://via.placeholder.com/800x200/f59e42/ffffff?text=KalaAI+-+Demo+Ready+%7C+No+Signup+%7C+Open+Source+AI)

## 🎯 Quick Demo Access

**Want to try KalaAI immediately? No signup required!**

```bash
# 1. Start the backend
cd backend
npm install
npm run dev

# 2. Test demo mode (no authentication needed)
curl "http://localhost:5000/api/demo/session"

# 3. Try AI features instantly
curl "http://localhost:5000/api/demo/heritage-story" \
  -H "Content-Type: application/json" \
  -d '{"artisanId": "demo_artisan_1", "interviewText": "My family has been making pottery for 5 generations"}'
```

## 📋 System Requirements

### Minimum Requirements
- **Node.js**: 18.0+ 
- **RAM**: 4GB (8GB recommended for AI models)
- **Storage**: 10GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux

### Recommended for Full AI Features
- **RAM**: 16GB+ 
- **CPU**: 8+ cores
- **GPU**: Optional (NVIDIA GPU for faster AI processing)

## 🛠️ Installation Options

### Option 1: Quick Demo Setup (Recommended)
```bash
# Clone the repository
git clone https://github.com/your-repo/kala-ai.git
cd kala-ai

# Backend setup
cd backend
npm install
cp .env.example .env

# Start in demo mode (uses mock AI responses)
npm run dev

# Frontend setup (in new terminal)
cd ../frontend
npm install
npm run dev
```

**✅ Demo mode works immediately with mock AI responses - no external dependencies!**

### Option 2: Full AI Setup (Advanced)
```bash
# After basic setup above, install AI models
cd backend

# Run the AI setup script
node setup-ai.js

# This will:
# 1. Install Ollama (local LLM server)
# 2. Download required AI models (llama3.1, gemma2, mistral)
# 3. Setup Hugging Face transformers
# 4. Cache models for faster startup
```

## 🎮 Demo Features

### 🧠 AI Heritage Story Generator
```bash
# Generate compelling stories from artisan interviews
curl "http://localhost:5000/api/demo/heritage-story" \
  -H "Content-Type: application/json" \
  -d '{
    "artisanId": "demo_artisan_1",
    "interviewText": "मेरे दादाजी ने मुझे मिट्टी के बर्तन बनाना सिखाया था",
    "options": {
      "tone": "traditional",
      "audience": "international"
    }
  }'
```

### 🎤 Voice Commerce (Hindi/English)
```bash
# Process voice commands in multiple languages
curl "http://localhost:5000/api/demo/voice-command" \
  -H "Content-Type: application/json" \
  -d '{
    "command": "मुझे अपने pottery को online बेचना है",
    "language": "hi"
  }'
```

### 💰 Global Pricing Analysis
```bash
# Get fair pricing recommendations
curl "http://localhost:5000/api/demo/pricing-analysis" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "demo_product_1"
  }'
```

### 🔮 Demand Prediction
```bash
# Predict market demand 3-6 months ahead
curl "http://localhost:5000/api/demo/demand-prediction" \
  -H "Content-Type: application/json" \
  -d '{
    "productCategory": "pottery",
    "timeHorizon": 180
  }'
```

### 📱 Social Media Content Generator
```bash
# Create viral social media content
curl "http://localhost:5000/api/demo/social-content" \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "instagram",
    "productId": "demo_product_1"
  }'
```

## 🏗️ Architecture Overview

### Demo Mode Architecture
```
Frontend (React) ←→ Backend (Express) ←→ Open Source AI
     ↓                    ↓                    ↓
  No Auth Required    Demo Routes         Ollama + HuggingFace
     ↓                    ↓                    ↓
  Mock Data          Sample Artisans     Local AI Models
```

### Technology Stack
- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **AI Models**: 
  - **Ollama**: llama3.1, gemma2, mistral (text generation)
  - **Hugging Face**: BLIP, Whisper, NLLB (vision, speech, translation)
- **Database**: MongoDB Atlas (with demo data)
- **Caching**: Redis (optional)

## 📁 Project Structure

```
kala-ai/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
├── backend/                 # Node.js backend
│   ├── config/
│   │   ├── openSourceAI.js # Open source AI integration
│   │   ├── database.js     # MongoDB connection
│   │   └── redis.js        # Redis caching
│   ├── routes/
│   │   ├── demo.js         # Demo routes (no auth)
│   │   ├── auth.js         # Authentication
│   │   ├── ai.js           # AI services
│   │   └── product.js      # Product management
│   ├── services/
│   │   ├── demoDataService.js        # Demo data provider
│   │   ├── aiHeritageTranslator.js   # Heritage story AI
│   │   └── smartDemandProphet.js     # Demand prediction
│   ├── models/             # Database models
│   ├── middleware/         # Express middleware
│   ├── setup-ai.js         # AI setup script
│   └── package.json
└── SETUP_GUIDE.md          # This file
```

## 🎯 Demo Workflow

### 1. Artisan Onboarding (No Signup)
```javascript
// Get demo artisan profile
GET /api/demo/artisans/demo_artisan_1

// Response includes:
{
  "artisan": {
    "name": "Rajesh Kumar",
    "craft": "pottery",
    "location": "Jaipur, Rajasthan",
    "experience": 25
  },
  "products": [...],
  "analytics": {...}
}
```

### 2. AI Content Generation
```javascript
// Generate heritage story
POST /api/demo/heritage-story
{
  "artisanId": "demo_artisan_1",
  "interviewText": "Traditional craft story...",
  "options": {
    "tone": "storytelling",
    "audience": "international"
  }
}

// AI generates:
{
  "story": "Compelling narrative...",
  "hashtags": ["#HandmadeInIndia", "#BluePottery"],
  "keywords": ["pottery", "traditional", "jaipur"],
  "culturalSignificance": "Heritage explanation..."
}
```

### 3. Voice Commerce
```javascript
// Process Hindi voice command
POST /api/demo/voice-command
{
  "command": "मुझे pottery बेचनी है",
  "language": "hi"
}

// AI understands and responds:
{
  "action": "create_product",
  "response": "मैं आपके pottery के लिए नया प्रोडक्ट बनाता हूं",
  "parameters": {
    "category": "pottery",
    "intent": "sell_product"
  }
}
```

### 4. Market Intelligence
```javascript
// Get pricing analysis
POST /api/demo/pricing-analysis
{
  "productData": {
    "name": "Blue Pottery Vase",
    "category": "pottery",
    "materials": ["clay", "natural pigments"]
  }
}

// AI analyzes global markets:
{
  "recommendedPrice": 2200,
  "priceRange": {"min": 1800, "max": 2800},
  "reasoning": "Based on Etsy/Amazon analysis",
  "culturalPremium": 1.2,
  "confidence": 0.87
}
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/kalaai
REDIS_DISABLED=true  # Optional for demo

# Open Source AI
OLLAMA_HOST=http://localhost:11434
HUGGINGFACE_API_KEY=optional-for-free-tier
DEMO_MODE=true

# JWT (for real auth, optional in demo)
JWT_SECRET=your-secret-key
```

### AI Model Configuration
```javascript
// Available models in config/openSourceAI.js
const MODELS = {
  TEXT_GENERATION: {
    primary: 'llama3.1:8b',    // Main AI model
    fallback: 'gemma2:2b',     // Lightweight backup
    creative: 'mistral:7b'     // Creative content
  },
  IMAGE_PROCESSING: {
    captioning: 'Salesforce/blip-image-captioning-large',
    classification: 'google/vit-base-patch16-224'
  },
  SPEECH: {
    recognition: 'openai/whisper-base',
    synthesis: 'microsoft/speecht5_tts'
  }
};
```

## 🚀 Running the Application

### Development Mode
```bash
# Terminal 1: Backend
cd backend
npm run dev
# Server runs on http://localhost:5000

# Terminal 2: Frontend  
cd frontend
npm run dev
# App runs on http://localhost:3000

# Terminal 3: AI Models (optional for full AI)
ollama serve
# Ollama runs on http://localhost:11434
```

### Production Mode
```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd backend
npm start
```

## 🧪 Testing Demo Features

### 1. Test Demo Session
```bash
curl http://localhost:5000/api/demo/session
```

### 2. Test AI Heritage Story
```bash
curl -X POST http://localhost:5000/api/demo/heritage-story \
  -H "Content-Type: application/json" \
  -d '{"artisanId": "demo_artisan_1"}'
```

### 3. Test Voice Commands
```bash
curl -X POST http://localhost:5000/api/demo/voice-command \
  -H "Content-Type: application/json" \
  -d '{"command": "Show me my orders", "language": "en"}'
```

### 4. Test Frontend with Demo Mode
```bash
# Visit frontend and add ?demo=true to any URL
http://localhost:3000/dashboard?demo=true
```

## 🎨 Demo Data

### Sample Artisans
1. **Rajesh Kumar** - Blue Pottery Master (Jaipur)
2. **Priya Devi** - Silk Weaver (West Bengal)  
3. **Arjun Singh** - Wood Carver (Punjab)

### Sample Products
1. **Traditional Blue Pottery Vase** - ₹2,200
2. **Handwoven Silk Saree** - ₹12,500
3. **Hand Carved Wooden Jewelry Box** - ₹3,000

### Sample Voice Commands
- Hindi: "मुझे pottery बेचनी है" → Create product listing
- English: "Show my sales analytics" → Display dashboard
- Mixed: "Price kitni रखूं?" → Get pricing suggestions

## 🔍 Troubleshooting

### Common Issues

#### 1. AI Models Not Working
```bash
# Check if Ollama is running
curl http://localhost:11434/api/version

# If not installed, use demo mode
# Demo mode works with mock AI responses
```

#### 2. Database Connection Issues
```bash
# Check MongoDB connection
# Demo mode works with in-memory data if DB fails
```

#### 3. Port Conflicts
```bash
# Change ports in .env file
PORT=5001  # Backend
VITE_PORT=3001  # Frontend
```

#### 4. Memory Issues
```bash
# Use lighter AI models
# Edit config/openSourceAI.js:
# Change primary model to 'gemma2:2b'
```

### Performance Optimization

#### 1. Faster AI Responses
```bash
# Pre-cache models
node setup-ai.js

# Use GPU acceleration (if available)
ollama run llama3.1:8b --gpu
```

#### 2. Reduce Memory Usage
```javascript
// Use smaller models in production
const MODELS = {
  TEXT_GENERATION: {
    primary: 'gemma2:2b',  // Instead of llama3.1:8b
    fallback: 'tinyllama'   // Ultra-lightweight
  }
};
```

## 📱 Frontend Integration

### Using Demo Mode in React
```javascript
// Add demo mode to API calls
const apiCall = async (endpoint, data) => {
  const url = `${API_BASE}${endpoint}?demo=true`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Demo-Mode': 'true'  // Alternative method
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

// Example: Generate heritage story
const generateStory = async (interviewText) => {
  return apiCall('/demo/heritage-story', {
    artisanId: 'demo_artisan_1',
    interviewText
  });
};
```

### Demo UI Components
```javascript
// Show demo banner
const DemoBanner = () => (
  <div className="bg-blue-100 p-4 rounded-lg mb-4">
    <h3 className="font-bold text-blue-800">🎮 Demo Mode Active</h3>
    <p className="text-blue-600">
      Exploring KalaAI features with sample data. 
      No signup required!
    </p>
  </div>
);

// Demo feature showcase
const DemoFeatures = () => (
  <div className="grid grid-cols-2 gap-4">
    <button onClick={() => generateHeritageStory()}>
      🧠 AI Story Generator
    </button>
    <button onClick={() => processVoiceCommand()}>
      🎤 Voice Commerce
    </button>
    <button onClick={() => analyzePricing()}>
      💰 Price Analysis
    </button>
    <button onClick={() => predictDemand()}>
      🔮 Demand Prediction
    </button>
  </div>
);
```

## 🌟 Key Features Showcase

### 1. Cultural Intelligence
- **Heritage Preservation**: AI understands cultural significance
- **Authentic Storytelling**: Respects traditional narratives
- **Multi-language Support**: Hindi, English, Bengali, Tamil, Telugu

### 2. Voice-First Design
- **Natural Commands**: "मुझे pottery बेचनी है"
- **Context Awareness**: Remembers conversation flow
- **Regional Accents**: Supports Indian English and regional languages

### 3. Global Market Intelligence
- **Real-time Pricing**: Compares Etsy, Amazon, eBay prices
- **Cultural Premium**: Calculates authenticity value
- **Demand Forecasting**: Predicts trends 3-6 months ahead

### 4. Social Media Optimization
- **Platform-Specific Content**: Instagram, TikTok, Facebook
- **Viral Strategies**: Trending hashtags and engagement tactics
- **Cultural Sensitivity**: Authentic representation

## 🎯 Next Steps

### For Developers
1. **Explore the Code**: Check out the AI services in `/backend/services/`
2. **Customize Models**: Modify `/backend/config/openSourceAI.js`
3. **Add Features**: Extend demo routes in `/backend/routes/demo.js`
4. **Frontend Integration**: Update React components for demo mode

### For Users
1. **Try Demo Features**: Test all AI capabilities without signup
2. **Voice Commands**: Experiment with Hindi/English voice input
3. **Heritage Stories**: Generate compelling artisan narratives
4. **Market Analysis**: Get pricing insights for crafts

### For Deployment
1. **Production Setup**: Configure environment for production
2. **AI Model Optimization**: Choose appropriate model sizes
3. **Scaling**: Implement load balancing for AI services
4. **Monitoring**: Add performance tracking and analytics

## 🤝 Contributing

### Development Workflow
```bash
# 1. Fork the repository
# 2. Create feature branch
git checkout -b feature/new-ai-feature

# 3. Make changes and test
npm run test

# 4. Submit pull request
```

### Adding New AI Features
1. **Create Service**: Add to `/backend/services/`
2. **Add Route**: Create endpoint in `/backend/routes/`
3. **Update Demo**: Add to demo data service
4. **Test**: Ensure demo mode works

## 📞 Support

### Demo Issues
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check README files in each directory
- **Community**: Join discussions about artisan empowerment

### AI Model Issues
- **Ollama Support**: https://ollama.ai/docs
- **Hugging Face**: https://huggingface.co/docs
- **Model Performance**: Check system requirements

---

## 🎉 Ready to Explore!

**KalaAI is now ready for demonstration!**

✅ **No signup required**  
✅ **Open source AI models**  
✅ **Complete feature showcase**  
✅ **Cultural authenticity**  
✅ **Voice commerce in Hindi**  
✅ **Global market intelligence**  

**Start exploring the future of artisan empowerment!** 🚀

```bash
# Quick start command
cd backend && npm run dev
# Then visit: http://localhost:5000/api/demo/session
```

**From village craft to viral content - KalaAI makes it possible!** 🎨✨
