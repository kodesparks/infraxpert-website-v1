// API URLs configuration
// Using dummy URLs as requested - replace with actual API endpoints when ready

export const URLS = {
  // Auth APIs
  login: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`,
  signup: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/signup`,
  refreshToken: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/refresh-token`,
  logout: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/logout`,
  userDetails: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/user`,
  changePassword: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/change-password`,
  
  // User profile APIs
  updateProfile: (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${id}`,
  updateEmail: (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${id}/email`,
  updateMobile: (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${id}/mobile`,
  
  // Products APIs
  getProducts: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`,
  getProduct: (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`,
  
  // Inventory APIs
  getInventory: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory`,
  getInventoryItem: (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory/${id}`,
  getInventoryPricing: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory/pricing`,
  getItemPricing: (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory/pricing/${id}`,
  getInventoryImages: (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory/${id}/images`,
  getInventoryCategories: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory/categories`,
  getInventorySubcategories: (category) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory/categories/${category}/subcategories`,
  
  // Order Management APIs
  // Customer Order APIs
  addToCart: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/cart/add`,
  getCustomerOrders: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/customer/orders`,
  getOrderDetails: (leadId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/customer/orders/${leadId}`,
  updateOrder: (leadId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/customer/orders/${leadId}`,
  removeFromCart: (leadId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/customer/orders/${leadId}`,
  placeOrder: (leadId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/customer/orders/${leadId}/place`,
  processPayment: (leadId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/customer/orders/${leadId}/payment`,
  getPaymentStatus: (leadId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/customer/orders/${leadId}/payment`,
  getOrderTracking: (leadId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/customer/orders/${leadId}/tracking`,
  
  // Cart-specific APIs
  getCartSummary: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/customer/orders/summary`,
  clearCart: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/customer/orders/clear`,
  removeSpecificItemFromCart: (leadId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/customer/orders/${leadId}/items`,
  
  // Vendor Order APIs
  getVendorOrders: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/vendor/orders`,
  getVendorOrderDetails: (leadId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/vendor/orders/${leadId}`,
  getPendingOrders: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/vendor/orders/pending`,
  getVendorOrderStats: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/vendor/orders/stats`,
  acceptOrder: (leadId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/vendor/orders/${leadId}/accept`,
  rejectOrder: (leadId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/vendor/orders/${leadId}/reject`,
  updateDeliveryTracking: (leadId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/vendor/orders/${leadId}/delivery`,
  
  // Admin Order APIs
  getAllOrders: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/admin/orders`,
  getAdminOrderDetails: (leadId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/admin/orders/${leadId}`,
  getOrderStats: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/admin/orders/stats`,
  getOrdersByDateRange: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/admin/orders/date-range`,
  cancelOrder: (leadId) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/admin/orders/${leadId}/cancel`,
  getPaymentStats: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/admin/payments/stats`,
  getDeliveryStats: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/order/admin/deliveries/stats`,
  
  // Legacy Orders APIs (for backward compatibility)
  getOrders: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`,
  createOrder: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`,
  getOrder: (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${id}`,
  
  // Legacy Cart APIs (for backward compatibility)
  getCart: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart`,
  updateCart: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart/update`,
  
  // Location & Delivery APIs
  validatePincode: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/location/validate-pincode`,
  calculateDelivery: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/delivery/calculate`,
  estimateDeliveryTime: (pincode) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/delivery/estimate-time/${pincode}`,
  
  // Contact APIs
  sendContactMessage: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`,
  
  // File upload APIs
  uploadAvatar: (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${id}/avatar`,
};
