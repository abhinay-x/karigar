import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  Camera, 
  Sparkles, 
  Save, 
  Eye,
  DollarSign,
  Package,
  Tag,
  FileText,
  Palette,
  Globe,
  Mic,
  MicOff
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SmartPricingSuggestions from '../components/pricing/SmartPricingSuggestions';
import toast from 'react-hot-toast';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    materials: [],
    colors: [],
    dimensions: {
      length: '',
      width: '',
      height: '',
      weight: ''
    },
    price: '',
    images: [],
    craftTechnique: '',
    timeToMake: '',
    culturalSignificance: '',
    careInstructions: ''
  });

  const [generatedContent, setGeneratedContent] = useState(null);

  const categories = [
    { id: 'textiles', name: 'Textiles & Fabrics', subcategories: ['Sarees', 'Scarves', 'Fabrics', 'Embroidery'] },
    { id: 'pottery', name: 'Pottery & Ceramics', subcategories: ['Vases', 'Bowls', 'Decorative Items', 'Functional Items'] },
    { id: 'jewelry', name: 'Jewelry & Accessories', subcategories: ['Earrings', 'Necklaces', 'Bracelets', 'Rings'] },
    { id: 'home-decor', name: 'Home Decor', subcategories: ['Wall Art', 'Sculptures', 'Lamps', 'Furniture'] },
    { id: 'bags', name: 'Bags & Leather', subcategories: ['Handbags', 'Wallets', 'Belts', 'Accessories'] },
    { id: 'woodwork', name: 'Woodwork', subcategories: ['Furniture', 'Decorative Items', 'Toys', 'Utensils'] }
  ];

  const materials = [
    'Cotton', 'Silk', 'Wool', 'Linen', 'Clay', 'Ceramic', 'Wood', 'Metal', 
    'Silver', 'Gold', 'Brass', 'Copper', 'Leather', 'Bamboo', 'Jute', 'Hemp'
  ];

  const colors = [
    'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown',
    'Black', 'White', 'Gray', 'Beige', 'Maroon', 'Navy', 'Turquoise', 'Gold'
  ];

  const steps = [
    { id: 1, name: 'Basic Info', icon: <Package className="w-5 h-5" /> },
    { id: 2, name: 'Details', icon: <FileText className="w-5 h-5" /> },
    { id: 3, name: 'Images', icon: <Camera className="w-5 h-5" /> },
    { id: 4, name: 'Pricing', icon: <DollarSign className="w-5 h-5" /> },
    { id: 5, name: 'Review', icon: <Eye className="w-5 h-5" /> }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProductData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProductData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayToggle = (field, value) => {
    setProductData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const generateAIContent = async () => {
    setIsGeneratingContent(true);
    try {
      const response = await fetch('/api/ai/generate-product-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data);
      
      // Update product data with generated content
      setProductData(prev => ({
        ...prev,
        description: data.description,
        culturalSignificance: data.culturalSignificance,
        careInstructions: data.careInstructions
      }));

      toast.success('AI content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      // Fallback demo content
      const demoContent = {
        description: `This exquisite ${productData.name} represents the finest traditions of Indian craftsmanship. Handcrafted with meticulous attention to detail, each piece tells a story of cultural heritage and artistic excellence.`,
        culturalSignificance: `Rooted in centuries-old traditions, this ${productData.category} embodies the rich cultural heritage of Indian artisans. The techniques used have been passed down through generations, preserving ancient wisdom and artistic expression.`,
        careInstructions: 'Handle with care. Clean gently with a soft cloth. Store in a dry place away from direct sunlight.'
      };
      setGeneratedContent(demoContent);
      setProductData(prev => ({ ...prev, ...demoContent }));
      toast.success('Demo content generated!');
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleVoiceInput = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsRecording(true);
        toast.success('Recording started. Describe your product...');
        
        // Simulate voice processing
        setTimeout(() => {
          setIsRecording(false);
          const voiceDescription = `This is a beautiful handcrafted ${productData.category || 'item'} made with traditional techniques. It features intricate details and represents the rich cultural heritage of Indian craftsmanship.`;
          handleInputChange('description', voiceDescription);
          toast.success('Voice input processed!');
          stream.getTracks().forEach(track => track.stop());
        }, 3000);
        
      } catch (error) {
        toast.error('Microphone access denied');
        setIsRecording(false);
      }
    } else {
      setIsRecording(false);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductData(prev => ({
          ...prev,
          images: [...prev.images, e.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveProduct = async () => {
    // Basic validation
    if (!productData.name?.trim() || !productData.category || !productData.description?.trim()) {
      toast.error('Please fill required fields: name, category, description');
      return;
    }
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`Failed to save product (status ${response.status})`);
      }

      toast.success('Product saved successfully!');
      navigate('/products');
    } catch (error) {
      console.warn('API save failed, falling back to local storage:', error);
      // Fallback: save locally so UX can continue in demo/offline mode
      try {
        const key = 'kala_ai_products';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const id = Date.now();
        const record = { id, ...productData, createdAt: new Date().toISOString() };
        localStorage.setItem(key, JSON.stringify([record, ...existing]));
        toast.success('Product saved locally (demo mode)');
        navigate('/products');
      } catch (lsErr) {
        console.error('Local save failed:', lsErr);
        toast.error('Failed to save product');
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Handwoven Silk Saree"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={productData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {productData.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <select
                    value={productData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Subcategory</option>
                    {categories.find(cat => cat.id === productData.category)?.subcategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Craft Technique
                </label>
                <input
                  type="text"
                  value={productData.craftTechnique}
                  onChange={(e) => handleInputChange('craftTechnique', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Hand weaving, Block printing"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleVoiceInput}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    isRecording 
                      ? 'bg-red-50 border-red-300 text-red-700' 
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isRecording ? 'Recording...' : 'Voice Input'}
                </button>
                <button
                  onClick={generateAIContent}
                  disabled={isGeneratingContent || !productData.name}
                  className="flex items-center gap-2 btn-primary disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {isGeneratingContent ? 'Generating...' : 'AI Generate'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={productData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe your product in detail..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Materials Used
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded-lg p-3">
                    {materials.map(material => (
                      <label key={material} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={productData.materials.includes(material)}
                          onChange={() => handleArrayToggle('materials', material)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        {material}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Colors
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded-lg p-3">
                    {colors.map(color => (
                      <label key={color} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={productData.colors.includes(color)}
                          onChange={() => handleArrayToggle('colors', color)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        {color}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cultural Significance
                </label>
                <textarea
                  value={productData.culturalSignificance}
                  onChange={(e) => handleInputChange('culturalSignificance', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe the cultural and historical significance..."
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Product Images</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Upload Product Images</p>
                <p className="text-gray-600">Drag and drop or click to select images</p>
              </label>
            </div>

            {productData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {productData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => {
                        setProductData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Pricing</h2>
            <SmartPricingSuggestions 
              productData={productData}
              onPriceUpdate={(price) => handleInputChange('price', price)}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Review & Save</h2>
            
            <div className="bg-white border rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {productData.name}</div>
                    <div><strong>Category:</strong> {productData.category}</div>
                    <div><strong>Price:</strong> ₹{productData.price}</div>
                    <div><strong>Materials:</strong> {productData.materials.join(', ')}</div>
                    <div><strong>Colors:</strong> {productData.colors.join(', ')}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {productData.images.slice(0, 6).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-16 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 text-sm">{productData.description}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/products')}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-600">Create a new product listing with AI assistance</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-lg p-4 shadow-sm">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step.id 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step.icon}
              </div>
              <div className="ml-3 hidden sm:block">
                <div className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 ml-4 ${
                  currentStep > step.id ? 'bg-primary-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex gap-3">
            {currentStep === 5 ? (
              <button
                onClick={handleSaveProduct}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Product
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                className="btn-primary"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
