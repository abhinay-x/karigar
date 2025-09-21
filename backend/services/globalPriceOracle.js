import { logger } from '../utils/logger.js';

/**
 * GlobalPriceOracle
 * Clean, minimal mock implementation to keep the backend stable during demos.
 * Provides deterministic calculations and mocked marketplace data.
 */
class GlobalPriceOracle {
  constructor() {
    this.marketplaces = {
      etsy: { region: 'global', currency: 'USD' },
      amazon: { region: 'US', currency: 'USD' },
      ebay: { region: 'global', currency: 'USD' },
      novica: { region: 'global', currency: 'USD' },
    };

    this.exchangeRates = {};
  }

  async initialize() {
    await this.updateExchangeRates();
    logger.info('GlobalPriceOracle initialized');
  }

  /**
   * Main entry: compute global pricing recommendations
   */
  async getGlobalPricing(productData, targetMarkets = ['US', 'EU', 'UK', 'AU']) {
    const marketplaceData = await this.gatherMarketplaceData(productData);
    const costAnalysis = await this.analyzeCosts(productData);
    const shippingAnalysis = await this.analyzeShippingCosts(productData, targetMarkets);

    // Simple recommendation heuristic
    const baseUsd = this.estimateBaseUsd(productData, marketplaceData, costAnalysis);
    const recommendedUsd = Math.round(baseUsd * 1.15); // 15% margin
    const rangeMinUsd = Math.round(recommendedUsd * 0.85);
    const rangeMaxUsd = Math.round(recommendedUsd * 1.25);

    const usdToInr = this.exchangeRates.USD_INR || 83;
    const recommendation = {
      recommendedPrice: {
        USD: recommendedUsd,
        INR: Math.round(recommendedUsd * usdToInr)
      },
      priceRange: {
        USD: { min: rangeMinUsd, max: rangeMaxUsd },
        INR: { min: Math.round(rangeMinUsd * usdToInr), max: Math.round(rangeMaxUsd * usdToInr) }
      },
      positioning: 'Premium handmade',
      rationale: 'Based on material/labor costs, marketplace averages and shipping.',
    };

    const result = {
      ...recommendation,
      marketplaceData,
      costBreakdown: costAnalysis,
      shippingCosts: shippingAnalysis,
      generatedAt: new Date(),
      confidence: this.calculatePricingConfidence(marketplaceData, costAnalysis),
    };

    return result;
  }

  // ----- Helpers -----
  async gatherMarketplaceData(productData) {
    // Mock: generate 10 items around an average
    const avg = this.mockAvgForCategory(productData.category);
    const variance = 0.25;
    const makeProducts = () => Array.from({ length: 10 }).map((_, i) => ({
      title: `${productData?.name || 'Handmade Item'} ${i + 1}`,
      price: Math.round(avg + (Math.random() - 0.5) * avg * variance),
      currency: 'USD',
      rating: +(Math.random() * 2 + 3).toFixed(1),
      reviews: Math.floor(Math.random() * 500) + 10,
      seller: `Seller${i + 1}`,
      shipping: Math.floor(Math.random() * 30) + 5,
      url: `https://example.com/item/${i + 1}`
    }));

    const data = {};
    for (const key of Object.keys(this.marketplaces)) {
      const products = makeProducts();
      data[key] = {
        products,
        averagePrice: Math.round(products.reduce((s, p) => s + p.price, 0) / products.length),
        priceRange: {
          min: Math.min(...products.map(p => p.price)),
          max: Math.max(...products.map(p => p.price)),
        },
        totalResults: 500 + Math.floor(Math.random() * 5000),
        scrapedAt: new Date(),
      };
    }
    return data;
  }

  async analyzeCosts(productData) {
    const materials = productData.materials || [];
    const materialTotals = materials.reduce((sum, m) => sum + this.getMaterialCost(m), 0);
    const labor = await this.calculateLaborCost(productData.category || 'pottery', productData.complexity || 'medium', 'India');
    const overhead = await this.calculateOverheadCosts(productData);

    return {
      materials: { total: materialTotals, currency: 'INR' },
      labor,
      overhead,
      total: materialTotals + labor.total + overhead.total,
    };
  }

  async analyzeShippingCosts(productData, targetMarkets) {
    const weight = Number(productData?.dimensions?.weight || productData?.weight || 1);
    const size = {
      length: Number(productData?.dimensions?.length || 20),
      width: Number(productData?.dimensions?.width || 20),
      height: Number(productData?.dimensions?.height || 10),
    };
    const markets = targetMarkets || ['US'];
    const costs = {};
    for (const m of markets) costs[m] = this.calculateShippingCost(weight, size, m);
    return costs;
  }

  calculateShippingCost(weight, dimensions, market) {
    const base = { US: 25, EU: 30, UK: 28, AU: 35, CA: 32 }[market] || 25;
    const weightMul = Math.max(1, weight);
    const sizeMul = Math.max(1, (dimensions.length * dimensions.width * dimensions.height) / 8000);
    const total = base + weightMul * 5 + sizeMul * 3;
    return { base, weight: weightMul * 5, size: sizeMul * 3, total: Math.round(total), currency: 'USD', estimatedDays: this.getShippingDays(market) };
  }

  getShippingDays(market) {
    return ({ US: '7-14', EU: '10-18', UK: '8-15', AU: '12-20', CA: '8-16' }[market]) || '7-21';
  }

  calculatePricingConfidence(marketplaceData, costAnalysis) {
    const totalProducts = Object.values(marketplaceData).reduce((s, d) => s + (d.products?.length || 0), 0);
    let confidence = 60;
    if (totalProducts > 30) confidence += 15;
    if (totalProducts > 60) confidence += 10;
    if (costAnalysis?.total > 0) confidence += 10;
    return Math.min(confidence, 95);
  }

  // --- Internal calc helpers ---
  mockAvgForCategory(category) {
    const map = { pottery: 40, textiles: 55, jewelry: 70, woodwork: 60, metalwork: 65 };
    return (map[category] || 50) * 1.0;
  }

  estimateBaseUsd(productData, marketplaceData, costAnalysis) {
    const avgMarket = Object.values(marketplaceData).reduce((s, d) => s + (d.averagePrice || 50), 0) / Math.max(1, Object.keys(marketplaceData).length);
    const inrTotal = costAnalysis?.total || 1500;
    const usd = inrTotal / (this.exchangeRates.USD_INR || 83);
    return Math.max(avgMarket * 0.9, usd * 1.5);
  }

  async updateExchangeRates() {
    this.exchangeRates = { USD_INR: 83.25, EUR_INR: 90.15, GBP_INR: 105.3, AUD_INR: 55.8 };
  }

  getMaterialCost(material) {
    const base = { clay: 50, silk: 500, cotton: 200, silver: 5000, gold: 50000, wood: 300, brass: 400, leather: 600, beads: 100, thread: 50 };
    return base[(material || '').toLowerCase()] || 100;
  }

  async calculateLaborCost(category, complexity, location) {
    const hourlyRates = {
      India: { pottery: 150, textiles: 200, jewelry: 300, woodwork: 180, metalwork: 250 },
    };
    const complexityMul = { simple: 0.7, medium: 1.0, complex: 1.5, masterpiece: 2.0 }[complexity] || 1.0;
    const baseHours = { pottery: 8, textiles: 12, jewelry: 6, woodwork: 10, metalwork: 8 }[category] || 8;
    const rate = (hourlyRates[location] || hourlyRates.India)[category] || 200;
    const hours = baseHours * complexityMul;
    return { hourlyRate: rate, hours, total: Math.round(rate * hours), currency: 'INR' };
  }

  async calculateOverheadCosts(productData) {
    const base = 200;
    const mul = { pottery: 1.0, textiles: 1.2, jewelry: 1.5, woodwork: 1.1, metalwork: 1.3 }[productData.category] || 1.0;
    const total = Math.round(base * mul);
    return { utilities: Math.round(total * 0.3), tools: Math.round(total * 0.4), workspace: Math.round(total * 0.3), total, currency: 'INR' };
  }
}

export default new GlobalPriceOracle();
