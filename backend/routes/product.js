import express from 'express';
import multer from 'multer';
import { body, validationResult, query } from 'express-validator';
import Product from '../models/Product.js';
import { authenticateToken, requireOwnership } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { analyzeImage } from '../config/openSourceAI.js';
import aiHeritageTranslator from '../services/aiHeritageTranslator.js';
import globalPriceOracle from '../services/globalPriceOracle.js';

const router = express.Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

/**
 * @route GET /api/products
 * @desc Get products with filtering and pagination
 * @access Private
 */
router.get('/', 
  authenticateToken,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('category').optional().isString(),
    query('status').optional().isIn(['draft', 'pending-review', 'active', 'inactive', 'out-of-stock', 'discontinued']),
    query('search').optional().isString(),
    query('sortBy').optional().isIn(['createdAt', 'name', 'price', 'views', 'orders']),
    query('sortOrder').optional().isIn(['asc', 'desc'])
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

      const {
        page = 1,
        limit = 10,
        category,
        status,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Build query
      const query = { artisanId: req.user._id };

      if (category) {
        query['basicInfo.category'] = category;
      }

      if (status) {
        query.status = status;
      }

      if (search) {
        query.$text = { $search: search };
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query with pagination
      const products = await Product.find(query)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('artisanId', 'personalInfo.name personalInfo.location');

      const total = await Product.countDocuments(query);

      res.json({
        success: true,
        message: 'Products retrieved successfully',
        data: {
          products,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalProducts: total,
            hasNext: page * limit < total,
            hasPrev: page > 1
          }
        }
      });

    } catch (error) {
      logger.error('Product retrieval failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve products',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/products/:id
 * @desc Get single product by ID
 * @access Private
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('artisanId', 'personalInfo.name personalInfo.location craftDetails.primaryCraft');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership or if product is published
    if (product.artisanId._id.toString() !== req.user._id.toString() && !product.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Increment view count if not owner
    if (product.artisanId._id.toString() !== req.user._id.toString()) {
      product.performance.views += 1;
      await product.save();
    }

    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });

  } catch (error) {
    logger.error('Product retrieval failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/products
 * @desc Create new product
 * @access Private
 */
router.post('/',
  authenticateToken,
  upload.array('images', 10),
  [
    body('basicInfo.name').notEmpty().withMessage('Product name is required'),
    body('basicInfo.category').isIn(['pottery', 'textiles', 'jewelry', 'woodwork', 'metalwork', 'leather', 'painting', 'sculpture', 'other']),
    body('basicInfo.subcategory').notEmpty().withMessage('Subcategory is required'),
    body('basicInfo.materials').isArray({ min: 1 }).withMessage('At least one material is required'),
    body('pricing.cost').isNumeric().withMessage('Cost must be a number'),
    body('pricing.finalPrice').isNumeric().withMessage('Final price must be a number'),
    body('inventory.quantity').optional().isInt({ min: 0 }),
    body('description').optional().isString()
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

      const productData = req.body;
      productData.artisanId = req.user._id;

      // Handle image uploads
      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(async (file, index) => {
          const fileName = `products/${req.user._id}/${Date.now()}-${index}.${file.originalname.split('.').pop()}`;
          // Mock image URL for demo mode
          const imageUrl = `https://via.placeholder.com/400x400/4A90E2/FFFFFF?text=Product+Image+${index + 1}`;
          
          // Analyze image with AI
          const analysis = await analyzeImage(file.buffer);
          
          return {
            url: imageUrl,
            filename: fileName,
            size: file.size,
            uploadedAt: new Date(),
            isMain: index === 0,
            analysis: {
              labels: analysis.labelAnnotations?.map(label => ({
                description: label.description,
                score: label.score
              })) || [],
              colors: analysis.imagePropertiesAnnotation?.dominantColors?.colors?.map(color => ({
                red: color.color.red || 0,
                green: color.color.green || 0,
                blue: color.color.blue || 0,
                score: color.score
              })) || []
            }
          };
        });

        const uploadedImages = await Promise.all(uploadPromises);
        productData.media = { originalImages: uploadedImages };
      }

      // Create product
      const product = new Product(productData);

      // Generate AI content if description provided
      if (req.body.description) {
        try {
          const aiContent = await aiHeritageTranslator.generateHeritageStory(
            req.user,
            req.body.description,
            {
              tone: req.user.digitalProfile.aiPreferences.contentTone,
              audience: req.user.digitalProfile.aiPreferences.targetAudience
            }
          );

          product.aiGenerated = {
            descriptions: {
              english: aiContent.fullStory,
              hindi: aiContent.fullStory // Would be translated in production
            },
            keywords: aiContent.keywords || [],
            hashtags: aiContent.hashtags || [],
            storyNarrative: aiContent.emotionalCore,
            generatedAt: new Date()
          };
        } catch (aiError) {
          logger.warn('AI content generation failed:', aiError);
        }
      }

      // Get pricing suggestions
      try {
        const pricingSuggestions = await globalPriceOracle.getGlobalPricing(productData);
        product.pricing.suggestedPrice = pricingSuggestions.recommendedPrice;
        product.pricing.priceReasoning = pricingSuggestions.rationale;
      } catch (pricingError) {
        logger.warn('Pricing suggestions failed:', pricingError);
      }

      await product.save();

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });

    } catch (error) {
      logger.error('Product creation failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create product',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route PUT /api/products/:id
 * @desc Update product
 * @access Private
 */
router.put('/:id',
  authenticateToken,
  upload.array('images', 10),
  [
    body('basicInfo.name').optional().notEmpty(),
    body('basicInfo.category').optional().isIn(['pottery', 'textiles', 'jewelry', 'woodwork', 'metalwork', 'leather', 'painting', 'sculpture', 'other']),
    body('pricing.cost').optional().isNumeric(),
    body('pricing.finalPrice').optional().isNumeric(),
    body('inventory.quantity').optional().isInt({ min: 0 })
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

      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check ownership
      if (product.artisanId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Handle new image uploads
      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(async (file, index) => {
          const fileName = `products/${req.user._id}/${Date.now()}-${index}.${file.originalname.split('.').pop()}`;
          // Mock image URL for demo mode
          const imageUrl = `https://via.placeholder.com/400x400/8B4513/FFFFFF?text=Updated+Image+${index + 1}`;
          
          return {
            url: imageUrl,
            filename: fileName,
            size: file.size,
            uploadedAt: new Date(),
            isMain: product.media.originalImages.length === 0 && index === 0
          };
        });

        const uploadedImages = await Promise.all(uploadPromises);
        product.media.originalImages.push(...uploadedImages);
      }

      // Update fields
      Object.keys(req.body).forEach(key => {
        if (req.body[key] !== undefined && key !== 'images') {
          if (typeof req.body[key] === 'object' && !Array.isArray(req.body[key])) {
            product[key] = { ...product[key], ...req.body[key] };
          } else {
            product[key] = req.body[key];
          }
        }
      });

      await product.save();

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });

    } catch (error) {
      logger.error('Product update failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update product',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route DELETE /api/products/:id
 * @desc Delete product
 * @access Private
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.artisanId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    logger.error('Product deletion failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/products/:id/generate-content
 * @desc Generate AI content for product
 * @access Private
 */
router.post('/:id/generate-content',
  authenticateToken,
  [
    body('interviewText').optional().isString(),
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

      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check ownership
      if (product.artisanId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const { interviewText, options = {} } = req.body;
      
      // Use product description if no interview text provided
      const contentSource = interviewText || `Product: ${product.basicInfo.name}. Category: ${product.basicInfo.category}. Materials: ${product.basicInfo.materials.join(', ')}.`;

      const aiContent = await aiHeritageTranslator.generateHeritageStory(
        req.user,
        contentSource,
        {
          tone: options.tone || req.user.digitalProfile.aiPreferences.contentTone,
          audience: options.audience || req.user.digitalProfile.aiPreferences.targetAudience
        }
      );

      // Update product with AI content
      product.aiGenerated = {
        descriptions: {
          english: aiContent.fullStory,
          hindi: aiContent.fullStory // Would be translated in production
        },
        keywords: aiContent.keywords || [],
        hashtags: aiContent.hashtags || [],
        storyNarrative: aiContent.emotionalCore,
        culturalSignificance: aiContent.culturalSignificance,
        generatedAt: new Date(),
        lastUpdated: new Date()
      };

      await product.save();

      res.json({
        success: true,
        message: 'AI content generated successfully',
        data: {
          product,
          aiContent
        }
      });

    } catch (error) {
      logger.error('AI content generation failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate AI content',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/products/:id/pricing-analysis
 * @desc Get pricing analysis for product
 * @access Private
 */
router.post('/:id/pricing-analysis', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.artisanId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const pricingAnalysis = await globalPriceOracle.getGlobalPricing(product.toObject());

    // Update product with pricing insights
    product.pricing.marketComparison = {
      averagePrice: pricingAnalysis.recommendedPrice,
      minPrice: pricingAnalysis.priceRange?.min,
      maxPrice: pricingAnalysis.priceRange?.max,
      competitorCount: pricingAnalysis.competitiveAnalysis?.totalCompetitors || 0,
      lastUpdated: new Date()
    };

    await product.save();

    res.json({
      success: true,
      message: 'Pricing analysis completed',
      data: pricingAnalysis
    });

  } catch (error) {
    logger.error('Pricing analysis failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze pricing',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/products/:id/publish
 * @desc Publish product to make it publicly visible
 * @access Private
 */
router.post('/:id/publish', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.artisanId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    product.isPublished = true;
    product.publishedAt = new Date();
    product.status = 'active';

    await product.save();

    res.json({
      success: true,
      message: 'Product published successfully',
      data: product
    });

  } catch (error) {
    logger.error('Product publishing failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route GET /api/products/trending
 * @desc Get trending products
 * @access Public
 */
router.get('/public/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const trendingProducts = await Product.findTrending(parseInt(limit));

    res.json({
      success: true,
      message: 'Trending products retrieved successfully',
      data: trendingProducts
    });

  } catch (error) {
    logger.error('Trending products retrieval failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve trending products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
