import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter,
  RefreshCw,
  Target,
  Users,
  ShoppingCart,
  DollarSign
} from 'lucide-react';
import EnhancedAnalytics from '../components/dashboard/EnhancedAnalytics';
import { useLanguage } from '../context/LanguageContext';

const AnalyticsPage = () => {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'orders', 'customers']);
  const [isExporting, setIsExporting] = useState(false);

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '6m', label: 'Last 6 months' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const availableMetrics = [
    { id: 'revenue', name: 'Revenue', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'orders', name: 'Orders', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'customers', name: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'conversion', name: 'Conversion Rate', icon: <Target className="w-4 h-4" /> },
    { id: 'traffic', name: 'Website Traffic', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create and download CSV
      const csvData = generateCSVData();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateCSVData = () => {
    const headers = ['Date', 'Revenue', 'Orders', 'Customers', 'Conversion Rate'];
    const sampleData = [
      ['2024-01-01', '8500', '6', '12', '3.2%'],
      ['2024-01-02', '12300', '9', '18', '3.5%'],
      ['2024-01-03', '9800', '7', '15', '2.8%'],
      ['2024-01-04', '15600', '11', '22', '4.1%'],
      ['2024-01-05', '11200', '8', '16', '3.0%']
    ];
    
    return [headers, ...sampleData].map(row => row.join(',')).join('\n');
  };

  const handleMetricToggle = (metricId) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive insights into your craft business performance</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Export Button */}
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Exporting...' : 'Export Data'}
              </button>
              
              {/* Refresh Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center gap-6">
            {/* Time Range Selector */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Time Range:</label>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Metrics Filter */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Metrics:</label>
              <div className="flex flex-wrap gap-2">
                {availableMetrics.map(metric => (
                  <button
                    key={metric.id}
                    onClick={() => handleMetricToggle(metric.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedMetrics.includes(metric.id)
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {metric.icon}
                    {metric.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-sm text-green-600 font-medium">+23.5%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">₹1,25,000</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-sm text-blue-600 font-medium">+15.2%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">89</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-sm text-purple-600 font-medium">+18.7%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">234</div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-sm text-orange-600 font-medium">+12.1%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">3.2%</div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </div>
        </div>

        {/* Enhanced Analytics Component */}
        <EnhancedAnalytics timeRange={timeRange} />

        {/* Additional Insights */}
        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          {/* Performance Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="font-medium text-green-900">Best Performing Product</div>
                  <div className="text-sm text-green-700">Handwoven Silk Saree</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-900">₹45,000</div>
                  <div className="text-sm text-green-700">25 orders</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium text-blue-900">Top Traffic Source</div>
                  <div className="text-sm text-blue-700">Social Media</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-900">1,250</div>
                  <div className="text-sm text-blue-700">visitors</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <div className="font-medium text-purple-900">Peak Sales Time</div>
                  <div className="text-sm text-purple-700">2:00 PM - 4:00 PM</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-purple-900">35%</div>
                  <div className="text-sm text-purple-700">of daily sales</div>
                </div>
              </div>
            </div>
          </div>

          {/* Goals & Targets */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals & Targets</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Monthly Revenue Goal</span>
                  <span className="text-sm text-gray-600">₹1,25,000 / ₹1,50,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '83%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">83% completed</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Orders Target</span>
                  <span className="text-sm text-gray-600">89 / 100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">89% completed</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">New Customers</span>
                  <span className="text-sm text-gray-600">42 / 50</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">84% completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
