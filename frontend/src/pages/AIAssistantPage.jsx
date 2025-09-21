import React, { useRef, useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Image, 
  Type, 
  Globe, 
  Mic, 
  Camera,
  Download,
  Copy,
  RefreshCw,
  Send,
  Bot,
  User,
  Loader,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Share2,
  Palette,
  Play,
  Info,
  Target,
  Languages,
  Wand2
} from 'lucide-react';
import StorytellingAssistant from '../components/ai/StorytellingAssistant';
import VoiceInterface from '../components/voice/VoiceInterface';
import SocialMediaAutomation from '../components/social/SocialMediaAutomation';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const AIAssistantPage = () => {
  const { user, isDemoMode, token } = useAuth();
  const { t } = useLanguage();
  const API_BASE = (import.meta?.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  const [activeTab, setActiveTab] = useState('content');
  const [isGenerating, setIsGenerating] = useState(false);
  const [productInfo, setProductInfo] = useState({
    name: 'Traditional Blue Pottery Vase',
    category: 'pottery',
    materials: ['Clay', 'Natural pigments', 'Glaze'],
    description: 'A beautiful handcrafted blue pottery vase featuring traditional Jaipur designs. Made using centuries-old techniques passed down through generations.',
    images: []
  });
  const [artisanInfo, setArtisanInfo] = useState({
    name: 'Rajesh Kumar',
    craft: 'Pottery',
    location: 'Jaipur, Rajasthan',
    experience: 15
  });
  const [preferences, setPreferences] = useState({
    tone: 'traditional',
    targetAudience: 'international',
    language: 'en'
  });
  const [generatedContent, setGeneratedContent] = useState(null);

  // Refs to keep focus stable while typing
  const nameRef = useRef(null);
  const materialsRef = useRef(null);
  const descriptionRef = useRef(null);

  const restoreCaret = (ref, start, end) => {
    // Restore caret position and focus after state update
    requestAnimationFrame(() => {
      const el = ref?.current;
      if (el && document.activeElement !== el) {
        try {
          el.focus();
          if (typeof start === 'number' && typeof end === 'number') {
            el.setSelectionRange(start, end);
          }
        } catch {}
      }
    });
  };

  const tabs = [
    { id: 'content', name: 'Content Generator', icon: <Type className="w-5 h-5" /> },
    { id: 'storytelling', name: 'AI Storytelling', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'voice', name: 'Voice Assistant', icon: <Mic className="w-5 h-5" /> },
    { id: 'social', name: 'Social Media', icon: <Share2 className="w-5 h-5" /> },
    { id: 'image', name: 'Image Enhancer', icon: <Image className="w-5 h-5" /> },
  ];

  const handleGenerateContent = async () => {
    if (!productInfo.name || !productInfo.description) {
      toast.error('Please fill in product name and description');
      return;
    }

    setIsGenerating(true);
    try {
      const payload = {
        product: productInfo,
        artisan: artisanInfo,
        preferences,
      };
      const res = await fetch(`${API_BASE}/api/ai/generate-product-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json) throw new Error(json?.message || 'Failed to generate AI content');

      // Expecting shape with title/description/keywords/hashtags/storyNarrative etc.
      setGeneratedContent({
        title: json.title || `AI Generated: ${productInfo.name}`,
        description: json.description || '',
        keywords: json.keywords || [],
        hashtags: json.hashtags || [],
        storyNarrative: json.storyNarrative || json.story || '',
        socialMediaCaptions: json.socialMediaCaptions || {},
      });
      toast.success('AI content generated');
    } catch (e) {
      // Fallback to local generation for demo/offline
      const local = {
        title: `Handcrafted ${productInfo.name} - Authentic Traditional Artistry`,
        description: `Discover the timeless beauty of this exquisite ${productInfo.name}, meticulously handcrafted by master artisan ${artisanInfo.name} from ${artisanInfo.location}. With over ${artisanInfo.experience} years of experience in traditional ${artisanInfo.craft.toLowerCase()}, each piece tells a story of cultural heritage and skilled craftsmanship.`,
        keywords: [productInfo.name.toLowerCase(), 'handcrafted', 'authentic'],
        hashtags: ['#HandmadeInIndia', '#ArtisanMade'],
        storyNarrative: `In the lanes of ${artisanInfo.location}, ${artisanInfo.name} continues a legacy spanning generations.`,
        socialMediaCaptions: {
          instagram: `${productInfo.description.substring(0, 100)}...`,
        },
      };
      setGeneratedContent(local);
      toast.success('Generated demo content (offline)');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const ContentGeneratorTab = () => (
    <div className="space-y-8">
      {/* Product Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Terracotta Vase"
              value={productInfo.name}
              ref={nameRef}
              onChange={(e) => {
                const { selectionStart, selectionEnd, value } = e.target;
                setProductInfo((prev) => ({ ...prev, name: value }));
                restoreCaret(nameRef, selectionStart, selectionEnd);
              }}
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              className="input-field"
              value={productInfo.category}
              onChange={(e) => setProductInfo({...productInfo, category: e.target.value})}
            >
              <option value="pottery">Pottery & Ceramics</option>
              <option value="textiles">Textiles & Weaving</option>
              <option value="jewelry">Jewelry & Ornaments</option>
              <option value="woodwork">Wood Crafts</option>
              <option value="metalwork">Metal Crafts</option>
              <option value="leather">Leather Crafts</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Materials Used
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g., Clay, Natural pigments, Gold leaf (comma separated)"
            value={productInfo.materials.join(', ')}
            ref={materialsRef}
            onChange={(e) => {
              const { selectionStart, selectionEnd, value } = e.target;
              setProductInfo((prev) => ({
                ...prev,
                materials: value.split(',').map(m => m.trim()).filter(Boolean)
              }));
              restoreCaret(materialsRef, selectionStart, selectionEnd);
            }}
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Basic Description *
          </label>
          <textarea
            className="input-field"
            rows="4"
            placeholder="Describe your product briefly..."
            value={productInfo.description}
            ref={descriptionRef}
            onChange={(e) => {
              const { selectionStart, selectionEnd, value } = e.target;
              setProductInfo((prev) => ({ ...prev, description: value }));
              restoreCaret(descriptionRef, selectionStart, selectionEnd);
            }}
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>

      {/* AI Preferences */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Preferences</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Palette className="w-4 h-4 inline mr-1" />
              Content Tone
            </label>
            <select
              className="input-field"
              value={preferences.tone}
              onChange={(e) => setPreferences({...preferences, tone: e.target.value})}
            >
              <option value="traditional">Traditional</option>
              <option value="modern">Modern</option>
              <option value="storytelling">Storytelling</option>
              <option value="professional">Professional</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4 inline mr-1" />
              Target Audience
            </label>
            <select
              className="input-field"
              value={preferences.targetAudience}
              onChange={(e) => setPreferences({...preferences, targetAudience: e.target.value})}
            >
              <option value="local">Local Community</option>
              <option value="national">National Market</option>
              <option value="international">Global Market</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Languages className="w-4 h-4 inline mr-1" />
              Primary Language
            </label>
            <select
              className="input-field"
              value={preferences.language}
              onChange={(e) => setPreferences({...preferences, language: e.target.value})}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="bn">Bengali</option>
              <option value="ta">Tamil</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={handleGenerateContent}
          disabled={isGenerating}
          className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Generate AI Content</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Content */}
      {generatedContent && (
        <div className="space-y-6">
          {/* Title */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Generated Title</h4>
              <button
                onClick={() => copyToClipboard(generatedContent.title)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{generatedContent.title}</p>
          </div>

          {/* Description */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Product Description</h4>
              <button
                onClick={() => copyToClipboard(generatedContent.description)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="text-gray-800 bg-gray-50 p-3 rounded-lg whitespace-pre-line">
              {generatedContent.description}
            </div>
          </div>

          {/* Keywords */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">SEO Keywords</h4>
              <button
                onClick={() => copyToClipboard(generatedContent.keywords.join(', '))}
                className="text-gray-500 hover:text-gray-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {generatedContent.keywords.map((keyword, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Hashtags */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Social Media Hashtags</h4>
              <button
                onClick={() => copyToClipboard(generatedContent.hashtags.join(' '))}
                className="text-gray-500 hover:text-gray-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {generatedContent.hashtags.map((hashtag, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  {hashtag}
                </span>
              ))}
            </div>
          </div>

          {/* Story Narrative */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Artisan Story</h4>
              <button
                onClick={() => copyToClipboard(generatedContent.storyNarrative)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="text-gray-800 bg-gray-50 p-3 rounded-lg whitespace-pre-line">
              {generatedContent.storyNarrative}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const ImageEnhancerTab = () => (
    <div className="space-y-8">
      <div className="card text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Image Enhancement</h3>
        <p className="text-gray-600 mb-6">
          Transform your product photos into professional marketplace-ready images
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Drop your product images here or click to upload</p>
          <p className="text-sm text-gray-500">Supports JPG, PNG, WebP up to 10MB</p>
          <button className="btn-primary mt-4">
            Choose Files
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 text-left">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Background Removal</h4>
            <p className="text-sm text-gray-600">Automatically remove backgrounds for clean product shots</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Lighting Correction</h4>
            <p className="text-sm text-gray-600">Enhance lighting and color balance for better visibility</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Quality Enhancement</h4>
            <p className="text-sm text-gray-600">Improve image resolution and sharpness</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SocialMediaTab = () => (
    <div className="space-y-8">
      {generatedContent ? (
        <div className="space-y-6">
          {/* Instagram */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
                <h4 className="font-semibold text-gray-900">Instagram Post</h4>
              </div>
              <button
                onClick={() => copyToClipboard(generatedContent.socialMediaCaptions.instagram)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-line">{generatedContent.socialMediaCaptions.instagram}</p>
            </div>
          </div>

          {/* Facebook */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                <h4 className="font-semibold text-gray-900">Facebook Post</h4>
              </div>
              <button
                onClick={() => copyToClipboard(generatedContent.socialMediaCaptions.facebook)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-line">{generatedContent.socialMediaCaptions.facebook}</p>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg"></div>
                <h4 className="font-semibold text-gray-900">WhatsApp Message</h4>
              </div>
              <button
                onClick={() => copyToClipboard(generatedContent.socialMediaCaptions.whatsapp)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-line">{generatedContent.socialMediaCaptions.whatsapp}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="card text-center">
          <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Social Media Content</h3>
          <p className="text-gray-600 mb-4">
            Generate content first to see social media captions
          </p>
          <button
            onClick={() => setActiveTab('content')}
            className="btn-primary"
          >
            Generate Content
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Demo Banner */}
        {isDemoMode && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4 mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Play className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Demo Mode Active</h3>
                  <p className="text-sm opacity-90">
                    Exploring as {user?.name} • All AI features are functional with sample data
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Info className="w-4 h-4" />
                <span>No signup required</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Assistant</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transform your craft descriptions into compelling stories with AI-powered content generation, 
            image enhancement, and social media optimization.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'content' && <ContentGeneratorTab />}
          {activeTab === 'storytelling' && (
            <StorytellingAssistant 
              artisanData={artisanInfo}
              productData={productInfo}
              onStoryGenerated={(story, type) => {
                toast.success('Story generated successfully!');
                console.log('Generated story:', story, type);
              }}
            />
          )}
          {activeTab === 'voice' && (
            <VoiceInterface 
              onCommand={(result) => {
                toast.success('Voice command processed!');
                console.log('Voice command result:', result);
              }}
              onTranscription={(text, confidence) => {
                console.log('Transcription:', text, 'Confidence:', confidence);
              }}
            />
          )}
          {activeTab === 'social' && (
            <SocialMediaAutomation 
              productData={productInfo}
              artisanData={artisanInfo}
            />
          )}
          {activeTab === 'image' && <ImageEnhancerTab />}
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
