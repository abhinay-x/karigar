// Constants for KalaAI platform

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
];

export const CRAFT_CATEGORIES = [
  {
    id: 'pottery',
    name: 'Pottery & Ceramics',
    description: 'Traditional clay work and ceramic art',
    icon: '🏺',
    subcategories: ['Earthenware', 'Stoneware', 'Porcelain', 'Terracotta'],
    materials: ['Clay', 'Glazes', 'Natural pigments'],
    techniques: ['Wheel throwing', 'Hand building', 'Glazing', 'Firing'],
  },
  {
    id: 'textiles',
    name: 'Textiles & Weaving',
    description: 'Handwoven fabrics and textile arts',
    icon: '🧵',
    subcategories: ['Handloom', 'Embroidery', 'Block printing', 'Dyeing'],
    materials: ['Cotton', 'Silk', 'Wool', 'Natural dyes'],
    techniques: ['Weaving', 'Embroidery', 'Block printing', 'Tie-dye'],
  },
  {
    id: 'jewelry',
    name: 'Jewelry & Ornaments',
    description: 'Traditional jewelry and decorative items',
    icon: '💍',
    subcategories: ['Silver work', 'Beadwork', 'Kundan', 'Meenakari'],
    materials: ['Silver', 'Gold', 'Beads', 'Gemstones'],
    techniques: ['Filigree', 'Engraving', 'Stone setting', 'Enameling'],
  },
  {
    id: 'woodwork',
    name: 'Wood Crafts',
    description: 'Carved wooden items and furniture',
    icon: '🪵',
    subcategories: ['Furniture', 'Sculptures', 'Toys', 'Utensils'],
    materials: ['Teak', 'Rosewood', 'Sandalwood', 'Bamboo'],
    techniques: ['Carving', 'Inlay work', 'Turning', 'Joinery'],
  },
  {
    id: 'metalwork',
    name: 'Metal Crafts',
    description: 'Traditional metalworking and smithy',
    icon: '⚒️',
    subcategories: ['Brass work', 'Copper work', 'Iron craft', 'Bell metal'],
    materials: ['Brass', 'Copper', 'Iron', 'Bronze'],
    techniques: ['Forging', 'Casting', 'Engraving', 'Repousse'],
  },
  {
    id: 'leather',
    name: 'Leather Crafts',
    description: 'Traditional leather goods and accessories',
    icon: '👜',
    subcategories: ['Bags', 'Footwear', 'Belts', 'Decorative items'],
    materials: ['Leather', 'Natural dyes', 'Thread', 'Hardware'],
    techniques: ['Tooling', 'Dyeing', 'Stitching', 'Embossing'],
  },
];

export const CONTENT_TONES = [
  { value: 'traditional', label: 'Traditional', description: 'Emphasizes heritage and cultural significance' },
  { value: 'modern', label: 'Modern', description: 'Contemporary and trendy language' },
  { value: 'storytelling', label: 'Storytelling', description: 'Narrative-driven with emotional connection' },
  { value: 'professional', label: 'Professional', description: 'Business-focused and informative' },
];

export const TARGET_AUDIENCES = [
  { value: 'local', label: 'Local Community', description: 'People from the same region or state' },
  { value: 'national', label: 'National Market', description: 'Customers across India' },
  { value: 'international', label: 'Global Market', description: 'International buyers and collectors' },
];

export const STOREFRONT_THEMES = [
  {
    id: 'heritage',
    name: 'Heritage Classic',
    description: 'Traditional Indian design with warm colors',
    preview: '/themes/heritage.jpg',
    colors: {
      primary: '#D97706',
      secondary: '#DC2626',
      accent: '#059669',
      background: '#FEF7EE',
      text: '#1F2937',
    },
    fonts: {
      heading: 'Noto Sans Devanagari',
      body: 'Inter',
    },
    layout: 'grid',
    culturalElements: ['Mandala patterns', 'Traditional borders', 'Heritage colors'],
  },
  {
    id: 'modern',
    name: 'Modern Minimalist',
    description: 'Clean and contemporary design',
    preview: '/themes/modern.jpg',
    colors: {
      primary: '#3B82F6',
      secondary: '#6366F1',
      accent: '#10B981',
      background: '#FFFFFF',
      text: '#111827',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    layout: 'list',
    culturalElements: ['Clean lines', 'Subtle shadows', 'Modern typography'],
  },
  {
    id: 'artisan',
    name: 'Artisan Showcase',
    description: 'Highlights the maker and their story',
    preview: '/themes/artisan.jpg',
    colors: {
      primary: '#7C3AED',
      secondary: '#EC4899',
      accent: '#F59E0B',
      background: '#F9FAFB',
      text: '#374151',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Source Sans Pro',
    },
    layout: 'masonry',
    culturalElements: ['Handwritten fonts', 'Organic shapes', 'Artisan photos'],
  },
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export const API_ENDPOINTS = {
  ARTISAN: '/api/artisan',
  PRODUCTS: '/api/products',
  AI_CONTENT: '/api/ai/content',
  AI_IMAGE: '/api/ai/image',
  STOREFRONT: '/api/storefront',
  ANALYTICS: '/api/analytics',
};

export const STORAGE_KEYS = {
  USER_LANGUAGE: 'kala_ai_language',
  ARTISAN_PROFILE: 'kala_ai_artisan',
  THEME_PREFERENCE: 'kala_ai_theme',
  ONBOARDING_COMPLETED: 'kala_ai_onboarded',
};
