import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';

const CulturalThemeSelector = ({ onThemeChange, currentTheme = 'rajasthani' }) => {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  const themes = [
    {
      id: 'rajasthani',
      name: 'Rajasthani Heritage',
      description: 'Rich colors inspired by Rajasthan\'s royal palaces',
      colors: {
        primary: '#D97706', // Saffron
        secondary: '#DC2626', // Deep Red
        accent: '#059669', // Emerald
        background: '#FEF3C7' // Warm cream
      },
      pattern: 'paisley',
      craft: 'Pottery, Textiles, Jewelry'
    },
    {
      id: 'bengali',
      name: 'Bengali Elegance',
      description: 'Inspired by Bengal\'s artistic traditions',
      colors: {
        primary: '#7C3AED', // Royal Purple
        secondary: '#F59E0B', // Golden Yellow
        accent: '#EF4444', // Vermillion
        background: '#FDF4FF' // Soft lavender
      },
      pattern: 'alpona',
      craft: 'Handloom, Pottery, Paintings'
    },
    {
      id: 'south_indian',
      name: 'South Indian Classic',
      description: 'Temple architecture and silk traditions',
      colors: {
        primary: '#B91C1C', // Temple Red
        secondary: '#F59E0B', // Gold
        accent: '#059669', // Green
        background: '#FFFBEB' // Ivory
      },
      pattern: 'kolam',
      craft: 'Silk Weaving, Bronze, Wood Carving'
    },
    {
      id: 'punjabi',
      name: 'Punjabi Vibrance',
      description: 'Bright and energetic like Punjab\'s fields',
      colors: {
        primary: '#F59E0B', // Mustard Yellow
        secondary: '#DC2626', // Red
        accent: '#059669', // Green
        background: '#FEFCE8' // Light yellow
      },
      pattern: 'phulkari',
      craft: 'Embroidery, Metalwork, Woodcraft'
    },
    {
      id: 'gujarati',
      name: 'Gujarati Tradition',
      description: 'Mirror work and vibrant textiles',
      colors: {
        primary: '#DC2626', // Red
        secondary: '#F59E0B', // Yellow
        accent: '#7C3AED', // Purple
        background: '#FEF2F2' // Light pink
      },
      pattern: 'bandhani',
      craft: 'Mirror Work, Bandhani, Pottery'
    },
    {
      id: 'kashmiri',
      name: 'Kashmiri Serenity',
      description: 'Peaceful colors of the valley',
      colors: {
        primary: '#1E40AF', // Deep Blue
        secondary: '#DC2626', // Red
        accent: '#059669', // Green
        background: '#F0F9FF' // Sky blue
      },
      pattern: 'chinar',
      craft: 'Pashmina, Carpets, Papier-mâché'
    }
  ];

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme.id);
    if (onThemeChange) {
      onThemeChange(theme);
    }
    
    // Apply theme to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    
    // Store theme preference
    localStorage.setItem('kalaai-theme', theme.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
          <Palette className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Cultural Themes</h3>
          <p className="text-gray-600">Choose a theme that reflects your craft heritage</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <div
            key={theme.id}
            onClick={() => handleThemeSelect(theme)}
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedTheme === theme.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Theme Preview */}
            <div className="mb-3">
              <div className="flex gap-1 mb-2">
                {Object.values(theme.colors).map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              
              {/* Pattern Preview */}
              <div 
                className="w-full h-16 rounded border border-gray-200 opacity-20"
                style={{ 
                  backgroundColor: theme.colors.background,
                  backgroundImage: getPatternCSS(theme.pattern, theme.colors.primary)
                }}
              />
            </div>

            {/* Theme Info */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{theme.name}</h4>
                {selectedTheme === theme.id && (
                  <Check className="w-5 h-5 text-primary-500" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{theme.description}</p>
              <div className="text-xs text-gray-500">
                <strong>Crafts:</strong> {theme.craft}
              </div>
            </div>

            {/* Selection Overlay */}
            {selectedTheme === theme.id && (
              <div className="absolute inset-0 bg-primary-500 bg-opacity-10 rounded-lg pointer-events-none" />
            )}
          </div>
        ))}
      </div>

      {/* Custom Theme Option */}
      <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <Palette className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <h4 className="font-medium text-gray-700 mb-1">Custom Theme</h4>
        <p className="text-sm text-gray-500 mb-3">
          Create your own theme based on your specific craft tradition
        </p>
        <button className="btn-secondary text-sm">
          Coming Soon
        </button>
      </div>

      {/* Theme Application Note */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>Note:</strong> Your selected theme will be applied to your storefront, 
          product pages, and all generated content to maintain cultural authenticity.
        </div>
      </div>
    </div>
  );
};

// Helper function to generate CSS patterns
const getPatternCSS = (pattern, color) => {
  const patterns = {
    paisley: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(color)}' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
    
    alpona: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(color)}' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3Ccircle cx='30' cy='30' r='10'/%3E%3C/g%3E%3C/svg%3E")`,
    
    kolam: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(color)}' fill-opacity='0.1'%3E%3Cpath d='M0 0h20v20H0zM20 20h20v20H20z'/%3E%3C/g%3E%3C/svg%3E")`,
    
    phulkari: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(color)}' fill-opacity='0.1'%3E%3Cpolygon points='15,5 20,15 15,25 10,15'/%3E%3C/g%3E%3C/svg%3E")`,
    
    bandhani: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(color)}' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
    
    chinar: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(color)}' fill-opacity='0.1'%3E%3Cpath d='M25 5L35 20L25 35L15 20z'/%3E%3C/g%3E%3C/svg%3E")`
  };
  
  return patterns[pattern] || patterns.paisley;
};

export default CulturalThemeSelector;
