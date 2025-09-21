// Core data structures for KalaAI platform (JavaScript)

// Example Artisan object structure
export const ARTISAN_TEMPLATE = {
  _id: '',
  personalInfo: {
    name: '',
    age: 0,
    location: {
      state: '',
      district: '',
      village: '',
    },
    languages: [],
    contactInfo: {
      phone: '',
      whatsapp: '',
    },
  },
  craftDetails: {
    primaryCraft: '',
    specializations: [],
    experience: 0,
    techniques: [],
    culturalBackground: '',
  },
  digitalProfile: {
    storefront: {
      url: '',
      customizations: {},
    },
    socialMedia: {
      instagram: '',
      facebook: '',
    },
    aiPreferences: {
      contentTone: '',
      targetAudience: '',
    },
  },
  businessMetrics: {
    totalSales: 0,
    avgOrderValue: 0,
    customerRating: 0,
    digitalScore: 0,
  },
};

// Example Product object structure
export const PRODUCT_TEMPLATE = {
  _id: '',
  artisanId: '',
  basicInfo: {
    name: '',
    category: '',
    subcategory: '',
    materials: [],
    colors: [],
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
    },
  },
  aiGenerated: {
    descriptions: {
      hindi: '',
      english: '',
      bengali: '',
      tamil: '',
    },
    keywords: [],
    hashtags: [],
    storyNarrative: '',
  },
  media: {
    originalImages: [],
    enhancedImages: [],
    videos: [],
  },
  pricing: {
    cost: 0,
    suggestedPrice: 0,
    finalPrice: 0,
    priceReasoning: '',
  },
  performance: {
    views: 0,
    likes: 0,
    shares: 0,
    orders: 0,
  },
};

// AI Content Request template
export const AI_CONTENT_REQUEST_TEMPLATE = {
  productInfo: {
    name: '',
    category: '',
    materials: [],
    description: '',
  },
  artisanInfo: {
    name: '',
    craft: '',
    location: '',
    experience: 0,
  },
  preferences: {
    tone: 'traditional', // 'traditional' | 'modern' | 'storytelling' | 'professional'
    targetAudience: 'local', // 'local' | 'national' | 'international'
    language: 'en',
  },
};

// Dashboard Metrics template
export const DASHBOARD_METRICS_TEMPLATE = {
  sales: {
    total: 0,
    thisMonth: 0,
    growth: 0,
  },
  products: {
    total: 0,
    active: 0,
    views: 0,
  },
  customers: {
    total: 0,
    returning: 0,
    rating: 0,
  },
  digital: {
    score: 0,
    socialReach: 0,
    engagement: 0,
  },
};
