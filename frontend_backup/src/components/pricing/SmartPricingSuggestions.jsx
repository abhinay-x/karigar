import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertCircle,
  CheckCircle,
  BarChart3,
  Calculator,
  Lightbulb,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const SmartPricingSuggestions = ({ productData, onPriceUpdate }) => {
  const { t, currentLanguage } = useLanguage();
  const [pricingData, setPricingData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [costBreakdown, setCostBreakdown] = useState({
    materials: 0,
    labor: 0,
    overhead: 0,
    profit: 0
  });

  useEffect(() => {
    if (productData) {
      analyzePricing();
    }
  }, [productData]);

  const analyzePricing = async () => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/ai/analyze-pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: productData,
          language: currentLanguage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze pricing');
      }

      const data = await response.json();
      setPricingData(data);
      setSelectedPrice(data.recommendedPrice);
      
    } catch (error) {
      console.error('Error analyzing pricing:', error);
      // Fallback demo data
      setPricingData(getDemoPricingData());
      setSelectedPrice(getDemoPricingData().recommendedPrice);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getDemoPricingData = () => {
    const basePrice = 2500;
    return {
      recommendedPrice: basePrice,
      priceRange: {
        minimum: basePrice * 0.8,
        maximum: basePrice * 1.4,
        optimal: basePrice
      },
      marketAnalysis: {
        averageMarketPrice: 2800,
        competitorPrices: [2200, 2600, 3000, 2400, 2900],
        demandLevel: 'high',
        seasonalTrend: 'increasing'
      },
      costAnalysis: {
        materials: 800,
        labor: 1200,
        overhead: 300,
        suggestedProfit: 500
      },
      confidence: 0.85,
      reasoning: [
        'Material costs are 32% of total price, within optimal range',
        'Labor time of 8 hours justifies current pricing',
        'Market demand is high for traditional pottery',
        'Seasonal trends show 15% price increase potential',
        'Your craftsmanship quality supports premium pricing'
      ],
      recommendations: [
        {
          type: 'increase',
          amount: 200,
          reason: 'Market analysis shows room for 8% price increase',
          impact: 'Higher profit margins without affecting demand'
        },
        {
          type: 'bundle',
          suggestion: 'Create pottery set bundles for 20% higher value',
          impact: 'Increase average order value'
        },
        {
          type: 'seasonal',
          suggestion: 'Increase prices by 10% during festival season',
          impact: 'Capitalize on seasonal demand'
        }
      ]
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPriceChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Target className="w-4 h-4 text-gray-500" />;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const handlePriceSelection = (price) => {
    setSelectedPrice(price);
    if (onPriceUpdate) {
      onPriceUpdate(price);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 text-primary-500 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Market Data</h3>
            <p className="text-gray-600">AI is analyzing pricing trends and market conditions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!pricingData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Pricing Assistant</h3>
          <p className="text-gray-600 mb-4">Add product details to get AI-powered pricing suggestions</p>
          <button 
            onClick={analyzePricing}
            className="btn-primary"
          >
            Analyze Pricing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
          <DollarSign className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Smart Pricing Suggestions</h2>
          <p className="text-gray-600">AI-powered pricing analysis for optimal profitability</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pricing Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended Price */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Recommended Price</h3>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(pricingData.confidence)}`}>
                {Math.round(pricingData.confidence * 100)}% Confidence
              </div>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {formatCurrency(pricingData.recommendedPrice)}
              </div>
              <div className="text-sm text-gray-600">
                Range: {formatCurrency(pricingData.priceRange.minimum)} - {formatCurrency(pricingData.priceRange.maximum)}
              </div>
            </div>

            <button
              onClick={() => handlePriceSelection(pricingData.recommendedPrice)}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                selectedPrice === pricingData.recommendedPrice
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-600 border border-green-600 hover:bg-green-50'
              }`}
            >
              {selectedPrice === pricingData.recommendedPrice ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Selected
                </div>
              ) : (
                'Use This Price'
              )}
            </button>
          </div>

          {/* Price Options */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alternative Pricing Options</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Conservative */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => handlePriceSelection(pricingData.priceRange.minimum)}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-900">Conservative</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatCurrency(pricingData.priceRange.minimum)}
                </div>
                <div className="text-sm text-gray-600">
                  Safe pricing for quick sales
                </div>
              </div>

              {/* Premium */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => handlePriceSelection(pricingData.priceRange.maximum)}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-gray-900">Premium</span>
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {formatCurrency(pricingData.priceRange.maximum)}
                </div>
                <div className="text-sm text-gray-600">
                  Maximum value positioning
                </div>
              </div>

              {/* Market Average */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => handlePriceSelection(pricingData.marketAnalysis.averageMarketPrice)}>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                  <span className="font-medium text-gray-900">Market Average</span>
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {formatCurrency(pricingData.marketAnalysis.averageMarketPrice)}
                </div>
                <div className="text-sm text-gray-600">
                  Competitive market rate
                </div>
              </div>
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
            </div>
            <div className="space-y-2">
              {pricingData.reasoning.map((reason, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cost Breakdown & Market Data */}
        <div className="space-y-6">
          {/* Cost Breakdown */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(pricingData.costAnalysis).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-medium text-gray-900">{formatCurrency(value)}</span>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    {formatCurrency(Object.values(pricingData.costAnalysis).reduce((a, b) => a + b, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Demand Level</span>
                  <span className={`text-sm font-medium ${
                    pricingData.marketAnalysis.demandLevel === 'high' ? 'text-green-600' : 
                    pricingData.marketAnalysis.demandLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {pricingData.marketAnalysis.demandLevel.toUpperCase()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${
                    pricingData.marketAnalysis.demandLevel === 'high' ? 'bg-green-500 w-4/5' : 
                    pricingData.marketAnalysis.demandLevel === 'medium' ? 'bg-yellow-500 w-3/5' : 'bg-red-500 w-2/5'
                  }`}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Seasonal Trend</span>
                  <div className="flex items-center gap-1">
                    {getPriceChangeIcon(pricingData.marketAnalysis.seasonalTrend === 'increasing' ? 1 : -1)}
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {pricingData.marketAnalysis.seasonalTrend}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-600">Competitor Range</span>
                <div className="text-sm font-medium text-gray-900 mt-1">
                  {formatCurrency(Math.min(...pricingData.marketAnalysis.competitorPrices))} - {formatCurrency(Math.max(...pricingData.marketAnalysis.competitorPrices))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-3">
              {pricingData.recommendations.map((rec, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 mb-1">{rec.suggestion}</div>
                      <div className="text-sm text-gray-600">{rec.impact}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6 pt-6 border-t">
        <button
          onClick={analyzePricing}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Analysis
        </button>
        <button
          onClick={() => {
            if (onPriceUpdate && selectedPrice) {
              onPriceUpdate(selectedPrice);
            }
          }}
          className="btn-primary flex items-center gap-2"
          disabled={!selectedPrice}
        >
          <CheckCircle className="w-4 h-4" />
          Apply Selected Price
        </button>
      </div>
    </div>
  );
};

export default SmartPricingSuggestions;
