import { logger } from '../utils/logger.js';

/**
 * Demo Data Service - Provides sample artisan profiles and products for demonstration
 * without requiring user signup or authentication
 */
class DemoDataService {
  constructor() {
    this.demoArtisans = [
      {
        _id: 'demo_artisan_1',
        personalInfo: {
          name: 'Rajesh Kumar',
          age: 45,
          location: {
            state: 'Rajasthan',
            district: 'Jaipur',
            village: 'Blue Pottery Lane'
          },
          languages: ['hi', 'en'],
          contactInfo: {
            phone: '9876543210',
            whatsapp: '9876543210'
          }
        },
        craftDetails: {
          primaryCraft: 'pottery',
          specializations: ['Blue Pottery', 'Decorative Vases', 'Traditional Diyas'],
          experience: 25,
          techniques: ['Hand throwing', 'Glazing', 'Traditional firing'],
          culturalBackground: 'Five generations of pottery masters from Jaipur. Our family has been creating the famous blue pottery since the Mughal era.',
          familyTradition: {
            generations: 5,
            origin: 'Mughal era techniques brought to Rajasthan'
          }
        },
        digitalProfile: {
          storefront: {
            url: 'rajesh-blue-pottery',
            customizations: {
              theme: 'traditional-blue',
              banner: 'Beautiful blue pottery from Jaipur'
            }
          },
          socialMedia: {
            instagram: '@rajesh_blue_pottery',
            facebook: 'Rajesh Blue Pottery Jaipur'
          },
          aiPreferences: {
            contentTone: 'traditional',
            targetAudience: 'international'
          }
        },
        businessMetrics: {
          totalSales: 125000,
          avgOrderValue: 2500,
          customerRating: 4.8,
          digitalScore: 85
        },
        isDemo: true
      },
      {
        _id: 'demo_artisan_2',
        personalInfo: {
          name: 'Priya Devi',
          age: 38,
          location: {
            state: 'West Bengal',
            district: 'Murshidabad',
            village: 'Silk Weaver Colony'
          },
          languages: ['bn', 'hi', 'en'],
          contactInfo: {
            phone: '9123456789',
            whatsapp: '9123456789'
          }
        },
        craftDetails: {
          primaryCraft: 'textiles',
          specializations: ['Silk Weaving', 'Handloom Sarees', 'Traditional Patterns'],
          experience: 20,
          techniques: ['Handloom weaving', 'Natural dyeing', 'Jacquard patterns'],
          culturalBackground: 'Traditional silk weaving family from Murshidabad. We create authentic Bengali silk sarees with intricate patterns.',
          familyTradition: {
            generations: 4,
            origin: 'Traditional Bengali silk weaving heritage'
          }
        },
        digitalProfile: {
          storefront: {
            url: 'priya-silk-sarees',
            customizations: {
              theme: 'elegant-silk',
              banner: 'Authentic Bengali silk sarees'
            }
          },
          socialMedia: {
            instagram: '@priya_silk_weaves',
            facebook: 'Priya Traditional Silk'
          },
          aiPreferences: {
            contentTone: 'elegant',
            targetAudience: 'national'
          }
        },
        businessMetrics: {
          totalSales: 200000,
          avgOrderValue: 8000,
          customerRating: 4.9,
          digitalScore: 92
        },
        isDemo: true
      },
      {
        _id: 'demo_artisan_3',
        personalInfo: {
          name: 'Arjun Singh',
          age: 52,
          location: {
            state: 'Punjab',
            district: 'Amritsar',
            village: 'Woodcraft Village'
          },
          languages: ['pa', 'hi', 'en'],
          contactInfo: {
            phone: '9876512345',
            whatsapp: '9876512345'
          }
        },
        craftDetails: {
          primaryCraft: 'woodwork',
          specializations: ['Hand Carving', 'Furniture', 'Decorative Items'],
          experience: 30,
          techniques: ['Traditional carving', 'Inlay work', 'Natural finishing'],
          culturalBackground: 'Master woodcarver from Punjab specializing in traditional Punjabi furniture and decorative items with intricate carvings.',
          familyTradition: {
            generations: 6,
            origin: 'Sikh woodworking traditions from Punjab'
          }
        },
        digitalProfile: {
          storefront: {
            url: 'arjun-woodcraft',
            customizations: {
              theme: 'rustic-wood',
              banner: 'Handcrafted wooden treasures from Punjab'
            }
          },
          socialMedia: {
            instagram: '@arjun_woodcraft',
            facebook: 'Arjun Traditional Woodwork'
          },
          aiPreferences: {
            contentTone: 'rustic',
            targetAudience: 'international'
          }
        },
        businessMetrics: {
          totalSales: 180000,
          avgOrderValue: 5000,
          customerRating: 4.7,
          digitalScore: 78
        },
        isDemo: true
      }
    ];

    this.demoProducts = [
      {
        _id: 'demo_product_1',
        artisanId: 'demo_artisan_1',
        basicInfo: {
          name: 'Traditional Blue Pottery Vase',
          category: 'pottery',
          subcategory: 'Decorative Vases',
          materials: ['Clay', 'Natural Pigments', 'Glaze'],
          colors: ['Blue', 'White', 'Turquoise'],
          dimensions: {
            height: 25,
            width: 15,
            depth: 15,
            weight: 800
          }
        },
        aiGenerated: {
          descriptions: {
            english: 'Exquisite handcrafted blue pottery vase from Jaipur, featuring traditional Mughal-inspired patterns. Each piece tells a story of five generations of pottery mastery.',
            hindi: 'जयपुर की पारंपरिक नीली मिट्टी के बर्तन का खूबसूरत फूलदान। मुगल कला से प्रेरित पैटर्न के साथ।'
          },
          keywords: ['blue pottery', 'jaipur', 'handmade', 'traditional', 'vase'],
          hashtags: ['#BluePottery', '#JaipurCrafts', '#HandmadeInIndia', '#TraditionalArt'],
          storyNarrative: 'Born from the sacred clay of Rajasthan, shaped by hands that carry five generations of wisdom.',
          culturalSignificance: 'Blue pottery represents the fusion of Persian and Indian artistic traditions'
        },
        media: {
          originalImages: [
            {
              url: 'https://via.placeholder.com/400x400/4A90E2/FFFFFF?text=Blue+Pottery+Vase',
              filename: 'blue-pottery-vase-1.jpg',
              isMain: true
            }
          ]
        },
        pricing: {
          cost: 800,
          suggestedPrice: 2500,
          finalPrice: 2200,
          priceReasoning: 'Premium pricing for authentic Jaipur blue pottery with cultural heritage value'
        },
        inventory: {
          quantity: 15,
          status: 'in-stock'
        },
        performance: {
          views: 1250,
          likes: 89,
          shares: 23,
          orders: 12
        },
        status: 'active',
        isPublished: true,
        isDemo: true
      },
      {
        _id: 'demo_product_2',
        artisanId: 'demo_artisan_2',
        basicInfo: {
          name: 'Handwoven Silk Saree - Traditional Bengali',
          category: 'textiles',
          subcategory: 'Sarees',
          materials: ['Pure Silk', 'Natural Dyes', 'Gold Zari'],
          colors: ['Maroon', 'Gold', 'Cream'],
          dimensions: {
            length: 550,
            width: 110,
            weight: 600
          }
        },
        aiGenerated: {
          descriptions: {
            english: 'Magnificent handwoven Bengali silk saree with traditional motifs. Crafted on handloom using time-honored techniques passed down through generations.',
            hindi: 'पारंपरिक बंगाली रेशमी साड़ी, हाथ से बुनी गई। पुरानी तकनीकों का उपयोग करके बनाई गई।'
          },
          keywords: ['silk saree', 'bengali', 'handwoven', 'traditional', 'handloom'],
          hashtags: ['#SilkSaree', '#BengaliTradition', '#HandloomSaree', '#HandwovenSilk'],
          storyNarrative: 'Each thread whispers tales of Bengal, woven with love and ancient wisdom.',
          culturalSignificance: 'Bengali silk sarees represent the rich textile heritage of West Bengal'
        },
        media: {
          originalImages: [
            {
              url: 'https://via.placeholder.com/400x600/8B0000/FFD700?text=Silk+Saree',
              filename: 'bengali-silk-saree-1.jpg',
              isMain: true
            }
          ]
        },
        pricing: {
          cost: 5000,
          suggestedPrice: 15000,
          finalPrice: 12500,
          priceReasoning: 'Premium handwoven silk with traditional Bengali craftsmanship'
        },
        inventory: {
          quantity: 8,
          status: 'in-stock'
        },
        performance: {
          views: 2100,
          likes: 156,
          shares: 45,
          orders: 8
        },
        status: 'active',
        isPublished: true,
        isDemo: true
      },
      {
        _id: 'demo_product_3',
        artisanId: 'demo_artisan_3',
        basicInfo: {
          name: 'Hand Carved Wooden Jewelry Box',
          category: 'woodwork',
          subcategory: 'Decorative Boxes',
          materials: ['Sheesham Wood', 'Natural Finish', 'Brass Hinges'],
          colors: ['Natural Wood', 'Brown'],
          dimensions: {
            length: 20,
            width: 15,
            height: 8,
            weight: 500
          }
        },
        aiGenerated: {
          descriptions: {
            english: 'Intricately hand-carved wooden jewelry box from Punjab. Features traditional Punjabi motifs and superior craftsmanship.',
            hindi: 'पंजाब से हाथ से तराशा गया लकड़ी का आभूषण बॉक्स। पारंपरिक पंजाबी कलाकृति के साथ।'
          },
          keywords: ['wooden jewelry box', 'hand carved', 'punjabi', 'sheesham wood'],
          hashtags: ['#WoodenCrafts', '#PunjabiArt', '#HandCarved', '#JewelryBox'],
          storyNarrative: 'Sacred sheesham wood transformed by skilled hands into a treasure keeper.',
          culturalSignificance: 'Punjabi woodwork represents the rich craftsmanship traditions of North India'
        },
        media: {
          originalImages: [
            {
              url: 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Wooden+Box',
              filename: 'wooden-jewelry-box-1.jpg',
              isMain: true
            }
          ]
        },
        pricing: {
          cost: 1200,
          suggestedPrice: 3500,
          finalPrice: 3000,
          priceReasoning: 'Hand-carved sheesham wood with traditional Punjabi craftsmanship'
        },
        inventory: {
          quantity: 12,
          status: 'in-stock'
        },
        performance: {
          views: 980,
          likes: 67,
          shares: 18,
          orders: 9
        },
        status: 'active',
        isPublished: true,
        isDemo: true
      }
    ];
  }

  /**
   * Get demo artisan by ID or random
   */
  getDemoArtisan(id = null) {
    if (id) {
      return this.demoArtisans.find(artisan => artisan._id === id);
    }
    
    // Return random artisan
    const randomIndex = Math.floor(Math.random() * this.demoArtisans.length);
    return this.demoArtisans[randomIndex];
  }

  /**
   * Get all demo artisans
   */
  getAllDemoArtisans() {
    return this.demoArtisans;
  }

  /**
   * Get demo products for an artisan
   */
  getDemoProducts(artisanId = null) {
    if (artisanId) {
      return this.demoProducts.filter(product => product.artisanId === artisanId);
    }
    
    return this.demoProducts;
  }

  /**
   * Get demo product by ID
   */
  getDemoProduct(id) {
    return this.demoProducts.find(product => product._id === id);
  }

  /**
   * Create a demo session for a user
   */
  createDemoSession() {
    const sessionId = `demo_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const selectedArtisan = this.getDemoArtisan();
    const artisanProducts = this.getDemoProducts(selectedArtisan._id);
    
    return {
      sessionId,
      artisan: selectedArtisan,
      products: artisanProducts,
      capabilities: {
        aiContentGeneration: true,
        voiceCommands: true,
        pricingAnalysis: true,
        demandPrediction: true,
        socialMediaContent: true
      },
      limitations: {
        message: 'This is a demo session. Real features require full setup.',
        maxProducts: 5,
        maxAIRequests: 10
      },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
  }

  /**
   * Generate sample interview text for heritage story
   */
  getSampleInterview(craftType = 'pottery') {
    const interviews = {
      pottery: `मेरे दादाजी ने मुझे मिट्टी के बर्तन बनाना सिखाया था। हमारे परिवार में पांच पीढ़ियों से यह कला चली आ रही है। 
                जयपुर की नीली मिट्टी के बर्तन बनाना एक पवित्र कला है। हर बर्तन में हमारी संस्कृति की आत्मा बसती है।
                मैं चाहता हूं कि दुनिया हमारी इस खूबसूरत कला को जाने और समझे।`,
      
      textiles: `আমাদের পরিবারে চার পুরুষ ধরে তাঁত চলে আসছে। মুর্শিদাবাদের রেশমী শাড়ি বোনা আমাদের ঐতিহ্য। 
                প্রতিটি সুতোয় বাংলার গল্প লুকিয়ে আছে। হাতে বোনা শাড়িতে যে ভালোবাসা থাকে, মেশিনে তা সম্ভব নয়।
                আমি চাই আমাদের এই শিল্প বিশ্বের কাছে পৌঁছে যাক।`,
      
      woodwork: `ਮੇਰੇ ਪਿਤਾ ਜੀ ਨੇ ਮੈਨੂੰ ਲੱਕੜ ਦੀ ਕਲਾ ਸਿਖਾਈ ਸੀ। ਪੰਜਾਬ ਦੀ ਪਰੰਪਰਾਗਤ ਲੱਕੜ ਦੀ ਕਾਰੀਗਰੀ ਬਹੁਤ ਪੁਰਾਣੀ ਹੈ।
                ਸ਼ੀਸ਼ਮ ਦੀ ਲੱਕੜ ਤੋਂ ਜੋ ਚੀਜ਼ਾਂ ਬਣਦੀਆਂ ਹਨ, ਉਹ ਸਦੀਆਂ ਤੱਕ ਚੱਲਦੀਆਂ ਹਨ।
                ਮੈਂ ਚਾਹੁੰਦਾ ਹਾਂ ਕਿ ਦੁਨੀਆ ਸਾਡੀ ਇਸ ਕਲਾ ਨੂੰ ਜਾਣੇ।`
    };
    
    return interviews[craftType] || interviews.pottery;
  }

  /**
   * Get sample voice commands for demo
   */
  getSampleVoiceCommands() {
    return [
      {
        hindi: "मुझे अपने pottery को online बेचना है",
        english: "I want to sell my pottery online",
        action: "create_product",
        response: "मैं आपके pottery के लिए एक नया प्रोडक्ट बनाता हूं। कृपया अपने बर्तन की फोटो लें।"
      },
      {
        hindi: "मेरे orders कितने आए हैं?",
        english: "How many orders have I received?",
        action: "check_orders",
        response: "आपके पास इस महीने 12 नए ऑर्डर आए हैं। कुल बिक्री ₹25,000 है।"
      },
      {
        hindi: "Price कितनी रखूं?",
        english: "What price should I set?",
        action: "pricing_suggestion",
        response: "आपके blue pottery vase के लिए ₹2,200 की कीमत सही रहेगी। यह market rate के अनुसार है।"
      }
    ];
  }

  /**
   * Get trending hashtags for demo
   */
  getTrendingHashtags(category = 'pottery') {
    const hashtags = {
      pottery: ['#BluePottery', '#JaipurCrafts', '#HandmadeInIndia', '#TraditionalPottery', '#CulturalHeritage'],
      textiles: ['#HandloomSaree', '#SilkWeaving', '#BengaliTradition', '#HandwovenFabric', '#TraditionalTextiles'],
      woodwork: ['#WoodCarving', '#PunjabiCrafts', '#HandcraftedWood', '#TraditionalWoodwork', '#SheeshamWood'],
      jewelry: ['#TraditionalJewelry', '#HandmadeJewelry', '#IndianJewelry', '#CulturalOrnaments', '#ArtisanJewelry']
    };
    
    return hashtags[category] || hashtags.pottery;
  }

  /**
   * Generate demo analytics data
   */
  getDemoAnalytics(artisanId) {
    const baseMetrics = {
      totalViews: Math.floor(Math.random() * 5000) + 1000,
      totalSales: Math.floor(Math.random() * 100000) + 50000,
      totalOrders: Math.floor(Math.random() * 100) + 20,
      avgOrderValue: Math.floor(Math.random() * 5000) + 2000,
      customerRating: (Math.random() * 1 + 4).toFixed(1),
      conversionRate: (Math.random() * 5 + 2).toFixed(1)
    };

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      sales: Math.floor(Math.random() * 20000) + 5000,
      orders: Math.floor(Math.random() * 20) + 5,
      views: Math.floor(Math.random() * 500) + 100
    }));

    const topProducts = this.getDemoProducts(artisanId).slice(0, 3).map(product => ({
      name: product.basicInfo.name,
      sales: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 50000) + 10000
    }));

    return {
      overview: baseMetrics,
      monthlyTrends: monthlyData,
      topProducts,
      recentActivity: [
        { type: 'order', message: 'New order received for Blue Pottery Vase', time: '2 hours ago' },
        { type: 'view', message: '25 people viewed your Silk Saree', time: '4 hours ago' },
        { type: 'like', message: 'Your Wooden Box got 5 new likes', time: '6 hours ago' }
      ]
    };
  }
}

export default new DemoDataService();
