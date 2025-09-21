import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Globe, Users, TrendingUp, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const HomePage = () => {
  const { enableDemoMode } = useAuth();
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-primary-500" />,
      title: t('aiPoweredContent'),
      description: t('aiContentDesc'),
    },
    {
      icon: <Globe className="w-8 h-8 text-secondary-500" />,
      title: t('globalMarketplace'),
      description: t('globalMarketplaceDesc'),
    },
    {
      icon: <Users className="w-8 h-8 text-accent-500" />,
      title: t('artisanCommunity'),
      description: t('artisanCommunityDesc'),
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary-500" />,
      title: t('businessGrowth'),
      description: t('businessGrowthDesc'),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg cultural-pattern py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={enableDemoMode}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium text-lg px-8 py-3 rounded-lg transition-all duration-200 inline-flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Play className="w-5 h-5" />
              {t('tryDemo')}
            </button>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              ✨ Free signup • No credit card required
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transform Your Craft Business
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides everything you need to digitize, 
              market, and sell your traditional crafts to a global audience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">10,000+</div>
              <div className="text-gray-600">Artisans Empowered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary-500 mb-2">50%</div>
              <div className="text-gray-600">Average Income Increase</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-500 mb-2">20+</div>
              <div className="text-gray-600">Countries Reached</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Digitize Your Craft?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of artisans who have transformed their traditional crafts 
            into thriving digital businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-primary-500 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
            >
              Create Your Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={enableDemoMode}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-500 font-medium py-3 px-8 rounded-lg transition-all duration-200 inline-flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Try Demo First
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
