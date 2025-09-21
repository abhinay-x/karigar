import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, User, Palette, Store, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Import constants
import { CRAFT_CATEGORIES, LANGUAGES, INDIAN_STATES, CONTENT_TONES, TARGET_AUDIENCES } from '../utils/constants';
import { ARTISAN_TEMPLATE } from '../types/index';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [artisanData, setArtisanData] = useState(ARTISAN_TEMPLATE);

  const steps = [
    { id: 1, title: 'Personal Info', icon: <User className="w-5 h-5" /> },
    { id: 2, title: 'Craft Details', icon: <Palette className="w-5 h-5" /> },
    { id: 3, title: 'Digital Profile', icon: <Store className="w-5 h-5" /> },
    { id: 4, title: 'Complete', icon: <CheckCircle className="w-5 h-5" /> },
  ];

  const updateArtisanData = (section, field, value) => {
    setArtisanData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      toast.success('Welcome to KalaAI! Your profile has been created.');
      navigate('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about yourself</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your full name"
                  value={artisanData.personalInfo.name}
                  onChange={(e) => updateArtisanData('personalInfo', 'name', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Your age"
                  value={artisanData.personalInfo.age}
                  onChange={(e) => updateArtisanData('personalInfo', 'age', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  className="input-field"
                  value={artisanData.personalInfo.location.state}
                  onChange={(e) => updateArtisanData('personalInfo', 'location', {
                    ...artisanData.personalInfo.location,
                    state: e.target.value
                  })}
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Your district"
                  value={artisanData.personalInfo.location.district}
                  onChange={(e) => updateArtisanData('personalInfo', 'location', {
                    ...artisanData.personalInfo.location,
                    district: e.target.value
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Village/City
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Your village or city"
                  value={artisanData.personalInfo.location.village}
                  onChange={(e) => updateArtisanData('personalInfo', 'location', {
                    ...artisanData.personalInfo.location,
                    village: e.target.value
                  })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="10-digit mobile number"
                  value={artisanData.personalInfo.contactInfo.phone}
                  onChange={(e) => updateArtisanData('personalInfo', 'contactInfo', {
                    ...artisanData.personalInfo.contactInfo,
                    phone: e.target.value
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="WhatsApp number (if different)"
                  value={artisanData.personalInfo.contactInfo.whatsapp}
                  onChange={(e) => updateArtisanData('personalInfo', 'contactInfo', {
                    ...artisanData.personalInfo.contactInfo,
                    whatsapp: e.target.value
                  })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages You Speak
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {LANGUAGES.map(lang => (
                  <label key={lang.code} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                      checked={artisanData.personalInfo.languages.includes(lang.code)}
                      onChange={(e) => {
                        const languages = e.target.checked
                          ? [...artisanData.personalInfo.languages, lang.code]
                          : artisanData.personalInfo.languages.filter(l => l !== lang.code);
                        updateArtisanData('personalInfo', 'languages', languages);
                      }}
                    />
                    <span className="text-sm">{lang.flag} {lang.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Craft Expertise</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Craft Category *
              </label>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CRAFT_CATEGORIES.map(category => (
                  <div
                    key={category.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      artisanData.craftDetails.primaryCraft === category.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => updateArtisanData('craftDetails', 'primaryCraft', category.id)}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                className="input-field max-w-xs"
                placeholder="Years in this craft"
                value={artisanData.craftDetails.experience}
                onChange={(e) => updateArtisanData('craftDetails', 'experience', parseInt(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cultural Background
              </label>
              <textarea
                className="input-field"
                rows="4"
                placeholder="Tell us about your cultural heritage and how it influences your craft..."
                value={artisanData.craftDetails.culturalBackground}
                onChange={(e) => updateArtisanData('craftDetails', 'culturalBackground', e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Digital Preferences</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Tone Preference
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                {CONTENT_TONES.map(tone => (
                  <div
                    key={tone.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      artisanData.digitalProfile.aiPreferences.contentTone === tone.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => updateArtisanData('digitalProfile', 'aiPreferences', {
                      ...artisanData.digitalProfile.aiPreferences,
                      contentTone: tone.value
                    })}
                  >
                    <h3 className="font-medium text-gray-900">{tone.label}</h3>
                    <p className="text-sm text-gray-600">{tone.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                {TARGET_AUDIENCES.map(audience => (
                  <div
                    key={audience.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      artisanData.digitalProfile.aiPreferences.targetAudience === audience.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => updateArtisanData('digitalProfile', 'aiPreferences', {
                      ...artisanData.digitalProfile.aiPreferences,
                      targetAudience: audience.value
                    })}
                  >
                    <h3 className="font-medium text-gray-900">{audience.label}</h3>
                    <p className="text-sm text-gray-600">{audience.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Handle (Optional)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="@your_instagram"
                  value={artisanData.digitalProfile.socialMedia.instagram}
                  onChange={(e) => updateArtisanData('digitalProfile', 'socialMedia', {
                    ...artisanData.digitalProfile.socialMedia,
                    instagram: e.target.value
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook Page (Optional)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Facebook page URL"
                  value={artisanData.digitalProfile.socialMedia.facebook}
                  onChange={(e) => updateArtisanData('digitalProfile', 'socialMedia', {
                    ...artisanData.digitalProfile.socialMedia,
                    facebook: e.target.value
                  })}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900">Welcome to KalaAI!</h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your artisan profile has been created successfully. You're now ready to start 
              digitizing your craft and reaching customers worldwide.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Upload your first product</li>
                <li>• Generate AI-powered descriptions</li>
                <li>• Customize your storefront</li>
                <li>• Start selling to global customers</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.icon}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-primary-500' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step.id ? 'bg-primary-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="card">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            className="btn-primary flex items-center gap-2 px-6 py-3"
          >
            {currentStep === 4 ? 'Complete Setup' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
