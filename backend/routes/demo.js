import express from 'express';
import demoDataService from '../services/demoDataService.js';
import aiHeritageTranslator from '../services/aiHeritageTranslator.js';
import { generateText, processVoiceCommand, predictDemand, analyzePricing } from '../config/openSourceAI.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * @route GET /api/demo/session
 * @desc Create a demo session without authentication
 * @access Public
 */
router.get('/session', async (req, res) => {
  try {
    const demoSession = demoDataService.createDemoSession();
    
    res.json({
      success: true,
      message: 'Demo session created successfully',
      data: demoSession,
      instructions: {
        message: 'Welcome to KalaAI Demo! Explore all features without signup.',
        features: [
          'AI Heritage Story Generation',
          'Voice Commands in Hindi/English',
          'Global Pricing Analysis',
          'Demand Prediction',
          'Social Media Content Creation'
        ],
        usage: 'Add ?demo=true to any API endpoint to use demo mode'
      }
    });

  } catch (error) {
    logger.error('Demo session creation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create demo session'
    });
  }
});

/**
 * @route GET /api/demo/artisans
 * @desc Get all demo artisan profiles
 * @access Public
 */
router.get('/artisans', async (req, res) => {
  try {
    const artisans = demoDataService.getAllDemoArtisans();
    
    res.json({
      success: true,
      message: 'Demo artisans retrieved successfully',
      data: artisans,
      count: artisans.length
    });

  } catch (error) {
    logger.error('Demo artisans retrieval failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve demo artisans'
    });
  }
});

/**
 * @route GET /api/demo/artisans/:id
 * @desc Get specific demo artisan
 * @access Public
 */
router.get('/artisans/:id', async (req, res) => {
  try {
    const artisan = demoDataService.getDemoArtisan(req.params.id);
    
    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: 'Demo artisan not found'
      });
    }

    const products = demoDataService.getDemoProducts(artisan._id);
    const analytics = demoDataService.getDemoAnalytics(artisan._id);

    res.json({
      success: true,
      message: 'Demo artisan retrieved successfully',
      data: {
        artisan,
        products,
        analytics
      }
    });

  } catch (error) {
    logger.error('Demo artisan retrieval failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve demo artisan'
    });
  }
});

/**
 * @route GET /api/demo/products
 * @desc Get all demo products
 * @access Public
 */
router.get('/products', async (req, res) => {
  try {
    const { artisanId } = req.query;
    const products = demoDataService.getDemoProducts(artisanId);
    
    res.json({
      success: true,
      message: 'Demo products retrieved successfully',
      data: products,
      count: products.length
    });

  } catch (error) {
    logger.error('Demo products retrieval failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve demo products'
    });
  }
});

/**
 * @route POST /api/demo/heritage-story
 * @desc Generate heritage story using demo data
 * @access Public
 */
router.post('/heritage-story', async (req, res) => {
  try {
    const { artisanId, interviewText, options = {} } = req.body;
    
    const artisan = demoDataService.getDemoArtisan(artisanId);
    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: 'Demo artisan not found'
      });
    }

    // Use sample interview if none provided
    const interview = interviewText || demoDataService.getSampleInterview(artisan.craftDetails.primaryCraft);
    
    const heritageStory = await aiHeritageTranslator.generateHeritageStory(
      artisan,
      interview,
      options
    );

    res.json({
      success: true,
      message: 'Heritage story generated successfully',
      data: heritageStory,
      demo: true
    });

  } catch (error) {
    logger.error('Demo heritage story generation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate heritage story',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/demo/voice-command
 * @desc Process voice command in demo mode
 * @access Public
 */
router.post('/voice-command', async (req, res) => {
  try {
    const { command, language = 'hi' } = req.body;
    
    if (!command) {
      return res.status(400).json({
        success: false,
        message: 'Voice command is required'
      });
    }

    // Get sample commands if none provided
    const sampleCommands = demoDataService.getSampleVoiceCommands();
    
    // Try to process the command
    const result = await processVoiceCommand(command, {
      language,
      demo: true,
      artisan: demoDataService.getDemoArtisan()
    });

    res.json({
      success: true,
      message: 'Voice command processed successfully',
      data: result,
      sampleCommands,
      demo: true
    });

  } catch (error) {
    logger.error('Demo voice command processing failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process voice command',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/demo/pricing-analysis
 * @desc Get pricing analysis for demo product
 * @access Public
 */
router.post('/pricing-analysis', async (req, res) => {
  try {
    const { productId, productData } = req.body;
    
    let product;
    if (productId) {
      product = demoDataService.getDemoProduct(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Demo product not found'
        });
      }
    } else if (productData) {
      product = productData;
    } else {
      // Use random demo product
      const products = demoDataService.getDemoProducts();
      product = products[Math.floor(Math.random() * products.length)];
    }

    const pricingAnalysis = await analyzePricing(product, []);

    res.json({
      success: true,
      message: 'Pricing analysis completed',
      data: pricingAnalysis,
      product: product.basicInfo || product,
      demo: true
    });

  } catch (error) {
    logger.error('Demo pricing analysis failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze pricing',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/demo/demand-prediction
 * @desc Get demand prediction for demo product
 * @access Public
 */
router.post('/demand-prediction', async (req, res) => {
  try {
    const { productCategory, timeHorizon = 180 } = req.body;
    
    const category = productCategory || 'pottery';
    const mockHistoricalData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      demand: Math.floor(Math.random() * 100) + 50,
      sales: Math.floor(Math.random() * 50000) + 10000
    }));

    const demandPrediction = await predictDemand({
      category,
      timeHorizon,
      name: `Demo ${category} product`
    }, mockHistoricalData);

    res.json({
      success: true,
      message: 'Demand prediction completed',
      data: demandPrediction,
      historicalData: mockHistoricalData,
      demo: true
    });

  } catch (error) {
    logger.error('Demo demand prediction failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to predict demand',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/demo/social-content
 * @desc Generate social media content for demo
 * @access Public
 */
router.post('/social-content', async (req, res) => {
  try {
    const { platform = 'instagram', productId, heritageStory } = req.body;
    
    let story = heritageStory;
    if (!story && productId) {
      const product = demoDataService.getDemoProduct(productId);
      if (product) {
        story = product.aiGenerated?.storyNarrative || 'Beautiful handcrafted item with rich cultural heritage.';
      }
    }
    
    if (!story) {
      story = 'Traditional Indian craft made with love and generations of wisdom.';
    }

    const prompt = `Create engaging ${platform} content for this heritage story: ${story}
    Make it viral, authentic, and culturally respectful. Include hashtags and call-to-action.`;

    const result = await generateText(prompt, {
      temperature: 0.8,
      maxTokens: 500
    });

    const hashtags = demoDataService.getTrendingHashtags(req.body.category || 'pottery');

    res.json({
      success: true,
      message: 'Social media content generated successfully',
      data: {
        content: result.text || 'Beautiful handcrafted treasures from India! 🇮🇳✨ Each piece tells a story of tradition and love. #HandmadeInIndia #CulturalHeritage',
        hashtags,
        platform,
        engagementTips: [
          'Post during peak hours (7-9 PM IST)',
          'Use high-quality images with good lighting',
          'Engage with comments within first hour',
          'Share behind-the-scenes content'
        ]
      },
      demo: true
    });

  } catch (error) {
    logger.error('Demo social content generation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate social content',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route GET /api/demo/analytics/:artisanId
 * @desc Get demo analytics for artisan
 * @access Public
 */
router.get('/analytics/:artisanId', async (req, res) => {
  try {
    const analytics = demoDataService.getDemoAnalytics(req.params.artisanId);
    
    res.json({
      success: true,
      message: 'Demo analytics retrieved successfully',
      data: analytics,
      demo: true
    });

  } catch (error) {
    logger.error('Demo analytics retrieval failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics'
    });
  }
});

/**
 * @route GET /api/demo/features
 * @desc Get list of available demo features
 * @access Public
 */
router.get('/features', async (req, res) => {
  try {
    const features = {
      aiFeatures: [
        {
          name: 'Heritage Story Generator',
          description: 'Convert traditional craft stories into compelling narratives',
          endpoint: '/api/demo/heritage-story',
          demo: true
        },
        {
          name: 'Voice Commerce',
          description: 'Manage business through voice commands in Hindi/English',
          endpoint: '/api/demo/voice-command',
          demo: true
        },
        {
          name: 'Global Pricing Oracle',
          description: 'Get fair pricing recommendations based on global markets',
          endpoint: '/api/demo/pricing-analysis',
          demo: true
        },
        {
          name: 'Smart Demand Prophet',
          description: 'Predict customer demand 3-6 months in advance',
          endpoint: '/api/demo/demand-prediction',
          demo: true
        },
        {
          name: 'Viral Content Creator',
          description: 'Generate social media content for maximum engagement',
          endpoint: '/api/demo/social-content',
          demo: true
        }
      ],
      sampleData: {
        artisans: demoDataService.getAllDemoArtisans().length,
        products: demoDataService.getDemoProducts().length,
        voiceCommands: demoDataService.getSampleVoiceCommands().length
      },
      usage: {
        message: 'All demo features are free and unlimited',
        authentication: 'No signup required - just add ?demo=true to any endpoint',
        limitations: 'Demo uses sample data and open-source AI models'
      }
    };

    res.json({
      success: true,
      message: 'Demo features retrieved successfully',
      data: features
    });

  } catch (error) {
    logger.error('Demo features retrieval failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve demo features'
    });
  }
});

export default router;
