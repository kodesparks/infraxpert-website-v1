import React, { useState, useEffect, useCallback } from 'react'
import { 
  Grid3X3, 
  Building, 
  Hammer, 
  Truck, 
  Headphones, 
  Heart, 
  Eye, 
  Star, 
  Check,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useInventory } from '@/contexts/InventoryContext'
import { useNavigate } from 'react-router-dom'
import cementImage from '@/assets/images/cement.jpg'
import steelImage from '@/assets/images/steel.jpg'
import mixerImage from '@/assets/images/mixer.jpg'
import warehouseImage from '@/assets/images/warehouse.jpg'
import rmcreadymixImage from '@/assets/images/rmcreadymix.png'

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [searchTerm, setSearchTerm] = useState('')
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const {
    inventoryItems,
    loading,
    error,
    pagination,
    categories,
    subcategories,
    categoriesLoading,
    updateFilters,
    changePage,
    searchItems,
    filterByCategory,
    filterBySubcategory,
    clearFilters,
    refreshData,
    transformInventoryToProducts
  } = useInventory()

  // Calculate real category counts from inventory items
  const getCategoryCount = useCallback((categoryName) => {
    if (categoryName === 'all') return pagination.totalItems
    return inventoryItems.filter(item => item.category === categoryName).length
  }, [inventoryItems, pagination.totalItems])

  // Transform API categories to match the existing structure with real counts
  const transformedCategories = [
    { id: 'all', name: 'All Products', count: getCategoryCount('all'), icon: Grid3X3 },
    ...Object.keys(categories).map(categoryName => ({
      id: categoryName.toLowerCase().replace(' ', '-'),
      name: categoryName,
      count: getCategoryCount(categoryName),
      icon: categoryName === 'Cement' ? Building : 
            categoryName === 'Iron' ? Hammer : 
            categoryName === 'Concrete Mixer' ? Truck : Grid3X3
    }))
  ]

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId
      return (term) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          searchItems(term)
        }, 900) // 500ms delay
      }
    })(),
    [searchItems]
  )

  // Transform inventory items to products format
  const products = transformInventoryToProducts(inventoryItems)

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    if (categoryId === 'all') {
      updateFilters({ category: '', subCategory: '' })
    } else {
      const categoryName = transformedCategories.find(cat => cat.id === categoryId)?.name
      if (categoryName) {
        filterByCategory(categoryName)
      }
    }
  }

  // Handle search with debouncing
  const handleSearch = (term) => {
    setSearchTerm(term)
    debouncedSearch(term)
  }

  // Handle refresh
  const handleRefresh = () => {
    refreshData()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header - Fixed mobile stacking issue */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
              Construction Materials
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto sm:mx-0">
              Premium quality construction materials from India's most trusted brands
            </p>
          </div>
            
            {/* Refresh Button */}
            <div className="flex justify-center sm:justify-end">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Mobile Categories - Improved mobile layout */}
          <div className="lg:hidden">
            <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-4 scrollbar-hide">
              {transformedCategories.map(category => {
                const Icon = category.icon
                const isActive = selectedCategory === category.id
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    disabled={loading}
                    className={`flex-shrink-0 flex items-center px-3 sm:px-4 py-2 rounded-full font-medium transition-all duration-200 cursor-pointer whitespace-nowrap text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                      isActive 
                        ? 'bg-blue-700 text-white shadow-md' 
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-center w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2">
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <span className="hidden xs:inline">{category.name}</span>
                    <span className="xs:hidden">{category.name.split(' ')[0]}</span>
                    <span className={`ml-1.5 sm:ml-2 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {category.count}
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
              {transformedCategories.map(category => {
                const Icon = category.icon
                const isActive = selectedCategory === category.id
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    disabled={loading}
                    className={`w-full flex items-center p-4 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
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
                      {category.count}
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
            {/* Search Bar */}
            <div className="mb-4 sm:mb-6">
              <div className="relative max-w-md mx-auto sm:mx-0">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  onMouseEnter={(e) => e.target.focus()}
                  onMouseLeave={(e) => e.target.blur()}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      searchItems('')
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Product Count and Sort - Improved mobile layout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <div className="text-gray-600 text-sm sm:text-base text-center sm:text-left">
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading products...
                  </div>
                ) : (
                  `Showing ${filteredProducts.length} of ${pagination.totalItems} products`
                )}
              </div>
              <div className="flex items-center justify-center sm:justify-end">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  disabled={loading}
                  className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 bg-white text-gray-700 pr-8 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="popular">Sort by: Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Products Grid - Improved mobile responsiveness */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-700" />
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    {selectedCategory === 'all' 
                      ? 'No products are available at the moment.' 
                      : `No products found in the ${transformedCategories.find(cat => cat.id === selectedCategory)?.name || 'selected'} category.`
                    }
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <img 
                      alt={product.name} 
                      className="w-full h-32 sm:h-40 lg:h-48 object-cover object-top group-hover:scale-110 transition-transform duration-300" 
                      src={product.image}
                    />
                    
                    {/* Discount Badge */}
                    <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {product.discount}% OFF
                      </span>
                    </div>
                    
                    {/* Wishlist Icon */}
                    <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white/90 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                        <Heart className="text-gray-700 text-xs sm:text-sm lg:text-base" />
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-3 sm:p-4 lg:p-6">
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
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center mb-2 sm:mb-3">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-3 h-3 sm:w-4 sm:h-4 mr-1">
                          <Star className="text-yellow-400 text-xs sm:text-sm fill-current" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700 mr-2">
                          {product.rating}
                        </span>
                        <span className="text-xs text-gray-500 hidden sm:inline">
                          ({product.reviews} reviews)
                        </span>
                        <span className="text-xs text-gray-500 sm:hidden">
                          ({product.reviews})
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 mb-3 sm:mb-4">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-600">
                          <div className="flex items-center justify-center w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1.5 sm:mr-2">
                            <Check className="text-green-500 w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </div>
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div>
                        <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">
                          ₹{product.currentPrice.toLocaleString()}{product.unit}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString()}{product.unit}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          addToCart(product)
                          // Trigger cart drawer to open by dispatching a custom event
                          window.dispatchEvent(new CustomEvent('openCartDrawer'))
                        }}
                        className="flex-1 bg-blue-700 text-white py-2 px-2 sm:px-3 lg:px-4 rounded-lg font-medium hover:bg-violet-700 transition-colors cursor-pointer whitespace-nowrap text-xs sm:text-sm lg:text-base"
                      >
                        Add to Cart
                      </button>
                      <button className="px-2 sm:px-3 lg:px-4 py-2 border-2 border-blue-700 text-blue-700 rounded-lg hover:bg-blue-700 hover:text-white transition-colors cursor-pointer">
                        <div className="flex items-center justify-center w-3 h-3 sm:w-4 sm:h-4">
                          <Eye className="text-xs sm:text-sm lg:text-base" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
            
            {/* Pagination */}
            {!loading && filteredProducts.length > 0 && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                <button
                  onClick={() => changePage(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev || loading}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => changePage(pageNum)}
                        disabled={loading}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          pagination.currentPage === pageNum
                            ? 'bg-blue-700 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => changePage(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext || loading}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
