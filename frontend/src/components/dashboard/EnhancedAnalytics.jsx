import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  Eye, 
  Heart,
  Globe,
  Smartphone,
  Calendar,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { useLanguage } from '../../context/LanguageContext';

const EnhancedAnalytics = ({ timeRange = '30d' }) => {
  const { t } = useLanguage();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setAnalyticsData(getDemoAnalyticsData());
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalyticsData(getDemoAnalyticsData());
      setIsLoading(false);
    }
  };

  const getDemoAnalyticsData = () => ({
    overview: {
      totalRevenue: 125000,
      revenueGrowth: 23.5,
      totalOrders: 89,
      ordersGrowth: 15.2,
      totalCustomers: 234,
      customersGrowth: 18.7,
      avgOrderValue: 1404,
      aovGrowth: 7.3,
      conversionRate: 3.2,
      conversionGrowth: 12.1,
      digitalScore: 78,
      scoreGrowth: 5.8
    },
    
    salesTrend: [
      { date: '2024-01-01', sales: 8500, orders: 6 },
      { date: '2024-01-02', sales: 12300, orders: 9 },
      { date: '2024-01-03', sales: 9800, orders: 7 },
      { date: '2024-01-04', sales: 15600, orders: 11 },
      { date: '2024-01-05', sales: 11200, orders: 8 },
      { date: '2024-01-06', sales: 18900, orders: 13 },
      { date: '2024-01-07', sales: 14500, orders: 10 }
    ],
    
    productPerformance: [
      { name: 'Handwoven Sarees', sales: 45000, orders: 25, growth: 28 },
      { name: 'Pottery Items', sales: 32000, orders: 18, growth: 15 },
      { name: 'Jewelry', sales: 28000, orders: 22, growth: 35 },
      { name: 'Home Decor', sales: 20000, orders: 14, growth: 12 }
    ],
    
    customerSegments: [
      { name: 'Local Customers', value: 35, color: '#8884d8' },
      { name: 'National Buyers', value: 45, color: '#82ca9d' },
      { name: 'International', value: 20, color: '#ffc658' }
    ],
    
    trafficSources: [
      { source: 'Social Media', visitors: 1250, conversions: 45, color: '#ff7c7c' },
      { source: 'Direct', visitors: 890, conversions: 32, color: '#8884d8' },
      { source: 'Search', visitors: 650, conversions: 28, color: '#82ca9d' },
      { source: 'Referral', visitors: 420, conversions: 15, color: '#ffc658' }
    ],
    
    aiInsights: [
      {
        type: 'opportunity',
        title: 'Peak Sales Window',
        description: 'Your sales peak between 2-4 PM. Consider scheduling social media posts during this time.',
        impact: 'high',
        action: 'Schedule posts'
      },
      {
        type: 'trend',
        title: 'Growing International Interest',
        description: 'International customers increased by 45% this month. Consider expanding global shipping.',
        impact: 'medium',
        action: 'Expand shipping'
      },
      {
        type: 'warning',
        title: 'Inventory Alert',
        description: 'Handwoven sarees are selling 3x faster than restocking rate.',
        impact: 'high',
        action: 'Increase production'
      }
    ],
    
    monthlyGoals: {
      revenue: { target: 150000, current: 125000, progress: 83 },
      orders: { target: 100, current: 89, progress: 89 },
      newCustomers: { target: 50, current: 42, progress: 84 }
    }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthIcon = (growth) => {
    return growth > 0 ? 
      <TrendingUp className="w-4 h-4 text-green-500" /> : 
      <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getGrowthColor = (growth) => {
    return growth > 0 ? 'text-green-600' : 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1">
              {getGrowthIcon(analyticsData.overview.revenueGrowth)}
              <span className={`text-sm font-medium ${getGrowthColor(analyticsData.overview.revenueGrowth)}`}>
                {analyticsData.overview.revenueGrowth > 0 ? '+' : ''}{analyticsData.overview.revenueGrowth}%
              </span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(analyticsData.overview.totalRevenue)}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1">
              {getGrowthIcon(analyticsData.overview.ordersGrowth)}
              <span className={`text-sm font-medium ${getGrowthColor(analyticsData.overview.ordersGrowth)}`}>
                {analyticsData.overview.ordersGrowth > 0 ? '+' : ''}{analyticsData.overview.ordersGrowth}%
              </span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {analyticsData.overview.totalOrders}
            </div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-1">
              {getGrowthIcon(analyticsData.overview.customersGrowth)}
              <span className={`text-sm font-medium ${getGrowthColor(analyticsData.overview.customersGrowth)}`}>
                {analyticsData.overview.customersGrowth > 0 ? '+' : ''}{analyticsData.overview.customersGrowth}%
              </span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {analyticsData.overview.totalCustomers}
            </div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </div>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Orders</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData.salesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'sales' ? formatCurrency(value) : value,
                  name === 'sales' ? 'Sales' : 'Orders'
                ]}
                labelFormatter={(value) => new Date(value).toLocaleDateString('en-IN')}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.1}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#10b981" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Product Performance */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Product Performance</h3>
          <div className="space-y-4">
            {analyticsData.productPerformance.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-600">{product.orders} orders</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatCurrency(product.sales)}</div>
                  <div className={`text-sm flex items-center gap-1 ${getGrowthColor(product.growth)}`}>
                    {getGrowthIcon(product.growth)}
                    {product.growth > 0 ? '+' : ''}{product.growth}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Segments</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.customerSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analyticsData.customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-2 mt-4">
            {analyticsData.customerSegments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: segment.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{segment.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{segment.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Insights & Recommendations</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {analyticsData.aiInsights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              insight.impact === 'high' ? 'border-red-500 bg-red-50' :
              insight.impact === 'medium' ? 'border-yellow-500 bg-yellow-50' :
              'border-blue-500 bg-blue-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {insight.type === 'opportunity' && <Target className="w-5 h-5 text-green-600" />}
                {insight.type === 'trend' && <TrendingUp className="w-5 h-5 text-blue-600" />}
                {insight.type === 'warning' && <Eye className="w-5 h-5 text-red-600" />}
                <h4 className="font-semibold text-gray-900">{insight.title}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                {insight.action} →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Goals */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Monthly Goals Progress</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(analyticsData.monthlyGoals).map(([key, goal]) => (
            <div key={key} className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - goal.progress / 100)}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">{goal.progress}%</span>
                </div>
              </div>
              <div className="font-medium text-gray-900 capitalize mb-1">{key}</div>
              <div className="text-sm text-gray-600">
                {key === 'revenue' ? formatCurrency(goal.current) : goal.current} / {key === 'revenue' ? formatCurrency(goal.target) : goal.target}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalytics;
