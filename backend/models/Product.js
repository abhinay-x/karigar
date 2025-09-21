import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // Basic Information
  artisanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artisan',
    required: [true, 'Artisan ID is required'],
    index: true
  },
  basicInfo: {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxLength: [200, 'Product name cannot exceed 200 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['pottery', 'textiles', 'jewelry', 'woodwork', 'metalwork', 'leather', 'painting', 'sculpture', 'other']
    },
    subcategory: {
      type: String,
      required: [true, 'Subcategory is required'],
      trim: true
    },
    materials: [{
      type: String,
      trim: true,
      required: true
    }],
    colors: [{
      type: String,
      trim: true
    }],
    dimensions: {
      length: {
        type: Number,
        min: [0, 'Length cannot be negative']
      },
      width: {
        type: Number,
        min: [0, 'Width cannot be negative']
      },
      height: {
        type: Number,
        min: [0, 'Height cannot be negative']
      },
      weight: {
        type: Number,
        min: [0, 'Weight cannot be negative']
      },
      unit: {
        type: String,
        enum: ['cm', 'inch', 'mm', 'm'],
        default: 'cm'
      }
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    sku: {
      type: String,
      unique: true,
      sparse: true
    }
  },

  // AI Generated Content
  aiGenerated: {
    descriptions: {
      hindi: {
        type: String,
        maxLength: [2000, 'Hindi description too long']
      },
      english: {
        type: String,
        maxLength: [2000, 'English description too long']
      },
      bengali: {
        type: String,
        maxLength: [2000, 'Bengali description too long']
      },
      tamil: {
        type: String,
        maxLength: [2000, 'Tamil description too long']
      },
      telugu: {
        type: String,
        maxLength: [2000, 'Telugu description too long']
      },
      marathi: {
        type: String,
        maxLength: [2000, 'Marathi description too long']
      }
    },
    keywords: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    hashtags: [{
      type: String,
      trim: true,
      match: [/^#[a-zA-Z0-9_]+$/, 'Invalid hashtag format']
    }],
    storyNarrative: {
      type: String,
      maxLength: [3000, 'Story narrative too long']
    },
    culturalSignificance: {
      type: String,
      maxLength: [1500, 'Cultural significance description too long']
    },
    seoTitle: {
      type: String,
      maxLength: [100, 'SEO title too long']
    },
    seoDescription: {
      type: String,
      maxLength: [300, 'SEO description too long']
    },
    socialMediaCaptions: {
      instagram: String,
      facebook: String,
      whatsapp: String,
      twitter: String,
      pinterest: String
    },
    generatedAt: {
      type: Date,
      default: Date.now
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },

  // Media Assets
  media: {
    originalImages: [{
      url: String,
      filename: String,
      size: Number,
      uploadedAt: Date,
      isMain: Boolean
    }],
    enhancedImages: [{
      url: String,
      filename: String,
      originalUrl: String,
      enhancementType: {
        type: String,
        enum: ['background-removal', 'lighting-correction', 'quality-enhancement', 'color-correction']
      },
      processedAt: Date
    }],
    videos: [{
      url: String,
      filename: String,
      duration: Number,
      thumbnail: String,
      uploadedAt: Date
    }],
    threeDModel: {
      url: String,
      format: String,
      size: Number
    }
  },

  // Pricing Information
  pricing: {
    cost: {
      type: Number,
      required: [true, 'Cost is required'],
      min: [0, 'Cost cannot be negative']
    },
    suggestedPrice: {
      type: Number,
      min: [0, 'Suggested price cannot be negative']
    },
    finalPrice: {
      type: Number,
      required: [true, 'Final price is required'],
      min: [0, 'Final price cannot be negative']
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative']
    },
    priceReasoning: {
      type: String,
      maxLength: [500, 'Price reasoning too long']
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR', 'GBP']
    },
    priceHistory: [{
      price: Number,
      changedAt: Date,
      reason: String
    }],
    marketComparison: {
      averagePrice: Number,
      minPrice: Number,
      maxPrice: Number,
      competitorCount: Number,
      lastUpdated: Date
    }
  },

  // Inventory Management
  inventory: {
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 1
    },
    isUnlimited: {
      type: Boolean,
      default: false
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: [0, 'Low stock threshold cannot be negative']
    },
    restockDate: Date,
    productionTime: {
      type: Number, // in days
      min: [0, 'Production time cannot be negative']
    }
  },

  // Performance Metrics
  performance: {
    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative']
    },
    likes: {
      type: Number,
      default: 0,
      min: [0, 'Likes cannot be negative']
    },
    shares: {
      type: Number,
      default: 0,
      min: [0, 'Shares cannot be negative']
    },
    orders: {
      type: Number,
      default: 0,
      min: [0, 'Orders cannot be negative']
    },
    revenue: {
      type: Number,
      default: 0,
      min: [0, 'Revenue cannot be negative']
    },
    conversionRate: {
      type: Number,
      default: 0,
      min: [0, 'Conversion rate cannot be negative'],
      max: [100, 'Conversion rate cannot exceed 100%']
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: [0, 'Total reviews cannot be negative']
    },
    wishlistCount: {
      type: Number,
      default: 0,
      min: [0, 'Wishlist count cannot be negative']
    }
  },

  // AI Insights & Predictions
  aiInsights: {
    demandPrediction: {
      nextMonth: Number,
      nextQuarter: Number,
      seasonalTrends: [{
        season: String,
        demandMultiplier: Number
      }],
      lastUpdated: Date
    },
    trendAnalysis: {
      trendScore: {
        type: Number,
        min: [0, 'Trend score cannot be negative'],
        max: [100, 'Trend score cannot exceed 100']
      },
      trendingKeywords: [String],
      competitorAnalysis: [{
        platform: String,
        averagePrice: Number,
        popularFeatures: [String]
      }],
      lastAnalyzed: Date
    },
    designSuggestions: [{
      suggestion: String,
      reasoning: String,
      confidence: Number,
      implementationDifficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard']
      }
    }],
    marketingInsights: {
      bestPostingTimes: [String],
      optimalHashtags: [String],
      targetAudience: String,
      contentStrategy: String
    }
  },

  // Status & Workflow
  status: {
    type: String,
    enum: ['draft', 'pending-review', 'active', 'inactive', 'out-of-stock', 'discontinued'],
    default: 'draft'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  isFeatured: {
    type: Boolean,
    default: false
  },
  featuredUntil: Date,

  // Shipping & Logistics
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    fragile: {
      type: Boolean,
      default: false
    },
    customPackaging: {
      type: Boolean,
      default: false
    },
    shippingCost: {
      domestic: Number,
      international: Number
    },
    processingTime: {
      type: Number, // in days
      default: 2
    }
  },

  // Customization Options
  customization: {
    isCustomizable: {
      type: Boolean,
      default: false
    },
    customizationOptions: [{
      name: String,
      type: {
        type: String,
        enum: ['color', 'size', 'text', 'pattern', 'material']
      },
      options: [String],
      additionalCost: Number
    }],
    customizationInstructions: String
  },

  // Sustainability & Ethics
  sustainability: {
    ecoFriendly: {
      type: Boolean,
      default: true
    },
    sustainableMaterials: [String],
    carbonFootprint: String,
    ethicalSourcing: {
      type: Boolean,
      default: true
    },
    certifications: [{
      name: String,
      issuedBy: String,
      certificateUrl: String
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ artisanId: 1, status: 1 });
productSchema.index({ 'basicInfo.category': 1, status: 1 });
productSchema.index({ 'pricing.finalPrice': 1 });
productSchema.index({ 'performance.views': -1 });
productSchema.index({ 'performance.orders': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'aiGenerated.keywords': 1 });
productSchema.index({ 'basicInfo.tags': 1 });
productSchema.index({ isPublished: 1, status: 1 });

// Text search index
productSchema.index({
  'basicInfo.name': 'text',
  'aiGenerated.descriptions.english': 'text',
  'aiGenerated.descriptions.hindi': 'text',
  'aiGenerated.keywords': 'text',
  'basicInfo.tags': 'text'
});

// Virtual for main image
productSchema.virtual('mainImage').get(function() {
  const enhancedImages = this.media.enhancedImages;
  const originalImages = this.media.originalImages;
  
  if (enhancedImages && enhancedImages.length > 0) {
    return enhancedImages.find(img => img.isMain) || enhancedImages[0];
  }
  
  if (originalImages && originalImages.length > 0) {
    return originalImages.find(img => img.isMain) || originalImages[0];
  }
  
  return null;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.pricing.discountPrice && this.pricing.finalPrice) {
    return Math.round(((this.pricing.finalPrice - this.pricing.discountPrice) / this.pricing.finalPrice) * 100);
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.inventory.isUnlimited) return 'unlimited';
  if (this.inventory.quantity === 0) return 'out-of-stock';
  if (this.inventory.quantity <= this.inventory.lowStockThreshold) return 'low-stock';
  return 'in-stock';
});

// Pre-save middleware to generate SKU
productSchema.pre('save', function(next) {
  if (!this.basicInfo.sku) {
    const categoryCode = this.basicInfo.category.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.basicInfo.sku = `${categoryCode}-${randomNum}`;
  }
  next();
});

// Method to calculate popularity score
productSchema.methods.calculatePopularityScore = function() {
  const viewsWeight = 0.3;
  const ordersWeight = 0.4;
  const likesWeight = 0.2;
  const ratingWeight = 0.1;
  
  const normalizedViews = Math.min(this.performance.views / 1000, 1);
  const normalizedOrders = Math.min(this.performance.orders / 100, 1);
  const normalizedLikes = Math.min(this.performance.likes / 500, 1);
  const normalizedRating = this.performance.averageRating / 5;
  
  return (
    normalizedViews * viewsWeight +
    normalizedOrders * ordersWeight +
    normalizedLikes * likesWeight +
    normalizedRating * ratingWeight
  ) * 100;
};

// Method to check if product needs restock
productSchema.methods.needsRestock = function() {
  return !this.inventory.isUnlimited && 
         this.inventory.quantity <= this.inventory.lowStockThreshold;
};

// Static method to find trending products
productSchema.statics.findTrending = function(limit = 10) {
  return this.find({ 
    status: 'active', 
    isPublished: true 
  })
  .sort({ 
    'performance.views': -1, 
    'performance.orders': -1,
    createdAt: -1 
  })
  .limit(limit)
  .populate('artisanId', 'personalInfo.name personalInfo.location craftDetails.primaryCraft');
};

// Static method to find products by price range
productSchema.statics.findByPriceRange = function(minPrice, maxPrice) {
  return this.find({
    'pricing.finalPrice': { $gte: minPrice, $lte: maxPrice },
    status: 'active',
    isPublished: true
  });
};

// Static method to find products needing AI content update
productSchema.statics.findNeedingContentUpdate = function() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.find({
    $or: [
      { 'aiGenerated.lastUpdated': { $lt: thirtyDaysAgo } },
      { 'aiGenerated.descriptions.english': { $exists: false } }
    ],
    status: 'active'
  });
};

export default mongoose.model('Product', productSchema);
