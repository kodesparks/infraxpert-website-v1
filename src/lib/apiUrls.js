// API URLs configuration
// Using dummy URLs as requested - replace with actual API endpoints when ready

export const URLS = {
  // Auth APIs
  login: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`,
  signup: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/signup`,
  refreshToken: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/refresh-token`,
  logout: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/logout`,
  userDetails: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/user`,
  
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
  getInventoryPricing: (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory/${id}/price`,
  getInventoryShipping: (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory/${id}/shipping`,
  getInventoryPromos: (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory/${id}/promo`,
  getInventoryImages: (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory/${id}/images`,
  getInventoryCategories: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory/categories`,
  getInventorySubcategories: (category) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory/categories/${category}/subcategories`,
  calculateShipping: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory/shipping/calculate`,
  calculatePromo: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory/promo/calculate`,
  getActivePromos: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory/promo/active`,
  getAllPrices: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory/price/list`,
  
  // Orders APIs
  getOrders: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`,
  createOrder: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`,
  getOrder: (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${id}`,
  
  // Cart APIs
  getCart: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart`,
  addToCart: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart/add`,
  updateCart: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart/update`,
  removeFromCart: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart/remove`,
  
  // Contact APIs
  sendContactMessage: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`,
  
  // File upload APIs
  uploadAvatar: (id) => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${id}/avatar`,
};
