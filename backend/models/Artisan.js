import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const artisanSchema = new mongoose.Schema({
  // Personal Information
  personalInfo: {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxLength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number']
    },
    whatsapp: {
      type: String,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid WhatsApp number']
    },
    age: {
      type: Number,
      min: [18, 'Age must be at least 18'],
      max: [100, 'Age cannot exceed 100']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
      default: 'prefer-not-to-say'
    },
    profileImage: {
      type: String,
      default: null
    },
    location: {
      state: {
        type: String,
        required: [true, 'State is required']
      },
      district: {
        type: String,
        required: [true, 'District is required']
      },
      village: {
        type: String,
        required: [true, 'Village/City is required']
      },
      pincode: {
        type: String,
        match: [/^[1-9][0-9]{5}$/, 'Please enter a valid pincode']
      },
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    languages: [{
      type: String,
      enum: ['hi', 'en', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'or', 'pa', 'as', 'ur']
    }],
    preferredLanguage: {
      type: String,
      enum: ['hi', 'en', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'or', 'pa', 'as', 'ur'],
      default: 'hi'
    }
  },

  // Authentication
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['artisan', 'admin', 'moderator'],
    default: 'artisan'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  // Craft Details
  craftDetails: {
    primaryCraft: {
      type: String,
      required: [true, 'Primary craft is required'],
      enum: ['pottery', 'textiles', 'jewelry', 'woodwork', 'metalwork', 'leather', 'painting', 'sculpture', 'other']
    },
    specializations: [{
      type: String,
      trim: true
    }],
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: [0, 'Experience cannot be negative'],
      max: [80, 'Experience cannot exceed 80 years']
    },
    techniques: [{
      name: String,
      description: String,
      culturalSignificance: String
    }],
    culturalBackground: {
      type: String,
      maxLength: [1000, 'Cultural background cannot exceed 1000 characters']
    },
    heritageStory: {
      type: String,
      maxLength: [2000, 'Heritage story cannot exceed 2000 characters']
    },
    familyTradition: {
      generations: {
        type: Number,
        min: [1, 'Must be at least 1 generation']
      },
      originStory: String,
      famousAncestors: [String]
    },
    awards: [{
      name: String,
      year: Number,
      organization: String,
      description: String
    }],
    certifications: [{
      name: String,
      issuedBy: String,
      issuedDate: Date,
      expiryDate: Date,
      certificateUrl: String
    }]
  },

  // Digital Profile
  digitalProfile: {
    storefront: {
      url: {
        type: String,
        unique: true,
        sparse: true
      },
      isActive: {
        type: Boolean,
        default: false
      },
      theme: {
        type: String,
        enum: ['heritage', 'modern', 'artisan'],
        default: 'heritage'
      },
      customizations: {
        colors: {
          primary: String,
          secondary: String,
          accent: String
        },
        fonts: {
          heading: String,
          body: String
        },
        layout: {
          type: String,
          enum: ['grid', 'list', 'masonry'],
          default: 'grid'
        }
      }
    },
    socialMedia: {
      instagram: String,
      facebook: String,
      youtube: String,
      tiktok: String,
      pinterest: String
    },
    aiPreferences: {
      contentTone: {
        type: String,
        enum: ['traditional', 'modern', 'storytelling', 'professional'],
        default: 'traditional'
      },
      targetAudience: {
        type: String,
        enum: ['local', 'national', 'international'],
        default: 'national'
      },
      voicePersonality: {
        type: String,
        enum: ['friendly', 'professional', 'enthusiastic', 'calm'],
        default: 'friendly'
      }
    }
  },

  // Business Metrics
  businessMetrics: {
    totalSales: {
      type: Number,
      default: 0,
      min: [0, 'Total sales cannot be negative']
    },
    totalOrders: {
      type: Number,
      default: 0,
      min: [0, 'Total orders cannot be negative']
    },
    avgOrderValue: {
      type: Number,
      default: 0,
      min: [0, 'Average order value cannot be negative']
    },
    customerRating: {
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
    digitalScore: {
      type: Number,
      default: 0,
      min: [0, 'Digital score cannot be negative'],
      max: [100, 'Digital score cannot exceed 100']
    },
    monthlyStats: [{
      month: Date,
      sales: Number,
      orders: Number,
      views: Number,
      engagement: Number
    }]
  },

  // AI Generated Content
  aiContent: {
    heritageStories: [{
      language: String,
      content: String,
      generatedAt: Date,
      isActive: Boolean
    }],
    productDescriptionTemplates: [{
      category: String,
      template: String,
      language: String
    }],
    socialMediaContent: [{
      platform: String,
      content: String,
      hashtags: [String],
      scheduledFor: Date,
      posted: Boolean
    }]
  },

  // Subscription & Billing
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'expired'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    features: [{
      name: String,
      enabled: Boolean,
      limit: Number,
      used: Number
    }]
  },

  // Activity & Engagement
  activity: {
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0
    },
    onboardingCompleted: {
      type: Boolean,
      default: false
    },
    onboardingStep: {
      type: Number,
      default: 1
    },
    tutorialCompleted: {
      type: Boolean,
      default: false
    },
    voiceCommandsUsed: {
      type: Number,
      default: 0
    },
    aiGenerationsUsed: {
      type: Number,
      default: 0
    }
  },

  // Settings & Preferences
  settings: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      marketing: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'customers-only'],
        default: 'public'
      },
      showLocation: {
        type: Boolean,
        default: true
      },
      allowDataCollection: {
        type: Boolean,
        default: true
      }
    },
    accessibility: {
      fontSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium'
      },
      highContrast: {
        type: Boolean,
        default: false
      },
      voiceNavigation: {
        type: Boolean,
        default: false
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
artisanSchema.index({ 'personalInfo.email': 1 });
artisanSchema.index({ 'personalInfo.phone': 1 });
artisanSchema.index({ 'craftDetails.primaryCraft': 1 });
artisanSchema.index({ 'personalInfo.location.state': 1 });
artisanSchema.index({ 'digitalProfile.storefront.url': 1 });
artisanSchema.index({ createdAt: -1 });
artisanSchema.index({ 'businessMetrics.digitalScore': -1 });

// Virtual for full name
artisanSchema.virtual('fullName').get(function() {
  return this.personalInfo.name;
});

// Virtual for location string
artisanSchema.virtual('locationString').get(function() {
  const loc = this.personalInfo.location;
  return `${loc.village}, ${loc.district}, ${loc.state}`;
});

// Pre-save middleware to hash password
artisanSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
artisanSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to calculate digital score
artisanSchema.methods.calculateDigitalScore = function() {
  let score = 0;
  
  // Profile completeness (30 points)
  if (this.personalInfo.profileImage) score += 5;
  if (this.craftDetails.heritageStory) score += 10;
  if (this.craftDetails.techniques.length > 0) score += 5;
  if (this.digitalProfile.socialMedia.instagram || this.digitalProfile.socialMedia.facebook) score += 10;
  
  // Business activity (40 points)
  if (this.businessMetrics.totalOrders > 0) score += 20;
  if (this.businessMetrics.customerRating >= 4) score += 10;
  if (this.businessMetrics.totalSales > 10000) score += 10;
  
  // Digital engagement (30 points)
  if (this.activity.voiceCommandsUsed > 10) score += 10;
  if (this.activity.aiGenerationsUsed > 5) score += 10;
  if (this.digitalProfile.storefront.isActive) score += 10;
  
  this.businessMetrics.digitalScore = Math.min(score, 100);
  return this.businessMetrics.digitalScore;
};

// Static method to find artisans by craft
artisanSchema.statics.findByCraft = function(craftType) {
  return this.find({ 'craftDetails.primaryCraft': craftType });
};

// Static method to find artisans by location
artisanSchema.statics.findByLocation = function(state, district = null) {
  const query = { 'personalInfo.location.state': state };
  if (district) {
    query['personalInfo.location.district'] = district;
  }
  return this.find(query);
};

export default mongoose.model('Artisan', artisanSchema);
