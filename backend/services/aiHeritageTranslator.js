import { generateHeritageStory, translateText, generateText } from '../config/openSourceAI.js';
import { redisClient, cacheService } from '../config/redis.js';
import { logger } from '../utils/logger.js';

/**
 * AI Heritage Story Translator - World's first AI that converts traditional craft stories 
 * into viral social media content while preserving cultural authenticity
 */
class AIHeritageTranslator {
  constructor() {
    this.model = null;
    this.culturalContexts = {
      pottery: {
        significance: "Clay represents the earth mother, shaping life from dust",
        traditions: ["wheel throwing", "hand building", "glazing rituals"],
        symbols: ["lotus patterns", "peacock motifs", "geometric designs"]
      },
      textiles: {
        significance: "Threads weave stories of generations, connecting past to future",
        traditions: ["handloom weaving", "natural dyeing", "block printing"],
        symbols: ["paisley", "mandala", "floral patterns"]
      },
      jewelry: {
        significance: "Metals and gems carry blessings and protection",
        traditions: ["filigree work", "kundan setting", "meenakari enameling"],
        symbols: ["sun and moon", "temple architecture", "nature motifs"]
      },
      woodwork: {
        significance: "Sacred trees give life to art, honoring forest spirits",
        traditions: ["hand carving", "inlay work", "temple architecture"],
        symbols: ["elephants", "gods and goddesses", "floral vines"]
      },
      metalwork: {
        significance: "Fire transforms metal, like wisdom transforms the soul",
        traditions: ["lost wax casting", "repoussé work", "engraving"],
        symbols: ["religious icons", "geometric patterns", "animal forms"]
      }
    };
  }

  async initialize() {
    try {
      // No model initialization needed for open-source AI
      logger.info('🎨 AI Heritage Translator initialized with open-source models');
    } catch (error) {
      logger.error('Failed to initialize AI Heritage Translator:', error);
      throw error;
    }
  }

  /**
   * Generate heritage story from artisan interview
   */
  async generateHeritageStory(artisanData, interviewText, options = {}) {
    try {
      const cacheKey = `heritage_story_${artisanData._id || 'demo'}_${Date.now()}`;
      
      // Check cache first
      const cached = await cacheService.get(cacheKey);
      if (cached && !options.forceRegenerate) {
        return cached;
      }

      const craftContext = this.culturalContexts[artisanData.craftDetails?.primaryCraft] || this.culturalContexts.pottery;
      
      // Use open-source AI for heritage story generation
      const result = await generateHeritageStory(artisanData, {
        name: artisanData.name || 'Traditional Craft',
        category: artisanData.craftDetails?.primaryCraft || 'pottery',
        materials: craftContext.traditions || ['traditional materials'],
        description: interviewText
      }, options);

      if (result.success) {
        // Cache the result
        await cacheService.set(cacheKey, result, 3600); // 1 hour cache
        
        logger.info(`Heritage story generated for artisan ${artisanData.personalInfo?.name || artisanData.name}`);
        return result;
      } else {
        throw new Error(result.error || 'Failed to generate heritage story');
      }

    } catch (error) {
      logger.error('Heritage story generation failed:', error);
      
      // Return fallback story
      return this.getFallbackHeritageStory(artisanData, interviewText);
    }
  }

  /**
   * Convert heritage story into viral social media content
   */
  async createViralContent(heritageStory, platform, targetAudience = 'international') {
    try {
      const cacheKey = `viral_content_${platform}_${targetAudience}_${Date.now()}`;
      
      const platformSpecs = this.getPlatformSpecifications(platform);
      const audienceContext = this.getAudienceContext(targetAudience);
      
      const prompt = this.buildViralContentPrompt(
        heritageStory, 
        platformSpecs, 
        audienceContext
      );

      const result = await this.model.generateContent(prompt);
      const viralContent = this.parseViralContentResponse(result.response.text());
      
      // Add trending elements
      viralContent.trendingElements = await this.addTrendingElements(platform, heritageStory.craft);
      
      // Generate hashtags
      viralContent.hashtags = await this.generateTrendingHashtags(
        heritageStory, 
        platform, 
        targetAudience
      );

      await cacheService.set(cacheKey, viralContent, 1800); // 30 min cache
      
      return viralContent;

    } catch (error) {
      logger.error('Viral content creation failed:', error);
      throw new Error('Failed to create viral content');
    }
  }

  /**
   * Translate story while preserving cultural nuances
   */
  async translateWithCulturalPreservation(story, targetLanguage, sourceLanguage = 'en') {
    try {
      // First, identify cultural terms that shouldn't be translated
      const culturalTerms = await this.identifyCulturalTerms(story);
      
      // Create translation with cultural preservation
      const prompt = `
        Translate the following text from ${sourceLanguage} to ${targetLanguage}, 
        but preserve these cultural terms in their original form: ${culturalTerms.join(', ')}.
        
        Add pronunciation guides in parentheses for cultural terms.
        Maintain the emotional tone and cultural significance.
        
        Text to translate: ${story}
      `;

      const result = await this.model.generateContent(prompt);
      const translation = result.response.text();

      return {
        translatedText: translation,
        preservedTerms: culturalTerms,
        culturalNotes: await this.generateCulturalNotes(culturalTerms, targetLanguage)
      };

    } catch (error) {
      logger.error('Cultural translation failed:', error);
      throw new Error('Failed to translate with cultural preservation');
    }
  }

  /**
   * Generate voice narration in multiple languages
   */
  async generateVoiceNarration(story, language = 'hi-IN', voiceStyle = 'storytelling') {
    try {
      // Optimize text for voice narration
      const voiceOptimizedText = await this.optimizeForVoice(story, language, voiceStyle);
      
      // Generate audio
      const audioBuffer = await synthesizeSpeech(
        voiceOptimizedText.text,
        language,
        this.getVoiceName(language, voiceStyle)
      );

      return {
        audioBuffer,
        duration: voiceOptimizedText.estimatedDuration,
        transcript: voiceOptimizedText.text,
        language,
        voiceStyle,
        culturalPronunciations: voiceOptimizedText.pronunciationGuide
      };

    } catch (error) {
      logger.error('Voice narration generation failed:', error);
      throw new Error('Failed to generate voice narration');
    }
  }

  // Private helper methods

  buildHeritageStoryPrompt(artisanData, interviewText, craftContext, options) {
    return `
      You are a master storyteller specializing in Indian cultural heritage. Create a compelling heritage story 
      that preserves authenticity while being engaging for modern audiences.

      ARTISAN DETAILS:
      - Name: ${artisanData.personalInfo.name}
      - Craft: ${artisanData.craftDetails.primaryCraft}
      - Experience: ${artisanData.craftDetails.experience} years
      - Location: ${artisanData.personalInfo.location.village}, ${artisanData.personalInfo.location.state}
      - Cultural Background: ${artisanData.craftDetails.culturalBackground}
      - Family Tradition: ${artisanData.craftDetails.familyTradition?.generations || 'Unknown'} generations

      CRAFT CONTEXT:
      - Cultural Significance: ${craftContext.significance}
      - Traditional Techniques: ${craftContext.traditions?.join(', ')}
      - Sacred Symbols: ${craftContext.symbols?.join(', ')}

      INTERVIEW CONTENT:
      ${interviewText}

      TARGET TONE: ${options.tone || 'traditional-modern blend'}
      TARGET AUDIENCE: ${options.audience || 'global'}

      Create a structured heritage story with these sections:
      1. ORIGIN_STORY: How this craft tradition began in their family/region
      2. MASTER_JOURNEY: The artisan's personal journey and learning
      3. CULTURAL_SIGNIFICANCE: Deep meaning and spiritual aspects
      4. TECHNIQUE_SECRETS: Unique methods passed down through generations
      5. MODERN_RELEVANCE: Why this craft matters today
      6. EMOTIONAL_CORE: The heart of their passion and dedication

      Make it authentic, emotionally engaging, and culturally respectful.
      Include specific details that make this story unique and memorable.
      Use vivid imagery and sensory details.
      
      Format as JSON with clear sections.
    `;
  }

  buildViralContentPrompt(heritageStory, platformSpecs, audienceContext) {
    return `
      Transform this heritage story into viral ${platformSpecs.platform} content that respects cultural authenticity 
      while maximizing engagement.

      HERITAGE STORY:
      ${JSON.stringify(heritageStory, null, 2)}

      PLATFORM REQUIREMENTS:
      - Platform: ${platformSpecs.platform}
      - Character Limit: ${platformSpecs.characterLimit}
      - Optimal Length: ${platformSpecs.optimalLength}
      - Content Style: ${platformSpecs.style}
      - Visual Elements: ${platformSpecs.visualElements}

      AUDIENCE CONTEXT:
      - Target: ${audienceContext.demographic}
      - Interests: ${audienceContext.interests}
      - Cultural Familiarity: ${audienceContext.culturalFamiliarity}
      - Engagement Triggers: ${audienceContext.engagementTriggers}

      Create viral content with:
      1. HOOK: Attention-grabbing opening (first 3 seconds)
      2. STORY_ARC: Compelling narrative flow
      3. EMOTIONAL_PEAKS: Moments that trigger sharing
      4. CULTURAL_EDUCATION: Authentic learning moments
      5. CALL_TO_ACTION: Clear engagement request
      6. VISUAL_CUES: Descriptions for accompanying visuals

      Make it shareable, educational, and emotionally resonant.
      Preserve cultural authenticity while maximizing viral potential.
      
      Format as structured JSON.
    `;
  }

  parseHeritageStoryResponse(response) {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback parsing if JSON is not properly formatted
      return {
        originStory: this.extractSection(response, 'ORIGIN_STORY'),
        masterJourney: this.extractSection(response, 'MASTER_JOURNEY'),
        culturalSignificance: this.extractSection(response, 'CULTURAL_SIGNIFICANCE'),
        techniqueSecrets: this.extractSection(response, 'TECHNIQUE_SECRETS'),
        modernRelevance: this.extractSection(response, 'MODERN_RELEVANCE'),
        emotionalCore: this.extractSection(response, 'EMOTIONAL_CORE'),
        fullStory: response
      };
    } catch (error) {
      logger.error('Failed to parse heritage story response:', error);
      return { fullStory: response };
    }
  }

  parseViralContentResponse(response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        hook: this.extractSection(response, 'HOOK'),
        storyArc: this.extractSection(response, 'STORY_ARC'),
        emotionalPeaks: this.extractSection(response, 'EMOTIONAL_PEAKS'),
        culturalEducation: this.extractSection(response, 'CULTURAL_EDUCATION'),
        callToAction: this.extractSection(response, 'CALL_TO_ACTION'),
        visualCues: this.extractSection(response, 'VISUAL_CUES'),
        fullContent: response
      };
    } catch (error) {
      logger.error('Failed to parse viral content response:', error);
      return { fullContent: response };
    }
  }

  extractSection(text, sectionName) {
    const regex = new RegExp(`${sectionName}:?\\s*([\\s\\S]*?)(?=\\n[A-Z_]+:|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  getPlatformSpecifications(platform) {
    const specs = {
      instagram: {
        platform: 'Instagram',
        characterLimit: 2200,
        optimalLength: '125-150 words',
        style: 'Visual storytelling with emotional hooks',
        visualElements: 'High-quality images, Stories, Reels'
      },
      tiktok: {
        platform: 'TikTok',
        characterLimit: 300,
        optimalLength: '50-100 words',
        style: 'Quick, engaging, trend-driven',
        visualElements: 'Short videos, trending sounds, effects'
      },
      facebook: {
        platform: 'Facebook',
        characterLimit: 63206,
        optimalLength: '200-300 words',
        style: 'Community-focused, educational',
        visualElements: 'Photos, videos, live streams'
      },
      youtube: {
        platform: 'YouTube',
        characterLimit: 5000,
        optimalLength: '300-500 words',
        style: 'Educational, documentary-style',
        visualElements: 'Long-form videos, tutorials'
      }
    };
    
    return specs[platform] || specs.instagram;
  }

  getAudienceContext(targetAudience) {
    const contexts = {
      local: {
        demographic: 'Local community, same region',
        interests: 'Cultural pride, local traditions',
        culturalFamiliarity: 'High',
        engagementTriggers: 'Nostalgia, community pride, family connections'
      },
      national: {
        demographic: 'Indian audience, urban and rural',
        interests: 'Heritage, authenticity, supporting artisans',
        culturalFamiliarity: 'Medium to High',
        engagementTriggers: 'Cultural pride, supporting local, authenticity'
      },
      international: {
        demographic: 'Global audience, cultural enthusiasts',
        interests: 'Unique crafts, cultural stories, sustainable shopping',
        culturalFamiliarity: 'Low to Medium',
        engagementTriggers: 'Exotic appeal, human stories, craftsmanship appreciation'
      }
    };
    
    return contexts[targetAudience] || contexts.international;
  }

  async addTrendingElements(platform, craft) {
    // This would integrate with social media APIs to get trending elements
    // For now, return mock trending elements
    return {
      hashtags: ['#HandmadeInIndia', '#CulturalHeritage', '#ArtisanMade'],
      sounds: platform === 'tiktok' ? ['traditional-music-trending'] : [],
      challenges: platform === 'tiktok' ? ['#CraftChallenge'] : [],
      filters: platform === 'instagram' ? ['heritage-filter'] : []
    };
  }

  async generateTrendingHashtags(heritageStory, platform, audience) {
    const baseHashtags = [
      '#HandmadeInIndia',
      '#TraditionalCrafts',
      '#CulturalHeritage',
      '#ArtisanMade',
      '#AuthenticArt'
    ];

    const craftSpecific = {
      pottery: ['#Pottery', '#Ceramics', '#ClayArt', '#HandmadePottery'],
      textiles: ['#Handloom', '#TraditionalTextiles', '#HandwovenFabric'],
      jewelry: ['#TraditionalJewelry', '#HandmadeJewelry', '#IndianJewelry'],
      woodwork: ['#WoodCarving', '#HandcraftedWood', '#TraditionalWoodwork'],
      metalwork: ['#Metalcraft', '#HandforgedMetal', '#TraditionalMetalwork']
    };

    const audienceSpecific = {
      international: ['#MadeInIndia', '#GlobalCrafts', '#WorldHeritage'],
      national: ['#IndianCrafts', '#SwadeshiMovement', '#VocalForLocal'],
      local: ['#LocalCrafts', '#CommunityArt', '#RegionalTradition']
    };

    return [
      ...baseHashtags,
      ...(craftSpecific[heritageStory.craft] || []),
      ...(audienceSpecific[audience] || [])
    ].slice(0, 15); // Limit to 15 hashtags
  }

  async identifyCulturalTerms(text) {
    // Use AI to identify cultural terms that shouldn't be translated
    const prompt = `
      Identify cultural terms, craft-specific vocabulary, and traditional concepts 
      in this text that should be preserved in their original form when translating:
      
      ${text}
      
      Return only the terms as a comma-separated list.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const terms = result.response.text()
        .split(',')
        .map(term => term.trim())
        .filter(term => term.length > 0);
      
      return terms;
    } catch (error) {
      logger.error('Failed to identify cultural terms:', error);
      return [];
    }
  }

  async validateCulturalAuthenticity(story, craft) {
    // Validate cultural authenticity using AI
    const prompt = `
      Evaluate the cultural authenticity of this ${craft} heritage story.
      Check for:
      1. Accurate cultural references
      2. Appropriate traditional terminology
      3. Respectful representation
      4. Historical accuracy
      5. Cultural sensitivity
      
      Story: ${JSON.stringify(story)}
      
      Provide a score from 0-100 and specific feedback.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Parse authenticity score and feedback
      const scoreMatch = response.match(/(\d+)/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 85;
      
      return {
        score,
        feedback: response,
        validated: score >= 80,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Cultural authenticity validation failed:', error);
      return { score: 75, validated: false, feedback: 'Validation failed' };
    }
  }

  async optimizeForVoice(text, language, style) {
    const prompt = `
      Optimize this text for voice narration in ${language} with a ${style} style:
      
      ${text}
      
      Make it:
      1. Easy to pronounce
      2. Natural speech rhythm
      3. Appropriate pauses
      4. Cultural pronunciation guides
      5. Engaging for audio
      
      Return optimized text with pronunciation notes.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const optimizedText = result.response.text();
      
      return {
        text: optimizedText,
        estimatedDuration: Math.ceil(optimizedText.length / 150), // Rough estimate: 150 chars per minute
        pronunciationGuide: this.extractPronunciationGuide(optimizedText)
      };
    } catch (error) {
      logger.error('Voice optimization failed:', error);
      return { text, estimatedDuration: Math.ceil(text.length / 150) };
    }
  }

  extractPronunciationGuide(text) {
    // Extract pronunciation guides from text (words in parentheses)
    const pronunciations = text.match(/\([^)]+\)/g) || [];
    return pronunciations.map(p => p.replace(/[()]/g, ''));
  }

  getVoiceName(language, style) {
    const voices = {
      'hi-IN': {
        storytelling: 'hi-IN-Wavenet-A',
        professional: 'hi-IN-Wavenet-B',
        friendly: 'hi-IN-Wavenet-C'
      },
      'en-IN': {
        storytelling: 'en-IN-Wavenet-D',
        professional: 'en-IN-Wavenet-A',
        friendly: 'en-IN-Wavenet-B'
      }
    };
    
    return voices[language]?.[style] || voices[language]?.storytelling || 'hi-IN-Wavenet-A';
  }

  /**
   * Fallback heritage story for when AI fails
   */
  getFallbackHeritageStory(artisanData, interviewText) {
    const craftName = artisanData.craftDetails?.primaryCraft || 'traditional craft';
    const artisanName = artisanData.personalInfo?.name || artisanData.name || 'Master Artisan';
    const location = artisanData.personalInfo?.location?.village || 'Rural India';
    
    return {
      success: true,
      story: `${artisanName} from ${location} carries forward the ancient tradition of ${craftName}. 
              With skilled hands and a passionate heart, they create beautiful pieces that tell stories 
              of our rich cultural heritage. Each creation is a testament to generations of knowledge 
              passed down through families, preserving the authentic techniques that make Indian crafts 
              truly special. ${interviewText || 'Their dedication to this art form helps keep our traditions alive.'}`,
      themes: ['Heritage', 'Tradition', 'Craftsmanship', 'Cultural Pride'],
      significance: `Traditional ${craftName} represents the soul of Indian artistry`,
      relevance: 'Authentic handmade crafts for conscious consumers',
      hashtags: ['#HandmadeInIndia', '#TraditionalCraft', '#CulturalHeritage', '#ArtisanMade'],
      keywords: [craftName, 'handmade', 'traditional', 'authentic', 'heritage'],
      fallback: true,
      metadata: {
        timestamp: new Date(),
        source: 'fallback'
      }
    };
  }
}

export default new AIHeritageTranslator();
