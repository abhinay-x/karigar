import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  Users, 
  Star, 
  Eye, 
  ShoppingCart, 
  Heart,
  BarChart3,
  PlusCircle,
  Sparkles,
  Calendar,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import EnhancedAnalytics from '../components/dashboard/EnhancedAnalytics';
import { useLanguage } from '../context/LanguageContext';

const DashboardPage = () => {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState('overview'); // overview, analytics
  const [timeRange, setTimeRange] = useState('30d');
  const [metrics, setMetrics] = useState({
    sales: { total: 125000, thisMonth: 18500, growth: 23.5 },
    products: { total: 45, active: 42, views: 12500 },
    customers: { total: 234, returning: 89, rating: 4.7 },
    digital: { score: 78, socialReach: 5600, engagement: 12.3 }
  });

  const [recentProducts] = useState([
    {
      id: 1,
      name: 'Handwoven Silk Saree',
      image: '/api/placeholder/100/100',
      views: 245,
      likes: 18,
      orders: 3,
      price: 8500,
      status: 'active'
    },
    {
      id: 2,
      name: 'Terracotta Vase Set',
      image: '/api/placeholder/100/100',
      views: 189,
      likes: 12,
      orders: 2,
      price: 2500,
      status: 'active'
    },
    {
      id: 3,
      name: 'Silver Filigree Earrings',
      image: '/api/placeholder/100/100',
      views: 156,
      likes: 24,
      orders: 5,
      price: 3200,
      status: 'active'
    }
  ]);

  const salesData = [
    { month: 'Jan', sales: 12000 },
    { month: 'Feb', sales: 15000 },
    { month: 'Mar', sales: 18000 },
    { month: 'Apr', sales: 16500 },
    { month: 'May', sales: 20000 },
    { month: 'Jun', sales: 18500 }
  ];

  const engagementData = [
    { day: 'Mon', views: 120, likes: 15 },
    { day: 'Tue', views: 150, likes: 18 },
    { day: 'Wed', views: 180, likes: 22 },
    { day: 'Thu', views: 165, likes: 20 },
    { day: 'Fri', views: 200, likes: 25 },
    { day: 'Sat', views: 220, likes: 28 },
    { day: 'Sun', views: 190, likes: 24 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard')}</h1>
              <p className="text-gray-600">Welcome back! Here's how your craft business is performing.</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Time Range Selector */}
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              {/* View Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveView('overview')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeView === 'overview'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveView('analytics')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeView === 'analytics'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Link
            to="/products/new"
            className="bg-primary-500 text-white p-4 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-3"
          >
            <PlusCircle className="w-6 h-6" />
            <span className="font-medium">Add Product</span>
          </Link>
          <Link
            to="/ai-assistant"
            className="bg-secondary-500 text-white p-4 rounded-lg hover:bg-secondary-600 transition-colors flex items-center space-x-3"
          >
            <Sparkles className="w-6 h-6" />
            <span className="font-medium">AI Assistant</span>
          </Link>
          <Link
            to="/storefront"
            className="bg-accent-500 text-white p-4 rounded-lg hover:bg-accent-600 transition-colors flex items-center space-x-3"
          >
            <BarChart3 className="w-6 h-6" />
            <span className="font-medium">Storefront</span>
          </Link>
          <Link
            to="/analytics"
            className="bg-gray-600 text-white p-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-3"
          >
            <TrendingUp className="w-6 h-6" />
            <span className="font-medium">Analytics</span>
          </Link>
        </div>

        {/* Metrics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Sales Metrics */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Sales</h3>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(metrics.sales.total)}</p>
              <p className="text-sm text-gray-600">This month: {formatCurrency(metrics.sales.thisMonth)}</p>
              <div className="flex items-center space-x-1">
                <span className="text-green-500 text-sm font-medium">+{metrics.sales.growth}%</span>
                <span className="text-gray-500 text-sm">from last month</span>
              </div>
            </div>
          </div>

          {/* Products Metrics */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Products</h3>
              <Package className="w-6 h-6 text-blue-500" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{metrics.products.total}</p>
              <p className="text-sm text-gray-600">Active: {metrics.products.active}</p>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 text-sm">{metrics.products.views.toLocaleString()} views</span>
              </div>
            </div>
          </div>

          {/* Customers Metrics */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Customers</h3>
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{metrics.customers.total}</p>
              <p className="text-sm text-gray-600">Returning: {metrics.customers.returning}</p>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-600 text-sm">{metrics.customers.rating} rating</span>
              </div>
            </div>
          </div>

          {/* Digital Score */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Digital Score</h3>
              <BarChart3 className="w-6 h-6 text-orange-500" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{metrics.digital.score}/100</p>
              <p className="text-sm text-gray-600">Social reach: {metrics.digital.socialReach.toLocaleString()}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${metrics.digital.score}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="sales" fill="#f59e42" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Engagement</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#0ea5e9" strokeWidth={2} />
                <Line type="monotone" dataKey="likes" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Products */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
            <Link to="/products" className="text-primary-500 hover:text-primary-600 font-medium">
              View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Views</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Likes</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Orders</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span>{product.views}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-gray-400" />
                        <span>{product.likes}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <ShoppingCart className="w-4 h-4 text-gray-400" />
                        <span>{product.orders}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conditional Content Based on Active View */}
        {activeView === 'analytics' ? (
          <EnhancedAnalytics timeRange={timeRange} />
        ) : null}
      </div>
    </div>
  );
};

export default DashboardPage;
