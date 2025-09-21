import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Download,
  Copy,
  RefreshCw,
  Heart,
  Globe,
  Users
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const StorytellingAssistant = ({ artisanData, productData, onStoryGenerated }) => {
  const { t, currentLanguage } = useLanguage();
  const { token } = useAuth();
  const API_BASE = (import.meta?.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [generatedStory, setGeneratedStory] = useState('');
  const [storyType, setStoryType] = useState('heritage'); // heritage, product, artisan
  const [tone, setTone] = useState('warm'); // warm, professional, casual, inspiring
  const [audience, setAudience] = useState('global'); // local, national, global
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [prompt, setPrompt] = useState('');

  const storyTypes = [
    { 
      id: 'heritage', 
      name: 'Heritage Story', 
      description: 'Tell the cultural history behind your craft',
      icon: <BookOpen className="w-5 h-5" />
    },
    { 
      id: 'artisan', 
      name: 'Artisan Journey', 
      description: 'Share your personal crafting journey',
      icon: <Users className="w-5 h-5" />
    },
    { 
      id: 'product', 
      name: 'Product Story', 
      description: 'Highlight the uniqueness of specific products',
      icon: <Heart className="w-5 h-5" />
    }
  ];

  const tones = [
    { id: 'warm', name: 'Warm & Personal', emoji: '🤗' },
    { id: 'professional', name: 'Professional', emoji: '💼' },
    { id: 'inspiring', name: 'Inspiring', emoji: '✨' },
    { id: 'casual', name: 'Casual & Friendly', emoji: '😊' }
  ];

  const audiences = [
    { id: 'local', name: 'Local Community', icon: <Users className="w-4 h-4" /> },
    { id: 'national', name: 'National Market', icon: <Heart className="w-4 h-4" /> },
    { id: 'global', name: 'Global Audience', icon: <Globe className="w-4 h-4" /> }
  ];

  const handleVoiceRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          setRecordedAudio(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);

        // Auto-stop after 2 minutes
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            setIsRecording(false);
          }
        }, 120000);

      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Unable to access microphone. Please check permissions.');
      }
    } else {
      // Stop recording logic would be handled by the mediaRecorder
      setIsRecording(false);
    }
  };

  const generateStory = async () => {
    setIsGenerating(true);
    
    try {
      // Use heritage-story endpoint with interview text derived from prompt and product context
      const interviewText = prompt && prompt.trim().length > 0
        ? prompt
        : `Create a ${tone} ${storyType} aimed at a ${audience} audience for the product "${productData?.name || 'artisan craft'}". Include cultural heritage elements.`;

      const response = await fetch(`${API_BASE}/api/ai/heritage-story`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          interviewText,
          options: { tone, audience }
        })
      });

      let json = await response.json().catch(() => ({}));
      if (!response.ok || !json?.success) {
        // Try public demo endpoint before local fallback
        const demoRes = await fetch(`${API_BASE}/api/ai/heritage-story-demo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ interviewText, options: { tone, audience } })
        });
        const demoJson = await demoRes.json().catch(() => ({}));
        if (!demoRes.ok || !demoJson?.success) {
          throw new Error(demoJson?.message || json?.message || 'Failed to generate story');
        }
        json = demoJson;
      }

      const storyText = json.data?.story || json.data?.text || JSON.stringify(json.data);
      setGeneratedStory(storyText);
      
      if (onStoryGenerated) {
        onStoryGenerated(storyText, storyType);
      }
      toast.success('AI story generated');

    } catch (error) {
      console.error('Error generating story:', error);
      // Fallback demo story
      const demoStory = getDemoStory();
      setGeneratedStory(demoStory);
      toast.success('Generated demo story (offline)');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDemoStory = () => {
    const stories = {
      heritage: `In the heart of Rajasthan, where the desert winds carry tales of ancient artisans, our pottery tradition has flourished for over five generations. Each piece we create is not just clay shaped by hands, but a vessel carrying the soul of our ancestors.

The techniques passed down from my great-great-grandmother remain unchanged - the same wheel, the same natural clay from the banks of the seasonal river, and the same fire that has burned in our family kiln for decades. When you hold one of our pieces, you're touching a piece of living history.`,

      artisan: `My name is Ramesh Kumar, and pottery flows through my veins like the clay flows through my fingers. I started learning this craft at the age of seven, sitting beside my father in our small workshop. The smell of wet clay and the rhythm of the potter's wheel became the soundtrack of my childhood.

Today, after 15 years of dedicated practice, I create pieces that blend traditional techniques with contemporary designs. Each pot, each vase tells a story - not just of the clay, but of the dreams and aspirations of a craftsman who believes in preserving heritage while embracing the future.`,

      product: `This handcrafted terracotta vase is more than just a decorative piece - it's a testament to the ancient art of pottery that has been perfected over centuries in the villages of Rajasthan. 

Made from locally sourced clay and fired in traditional kilns, each vase bears the unique fingerprints of its creator. The natural earth tones and organic textures make every piece one-of-a-kind. The subtle imperfections are not flaws, but signatures of human craftsmanship in an age of mass production.

Perfect for modern homes that appreciate authentic, sustainable art.`
    };

    return stories[storyType] || stories.heritage;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedStory);
    // You could add a toast notification here
  };

  const downloadStory = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedStory], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `story-${storyType}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Storytelling Assistant</h2>
          <p className="text-gray-600">Transform your craft into compelling narratives</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Story Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Story Type
            </label>
            <div className="grid gap-3">
              {storyTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setStoryType(type.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    storyType === type.id
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

          {/* Tone Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tone & Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {tones.map((toneOption) => (
                <button
                  key={toneOption.id}
                  onClick={() => setTone(toneOption.id)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    tone === toneOption.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg mb-1">{toneOption.emoji}</div>
                  <div className="text-sm font-medium">{toneOption.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Audience Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Target Audience
            </label>
            <div className="flex gap-2">
              {audiences.map((aud) => (
                <button
                  key={aud.id}
                  onClick={() => setAudience(aud.id)}
                  className={`flex-1 p-3 rounded-lg border transition-all ${
                    audience === aud.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {aud.icon}
                    <span className="text-sm font-medium">{aud.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Voice Input (Optional)
            </label>
            <div className="flex gap-3">
              <button
                onClick={handleVoiceRecording}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  isRecording
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {isRecording ? (
                    <>
                      <MicOff className="w-5 h-5" />
                      <span>Recording... (Click to stop)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      <span>Record Your Story</span>
                    </>
                  )}
                </div>
              </button>
            </div>
            {recordedAudio && (
              <div className="mt-2 p-2 bg-green-50 rounded-lg text-sm text-green-700">
                ✓ Audio recorded successfully
              </div>
            )}
          </div>

          {/* Prompt + Generate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prompt (optional)</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="Describe what you want in the story..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateStory}
            disabled={isGenerating}
            className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                Crafting Your Story...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generate Story
              </div>
            )}
          </button>
        </div>

        {/* Generated Story Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Generated Story</h3>
            {generatedStory && (
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={downloadStory}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  title="Download story"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="min-h-[400px] p-4 border-2 border-dashed border-gray-200 rounded-lg">
            {generatedStory ? (
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {generatedStory}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Your AI-generated story will appear here</p>
                  <p className="text-sm mt-1">Configure options and click "Generate Story"</p>
                </div>
              </div>
            )}
          </div>

          {generatedStory && (
            <div className="flex gap-2">
              <button
                onClick={generateStory}
                className="flex-1 btn-secondary py-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </button>
              <button
                onClick={() => {
                  // This would integrate with social media posting
                  alert('Social media integration coming soon!');
                }}
                className="flex-1 btn-primary py-2"
              >
                <Globe className="w-4 h-4 mr-2" />
                Share Story
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorytellingAssistant;
