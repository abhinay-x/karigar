import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Heart, 
  ShoppingCart, 
  Edit, 
  Trash2,
  Package,
  Grid3X3,
  List,
  SortAsc
} from 'lucide-react';

const ProductsPage = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [products] = useState([
    {
      id: 1,
      name: 'Handwoven Silk Saree',
      category: 'textiles',
      subcategory: 'Handloom',
      price: 8500,
      originalPrice: 9500,
      images: ['/api/placeholder/300/300'],
      views: 245,
      likes: 18,
      orders: 3,
      status: 'active',
      createdAt: '2024-01-15',
      materials: ['Silk', 'Gold thread'],
      colors: ['Red', 'Gold'],
      description: 'Beautiful traditional silk saree with intricate gold work...',
      aiGenerated: {
        keywords: ['handwoven', 'silk', 'traditional', 'saree'],
        hashtags: ['#HandwovenSaree', '#SilkSaree', '#TraditionalWear']
      }
    },
    {
      id: 2,
      name: 'Terracotta Vase Set',
      category: 'pottery',
      subcategory: 'Earthenware',
      price: 2500,
      originalPrice: 2500,
      images: ['/api/placeholder/300/300'],
      views: 189,
      likes: 12,
      orders: 2,
      status: 'active',
      createdAt: '2024-01-10',
      materials: ['Clay', 'Natural pigments'],
      colors: ['Terracotta', 'Brown'],
      description: 'Set of 3 handcrafted terracotta vases with traditional motifs...',
      aiGenerated: {
        keywords: ['terracotta', 'vase', 'handcrafted', 'pottery'],
        hashtags: ['#TerracottaVase', '#HandmadePottery', '#HomeDecor']
      }
    },
    {
      id: 3,
      name: 'Silver Filigree Earrings',
      category: 'jewelry',
      subcategory: 'Silver work',
      price: 3200,
      originalPrice: 3200,
      images: ['/api/placeholder/300/300'],
      views: 156,
      likes: 24,
      orders: 5,
      status: 'active',
      createdAt: '2024-01-08',
      materials: ['Silver', 'Gemstones'],
      colors: ['Silver', 'Blue'],
      description: 'Exquisite silver filigree earrings with blue gemstone accents...',
      aiGenerated: {
        keywords: ['silver', 'filigree', 'earrings', 'jewelry'],
        hashtags: ['#SilverJewelry', '#FiligreeWork', '#HandmadeEarrings']
      }
    },
    {
      id: 4,
      name: 'Wooden Carved Elephant',
      category: 'woodwork',
      subcategory: 'Sculptures',
      price: 1800,
      originalPrice: 2000,
      images: ['/api/placeholder/300/300'],
      views: 98,
      likes: 8,
      orders: 1,
      status: 'draft',
      createdAt: '2024-01-05',
      materials: ['Teak wood'],
      colors: ['Natural wood'],
      description: 'Hand-carved wooden elephant sculpture with intricate details...',
      aiGenerated: {
        keywords: ['wooden', 'carved', 'elephant', 'sculpture'],
        hashtags: ['#WoodCarving', '#HandmadeSculpture', '#HomeDecor']
      }
    },
    {
      id: 5,
      name: 'Brass Diya Set',
      category: 'metalwork',
      subcategory: 'Brass work',
      price: 1200,
      originalPrice: 1200,
      images: ['/api/placeholder/300/300'],
      views: 134,
      likes: 15,
      orders: 4,
      status: 'active',
      createdAt: '2024-01-03',
      materials: ['Brass'],
      colors: ['Golden brass'],
      description: 'Traditional brass diya set for festivals and ceremonies...',
      aiGenerated: {
        keywords: ['brass', 'diya', 'traditional', 'festival'],
        hashtags: ['#BrassDiya', '#FestivalLights', '#TraditionalCrafts']
      }
    },
    {
      id: 6,
      name: 'Leather Handbag',
      category: 'leather',
      subcategory: 'Bags',
      price: 4500,
      originalPrice: 4500,
      images: ['/api/placeholder/300/300'],
      views: 201,
      likes: 19,
      orders: 2,
      status: 'active',
      createdAt: '2024-01-01',
      materials: ['Leather', 'Cotton lining'],
      colors: ['Brown', 'Tan'],
      description: 'Handcrafted leather handbag with traditional tooling patterns...',
      aiGenerated: {
        keywords: ['leather', 'handbag', 'handcrafted', 'tooling'],
        hashtags: ['#LeatherBag', '#HandmadeBag', '#TraditionalCrafts']
      }
    }
  ]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'pottery', label: 'Pottery & Ceramics' },
    { value: 'textiles', label: 'Textiles & Weaving' },
    { value: 'jewelry', label: 'Jewelry & Ornaments' },
    { value: 'woodwork', label: 'Wood Crafts' },
    { value: 'metalwork', label: 'Metal Crafts' },
    { value: 'leather', label: 'Leather Crafts' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'orders', label: 'Most Orders' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const ProductCard = ({ product }) => (
    <div className="card hover:shadow-xl transition-shadow">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
          <Package className="w-12 h-12 text-gray-400" />
        </div>
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            product.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {product.status}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
          <p className="text-gray-600 text-sm">{product.subcategory}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{product.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{product.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ShoppingCart className="w-4 h-4" />
              <span>{product.orders}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <button className="flex-1 btn-outline text-sm py-2">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
          <button className="btn-primary text-sm py-2 px-4">
            View
          </button>
        </div>
      </div>
    </div>
  );

  const ProductListItem = ({ product }) => (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
              <p className="text-gray-600 text-sm">{product.subcategory}</p>
              <p className="text-gray-500 text-sm mt-1 truncate">{product.description}</p>
            </div>
            
            <div className="text-right ml-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  product.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {product.status}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{product.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{product.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ShoppingCart className="w-4 h-4" />
                  <span>{product.orders}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="btn-outline text-sm py-1 px-3">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button className="btn-primary text-sm py-1 px-3">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Products</h1>
            <p className="text-gray-600">Manage your craft products and track their performance</p>
          </div>
          <Link
            to="/products/new"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <select
                className="input-field min-w-[180px]"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                className="input-field min-w-[160px]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map(product => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first product'
              }
            </p>
            <Link to="/products/new" className="btn-primary">
              Add Your First Product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
