import React, { useState } from 'react';
import { 
  Instagram, 
  Facebook, 
  MessageCircle, 
  Calendar,
  Image,
  Video,
  Type,
  Sparkles,
  Clock,
  Send,
  Eye,
  Download,
  Copy,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const SocialMediaAutomation = ({ productData, artisanData }) => {
  const { t, currentLanguage } = useLanguage();
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram']);
  const [contentType, setContentType] = useState('post'); // post, story, reel
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState([]);

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      features: ['Posts', 'Stories', 'Reels']
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'from-blue-600 to-blue-700',
      features: ['Posts', 'Stories']
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'from-green-500 to-green-600',
      features: ['Status', 'Catalog']
    }
  ];

  const contentTypes = [
    {
      id: 'post',
      name: 'Feed Post',
      description: 'Regular post with image and caption',
      icon: <Image className="w-5 h-5" />
    },
    {
      id: 'story',
      name: 'Story',
      description: '24-hour temporary content',
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: 'reel',
      name: 'Reel/Video',
      description: 'Short video content',
      icon: <Video className="w-5 h-5" />
    }
  ];

  const generateContent = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai/generate-social-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platforms: selectedPlatforms,
          contentType,
          language: currentLanguage,
          productData: productData || {
            name: 'Handwoven Silk Saree',
            category: 'Textiles',
            price: 8500,
            description: 'Traditional Banarasi silk saree with intricate gold work'
          },
          artisanData: artisanData || {
            name: 'Meera Devi',
            craft: 'Silk Weaving',
            location: 'Varanasi, UP',
            experience: 20
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data);
      
    } catch (error) {
      console.error('Error generating content:', error);
      // Fallback demo content
      setGeneratedContent(getDemoContent());
    } finally {
      setIsGenerating(false);
    }
  };

  const getDemoContent = () => {
    const demoContent = {
      instagram: {
        post: {
          caption: `✨ Handwoven with love, crafted with tradition ✨

This exquisite Banarasi silk saree represents 20 years of dedication to the ancient art of silk weaving. Each thread tells a story of our rich cultural heritage.

🧵 100% Pure Silk
🎨 Traditional Gold Zari Work  
📍 Handcrafted in Varanasi
💫 Limited Edition

#HandwovenSaree #BaranasiSilk #TraditionalCraft #ArtisanMade #CulturalHeritage #SilkSaree #HandmadeWithLove #IndianTextiles #WeavingTradition #AuthenticCraft`,
          
          hashtags: ['#HandwovenSaree', '#BaranasiSilk', '#TraditionalCraft', '#ArtisanMade', '#CulturalHeritage'],
          
          suggestedImages: [
            'Close-up of intricate gold work',
            'Artisan at the loom',
            'Full saree display',
            'Detail of silk texture'
          ]
        },
        
        story: {
          text: 'Behind every thread lies a story of tradition 🧵✨',
          stickers: ['🧵', '✨', '🎨', '💫'],
          background: 'Gradient with traditional patterns'
        },
        
        reel: {
          script: [
            'Scene 1: Close-up of hands working the loom',
            'Scene 2: Golden threads being woven',
            'Scene 3: The finished saree flowing in the wind',
            'Scene 4: Artisan smiling with pride'
          ],
          music: 'Traditional Indian instrumental',
          duration: '15-30 seconds',
          text_overlay: 'From loom to luxury'
        }
      },
      
      facebook: {
        post: {
          caption: `🌟 Preserving Tradition, One Thread at a Time 🌟

Meet Meera Devi, a master weaver from Varanasi who has been creating beautiful Banarasi silk sarees for over 20 years. Her latest creation - this stunning silk saree with traditional gold zari work - is a testament to the timeless beauty of Indian craftsmanship.

When you choose handmade, you're not just buying a product - you're supporting a tradition, an artisan, and a way of life that has been passed down through generations.

✨ What makes this special:
• 100% Pure Mulberry Silk
• Hand-woven on traditional pit looms
• Authentic gold and silver zari
• Takes 15-20 days to complete
• Each piece is unique

Support our artisans. Preserve our heritage. 🙏

#SupportArtisans #HandmadeSarees #BaranasiSilk #IndianHeritage #TraditionalCrafts #WomenEntrepreneurs #MadeInIndia`,
          
          cta: 'Shop Now',
          link: 'Visit our online store'
        }
      },
      
      whatsapp: {
        status: {
          text: '🧵 New arrival: Handwoven Banarasi silk saree\n✨ Limited edition\n📱 DM for details',
          image: 'Product showcase'
        },
        
        catalog: {
          title: 'Handwoven Silk Saree - Baranasi Collection',
          description: 'Exquisite handwoven silk saree with traditional gold zari work. Perfect for special occasions.',
          price: '₹8,500',
          category: 'Traditional Sarees'
        }
      }
    };

    return demoContent;
  };

  const schedulePost = (platform, content, scheduledTime) => {
    const newPost = {
      id: Date.now(),
      platform,
      content,
      scheduledTime,
      status: 'scheduled'
    };
    
    setScheduledPosts([...scheduledPosts, newPost]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here
  };

  const downloadContent = (content, filename) => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Social Media Automation</h2>
          <p className="text-gray-600">Generate and schedule content across platforms</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Platforms
            </label>
            <div className="space-y-2">
              {platforms.map((platform) => (
                <label key={platform.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPlatforms([...selectedPlatforms, platform.id]);
                      } else {
                        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.id));
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className={`p-2 bg-gradient-to-r ${platform.color} rounded-lg text-white`}>
                    {platform.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{platform.name}</div>
                    <div className="text-sm text-gray-500">{platform.features.join(', ')}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Content Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Content Type
            </label>
            <div className="space-y-2">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setContentType(type.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    contentType === type.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {type.icon}
                    <div>
                      <div className="font-medium text-gray-900">{type.name}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateContent}
            disabled={isGenerating || selectedPlatforms.length === 0}
            className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating Content...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generate Content
              </div>
            )}
          </button>
        </div>

        {/* Generated Content Display */}
        <div className="lg:col-span-2 space-y-6">
          {generatedContent ? (
            <div className="space-y-4">
              {selectedPlatforms.map((platformId) => {
                const platform = platforms.find(p => p.id === platformId);
                const content = generatedContent[platformId]?.[contentType];
                
                if (!content) return null;

                return (
                  <div key={platformId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-gradient-to-r ${platform.color} rounded-lg text-white`}>
                          {platform.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                          <p className="text-sm text-gray-600">{contentTypes.find(t => t.id === contentType)?.name}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(content, null, 2))}
                          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                          title="Copy content"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadContent(content, `${platformId}-${contentType}.json`)}
                          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                          title="Download content"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div className="space-y-3">
                      {content.caption && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                          <div className="p-3 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap">
                            {content.caption}
                          </div>
                        </div>
                      )}

                      {content.hashtags && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Hashtags</label>
                          <div className="flex flex-wrap gap-1">
                            {content.hashtags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {content.script && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Video Script</label>
                          <div className="space-y-2">
                            {content.script.map((scene, index) => (
                              <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                                {scene}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {content.suggestedImages && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Suggested Images</label>
                          <div className="grid grid-cols-2 gap-2">
                            {content.suggestedImages.map((suggestion, index) => (
                              <div key={index} className="p-2 bg-gray-50 rounded text-sm text-center">
                                <Image className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                                {suggestion}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                      <button className="flex-1 btn-primary py-2">
                        <Send className="w-4 h-4 mr-2" />
                        Post Now
                      </button>
                      <button className="flex-1 btn-secondary py-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule
                      </button>
                      <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center text-gray-500">
                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select platforms and click "Generate Content"</p>
                <p className="text-sm mt-1">AI will create optimized content for each platform</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scheduled Posts */}
      {scheduledPosts.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Posts</h3>
          <div className="space-y-3">
            {scheduledPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="font-medium">{post.platform}</span>
                  <span className="text-sm text-gray-600">{post.scheduledTime}</span>
                </div>
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-800">Edit</button>
                  <button className="text-sm text-red-600 hover:text-red-800">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaAutomation;
