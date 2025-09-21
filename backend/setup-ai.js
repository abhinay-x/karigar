#!/usr/bin/env node

/**
 * Setup script for KalaAI Open Source AI Models
 * This script helps install and configure the required AI models
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { logger } from './utils/logger.js';

const AI_MODELS = {
  ollama: [
    'llama3.1:8b',    // Primary text generation
    'gemma2:2b',      // Lightweight fallback
    'mistral:7b'      // Creative content
  ],
  huggingface: [
    'Salesforce/blip-image-captioning-large',
    'microsoft/swin-base-patch4-window7-224',
    'openai/whisper-base',
    'facebook/nllb-200-distilled-600M'
  ]
};

class AISetup {
  constructor() {
    this.isWindows = process.platform === 'win32';
    this.isMac = process.platform === 'darwin';
    this.isLinux = process.platform === 'linux';
  }

  async checkOllamaInstallation() {
    try {
      const result = await this.runCommand('ollama', ['--version']);
      logger.info('✅ Ollama is already installed');
      return true;
    } catch (error) {
      logger.warn('❌ Ollama is not installed');
      return false;
    }
  }

  async installOllama() {
    logger.info('🔧 Installing Ollama...');
    
    try {
      if (this.isWindows) {
        logger.info('Please download and install Ollama from: https://ollama.ai/download/windows');
        logger.info('After installation, restart this script.');
        return false;
      } else if (this.isMac) {
        await this.runCommand('curl', ['-fsSL', 'https://ollama.ai/install.sh', '|', 'sh']);
      } else if (this.isLinux) {
        await this.runCommand('curl', ['-fsSL', 'https://ollama.ai/install.sh', '|', 'sh']);
      }
      
      logger.info('✅ Ollama installed successfully');
      return true;
    } catch (error) {
      logger.error('❌ Failed to install Ollama:', error.message);
      return false;
    }
  }

  async downloadOllamaModels() {
    logger.info('📦 Downloading Ollama models...');
    
    for (const model of AI_MODELS.ollama) {
      try {
        logger.info(`Downloading ${model}...`);
        await this.runCommand('ollama', ['pull', model]);
        logger.info(`✅ ${model} downloaded successfully`);
      } catch (error) {
        logger.warn(`⚠️ Failed to download ${model}: ${error.message}`);
      }
    }
  }

  async setupHuggingFace() {
    logger.info('🤗 Setting up Hugging Face models...');
    
    try {
      // Install transformers.js
      await this.runCommand('npm', ['install', '@xenova/transformers']);
      logger.info('✅ Transformers.js installed');
      
      // Pre-cache models (optional)
      logger.info('Pre-caching models for faster startup...');
      const cacheScript = `
        import { pipeline } from '@xenova/transformers';
        
        async function cacheModels() {
          try {
            console.log('Caching image captioning model...');
            await pipeline('image-to-text', 'Salesforce/blip-image-captioning-large');
            
            console.log('Caching speech recognition model...');
            await pipeline('automatic-speech-recognition', 'openai/whisper-base');
            
            console.log('✅ Models cached successfully');
          } catch (error) {
            console.warn('⚠️ Model caching failed:', error.message);
          }
        }
        
        cacheModels();
      `;
      
      await fs.writeFile('cache-models.mjs', cacheScript);
      await this.runCommand('node', ['cache-models.mjs']);
      await fs.unlink('cache-models.mjs');
      
    } catch (error) {
      logger.warn('⚠️ Hugging Face setup had issues:', error.message);
    }
  }

  async createEnvFile() {
    const envPath = '.env';
    const envExamplePath = '.env.example';
    
    try {
      // Check if .env already exists
      await fs.access(envPath);
      logger.info('✅ .env file already exists');
    } catch {
      try {
        // Copy from .env.example
        const envExample = await fs.readFile(envExamplePath, 'utf8');
        await fs.writeFile(envPath, envExample);
        logger.info('✅ Created .env file from .env.example');
      } catch (error) {
        logger.warn('⚠️ Could not create .env file:', error.message);
      }
    }
  }

  async runCommand(command, args = []) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, { 
        stdio: 'pipe',
        shell: this.isWindows 
      });
      
      let output = '';
      let error = '';
      
      process.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      process.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(error || `Command failed with code ${code}`));
        }
      });
    });
  }

  async checkSystemRequirements() {
    logger.info('🔍 Checking system requirements...');
    
    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
      logger.error('❌ Node.js 18+ is required. Current version:', nodeVersion);
      return false;
    }
    
    logger.info(`✅ Node.js version: ${nodeVersion}`);
    
    // Check available memory
    const totalMem = Math.round(process.memoryUsage().heapTotal / 1024 / 1024);
    if (totalMem < 2048) {
      logger.warn('⚠️ Low memory detected. AI models may run slowly.');
    } else {
      logger.info(`✅ Memory: ${totalMem}MB available`);
    }
    
    return true;
  }

  async setup() {
    logger.info('🚀 Starting KalaAI Open Source AI Setup...');
    
    // Check system requirements
    const systemOk = await this.checkSystemRequirements();
    if (!systemOk) {
      process.exit(1);
    }
    
    // Create .env file
    await this.createEnvFile();
    
    // Setup Ollama
    const ollamaInstalled = await this.checkOllamaInstallation();
    if (!ollamaInstalled) {
      const installed = await this.installOllama();
      if (!installed) {
        logger.info('Please install Ollama manually and run this script again.');
        process.exit(1);
      }
    }
    
    // Download models
    await this.downloadOllamaModels();
    
    // Setup Hugging Face
    await this.setupHuggingFace();
    
    logger.info('🎉 Setup completed successfully!');
    logger.info('');
    logger.info('Next steps:');
    logger.info('1. Start Ollama: ollama serve');
    logger.info('2. Start the backend: npm run dev');
    logger.info('3. Test demo mode: curl http://localhost:5000/api/demo/session');
    logger.info('');
    logger.info('For demo mode, no signup is required - just add ?demo=true to any endpoint!');
  }
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new AISetup();
  setup.setup().catch((error) => {
    logger.error('Setup failed:', error);
    process.exit(1);
  });
}

export default AISetup;
