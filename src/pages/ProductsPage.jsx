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
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calculator
} from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useInventory } from '@/contexts/InventoryContext'
import { useNavigate } from 'react-router-dom'
import PincodePopup from '@/components/PincodePopup'
import cementImage from '@/assets/images/cement.jpg'
import steelImage from '@/assets/images/steel.jpg'
import mixerImage from '@/assets/images/mixer.jpg'
import warehouseImage from '@/assets/images/warehouse.jpg'
import rmcreadymixImage from '@/assets/images/rmcreadymix.png'

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [searchTerm, setSearchTerm] = useState('')
  const [productImageIndex, setProductImageIndex] = useState({}) // Track current image index for each product
  const [pincode, setPincode] = useState('')
  const [isPincodePopupOpen, setIsPincodePopupOpen] = useState(false)
  const [deliveryCharges, setDeliveryCharges] = useState({}) // Store delivery charges per product
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
    productDetails,
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

  // Transform inventory items to products format with enhanced data
  const products = inventoryItems.map(item => {
    // Get pricing info if available
    const pricing = productDetails[item._id]?.pricing;
    const promos = productDetails[item._id]?.promos || [];
    
    // Calculate current price with any active promo
    let currentPrice = pricing?.unitPrice || 0;
    let originalPrice = currentPrice;
    let discount = 0;
    
    if (promos.length > 0) {
      const activePromo = promos.find(promo => promo.isActive);
      if (activePromo) {
        if (activePromo.discountType === 'percentage') {
          discount = activePromo.discountValue;
          currentPrice = originalPrice * (1 - discount / 100);
        } else if (activePromo.discountType === 'fixed') {
          discount = (activePromo.discountValue / originalPrice) * 100;
          currentPrice = originalPrice - activePromo.discountValue;
        }
      }
    }

    return {
      id: item._id,
      name: item.itemDescription,
      category: item.category.toLowerCase().replace(' ', '-'),
      brand: item.vendorId?.name || 'Unknown',
      image: item.primaryImage || '/placeholder-image.jpg',
      images: item.images || [], // All images for slideshow
      discount: Math.round(discount),
      originalPrice: Math.round(originalPrice),
      currentPrice: Math.round(currentPrice),
      unit: `/${item.units.toLowerCase()}`,
      rating: 4.5, // Default rating since not provided in API
      reviews: Math.floor(Math.random() * 1000) + 100, // Random reviews since not provided
      features: [
        item.grade || 'Premium Grade',
        item.specification || 'Quality Assured',
        item.deliveryInformation || 'Fast Delivery'
      ],
      inStock: item.isActive,
      // Additional API data
      itemCode: item.itemCode,
      formattedItemCode: item.formattedItemCode,
      subCategory: item.subCategory,
      details: item.details,
      deliveryInformation: item.deliveryInformation,
      hscCode: item.hscCode,
      vendorId: item.vendorId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  })

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

  // Handle image navigation
  const handleImageNavigation = (productId, direction) => {
    const product = products.find(p => p.id === productId)
    if (!product || !product.images || product.images.length <= 1) return

    const currentIndex = productImageIndex[productId] || 0
    let newIndex = currentIndex

    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1
    } else if (direction === 'next') {
      newIndex = currentIndex === product.images.length - 1 ? 0 : currentIndex + 1
    }

    setProductImageIndex(prev => ({
      ...prev,
      [productId]: newIndex
    }))
  }

  // Get current image for a product
  const getCurrentImage = (product) => {
    if (!product.images || product.images.length === 0) {
      return product.image
    }
    const currentIndex = productImageIndex[product.id] || 0
    return product.images[currentIndex]?.url || product.image
  }

  // Handle pincode submission
  const handlePincodeSubmit = (newPincode) => {
    setPincode(newPincode)
    // Simulate distance calculation and delivery charges
    const mockDeliveryCharges = {}
    products.forEach(product => {
      // Mock delivery charge calculation based on distance
      const baseDistance = Math.floor(Math.random() * 50) + 10 // 10-60 km
      const chargePerKm = 2 // ₹2 per km
      const baseDeliveryCharge = 50 // ₹50 base charge
      const totalDeliveryCharge = baseDeliveryCharge + (baseDistance * chargePerKm)
      
      mockDeliveryCharges[product.id] = {
        distance: baseDistance,
        charge: totalDeliveryCharge,
        freeDelivery: totalDeliveryCharge === 0
      }
    })
    setDeliveryCharges(mockDeliveryCharges)
  }

  // Calculate total price including delivery
  const getTotalPrice = (product) => {
    const basePrice = product.currentPrice
    const deliveryCharge = deliveryCharges[product.id]?.charge || 0
    return basePrice + deliveryCharge
  }

  // Get delivery info for a product
  const getDeliveryInfo = (product) => {
    return deliveryCharges[product.id] || null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header - Fixed mobile stacking issue */}
        {/* <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
              Construction Materials
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto sm:mx-0">
              Premium quality construction materials from India's most trusted brands
            </p>
          </div>
            
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
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}
        </div> */}

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
            {/* Search, Sort and Product Count - Single Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 sm:mb-6 gap-3 lg:gap-4">
              {/* Left side - Product Count */}
              <div className="text-gray-600 text-sm sm:text-base text-center lg:text-left">
                {loading ? (
                  <div className="flex items-center justify-center lg:justify-start">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading products...
                  </div>
                ) : (
                  `Showing ${filteredProducts.length} of ${pagination.totalItems} products`
                )}
              </div>
              
              {/* Right side - Pincode, Search and Sort */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Pincode Button */}
                <button
                  onClick={() => setIsPincodePopupOpen(true)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pincode 
                      ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200' 
                      : 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200'
                  }`}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {pincode ? `📍 ${pincode}` : '📍 Add Pincode'}
                </button>
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    onMouseEnter={(e) => e.target.focus()}
                    onMouseLeave={(e) => e.target.blur()}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Sort Dropdown */}
                <div className="w-full sm:w-auto">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    disabled={loading}
                    className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="popular">Sort by: Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
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
                  {/* Product Image with Slideshow */}
                  <div className="relative overflow-hidden">
                    <img 
                      alt={product.name} 
                      className="w-full h-32 sm:h-36 lg:h-40 object-cover object-center group-hover:scale-110 transition-transform duration-300" 
                      src={getCurrentImage(product)}
                    />
                    
                    {/* Image Navigation Arrows */}
                    {product.images && product.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleImageNavigation(product.id, 'prev')
                          }}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleImageNavigation(product.id, 'next')
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        
                        {/* Image Indicators */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                          {product.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                (productImageIndex[product.id] || 0) === index
                                  ? 'bg-white'
                                  : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {product.discount}% OFF
                        </span>
                      </div>
                    )}
                    
                    {/* Wishlist Icon */}
                    <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white/90 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                        <Heart className="text-gray-700 text-xs sm:text-sm lg:text-base" />
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-3 sm:p-4 lg:p-5">
                    {/* Brand and Stock Status */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
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
                    <h3 className="text-sm font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Item Code and Subcategory in one line */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-500">
                        {product.formattedItemCode}
                      </div>
                      {product.subCategory && (
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {product.subCategory}
                        </div>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-3 h-3 mr-1">
                          <Star className="text-yellow-400 text-xs fill-current" />
                        </div>
                        <span className="text-xs font-medium text-gray-700 mr-1">
                          {product.rating}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({product.reviews})
                        </span>
                      </div>
                    </div>

                    {/* Features - Show only first 2 */}
                    <div className="mb-3">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-600 mb-1">
                          <div className="flex items-center justify-center w-2.5 h-2.5 mr-1">
                            <Check className="text-green-500 w-2.5 h-2.5" />
                          </div>
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Information - Compact */}
                    {product.deliveryInformation && (
                      <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded mb-3">
                        🚚 {product.deliveryInformation.length > 20 ? product.deliveryInformation.substring(0, 20) + '...' : product.deliveryInformation}
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="mb-3">
                      {pincode ? (
                        <div className="space-y-2">
                          {/* Base Price */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Base Price:</span>
                            <span className="text-xs text-gray-600">
                              ₹{product.currentPrice.toLocaleString()}{product.unit}
                            </span>
                          </div>
                          
                          {/* Delivery Charge */}
                          {getDeliveryInfo(product) && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Delivery:</span>
                              <span className={`text-xs ${
                                getDeliveryInfo(product).freeDelivery 
                                  ? 'text-green-600 font-medium' 
                                  : 'text-gray-600'
                              }`}>
                                {getDeliveryInfo(product).freeDelivery 
                                  ? 'FREE' 
                                  : `₹${getDeliveryInfo(product).charge.toLocaleString()}`
                                }
                              </span>
                            </div>
                          )}
                          
                          {/* Total Price */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-sm font-semibold text-gray-800">Total:</span>
                            <span className="text-sm font-bold text-blue-600">
                              ₹{getTotalPrice(product).toLocaleString()}{product.unit}
                            </span>
                          </div>
                          
                          {/* Distance Info */}
                          {getDeliveryInfo(product) && (
                            <div className="text-xs text-gray-500 text-center">
                              📍 {getDeliveryInfo(product).distance}km from warehouse
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm font-bold text-gray-800">
                            ₹{product.currentPrice.toLocaleString()}{product.unit}
                          </div>
                          {product.originalPrice > product.currentPrice && (
                            <div className="text-xs text-gray-500 line-through">
                              ₹{product.originalPrice.toLocaleString()}{product.unit}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            + Delivery charges
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          addToCart(product)
                          // Trigger cart drawer to open by dispatching a custom event
                          window.dispatchEvent(new CustomEvent('openCartDrawer'))
                        }}
                        className="flex-1 bg-blue-700 text-white py-2 px-3 rounded-lg font-medium hover:bg-violet-700 transition-colors cursor-pointer text-sm"
                      >
                        Add to Cart
                      </button>
                      <button className="px-3 py-2 border-2 border-blue-700 text-blue-700 rounded-lg hover:bg-blue-700 hover:text-white transition-colors cursor-pointer">
                        <div className="flex items-center justify-center w-4 h-4">
                          <Eye className="text-sm" />
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

      {/* Pincode Popup */}
      <PincodePopup
        isOpen={isPincodePopupOpen}
        onClose={() => setIsPincodePopupOpen(false)}
        onPincodeSubmit={handlePincodeSubmit}
        currentPincode={pincode}
      />
    </div>
  )
}

export default ProductsPage
