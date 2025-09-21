#!/usr/bin/env node

/**
 * KalaAI Deployment Helper Script
 * Helps with common deployment tasks and configurations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 KalaAI Deployment Helper\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json') || !fs.existsSync('frontend') || !fs.existsSync('backend')) {
  console.error('❌ Please run this script from the KalaAI root directory');
  process.exit(1);
}

const commands = {
  'build-frontend': () => {
    console.log('📦 Building frontend...');
    execSync('cd frontend && npm ci && npm run build', { stdio: 'inherit' });
    console.log('✅ Frontend built successfully!');
  },
  
  'build-backend': () => {
    console.log('📦 Installing backend dependencies...');
    execSync('cd backend && npm ci', { stdio: 'inherit' });
    console.log('✅ Backend dependencies installed!');
  },
  
  'build-all': () => {
    console.log('📦 Building entire project...');
    commands['build-backend']();
    commands['build-frontend']();
    console.log('✅ Full project built successfully!');
  },
  
  'check-env': () => {
    console.log('🔍 Checking environment configuration...');
    
    const backendEnvExample = path.join('backend', '.env.example');
    const backendEnv = path.join('backend', '.env');
    
    if (!fs.existsSync(backendEnv)) {
      console.log('⚠️  Backend .env file not found');
      if (fs.existsSync(backendEnvExample)) {
        console.log('💡 Copy .env.example to .env and configure your variables');
      }
    } else {
      console.log('✅ Backend .env file exists');
    }
    
    // Check for required environment variables
    const envContent = fs.existsSync(backendEnv) ? fs.readFileSync(backendEnv, 'utf8') : '';
    const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
    
    requiredVars.forEach(varName => {
      if (envContent.includes(`${varName}=`)) {
        console.log(`✅ ${varName} configured`);
      } else {
        console.log(`⚠️  ${varName} not configured`);
      }
    });
  },
  
  'deploy-info': () => {
    console.log('📋 Deployment Information\n');
    
    console.log('🎯 Quick Deploy Commands:');
    console.log('');
    console.log('Frontend (Vercel):');
    console.log('  cd frontend && vercel --prod');
    console.log('');
    console.log('Frontend (Netlify):');
    console.log('  cd frontend && npm run build');
    console.log('  # Then drag & drop dist/ folder to Netlify');
    console.log('');
    console.log('Backend (Render):');
    console.log('  Build Command: cd backend && npm ci');
    console.log('  Start Command: cd backend && npm start');
    console.log('');
    console.log('🌐 Demo URLs:');
    console.log('  Add ?demo=true to any URL for instant access');
    console.log('  No signup required!');
    console.log('');
    console.log('📚 Full deployment guide: ./DEPLOYMENT.md');
  },
  
  'demo-test': () => {
    console.log('🧪 Testing demo mode...');
    
    try {
      // Check if backend is running
      execSync('curl -f http://localhost:5000/health', { stdio: 'pipe' });
      console.log('✅ Backend is running on http://localhost:5000');
    } catch (error) {
      console.log('❌ Backend not running. Start with: cd backend && npm run dev');
    }
    
    try {
      // Check if frontend is built
      if (fs.existsSync('frontend/dist/index.html')) {
        console.log('✅ Frontend is built');
      } else {
        console.log('❌ Frontend not built. Run: cd frontend && npm run build');
      }
    } catch (error) {
      console.log('❌ Frontend build check failed');
    }
    
    console.log('');
    console.log('🎮 Demo Features Available:');
    console.log('  • AI Heritage Story Generator');
    console.log('  • Voice Commerce (Hindi/English)');
    console.log('  • Global Pricing Analysis');
    console.log('  • Smart Demand Prediction');
    console.log('  • Social Media Content Generator');
  },
  
  'help': () => {
    console.log('Available commands:');
    console.log('  build-frontend  - Build the React frontend');
    console.log('  build-backend   - Install backend dependencies');
    console.log('  build-all       - Build entire project');
    console.log('  check-env       - Check environment configuration');
    console.log('  deploy-info     - Show deployment information');
    console.log('  demo-test       - Test demo functionality');
    console.log('  help            - Show this help message');
    console.log('');
    console.log('Usage: node deploy.js <command>');
  }
};

const command = process.argv[2];

if (!command || !commands[command]) {
  console.log('❓ Unknown command. Available commands:\n');
  commands.help();
  process.exit(1);
}

try {
  commands[command]();
} catch (error) {
  console.error('❌ Command failed:', error.message);
  process.exit(1);
}
