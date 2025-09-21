import React, { useState } from 'react';
import { 
  Palette, 
  Eye, 
  Settings, 
  Share2, 
  ExternalLink,
  Layout,
  Type,
  Image as ImageIcon,
  Save,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { STOREFRONT_THEMES } from '../utils/constants';
import { useAuth } from '../context/AuthContext.jsx';

const StorefrontPage = () => {
  const { user } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState('heritage');
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop, tablet, mobile

  const craftTitle = user?.craft ? user.craft.charAt(0).toUpperCase() + user.craft.slice(1) : 'Store';
  const defaultStoreName = user?.name ? `${user.name} ${craftTitle}` : 'Your Craft Store';
  const defaultTagline = `Authentic Handcrafted ${craftTitle}${user?.location ? ` from ${user.location.split(',')[0]}` : ''}`;
  const defaultAbout = user?.craft
    ? `Artisan specializing in ${user.craft.toLowerCase()} with a passion for preserving traditional techniques.`
    : 'Dedicated artisan creating beautiful handcrafted products using time-honored techniques.';

  const [storeSettings, setStoreSettings] = useState({
    storeName: defaultStoreName,
    tagline: defaultTagline,
    about: defaultAbout,
    contactInfo: {
      phone: '+91 98765 43210',
      whatsapp: '+91 98765 43210',
      email: user?.email || 'hello@yourstore.com',
      address: user?.location || 'India'
    },
    socialMedia: {
      instagram: user?.name ? `@${user.name.toLowerCase().replace(/\s+/g,'')}` : '@yourstore',
      facebook: user?.name ? user.name.replace(/\s+/g,'') : 'YourStore'
    }
  });

  React.useEffect(() => {
    // If user logs in and defaults are still the demo ones, personalize them
    if (user) {
      const ct = user.craft ? user.craft.charAt(0).toUpperCase() + user.craft.slice(1) : 'Store';
      const personalizedName = `${user.name} ${ct}`;
      const personalizedTagline = `Authentic Handcrafted ${ct}${user.location ? ` from ${user.location.split(',')[0]}` : ''}`;
      setStoreSettings((prev) => ({
        ...prev,
        storeName: (prev.storeName === 'Rajesh Kumar Pottery' || prev.storeName === 'Your Craft Store') ? personalizedName : prev.storeName,
        tagline: prev.tagline.includes('Authentic Handcrafted') ? personalizedTagline : prev.tagline,
        contactInfo: {
          ...prev.contactInfo,
          email: prev.contactInfo.email === 'rajesh@pottery.com' || prev.contactInfo.email === 'hello@yourstore.com' ? (user.email || prev.contactInfo.email) : prev.contactInfo.email,
          address: prev.contactInfo.address === 'Blue Pottery Lane, Jaipur, Rajasthan' || prev.contactInfo.address === 'India' ? (user.location || prev.contactInfo.address) : prev.contactInfo.address,
        },
      }));
    }
  }, [user]);

  const [products] = useState([
    {
      id: 1,
      name: 'Blue Pottery Vase',
      price: 2500,
      image: '/api/placeholder/300/300',
      category: 'Vases'
    },
    {
      id: 2,
      name: 'Decorative Bowl Set',
      price: 1800,
      image: '/api/placeholder/300/300',
      category: 'Bowls'
    },
    {
      id: 3,
      name: 'Traditional Diya Set',
      price: 800,
      image: '/api/placeholder/300/300',
      category: 'Lighting'
    },
    {
      id: 4,
      name: 'Ceramic Planters',
      price: 1200,
      image: '/api/placeholder/300/300',
      category: 'Garden'
    },
    {
      id: 5,
      name: 'Tea Cup Set',
      price: 1500,
      image: '/api/placeholder/300/300',
      category: 'Tableware'
    },
    {
      id: 6,
      name: 'Wall Hanging Plates',
      price: 3200,
      image: '/api/placeholder/300/300',
      category: 'Decor'
    }
  ]);

  const currentTheme = STOREFRONT_THEMES.find(theme => theme.id === selectedTheme);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'max-w-6xl';
    }
  };

  const StorefrontPreview = () => (
    <div 
      className={`mx-auto transition-all duration-300 ${getPreviewWidth()}`}
      style={{ 
        backgroundColor: currentTheme.colors.background,
        color: currentTheme.colors.text,
        fontFamily: currentTheme.fonts.body
      }}
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b" style={{ borderColor: currentTheme.colors.primary + '20' }}>
        <div className="px-4 py-6">
          <div className="text-center">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ 
                color: currentTheme.colors.primary,
                fontFamily: currentTheme.fonts.heading
              }}
            >
              {storeSettings.storeName}
            </h1>
            <p className="text-gray-600">{storeSettings.tagline}</p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-4 py-8 text-center" style={{ backgroundColor: currentTheme.colors.background }}>
        <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
          <div className="text-2xl">👨‍🎨</div>
        </div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: currentTheme.colors.text }}>
          About the Artisan
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {storeSettings.about}
        </p>
      </div>

      {/* Products Section */}
      <div className="px-4 py-8">
        <h2 
          className="text-2xl font-bold text-center mb-8"
          style={{ 
            color: currentTheme.colors.primary,
            fontFamily: currentTheme.fonts.heading
          }}
        >
          Featured Products
        </h2>
        
        <div className={`grid gap-6 ${
          previewMode === 'mobile' 
            ? 'grid-cols-1' 
            : previewMode === 'tablet' 
            ? 'grid-cols-2' 
            : 'grid-cols-3'
        }`}>
          {products.slice(0, previewMode === 'mobile' ? 3 : 6).map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                <div className="flex items-center justify-between">
                  <span 
                    className="text-lg font-bold"
                    style={{ color: currentTheme.colors.primary }}
                  >
                    {formatCurrency(product.price)}
                  </span>
                  <button 
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="px-4 py-8 bg-gray-50">
        <h2 
          className="text-2xl font-bold text-center mb-8"
          style={{ 
            color: currentTheme.colors.primary,
            fontFamily: currentTheme.fonts.heading
          }}
        >
          Get in Touch
        </h2>
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-sm">📱</span>
            </div>
            <span>{storeSettings.contactInfo.whatsapp}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-sm">📧</span>
            </div>
            <span>{storeSettings.contactInfo.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-sm">📍</span>
            </div>
            <span className="text-sm">{storeSettings.contactInfo.address}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg h-screen overflow-y-auto">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Storefront Builder</h1>
            <p className="text-gray-600">Customize your digital storefront</p>
          </div>

          {/* Theme Selection */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Choose Theme
            </h3>
            <div className="space-y-3">
              {STOREFRONT_THEMES.map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTheme === theme.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      ></div>
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.secondary }}
                      ></div>
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.accent }}
                      ></div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{theme.name}</h4>
                      <p className="text-sm text-gray-600">{theme.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Store Settings */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Store Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  className="input-field text-sm"
                  value={storeSettings.storeName}
                  onChange={(e) => setStoreSettings({
                    ...storeSettings,
                    storeName: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  className="input-field text-sm"
                  value={storeSettings.tagline}
                  onChange={(e) => setStoreSettings({
                    ...storeSettings,
                    tagline: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About
                </label>
                <textarea
                  rows="3"
                  className="input-field text-sm"
                  value={storeSettings.about}
                  onChange={(e) => setStoreSettings({
                    ...storeSettings,
                    about: e.target.value
                  })}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 space-y-3">
            <button className="w-full btn-primary flex items-center justify-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button className="w-full btn-outline flex items-center justify-center space-x-2">
              <ExternalLink className="w-4 h-4" />
              <span>Visit Live Store</span>
            </button>
            <button className="w-full btn-secondary flex items-center justify-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share Store</span>
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 p-6">
          {/* Preview Controls */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
            <div className="flex items-center space-x-4">
              {/* Device Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
                  title="Desktop"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('tablet')}
                  className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-white shadow-sm' : ''}`}
                  title="Tablet"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
                  title="Mobile"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
              
              <button className="btn-outline flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
            </div>
          </div>

          {/* Preview Container */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 flex items-center space-x-2 border-b">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600">
                {`https://kalaai.com/store/${(storeSettings.storeName || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}`}
              </div>
            </div>
            
            <div className="overflow-auto" style={{ maxHeight: '80vh' }}>
              <StorefrontPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorefrontPage;
