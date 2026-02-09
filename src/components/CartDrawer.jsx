import React, { useState, useEffect } from 'react'
import { useOrders } from '@/contexts/OrdersContext'
import { usePincode } from '@/contexts/PincodeContext'
import { useNavigate } from 'react-router-dom'
import { X, Plus, Minus, Trash2, ShoppingBag, User, Phone, Mail, MapPin, Calendar, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import * as orderService from '@/services/order'

const CartDrawer = ({ isOpen, onClose }) => {
  const { createOrder, placeOrder } = useOrders()
  const { userPincode } = usePincode()
  const navigate = useNavigate()
  
  // Local state for cart management
  const [cartItems, setCartItems] = useState([])
  const [cartLoading, setCartLoading] = useState(false)
  const [cartError, setCartError] = useState(null)
  
  const [currentStep, setCurrentStep] = useState('cart') // 'cart' or 'delivery'
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    deliveryAddress: '',
    city: '',
    state: '',
    pinCode: userPincode || '',
    preferredDeliveryDate: ''
  })
  const [errors, setErrors] = useState({})

  // Fetch cart items when drawer opens, and refetch shortly after so newly added items show immediately
  useEffect(() => {
    if (isOpen) {
      console.log('🛒 Cart drawer opened, fetching cart items...')
      fetchCartItems()
      const refetchTimer = setTimeout(() => {
        fetchCartItems()
      }, 400)
      return () => clearTimeout(refetchTimer)
    }
  }, [isOpen])

  // Listen for refresh event (e.g. after Add to Cart from product page) so cart updates without manual refresh
  useEffect(() => {
    const handleRefreshCart = () => {
      if (isOpen) fetchCartItems()
    }
    window.addEventListener('refreshCartDrawer', handleRefreshCart)
    return () => window.removeEventListener('refreshCartDrawer', handleRefreshCart)
  }, [isOpen])

  // Update pincode when userPincode changes
  useEffect(() => {
    if (userPincode) {
      setFormData(prev => ({
        ...prev,
        pinCode: userPincode
      }))
    }
  }, [userPincode])

  // Fetch cart items from API
  const fetchCartItems = async () => {
    try {
      setCartLoading(true)
      setCartError(null)
      const response = await orderService.getCartItems()
      
      if (response && response.orders) {
        console.log('🛒 Fetched cart orders:', response.orders.length)
        // Transform API response to cart items format
        const transformedItems = response.orders
          .filter(order => order.orderStatus === 'pending') // Only show pending orders in cart
          .map(order => {
            const item = order.items[0] // Each order has one item
            // Calculate delivery charges properly
            const basePrice = item.unitPrice
            const totalAmount = order.totalAmount
            const calculatedDeliveryCharges = totalAmount > basePrice ? totalAmount - basePrice : 0
            
            const transformedItem = {
              id: order.leadId, // Use leadId as unique identifier
              name: item.itemCode.itemDescription,
              image: item.itemCode.primaryImage,
              currentPrice: item.unitPrice,
              totalPrice: order.totalAmount,
              deliveryCharges: calculatedDeliveryCharges, // Use calculated delivery charges
              quantity: item.qty,
              leadId: order.leadId,
              orderNumber: order.leadId,
              orderStatus: order.orderStatus,
              vendorId: order.vendorId,
              deliveryDetails: order.deliveryDetails,
              itemCode: item.itemCode._id, // MongoDB ObjectId for API calls
              category: item.itemCode.category,
              unit: item.itemCode.subCategory
            }
          
          console.log('🛒 Transformed item:', {
            leadId: transformedItem.leadId,
            itemCode: transformedItem.itemCode,
            name: transformedItem.name
          })
          
          return transformedItem
        })
        console.log('🛒 Transformed cart items:', transformedItems)
        setCartItems(transformedItems)
      } else {
        setCartItems([])
      }
    } catch (error) {
      console.error('Error fetching cart items:', error)
      setCartError(error.message)
      setCartItems([])
    } finally {
      setCartLoading(false)
    }
  }

  // Calculate total price from cart items
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.totalPrice || 0), 0)
  }

  // Calculate total items count
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  // Handle quantity change with API call
  const handleQuantityChange = async (productId, newQuantity, leadId = null) => {
    if (newQuantity < 1) {
      await handleRemoveFromCart(leadId)
    } else {
      await handleUpdateQuantity(productId, newQuantity, leadId)
    }
  }

  // Update quantity via API
  const handleUpdateQuantity = async (productId, quantity, leadId) => {
    try {
      // Find the cart item to get the actual itemCode
      const cartItem = cartItems.find(item => item.leadId === leadId)
      if (!cartItem) {
        console.error('❌ Cart item not found for leadId:', leadId)
        return
      }

      const updateData = {
        items: [{ itemCode: cartItem.itemCode, qty: quantity }]
      }
      
      console.log('🔄 Updating quantity:')
      console.log('  - leadId:', leadId)
      console.log('  - itemCode (MongoDB ObjectId):', cartItem.itemCode)
      console.log('  - quantity:', quantity)
      console.log('  - payload:', updateData)
      
      const response = await orderService.updateOrder(leadId, updateData)
      
      if (response && response.order) {
        // Update local cart state with API response
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.leadId === leadId 
              ? {
                  ...item,
                  quantity: quantity,
                  totalPrice: response.order.totalAmount,
                  deliveryCharges: response.order.deliveryCharges
                }
              : item
          )
        )
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      // Refresh cart items on error
      fetchCartItems()
    }
  }

  // Remove item from cart via API
  const handleRemoveFromCart = async (leadId) => {
    try {
      console.log('🗑️ Removing item from cart:', leadId)
      await orderService.removeFromCart(leadId)
      // Remove item from local state
      setCartItems(prevItems => {
        const filtered = prevItems.filter(item => item.leadId !== leadId)
        console.log('✅ Item removed, remaining items:', filtered.length)
        return filtered
      })
    } catch (error) {
      console.error('❌ Error removing from cart:', error)
      // Refresh cart items on error
      fetchCartItems()
    }
  }

  // Clear entire cart via API
  const handleClearCart = async () => {
    try {
      await orderService.clearCart()
      setCartItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
      // Refresh cart items on error
      fetchCartItems()
    }
  }

  const handleProceedToCheckout = () => {
    setCurrentStep('delivery')
  }

  const handleContactSupport = () => {
    onClose()
    navigate('/contact')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }

    if (!formData.pinCode.trim()) {
      newErrors.pinCode = 'PIN code is required'
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = 'Please enter a valid 6-digit PIN code'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePlaceOrder = async () => {
    if (validateForm()) {
      try {
        // Place orders for all cart items
        const orderPromises = cartItems.map(async (item) => {
          if (item.leadId) {
            const orderData = {
              deliveryAddress: `${formData.deliveryAddress}, ${formData.city}, ${formData.state}`,
              deliveryPincode: formData.pinCode,
              deliveryExpectedDate: formData.preferredDeliveryDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              receiverMobileNum: formData.phoneNumber,
              receiverName: formData.fullName,
              email: formData.email,
              city: formData.city,
              state: formData.state
            }
            
            // Place order via API
            return await placeOrder(item.leadId, orderData)
          }
          return null
        })
        
        // Wait for all orders to be placed
        await Promise.all(orderPromises.filter(Boolean))
        
        // Refresh cart to get updated status (orders will no longer be 'pending')
        await fetchCartItems()
        
        // Close drawer and navigate to orders page
        onClose()
        navigate('/orders', { 
          state: { 
            message: 'Order placed successfully!',
            orderCount: cartItems.length
          } 
        })
      } catch (error) {
        console.error('Error placing order:', error)
        // Handle error - show error message to user
        setErrors({ general: 'Failed to place order. Please try again.' })
      }
    }
  }

  const handleBackToCart = () => {
    setCurrentStep('cart')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed left-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {currentStep === 'delivery' && (
              <button
                onClick={handleBackToCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">
              {currentStep === 'cart' ? 'Shopping Cart' : 'Delivery Details'}
            </h2>
            {currentStep === 'cart' && (
              <button
                onClick={fetchCartItems}
                disabled={cartLoading}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                title="Refresh cart"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {currentStep === 'cart' ? (
            // Cart Step
            cartLoading ? (
              <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading cart items...</p>
              </div>
            ) : cartError ? (
              <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="text-red-500 mb-4">⚠️</div>
                <p className="text-red-600 mb-2">Error loading cart</p>
                <p className="text-gray-500 text-sm text-center">{cartError}</p>
                <button 
                  onClick={fetchCartItems}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 text-center">
                  Add some products to get started
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.leadId} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">{item.brand}</p>
                      {/* Price hidden for now
                      <p className="text-sm font-bold text-gray-800">
                        ₹{(item.totalPrice || item.currentPrice).toLocaleString()}{item.unit}
                      </p>
                      {item.deliveryCharges > 0 ? (
                        <p className="text-xs text-gray-500">
                          Base: ₹{item.currentPrice.toLocaleString()} + Delivery: ₹{item.deliveryCharges.toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-xs text-green-600 font-medium">
                          Free Delivery
                        </p>
                      )}
                      */}
                      {/* {item.deliveryCharges <= 0 && (
                        <p className="text-xs text-green-600 font-medium">Free Delivery</p>
                      )} */}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.leadId)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                        title="Decrease quantity"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value) || 1
                          if (newValue >= 1) {
                            handleQuantityChange(item.id, newValue, item.leadId)
                          }
                        }}
                        onBlur={(e) => {
                          const value = parseInt(e.target.value)
                          if (!value || value < 1) {
                            handleQuantityChange(item.id, 1, item.leadId)
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.target.blur()
                          }
                        }}
                        className="w-16 px-2 py-1 text-center font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        style={{ appearance: 'textfield' }}
                      />
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.leadId)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                        title="Increase quantity"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFromCart(item.leadId)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            // Delivery Step
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={`pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Receiver Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Receiver Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Enter receiver phone number"
                        className={`pl-10 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Address</h3>
                <div className="space-y-4">
                  {/* Delivery Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <Textarea
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleInputChange}
                        placeholder="Enter complete delivery address with landmarks"
                        className={`pl-10 min-h-[100px] ${errors.deliveryAddress ? 'border-red-500' : ''}`}
                        maxLength={500}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      {errors.deliveryAddress && (
                        <p className="text-red-500 text-sm">{errors.deliveryAddress}</p>
                      )}
                      <p className="text-gray-500 text-sm ml-auto">
                        {formData.deliveryAddress.length}/500 characters
                      </p>
                    </div>
                  </div>

                  {/* City and State */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <Input
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className={errors.state ? 'border-red-500' : ''}
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  {/* PIN Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code *
                    </label>
                    <Input
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      placeholder="6-digit PIN code"
                      maxLength={6}
                      disabled={!!userPincode}
                      className={`${errors.pinCode ? 'border-red-500' : ''} ${userPincode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                    {userPincode && (
                      <p className="text-gray-500 text-xs mt-1">
                        PIN code is set from your location selection
                      </p>
                    )}
                    {errors.pinCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>
                    )}
                  </div>

                  {/* Preferred Delivery Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Delivery Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        name="preferredDeliveryDate"
                        type="date"
                        value={formData.preferredDeliveryDate}
                        onChange={handleInputChange}
                        className="pr-10"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {currentStep === 'cart' && cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            {/* Total - price hidden for now
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">Total:</span>
              <span className="text-xl font-bold text-gray-800">
                ₹{getTotalPrice().toLocaleString()}
              </span>
            </div>
            */}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleProceedToCheckout}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
              >
                Enter Delivery Address
              </Button>
              <Button
                onClick={handleContactSupport}
                variant="outline"
                className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-semibold"
              >
                Contact Support
              </Button>
            </div>
          </div>
        )}

        {/* Delivery Step Footer */}
        {currentStep === 'delivery' && (
          <div className="border-t border-gray-200 p-6">
            <Button
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
            >
              Place Order
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer
