import { transcribeAudio, translateText, processVoiceCommand } from '../config/openSourceAI.js';
import { logger } from '../utils/logger.js';
import { cacheService } from '../config/redis.js';
import Artisan from '../models/Artisan.js';
import Product from '../models/Product.js';

/**
 * Multilingual Voice Commerce Engine - Complete marketplace management through voice
 * Supports 15+ Indian languages with natural conversation flow
 */
class VoiceCommerceEngine {
  constructor() {
    this.model = null;
    this.supportedLanguages = {
      'hi-IN': { name: 'Hindi', nativeName: 'हिन्दी', voice: 'hi-IN-Wavenet-A' },
      'en-IN': { name: 'English (India)', nativeName: 'English', voice: 'en-IN-Wavenet-D' },
      'bn-IN': { name: 'Bengali', nativeName: 'বাংলা', voice: 'bn-IN-Wavenet-A' },
      'ta-IN': { name: 'Tamil', nativeName: 'தமிழ்', voice: 'ta-IN-Wavenet-A' },
      'te-IN': { name: 'Telugu', nativeName: 'తెలుగు', voice: 'te-IN-Wavenet-A' },
      'mr-IN': { name: 'Marathi', nativeName: 'मराठी', voice: 'mr-IN-Wavenet-A' },
      'gu-IN': { name: 'Gujarati', nativeName: 'ગુજરાતી', voice: 'gu-IN-Wavenet-A' },
      'kn-IN': { name: 'Kannada', nativeName: 'ಕನ್ನಡ', voice: 'kn-IN-Wavenet-A' },
      'ml-IN': { name: 'Malayalam', nativeName: 'മലയാളം', voice: 'ml-IN-Wavenet-A' },
      'pa-IN': { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', voice: 'pa-IN-Wavenet-A' },
      'or-IN': { name: 'Odia', nativeName: 'ଓଡ଼ିଆ', voice: 'or-IN-Wavenet-A' },
      'as-IN': { name: 'Assamese', nativeName: 'অসমীয়া', voice: 'as-IN-Wavenet-A' },
      'ur-IN': { name: 'Urdu', nativeName: 'اردو', voice: 'ur-IN-Wavenet-A' },
      'ne-IN': { name: 'Nepali', nativeName: 'नेपाली', voice: 'ne-IN-Wavenet-A' },
      'sa-IN': { name: 'Sanskrit', nativeName: 'संस्कृत', voice: 'sa-IN-Wavenet-A' }
    };

    this.intentPatterns = this.initializeIntentPatterns();
    this.conversationContexts = new Map(); // Store conversation states
    this.voiceCommands = this.initializeVoiceCommands();
  }

  async initialize() {
    try {
      this.model = getGeminiModel();
      logger.info('🎤 Multilingual Voice Commerce Engine initialized');
      logger.info(`📢 Supporting ${Object.keys(this.supportedLanguages).length} languages`);
    } catch (error) {
      logger.error('Failed to initialize Voice Commerce Engine:', error);
      throw error;
    }
  }

  /**
   * Process voice command and return appropriate response
   */
  async processVoiceCommand(audioBuffer, artisanId, sessionId, languageHint = 'hi-IN') {
    try {
      // Transcribe audio to text
      const transcription = await this.transcribeVoiceCommand(audioBuffer, languageHint);
      
      if (!transcription || transcription.length === 0) {
        return await this.createErrorResponse('मुझे आपकी आवाज़ समझ नहीं आई। कृपया फिर से कोशिश करें।', languageHint);
      }

      const primaryTranscript = transcription[0];
      const detectedLanguage = primaryTranscript.languageCode || languageHint;
      const spokenText = primaryTranscript.transcript;

      logger.info(`Voice command received: "${spokenText}" in ${detectedLanguage}`);

      // Get or create conversation context
      const context = await this.getConversationContext(sessionId, artisanId);
      
      // Understand intent and extract entities
      const intentAnalysis = await this.analyzeIntent(spokenText, detectedLanguage, context);
      
      // Execute the appropriate action
      const actionResult = await this.executeVoiceAction(
        intentAnalysis, 
        artisanId, 
        context, 
        detectedLanguage
      );

      // Generate natural language response
      const response = await this.generateVoiceResponse(
        actionResult, 
        intentAnalysis, 
        detectedLanguage,
        context
      );

      // Update conversation context
      await this.updateConversationContext(sessionId, {
        ...context,
        lastIntent: intentAnalysis.intent,
        lastAction: actionResult.action,
        conversationTurn: (context.conversationTurn || 0) + 1
      });

      return response;

    } catch (error) {
      logger.error('Voice command processing failed:', error);
      return await this.createErrorResponse(
        'माफ़ करें, कुछ तकनीकी समस्या हुई है। कृपया बाद में कोशिश करें।', 
        languageHint
      );
    }
  }

  /**
   * Handle guided product creation through voice
   */
  async startGuidedProductCreation(artisanId, language = 'hi-IN') {
    try {
      const artisan = await Artisan.findById(artisanId);
      if (!artisan) {
        throw new Error('Artisan not found');
      }

      const welcomeMessage = await this.getLocalizedMessage('product_creation_welcome', language, {
        artisanName: artisan.personalInfo.name
      });

      const audioResponse = await synthesizeSpeech(
        welcomeMessage,
        language,
        this.supportedLanguages[language].voice
      );

      return {
        success: true,
        message: welcomeMessage,
        audioResponse,
        nextStep: 'product_name',
        guidance: await this.getLocalizedMessage('ask_product_name', language),
        sessionId: `product_creation_${artisanId}_${Date.now()}`
      };

    } catch (error) {
      logger.error('Failed to start guided product creation:', error);
      throw new Error('Failed to start product creation');
    }
  }

  /**
   * Get real-time business analytics through voice
   */
  async getVoiceAnalytics(query, artisanId, language = 'hi-IN') {
    try {
      const artisan = await Artisan.findById(artisanId).populate('businessMetrics');
      const products = await Product.find({ artisanId, status: 'active' });

      const analyticsData = {
        totalSales: artisan.businessMetrics.totalSales,
        totalOrders: artisan.businessMetrics.totalOrders,
        avgOrderValue: artisan.businessMetrics.avgOrderValue,
        customerRating: artisan.businessMetrics.customerRating,
        digitalScore: artisan.businessMetrics.digitalScore,
        activeProducts: products.length,
        totalViews: products.reduce((sum, p) => sum + p.performance.views, 0),
        totalLikes: products.reduce((sum, p) => sum + p.performance.likes, 0)
      };

      const analyticsResponse = await this.generateAnalyticsResponse(
        query, 
        analyticsData, 
        language
      );

      const audioResponse = await synthesizeSpeech(
        analyticsResponse.spokenText,
        language,
        this.supportedLanguages[language].voice
      );

      return {
        success: true,
        data: analyticsData,
        response: analyticsResponse,
        audioResponse,
        language
      };

    } catch (error) {
      logger.error('Voice analytics failed:', error);
      throw new Error('Failed to get voice analytics');
    }
  }

  /**
   * Handle customer communication through voice
   */
  async handleCustomerCommunication(message, artisanId, customerId, language = 'hi-IN') {
    try {
      const artisan = await Artisan.findById(artisanId);
      
      // Generate appropriate response based on message type
      const responseType = await this.classifyCustomerMessage(message, language);
      
      const response = await this.generateCustomerResponse(
        message, 
        responseType, 
        artisan, 
        language
      );

      const audioResponse = await synthesizeSpeech(
        response.text,
        language,
        this.supportedLanguages[language].voice
      );

      return {
        success: true,
        responseType,
        response: response.text,
        audioResponse,
        suggestedActions: response.actions,
        language
      };

    } catch (error) {
      logger.error('Customer communication failed:', error);
      throw new Error('Failed to handle customer communication');
    }
  }

  // Private helper methods

  async transcribeVoiceCommand(audioBuffer, languageHint) {
    try {
      const alternativeLanguages = this.getAlternativeLanguages(languageHint);
      
      return await transcribeAudio(audioBuffer, languageHint);
    } catch (error) {
      logger.error('Voice transcription failed:', error);
      throw error;
    }
  }

  getAlternativeLanguages(primaryLanguage) {
    // Return likely alternative languages based on region
    const languageGroups = {
      'hi-IN': ['en-IN', 'ur-IN', 'pa-IN'],
      'bn-IN': ['en-IN', 'hi-IN', 'as-IN'],
      'ta-IN': ['en-IN', 'te-IN', 'kn-IN', 'ml-IN'],
      'te-IN': ['en-IN', 'ta-IN', 'kn-IN'],
      'mr-IN': ['en-IN', 'hi-IN', 'gu-IN'],
      'gu-IN': ['en-IN', 'hi-IN', 'mr-IN'],
      'kn-IN': ['en-IN', 'ta-IN', 'te-IN', 'ml-IN'],
      'ml-IN': ['en-IN', 'ta-IN', 'kn-IN'],
      'pa-IN': ['en-IN', 'hi-IN', 'ur-IN'],
      'or-IN': ['en-IN', 'hi-IN', 'bn-IN'],
      'as-IN': ['en-IN', 'bn-IN', 'hi-IN'],
      'ur-IN': ['en-IN', 'hi-IN', 'pa-IN']
    };

    return languageGroups[primaryLanguage] || ['en-IN', 'hi-IN'];
  }

  async analyzeIntent(text, language, context) {
    const prompt = `
      Analyze the intent of this voice command in ${language}:
      
      Text: "${text}"
      
      Previous context: ${JSON.stringify(context, null, 2)}
      
      Identify:
      1. Primary intent (product_create, product_list, analytics, pricing, orders, help, etc.)
      2. Entities (product names, numbers, dates, etc.)
      3. Sentiment (positive, neutral, negative)
      4. Confidence level (0-100)
      5. Required follow-up questions
      
      Consider cultural context and natural speech patterns in Indian languages.
      
      Return as JSON with clear structure.
    `;

    const result = await this.model.generateContent(prompt);
    return this.parseIntentAnalysis(result.response.text());
  }

  parseIntentAnalysis(response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback parsing
      return {
        intent: this.extractValue(response, 'intent', 'help'),
        entities: this.extractEntities(response),
        sentiment: this.extractValue(response, 'sentiment', 'neutral'),
        confidence: parseInt(this.extractValue(response, 'confidence', '70')),
        followUp: this.extractArray(response, 'follow')
      };
    } catch (error) {
      logger.error('Failed to parse intent analysis:', error);
      return {
        intent: 'help',
        entities: {},
        sentiment: 'neutral',
        confidence: 50,
        followUp: []
      };
    }
  }

  async executeVoiceAction(intentAnalysis, artisanId, context, language) {
    const { intent, entities } = intentAnalysis;

    switch (intent) {
      case 'product_create':
        return await this.handleProductCreation(entities, artisanId, context, language);
      
      case 'product_list':
        return await this.handleProductListing(entities, artisanId, language);
      
      case 'analytics':
        return await this.handleAnalyticsQuery(entities, artisanId, language);
      
      case 'pricing':
        return await this.handlePricingQuery(entities, artisanId, language);
      
      case 'orders':
        return await this.handleOrdersQuery(entities, artisanId, language);
      
      case 'help':
        return await this.handleHelpRequest(entities, language);
      
      default:
        return {
          action: 'unknown',
          success: false,
          message: 'Intent not recognized',
          data: null
        };
    }
  }

  async handleProductCreation(entities, artisanId, context, language) {
    try {
      if (!context.productCreation) {
        // Start new product creation
        return {
          action: 'product_creation_start',
          success: true,
          message: 'Starting product creation',
          data: {
            step: 'name',
            prompt: await this.getLocalizedMessage('ask_product_name', language)
          }
        };
      }

      // Continue existing product creation
      const currentStep = context.productCreation.step;
      const productData = context.productCreation.data || {};

      switch (currentStep) {
        case 'name':
          productData.name = entities.productName || entities.text;
          return {
            action: 'product_creation_continue',
            success: true,
            data: {
              step: 'category',
              productData,
              prompt: await this.getLocalizedMessage('ask_product_category', language)
            }
          };

        case 'category':
          productData.category = entities.category || this.mapCategoryFromText(entities.text);
          return {
            action: 'product_creation_continue',
            success: true,
            data: {
              step: 'price',
              productData,
              prompt: await this.getLocalizedMessage('ask_product_price', language)
            }
          };

        case 'price':
          productData.price = entities.price || this.extractPriceFromText(entities.text);
          
          // Create the product
          const newProduct = await this.createProductFromVoice(productData, artisanId);
          
          return {
            action: 'product_creation_complete',
            success: true,
            data: {
              product: newProduct,
              message: await this.getLocalizedMessage('product_created_success', language, {
                productName: newProduct.basicInfo.name
              })
            }
          };

        default:
          return {
            action: 'product_creation_error',
            success: false,
            message: 'Unknown step in product creation'
          };
      }

    } catch (error) {
      logger.error('Product creation failed:', error);
      return {
        action: 'product_creation_error',
        success: false,
        message: 'Failed to create product',
        error: error.message
      };
    }
  }

  async handleProductListing(entities, artisanId, language) {
    try {
      const products = await Product.find({ 
        artisanId, 
        status: 'active' 
      }).limit(10);

      return {
        action: 'product_list',
        success: true,
        data: {
          products,
          count: products.length,
          summary: await this.generateProductListSummary(products, language)
        }
      };

    } catch (error) {
      logger.error('Product listing failed:', error);
      return {
        action: 'product_list_error',
        success: false,
        message: 'Failed to get product list'
      };
    }
  }

  async handleAnalyticsQuery(entities, artisanId, language) {
    try {
      const artisan = await Artisan.findById(artisanId);
      const analyticsType = entities.analyticsType || 'overview';

      const analyticsData = await this.getAnalyticsData(artisan, analyticsType);
      
      return {
        action: 'analytics',
        success: true,
        data: {
          type: analyticsType,
          analytics: analyticsData,
          summary: await this.generateAnalyticsSummary(analyticsData, language)
        }
      };

    } catch (error) {
      logger.error('Analytics query failed:', error);
      return {
        action: 'analytics_error',
        success: false,
        message: 'Failed to get analytics'
      };
    }
  }

  async generateVoiceResponse(actionResult, intentAnalysis, language, context) {
    try {
      const responseText = await this.generateResponseText(
        actionResult, 
        intentAnalysis, 
        language, 
        context
      );

      const audioResponse = await synthesizeSpeech(
        responseText,
        language,
        this.supportedLanguages[language].voice
      );

      return {
        success: actionResult.success,
        text: responseText,
        audioResponse,
        language,
        action: actionResult.action,
        data: actionResult.data,
        followUp: this.generateFollowUpSuggestions(actionResult, language)
      };

    } catch (error) {
      logger.error('Voice response generation failed:', error);
      return await this.createErrorResponse(
        'माफ़ करें, जवाब तैयार करने में समस्या हुई।', 
        language
      );
    }
  }

  async generateResponseText(actionResult, intentAnalysis, language, context) {
    const prompt = `
      Generate a natural, conversational response in ${language} for this voice commerce interaction:

      ACTION RESULT:
      ${JSON.stringify(actionResult, null, 2)}

      INTENT ANALYSIS:
      ${JSON.stringify(intentAnalysis, null, 2)}

      CONTEXT:
      ${JSON.stringify(context, null, 2)}

      Requirements:
      1. Use natural, conversational tone
      2. Be culturally appropriate for Indian artisans
      3. Include specific data when relevant
      4. Keep response concise but informative
      5. End with a helpful follow-up question if appropriate
      6. Use respectful language suitable for voice interaction

      Generate response in ${this.supportedLanguages[language].nativeName}.
    `;

    const result = await this.model.generateContent(prompt);
    return result.response.text().trim();
  }

  async getConversationContext(sessionId, artisanId) {
    const cacheKey = `voice_context_${sessionId}`;
    let context = await cacheService.get(cacheKey);

    if (!context) {
      context = {
        sessionId,
        artisanId,
        startedAt: new Date(),
        conversationTurn: 0,
        lastIntent: null,
        lastAction: null,
        productCreation: null
      };
    }

    return context;
  }

  async updateConversationContext(sessionId, context) {
    const cacheKey = `voice_context_${sessionId}`;
    await cacheService.set(cacheKey, context, 1800); // 30 minutes
  }

  async createErrorResponse(message, language) {
    const audioResponse = await synthesizeSpeech(
      message,
      language,
      this.supportedLanguages[language].voice
    );

    return {
      success: false,
      text: message,
      audioResponse,
      language,
      action: 'error'
    };
  }

  initializeIntentPatterns() {
    return {
      product_create: [
        'नया प्रोडक्ट बनाना है',
        'product banani hai',
        'नई चीज़ बेचनी है',
        'create new product',
        'add product'
      ],
      analytics: [
        'मेरे बिज़नेस का हाल',
        'sales kitni hui',
        'कितने ऑर्डर आए',
        'business analytics',
        'show me stats'
      ],
      pricing: [
        'price kitni rakhun',
        'दाम क्या रखूं',
        'pricing suggestion',
        'कीमत बताओ'
      ]
    };
  }

  initializeVoiceCommands() {
    return {
      'hi-IN': {
        'product_creation_welcome': 'नमस्ते {artisanName} जी! आइए एक नया प्रोडक्ट बनाते हैं।',
        'ask_product_name': 'आपके प्रोडक्ट का नाम क्या है?',
        'ask_product_category': 'यह किस कैटेगरी का प्रोडक्ट है?',
        'ask_product_price': 'इसकी कीमत क्या रखना चाहते हैं?',
        'product_created_success': 'बहुत बढ़िया! {productName} सफलतापूर्वक बन गया है।'
      },
      'en-IN': {
        'product_creation_welcome': 'Hello {artisanName}! Let\'s create a new product.',
        'ask_product_name': 'What is the name of your product?',
        'ask_product_category': 'Which category does this product belong to?',
        'ask_product_price': 'What price would you like to set?',
        'product_created_success': 'Excellent! {productName} has been created successfully.'
      }
    };
  }

  async getLocalizedMessage(key, language, params = {}) {
    const messages = this.voiceCommands[language] || this.voiceCommands['hi-IN'];
    let message = messages[key] || key;

    // Replace parameters
    for (const [param, value] of Object.entries(params)) {
      message = message.replace(`{${param}}`, value);
    }

    return message;
  }

  // Utility methods
  extractValue(text, key, defaultValue = '') {
    const regex = new RegExp(`${key}:?\\s*([^\\n]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : defaultValue;
  }

  extractEntities(response) {
    // Simple entity extraction - in production, use more sophisticated NER
    const entities = {};
    
    // Extract prices
    const priceMatch = response.match(/(\d+)\s*(रुपए|rupees?|₹)/i);
    if (priceMatch) {
      entities.price = parseInt(priceMatch[1]);
    }

    // Extract product names (simple heuristic)
    const productMatch = response.match(/product[:\s]+([^,.\n]+)/i);
    if (productMatch) {
      entities.productName = productMatch[1].trim();
    }

    return entities;
  }

  extractArray(text, key) {
    const section = this.extractValue(text, key);
    return section.split(',').map(item => item.trim()).filter(item => item);
  }

  mapCategoryFromText(text) {
    const categoryMap = {
      'मिट्टी': 'pottery',
      'pottery': 'pottery',
      'कपड़ा': 'textiles',
      'textile': 'textiles',
      'गहना': 'jewelry',
      'jewelry': 'jewelry',
      'लकड़ी': 'woodwork',
      'wood': 'woodwork'
    };

    const lowerText = text.toLowerCase();
    for (const [key, value] of Object.entries(categoryMap)) {
      if (lowerText.includes(key.toLowerCase())) {
        return value;
      }
    }

    return 'other';
  }

  extractPriceFromText(text) {
    const priceMatch = text.match(/(\d+)/);
    return priceMatch ? parseInt(priceMatch[1]) : 0;
  }
}

export default new VoiceCommerceEngine();
