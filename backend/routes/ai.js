import express from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import aiHeritageTranslator from '../services/aiHeritageTranslator.js';
import smartDemandProphet from '../services/smartDemandProphet.js';
import globalPriceOracle from '../services/globalPriceOracle.js';
import { authenticateToken } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Configure multer for audio uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/') || file.mimetype === 'application/octet-stream') {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

// Initialize AI services
router.use(async (req, res, next) => {
  try {
    if (!aiHeritageTranslator.model) await aiHeritageTranslator.initialize();
    if (!smartDemandProphet.model) await smartDemandProphet.initialize();
    if (!globalPriceOracle.model) await globalPriceOracle.initialize();
    next();
  } catch (error) {
    logger.error('AI services initialization failed:', error);
    res.status(500).json({
      success: false,
      message: 'AI services are currently unavailable',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/ai/heritage-story
 * @desc Generate heritage story from artisan interview
 * @access Private
 */
router.post('/heritage-story', 
  authenticateToken,
  [
    body('interviewText').notEmpty().withMessage('Interview text is required'),
    body('options.tone').optional().isIn(['traditional', 'modern', 'storytelling', 'professional']),
    body('options.audience').optional().isIn(['local', 'national', 'international'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { interviewText, options = {} } = req.body;
      const artisanData = req.user; // From auth middleware

      const heritageStory = await aiHeritageTranslator.generateHeritageStory(
        artisanData,
        interviewText,
        options
      );

      res.json({
        success: true,
        message: 'Heritage story generated successfully',
        data: heritageStory
      });

    } catch (error) {
      logger.error('Heritage story generation failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate heritage story',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/ai/heritage-story-demo
 * @desc Generate heritage story (public/demo - no auth)
 * @access Public
 */
router.post('/heritage-story-demo',
  [
    body('interviewText').notEmpty().withMessage('Interview text is required'),
    body('options.tone').optional().isIn(['traditional', 'modern', 'storytelling', 'professional']),
    body('options.audience').optional().isIn(['local', 'national', 'international'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { interviewText, options = {} } = req.body;
      const guestArtisan = {
        personalInfo: {
          name: 'Guest Artisan',
          location: { village: 'Unknown', district: 'Unknown', state: 'India' },
          email: 'guest@kalaai.local'
        },
        craftDetails: { primaryCraft: 'other', experience: 0 }
      };

      const heritageStory = await aiHeritageTranslator.generateHeritageStory(
        guestArtisan,
        interviewText,
        options
      );

      res.json({
        success: true,
        message: 'Heritage story generated successfully',
        data: heritageStory
      });

    } catch (error) {
      logger.error('Public heritage story generation failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate heritage story'
      });
    }
  }
);

/**
 * @route POST /api/ai/viral-content
 * @desc Create viral social media content from heritage story
 * @access Private
 */
router.post('/viral-content',
  authenticateToken,
  [
    body('heritageStory').isObject().withMessage('Heritage story object is required'),
    body('platform').isIn(['instagram', 'tiktok', 'facebook', 'youtube']).withMessage('Valid platform required'),
    body('targetAudience').optional().isIn(['local', 'national', 'international'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { heritageStory, platform, targetAudience = 'international' } = req.body;

      const viralContent = await aiHeritageTranslator.createViralContent(
        heritageStory,
        platform,
        targetAudience
      );

      res.json({
        success: true,
        message: 'Viral content created successfully',
        data: viralContent
      });

    } catch (error) {
      logger.error('Viral content creation failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create viral content',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/ai/translate-story
 * @desc Translate heritage story while preserving cultural nuances
 * @access Private
 */
router.post('/translate-story',
  authenticateToken,
  [
    body('story').notEmpty().withMessage('Story text is required'),
    body('targetLanguage').notEmpty().withMessage('Target language is required'),
    body('sourceLanguage').optional().isString()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { story, targetLanguage, sourceLanguage = 'en' } = req.body;

      const translation = await aiHeritageTranslator.translateWithCulturalPreservation(
        story,
        targetLanguage,
        sourceLanguage
      );

      res.json({
        success: true,
        message: 'Story translated successfully',
        data: translation
      });

    } catch (error) {
      logger.error('Story translation failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to translate story',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/ai/voice-narration
 * @desc Generate voice narration from text
 * @access Private
 */
router.post('/voice-narration',
  authenticateToken,
  [
    body('text').notEmpty().withMessage('Text is required'),
    body('language').optional().isString(),
    body('voiceStyle').optional().isIn(['storytelling', 'professional', 'friendly'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { text, language = 'hi-IN', voiceStyle = 'storytelling' } = req.body;

      const narration = await aiHeritageTranslator.generateVoiceNarration(
        text,
        language,
        voiceStyle
      );

      // Convert audio buffer to base64 for JSON response
      const audioBase64 = narration.audioBuffer.toString('base64');

      res.json({
        success: true,
        message: 'Voice narration generated successfully',
        data: {
          ...narration,
          audioBuffer: audioBase64
        }
      });

    } catch (error) {
      logger.error('Voice narration generation failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate voice narration',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/ai/demand-prediction
 * @desc Predict demand for product category 3-6 months ahead
 * @access Private
 */
router.post('/demand-prediction',
  authenticateToken,
  [
    body('productCategory').notEmpty().withMessage('Product category is required'),
    body('timeHorizon').optional().isInt({ min: 30, max: 365 }),
    body('region').optional().isString()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { productCategory, timeHorizon = 180, region = 'global' } = req.body;

      const prediction = await smartDemandProphet.predictDemand(
        productCategory,
        timeHorizon,
        region
      );

      res.json({
        success: true,
        message: 'Demand prediction generated successfully',
        data: prediction
      });

    } catch (error) {
      logger.error('Demand prediction failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to predict demand',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/ai/design-trends
 * @desc Analyze emerging design trends and color palettes
 * @access Private
 */
router.post('/design-trends',
  authenticateToken,
  [
    body('craftType').notEmpty().withMessage('Craft type is required'),
    body('targetMarket').optional().isIn(['local', 'national', 'international'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { craftType, targetMarket = 'international' } = req.body;

      const trends = await smartDemandProphet.analyzeDesignTrends(
        craftType,
        targetMarket
      );

      res.json({
        success: true,
        message: 'Design trends analyzed successfully',
        data: trends
      });

    } catch (error) {
      logger.error('Design trends analysis failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to analyze design trends',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/ai/global-pricing
 * @desc Get real-time global pricing analysis
 * @access Private
 */
router.post('/global-pricing',
  authenticateToken,
  [
    body('productData').isObject().withMessage('Product data is required'),
    body('targetMarkets').optional().isArray()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { productData, targetMarkets = ['US', 'EU', 'UK', 'AU'] } = req.body;

      const pricing = await globalPriceOracle.getGlobalPricing(
        productData,
        targetMarkets
      );

      res.json({
        success: true,
        message: 'Global pricing analysis completed',
        data: pricing
      });

    } catch (error) {
      logger.error('Global pricing analysis failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to analyze global pricing',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/ai/compare-products
 * @desc Compare product with similar items globally
 * @access Private
 */
router.post('/compare-products',
  authenticateToken,
  [
    body('productData').isObject().withMessage('Product data is required'),
    body('limit').optional().isInt({ min: 5, max: 50 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { productData, limit = 20 } = req.body;

      const comparison = await globalPriceOracle.compareWithSimilarProducts(
        productData,
        limit
      );

      res.json({
        success: true,
        message: 'Product comparison completed',
        data: comparison
      });

    } catch (error) {
      logger.error('Product comparison failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to compare products',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/ai/dynamic-pricing
 * @desc Calculate dynamic pricing based on demand and competition
 * @access Private
 */
router.post('/dynamic-pricing',
  authenticateToken,
  [
    body('productData').isObject().withMessage('Product data is required'),
    body('demandLevel').optional().isIn(['low', 'medium', 'high', 'very_high']),
    body('competitionLevel').optional().isIn(['low', 'medium', 'high', 'very_high'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { productData, demandLevel = 'medium', competitionLevel = 'medium' } = req.body;

      const dynamicPricing = await globalPriceOracle.calculateDynamicPricing(
        productData,
        demandLevel,
        competitionLevel
      );

      res.json({
        success: true,
        message: 'Dynamic pricing calculated successfully',
        data: dynamicPricing
      });

    } catch (error) {
      logger.error('Dynamic pricing calculation failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate dynamic pricing',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/ai/pricing-ab-tests
 * @desc Generate A/B testing recommendations for pricing
 * @access Private
 */
router.post('/pricing-ab-tests',
  authenticateToken,
  [
    body('productData').isObject().withMessage('Product data is required'),
    body('currentPrice').isNumeric().withMessage('Current price is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { productData, currentPrice } = req.body;

      const abTests = await globalPriceOracle.generatePricingABTests(
        productData,
        parseFloat(currentPrice)
      );

      res.json({
        success: true,
        message: 'A/B testing recommendations generated',
        data: abTests
      });

    } catch (error) {
      logger.error('A/B test generation failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate A/B tests',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/ai/status
 * @desc Get AI services status
 * @access Private
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const status = {
      heritageTranslator: !!aiHeritageTranslator.model,
      demandProphet: !!smartDemandProphet.model,
      priceOracle: !!globalPriceOracle.model,
      timestamp: new Date(),
      version: '1.0.0'
    };

    res.json({
      success: true,
      message: 'AI services status retrieved',
      data: status
    });

  } catch (error) {
    logger.error('AI status check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI services status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
