import { URLS } from "@/lib/apiUrls";
import FetchRequestData from '@/lib/axios';

const { apiRequest } = FetchRequestData();

// Customer Order APIs
export const addToCart = async (cartData) => {
  try {
    const response = await apiRequest({
      url: URLS.addToCart,
      method: 'post',
      setAuthznHeader: true,
      sessionSource: "cookie",
      data: {
        itemCode: cartData.itemCode,
        qty: cartData.qty,
        deliveryPincode: cartData.deliveryPincode,
        deliveryAddress: cartData.deliveryAddress,
        deliveryExpectedDate: cartData.deliveryExpectedDate,
        custPhoneNum: cartData.custPhoneNum,
        receiverMobileNum: cartData.receiverMobileNum
      }
    })
    return response.data
  } catch (error) {
    console.error('Error adding item to cart:', error)
    throw error
  }
}

export const getCustomerOrders = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams()
    
    if (params.status) queryParams.append('status', params.status)
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    
    const url = `${URLS.getCustomerOrders}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await apiRequest({
      url,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error fetching customer orders:', error)
    throw error
  }
}

// Cart-specific API functions
export const getCartItems = async () => {
  try {
    const response = await apiRequest({
      url: `${URLS.getCustomerOrders}?status=pending`,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error fetching cart items:', error)
    throw error
  }
}

export const getCartSummary = async () => {
  try {
    const response = await apiRequest({
      url: URLS.getCartSummary,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error fetching cart summary:', error)
    throw error
  }
}

export const clearCart = async () => {
  try {
    const response = await apiRequest({
      url: URLS.clearCart,
      method: 'delete',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error clearing cart:', error)
    throw error
  }
}

export const getOrderDetails = async (leadId) => {
  try {
    const response = await apiRequest({
      url: URLS.getOrderDetails(leadId),
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error fetching order details:', error)
    throw error
  }
}

export const updateOrder = async (leadId, updateData) => {
  try {
    const response = await apiRequest({
      url: URLS.updateOrder(leadId),
      method: 'put',
      setAuthznHeader: true,
      sessionSource: "cookie",
      data: {
        items: updateData.items || []
      }
    })
    return response.data
  } catch (error) {
    console.error('Error updating order:', error)
    throw error
  }
}

export const removeFromCart = async (leadId) => {
  try {
    const response = await apiRequest({
      url: URLS.removeFromCart(leadId),
      method: 'delete',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error removing order from cart:', error)
    throw error
  }
}

// Remove specific item from cart order (alternative approach)
export const removeSpecificItemFromCart = async (leadId, itemCode) => {
  try {
    const response = await apiRequest({
      url: URLS.removeSpecificItemFromCart(leadId),
      method: 'delete',
      setAuthznHeader: true,
      sessionSource: "cookie",
      data: {
        itemCode: itemCode
      }
    })
    return response.data
  } catch (error) {
    console.error('Error removing specific item from cart:', error)
    throw error
  }
}

export const placeOrder = async (leadId, orderData) => {
  try {
    const response = await apiRequest({
      url: URLS.placeOrder(leadId),
      method: 'post',
      setAuthznHeader: true,
      sessionSource: "cookie",
      data: {
        deliveryAddress: orderData.deliveryAddress,
        deliveryPincode: orderData.deliveryPincode,
        deliveryExpectedDate: orderData.deliveryExpectedDate,
        receiverMobileNum: orderData.receiverMobileNum
      }
    })
    return response.data
  } catch (error) {
    console.error('Error placing order:', error)
    throw error
  }
}

export const processPayment = async (leadId, paymentData) => {
  try {
    const response = await apiRequest({
      url: URLS.processPayment(leadId),
      method: 'post',
      setAuthznHeader: true,
      sessionSource: "cookie",
      data: paymentData
    })
    return response.data
  } catch (error) {
    console.error('Error processing payment:', error)
    throw error
  }
}

export const getPaymentStatus = async (leadId) => {
  try {
    const response = await apiRequest({
      url: URLS.getPaymentStatus(leadId),
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error fetching payment status:', error)
    throw error
  }
}

export const getOrderTracking = async (leadId) => {
  try {
    const response = await apiRequest({
      url: URLS.getOrderTracking(leadId),
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error fetching order tracking:', error)
    throw error
  }
}

// Vendor Order APIs
export const getVendorOrders = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams()
    
    if (params.status) queryParams.append('status', params.status)
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    
    const url = `${URLS.getVendorOrders}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await apiRequest({
      url,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error fetching vendor orders:', error)
    throw error
  }
}

export const getVendorOrderDetails = async (leadId) => {
  try {
    const response = await apiRequest({
      url: URLS.getVendorOrderDetails(leadId),
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error fetching vendor order details:', error)
    throw error
  }
}

export const getPendingOrders = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    
    const url = `${URLS.getPendingOrders}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await apiRequest({
      url,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error fetching pending orders:', error)
    throw error
  }
}

export const getVendorOrderStats = async () => {
  try {
    const response = await apiRequest({
      url: URLS.getVendorOrderStats,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error fetching vendor order stats:', error)
    throw error
  }
}

export const acceptOrder = async (leadId, remarks = '') => {
  try {
    const response = await apiRequest({
      url: URLS.acceptOrder(leadId),
      method: 'post',
      setAuthznHeader: true,
      sessionSource: "cookie",
      data: { remarks }
    })
    return response.data
  } catch (error) {
    console.error('Error accepting order:', error)
    throw error
  }
}

export const rejectOrder = async (leadId, remarks = '') => {
  try {
    const response = await apiRequest({
      url: URLS.rejectOrder(leadId),
      method: 'post',
      setAuthznHeader: true,
      sessionSource: "cookie",
      data: { remarks }
    })
    return response.data
  } catch (error) {
    console.error('Error rejecting order:', error)
    throw error
  }
}

export const updateDeliveryTracking = async (leadId, trackingData) => {
  try {
    const response = await apiRequest({
      url: URLS.updateDeliveryTracking(leadId),
      method: 'put',
      setAuthznHeader: true,
      sessionSource: "cookie",
      data: trackingData
    })
    return response.data
  } catch (error) {
    console.error('Error updating delivery tracking:', error)
    throw error
  }
}

// Admin Order APIs
export const getAllOrders = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams()
    
    if (params.status) queryParams.append('status', params.status)
    if (params.vendorId) queryParams.append('vendorId', params.vendorId)
    if (params.customerId) queryParams.append('customerId', params.customerId)
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    
    const url = `${URLS.getAllOrders}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await apiRequest({
      url,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error fetching all orders:', error)
    throw error
  }
}

export const getAdminOrderDetails = async (leadId) => {
  try {
    const response = await apiRequest({
      url: URLS.getAdminOrderDetails(leadId),
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error fetching admin order details:', error)
    throw error
  }
}

export const getOrderStats = async () => {
  try {
    const response = await apiRequest({
      url: URLS.getOrderStats,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error fetching order stats:', error)
    throw error
  }
}

export const getOrdersByDateRange = async (startDate, endDate, params = {}) => {
  try {
    const queryParams = new URLSearchParams()
    
    queryParams.append('startDate', startDate)
    queryParams.append('endDate', endDate)
    
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    
    const url = `${URLS.getOrdersByDateRange}?${queryParams.toString()}`
    
    const response = await apiRequest({
      url,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error fetching orders by date range:', error)
    throw error
  }
}

export const cancelOrder = async (leadId, reason = '') => {
  try {
    const response = await apiRequest({
      url: URLS.cancelOrder(leadId),
      method: 'post',
      setAuthznHeader: true,
      sessionSource: "cookie",
      data: { reason }
    })
    return response.data
  } catch (error) {
    console.error('Error cancelling order:', error)
    throw error
  }
}

export const getPaymentStats = async () => {
  try {
    const response = await apiRequest({
      url: URLS.getPaymentStats,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error fetching payment stats:', error)
    throw error
  }
}

export const getDeliveryStats = async () => {
  try {
    const response = await apiRequest({
      url: URLS.getDeliveryStats,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error fetching delivery stats:', error)
    throw error
  }
}

// Order Status Mapping
export const ORDER_STATUS_MAP = {
  'pending': 'pending',
  'vendor_accepted': 'confirmed',
  'payment_done': 'processing',
  'order_confirmed': 'processing',
  'shipped': 'shipped',
  'delivered': 'delivered',
  'cancelled': 'cancelled'
}

// Reverse mapping for API calls
export const UI_TO_API_STATUS_MAP = {
  'pending': 'pending',
  'confirmed': 'vendor_accepted',
  'processing': 'payment_done',
  'shipped': 'shipped',
  'delivered': 'delivered',
  'cancelled': 'cancelled'
}

// Payment Types
export const PAYMENT_TYPES = {
  'credit_card': 'Credit Card',
  'debit_card': 'Debit Card',
  'upi': 'UPI',
  'net_banking': 'Net Banking',
  'wallet': 'Wallet',
  'cash_on_delivery': 'Cash on Delivery',
  'bank_transfer': 'Bank Transfer'
}

// Payment Modes
export const PAYMENT_MODES = {
  'online': 'Online',
  'offline': 'Offline',
  'cash_on_delivery': 'Cash on Delivery'
}

// Order Change APIs
export const checkChangeEligibility = async (leadId) => {
  try {
    const response = await apiRequest({
      url: `${URLS.getCustomerOrders}/${leadId}/change-history`,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie"
    })
    return response.data
  } catch (error) {
    console.error('Error checking change eligibility:', error)
    throw error
  }
}

export const changeDeliveryAddress = async (leadId, addressData) => {
  try {
    const response = await apiRequest({
      url: `${URLS.getCustomerOrders}/${leadId}/address`,
      method: 'put',
      setAuthznHeader: true,
      sessionSource: "cookie",
      data: {
        newAddress: addressData.newAddress,
        reason: addressData.reason || ''
      }
    })
    return response.data
  } catch (error) {
    console.error('Error changing delivery address:', error)
    throw error
  }
}

export const changeDeliveryDate = async (leadId, dateData) => {
  try {
    const response = await apiRequest({
      url: `${URLS.getCustomerOrders}/${leadId}/delivery-date`,
      method: 'put',
      setAuthznHeader: true,
      sessionSource: "cookie",
      data: {
        newDeliveryDate: dateData.newDeliveryDate,
        reason: dateData.reason || ''
      }
    })
    return response.data
  } catch (error) {
    console.error('Error changing delivery date:', error)
    throw error
  }
}
