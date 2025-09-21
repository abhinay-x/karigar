# 🚀 KalaAI Deployment Guide

## Quick Deploy Options

### Option 1: Render (Recommended for Demo)

#### Frontend Deployment
1. **Create New Static Site on Render**
   - Connect your GitHub repository
   - **Build Command**: `cd frontend && npm ci && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Node Version**: `18.17.0`

#### Backend Deployment
1. **Create New Web Service on Render**
   - Connect your GitHub repository
   - **Build Command**: `cd backend && npm ci`
   - **Start Command**: `cd backend && npm start`
   - **Node Version**: `18.17.0`
   - **Port**: `10000` (Render default)

#### Environment Variables (Backend)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kala_ai
JWT_SECRET=your-super-secret-jwt-key-here
REDIS_DISABLED=true
```

### Option 2: Vercel (Frontend Only)

#### Deploy Frontend to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod
```

#### Vercel Configuration (vercel.json)
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Option 3: Netlify (Frontend Only)

#### Deploy to Netlify
1. **Drag & Drop**: Upload `frontend/dist` folder to Netlify
2. **Git Integration**: Connect repository
   - **Build Command**: `cd frontend && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Node Version**: `18.17.0`

#### Netlify Configuration (_redirects)
```
/*    /index.html   200
```

## Backend Deployment Options

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy backend
cd backend
railway login
railway init
railway up
```

### Heroku
```bash
# Create Heroku app
heroku create kala-ai-backend

# Set buildpacks
heroku buildpacks:set heroku/nodejs

# Configure for subdirectory
echo "web: cd backend && npm start" > Procfile

# Deploy
git subtree push --prefix backend heroku main
```

### DigitalOcean App Platform
1. Create new app from GitHub
2. **Source Directory**: `backend`
3. **Build Command**: `npm ci`
4. **Run Command**: `npm start`

## Environment Setup

### Required Environment Variables

#### Backend (.env)
```env
# Server Configuration
NODE_ENV=production
PORT=10000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kala_ai

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Redis (Optional - set to true to disable)
REDIS_DISABLED=true

# CORS (Frontend URL)
FRONTEND_URL=https://your-frontend-domain.com

# AI Configuration (Optional - uses mock responses if not set)
HUGGINGFACE_API_KEY=your-huggingface-api-key
```

### MongoDB Setup (MongoDB Atlas)
1. Create free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for demo)
4. Get connection string

## Demo URLs

### Live Demo (After Deployment)
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.onrender.com`
- **Demo Mode**: Add `?demo=true` to any URL

### Local Development
```bash
# Backend
cd backend
npm run dev
# Runs on http://localhost:5000

# Frontend  
cd frontend
npm run dev
# Runs on http://localhost:5173
```

## Troubleshooting

### Common Issues

#### 1. Build Fails - Package.json Not Found
**Solution**: Ensure build commands include directory change
```bash
# Correct
cd frontend && npm ci && npm run build

# Incorrect
npm run build
```

#### 2. CORS Errors
**Solution**: Update backend CORS configuration
```javascript
// backend/server.js
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-frontend-domain.com'
  ]
};
```

#### 3. MongoDB Connection Issues
**Solution**: Check connection string and IP whitelist
```env
# Correct format
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kala_ai?retryWrites=true&w=majority
```

#### 4. Environment Variables Not Loading
**Solution**: Ensure .env file is in correct directory
```bash
backend/.env  # ✅ Correct
.env          # ❌ Wrong location
```

## Performance Optimization

### Frontend
- Static site generation with Vite
- Asset optimization and compression
- CDN integration (automatic with Vercel/Netlify)

### Backend
- MongoDB connection pooling
- Redis caching (optional)
- Compression middleware
- Rate limiting

## Security Checklist

- [ ] Environment variables secured
- [ ] JWT secret is strong (32+ characters)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] HTTPS enforced

## Monitoring

### Health Checks
- **Backend**: `GET /health`
- **Frontend**: Static files served correctly

### Logs
- Check deployment platform logs
- Monitor error rates
- Track API response times

## Demo Mode Features

### Automatic Demo Access
- No signup required
- Instant access with `?demo=true`
- Pre-loaded sample data
- All AI features functional

### Demo User Profile
- **Name**: Rajesh Kumar
- **Craft**: Pottery Master
- **Location**: Jaipur, Rajasthan
- **Experience**: 15+ years

## Support

### Documentation
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas](https://docs.atlas.mongodb.com)

### Quick Deploy Commands
```bash
# Full stack local setup
git clone https://github.com/abhinay-x/kala-ai.git
cd kala-ai
npm run install:all
npm run dev

# Production build
npm run build
```

---

**🎉 KalaAI is ready for global deployment!**

*From village craft to viral content - democratizing digital commerce for 6.8 million Indian artisans worldwide.*
