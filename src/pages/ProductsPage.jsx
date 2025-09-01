import React, { useState } from 'react'
import { 
  Grid3X3, 
  Building, 
  Hammer, 
  Truck, 
  Headphones, 
  Heart, 
  Eye, 
  Star, 
  Check 
} from 'lucide-react'
import cementImage from '@/assets/images/cement.jpg'
import steelImage from '@/assets/images/steel.jpg'
import mixerImage from '@/assets/images/mixer.jpg'
import warehouseImage from '@/assets/images/warehouse.jpg'
import rmcreadymixImage from '@/assets/images/rmcreadymix.png'

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  const categories = [
    { id: 'all', name: 'All Products', count: 12, icon: Grid3X3 },
    { id: 'cement', name: 'Cement', count: 4, icon: Building },
    { id: 'steel', name: 'Steel & TMT', count: 4, icon: Hammer },
    { id: 'concrete', name: 'Concrete Mix', count: 4, icon: Truck }
  ]

  const products = [
    // Cement Products
    {
      id: 1,
      name: 'UltraTech Cement OPC 53',
      category: 'cement',
      brand: 'UltraTech',
      image: cementImage,
      discount: 8,
      originalPrice: 420,
      currentPrice: 385,
      unit: '/bag',
      rating: 4.8,
      reviews: 2847,
      features: ['53 Grade OPC', 'ISI Certified'],
      inStock: true
    },
    {
      id: 2,
      name: 'ACC Cement PPC',
      category: 'cement',
      brand: 'ACC',
      image: cementImage,
      discount: 8,
      originalPrice: 395,
      currentPrice: 362,
      unit: '/bag',
      rating: 4.7,
      reviews: 1923,
      features: ['PPC Grade', 'Eco-Friendly'],
      inStock: true
    },
    {
      id: 3,
      name: 'Ambuja Cement Plus',
      category: 'cement',
      brand: 'Ambuja',
      image: cementImage,
      discount: 7,
      originalPrice: 405,
      currentPrice: 375,
      unit: '/bag',
      rating: 4.6,
      reviews: 1654,
      features: ['Premium Grade', 'Weather Resistant'],
      inStock: true
    },
    {
      id: 4,
      name: 'Shree Cement Ultra',
      category: 'cement',
      brand: 'Shree Cement',
      image: cementImage,
      discount: 8,
      originalPrice: 398,
      currentPrice: 368,
      unit: '/bag',
      rating: 4.5,
      reviews: 987,
      features: ['Ultra Grade', 'High Durability'],
      inStock: true
    },

    // Steel Products
    {
      id: 5,
      name: 'TATA Steel TMT Bars',
      category: 'steel',
      brand: 'TATA Steel',
      image: steelImage,
      discount: 5,
      originalPrice: 72000,
      currentPrice: 68500,
      unit: '/ton',
      rating: 4.9,
      reviews: 3421,
      features: ['Fe 550D Grade', 'Earthquake Resistant'],
      inStock: true
    },
    {
      id: 6,
      name: 'JSW Steel Neo TMT',
      category: 'steel',
      brand: 'JSW Steel',
      image: steelImage,
      discount: 6,
      originalPrice: 71500,
      currentPrice: 67200,
      unit: '/ton',
      rating: 4.8,
      reviews: 2876,
      features: ['Neo Technology', 'High Tensile Strength'],
      inStock: true
    },
    {
      id: 7,
      name: 'SAIL Steel TMT Bars',
      category: 'steel',
      brand: 'SAIL',
      image: steelImage,
      discount: 5,
      originalPrice: 70200,
      currentPrice: 66800,
      unit: '/ton',
      rating: 4.7,
      reviews: 2154,
      features: ['Government Brand', 'Fe 500D Grade'],
      inStock: true
    },
    {
      id: 8,
      name: 'Jindal Steel Panther TMT',
      category: 'steel',
      brand: 'Jindal Steel',
      image: steelImage,
      discount: 6,
      originalPrice: 71800,
      currentPrice: 67800,
      unit: '/ton',
      rating: 4.6,
      reviews: 1876,
      features: ['Panther Grade', 'Superior Ductility'],
      inStock: true
    },

    // Concrete Mix Products
    {
      id: 9,
      name: 'UltraTech Ready Mix M25',
      category: 'concrete',
      brand: 'UltraTech',
      image: rmcreadymixImage,
      discount: 7,
      originalPrice: 4500,
      currentPrice: 4200,
      unit: '/cubic meter',
      rating: 4.8,
      reviews: 1432,
      features: ['M25 Grade', 'Site Delivery'],
      inStock: true
    },
    {
      id: 10,
      name: 'ACC RMC Premium',
      category: 'concrete',
      brand: 'ACC',
      image: rmcreadymixImage,
      discount: 6,
      originalPrice: 4400,
      currentPrice: 4150,
      unit: '/cubic meter',
      rating: 4.7,
      reviews: 987,
      features: ['Premium Grade', 'Customizable'],
      inStock: true
    },
    {
      id: 11,
      name: 'Ambuja Kawach Concrete',
      category: 'concrete',
      brand: 'Ambuja',
      image: rmcreadymixImage,
      discount: 7,
      originalPrice: 4600,
      currentPrice: 4300,
      unit: '/cubic meter',
      rating: 4.6,
      reviews: 743,
      features: ['Kawach Technology', 'Weather Resistant'],
      inStock: true
    },
    {
      id: 12,
      name: 'RMC Readymix Supreme',
      category: 'concrete',
      brand: 'RMC Readymix',
      image: rmcreadymixImage,
      discount: 7,
      originalPrice: 4350,
      currentPrice: 4050,
      unit: '/cubic meter',
      rating: 4.5,
      reviews: 654,
      features: ['Supreme Quality', 'Cost Effective'],
      inStock: true
    }
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return products.length
    return products.filter(product => product.category === categoryId).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
              Construction Materials
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              Premium quality construction materials from India's most trusted brands
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile Categories */}
          <div className="lg:hidden mb-6">
            <div className="flex space-x-3 overflow-x-auto pb-4">
              {categories.map(category => {
                const Icon = category.icon
                const isActive = selectedCategory === category.id
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-shrink-0 flex items-center px-4 py-2 rounded-full font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      isActive 
                        ? 'bg-blue-700 text-white shadow-md' 
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border'
                    }`}
                  >
                    <div className="flex items-center justify-center w-4 h-4 mr-2">
                      <Icon className="w-4 h-4" />
                    </div>
                    {category.name}
                    <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {getCategoryCount(category.id)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 bg-white rounded-xl shadow-lg p-6 h-fit sticky top-24">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => {
                const Icon = category.icon
                const isActive = selectedCategory === category.id
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center p-4 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-blue-700 text-white shadow-md' 
                        : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    <div className="flex items-center justify-center w-5 h-5 mr-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    {category.name}
                    <span className={`ml-auto text-sm px-2 py-1 rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {getCategoryCount(category.id)}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Need Help Section */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-violet-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-700 rounded-full mb-3">
                <Headphones className="text-white w-5 h-5" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-3">
                Get expert advice on material selection and quantities
              </p>
              <button className="w-full bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors cursor-pointer">
                Contact Expert
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Product Count and Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <div className="text-gray-600 text-sm sm:text-base">
                Showing {filteredProducts.length} products
              </div>
              <div className="flex items-center space-x-4">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 bg-white text-gray-700 pr-8 text-sm sm:text-base"
                >
                  <option value="popular">Sort by: Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <img 
                      alt={product.name} 
                      className="w-full h-40 sm:h-48 object-cover object-top group-hover:scale-110 transition-transform duration-300" 
                      src={product.image}
                    />
                    
                    {/* Discount Badge */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {product.discount}% OFF
                      </span>
                    </div>
                    
                    {/* Wishlist Icon */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                      <div className="w-7 sm:w-8 h-7 sm:h-8 bg-white/90 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                        <Heart className="text-gray-700 text-sm sm:text-base" />
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 sm:p-6">
                    {/* Brand and Stock Status */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
                        {product.brand}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        product.inStock 
                          ? 'text-green-600 bg-green-50' 
                          : 'text-red-600 bg-red-50'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-4 h-4 mr-1">
                          <Star className="text-yellow-400 text-sm fill-current" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700 mr-2">
                          {product.rating}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({product.reviews} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 mb-4">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-600">
                          <div className="flex items-center justify-center w-3 h-3 mr-2">
                            <Check className="text-green-500 w-3 h-3" />
                          </div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-lg sm:text-xl font-bold text-gray-800">
                          ₹{product.currentPrice.toLocaleString()}{product.unit}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString()}{product.unit}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-700 text-white py-2 px-3 sm:px-4 rounded-lg font-medium hover:bg-violet-700 transition-colors cursor-pointer whitespace-nowrap text-sm sm:text-base">
                        Add to Cart
                      </button>
                      <button className="px-3 sm:px-4 py-2 border-2 border-blue-700 text-blue-700 rounded-lg hover:bg-blue-700 hover:text-white transition-colors cursor-pointer">
                        <div className="flex items-center justify-center w-4 h-4">
                          <Eye className="text-sm sm:text-base" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
