import { URLS } from "@/lib/apiUrls";
import FetchRequestData from '@/lib/axios';

const { apiRequest } = FetchRequestData();

/**
 * Get all inventory items with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.category - Filter by category
 * @param {string} params.subCategory - Filter by subcategory
 * @param {string} params.search - Search in item description
 * @param {boolean} params.isActive - Show only active items (default: true)
 * @returns {Promise<Object>} Inventory items with pagination
 */
export async function getInventoryItems(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    // Add query parameters
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.category) queryParams.append('category', params.category);
    if (params.subCategory) queryParams.append('subCategory', params.subCategory);
    if (params.search) queryParams.append('search', params.search);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);

    const url = `${URLS.getInventory}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await apiRequest({
      url,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie",
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    throw error;
  }
}

/**
 * Get detailed information about a specific inventory item
 * @param {string} itemId - MongoDB ObjectId of the inventory item
 * @returns {Promise<Object>} Inventory item details
 */
export async function getInventoryItem(itemId) {
  try {
    const response = await apiRequest({
      url: URLS.getInventoryItem(itemId),
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie",
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    throw error;
  }
}

/**
 * Get pricing information for a specific item
 * @param {string} itemId - MongoDB ObjectId of the inventory item
 * @returns {Promise<Object>} Pricing data
 */
export async function getItemPricing(itemId) {
  try {
    const response = await apiRequest({
      url: URLS.getInventoryPricing(itemId),
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie",
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching item pricing:', error);
    throw error;
  }
}

/**
 * Get shipping cost structure for a specific item
 * @param {string} itemId - MongoDB ObjectId of the inventory item
 * @returns {Promise<Object>} Shipping data
 */
export async function getItemShipping(itemId) {
  try {
    const response = await apiRequest({
      url: URLS.getInventoryShipping(itemId),
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie",
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching item shipping:', error);
    throw error;
  }
}

/**
 * Get active promotions for a specific item
 * @param {string} itemId - MongoDB ObjectId of the inventory item
 * @param {boolean} active - Show only active promos (default: true)
 * @returns {Promise<Object>} Promo data
 */
export async function getItemPromos(itemId, active = true) {
  try {
    const queryParams = new URLSearchParams();
    if (active !== undefined) queryParams.append('active', active);

    const url = `${URLS.getInventoryPromos(itemId)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await apiRequest({
      url,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie",
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching item promos:', error);
    throw error;
  }
}

/**
 * Get all images for a specific inventory item
 * @param {string} itemId - MongoDB ObjectId of the inventory item
 * @returns {Promise<Object>} Images data
 */
export async function getItemImages(itemId) {
  try {
    const response = await apiRequest({
      url: URLS.getInventoryImages(itemId),
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie",
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching item images:', error);
    throw error;
  }
}

/**
 * Get all available product categories and subcategories
 * @returns {Promise<Object>} Categories data
 */
export async function getInventoryCategories() {
  try {
    const response = await apiRequest({
      url: URLS.getInventoryCategories,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie",
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching inventory categories:', error);
    throw error;
  }
}

/**
 * Get subcategories for a specific category
 * @param {string} category - Product category name
 * @returns {Promise<Object>} Subcategories data
 */
export async function getInventorySubcategories(category) {
  try {
    const response = await apiRequest({
      url: URLS.getInventorySubcategories(category),
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie",
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching inventory subcategories:', error);
    throw error;
  }
}

/**
 * Calculate shipping cost for a specific order value
 * @param {string} itemCode - MongoDB ObjectId of the inventory item
 * @param {number} orderValue - Order amount in rupees
 * @returns {Promise<Object>} Shipping cost calculation
 */
export async function calculateShippingCost(itemCode, orderValue) {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('itemCode', itemCode);
    queryParams.append('orderValue', orderValue);

    const url = `${URLS.calculateShipping}?${queryParams.toString()}`;
    
    const response = await apiRequest({
      url,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie",
    });

    return response.data;
  } catch (error) {
    console.error('Error calculating shipping cost:', error);
    throw error;
  }
}

/**
 * Calculate discount amount for a specific promo
 * @param {string} promoId - MongoDB ObjectId of the promo
 * @param {number} orderValue - Order amount in rupees
 * @returns {Promise<Object>} Promo discount calculation
 */
export async function calculatePromoDiscount(promoId, orderValue) {
  try {
    const response = await apiRequest({
      url: URLS.calculatePromo,
      method: 'post',
      setAuthznHeader: true,
      sessionSource: "cookie",
      data: {
        promoId,
        orderValue
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error calculating promo discount:', error);
    throw error;
  }
}

/**
 * Get all active promotions across all items
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.itemCode - Filter by specific item ID
 * @returns {Promise<Object>} Active promos with pagination
 */
export async function getActivePromos(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.itemCode) queryParams.append('itemCode', params.itemCode);

    const url = `${URLS.getActivePromos}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await apiRequest({
      url,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie",
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching active promos:', error);
    throw error;
  }
}

/**
 * Browse all pricing information with filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {number} params.minPrice - Minimum price filter
 * @param {number} params.maxPrice - Maximum price filter
 * @param {boolean} params.isActive - Show only active items (default: true)
 * @returns {Promise<Object>} Pricing data with pagination
 */
export async function getAllPrices(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);

    const url = `${URLS.getAllPrices}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await apiRequest({
      url,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie",
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching all prices:', error);
    throw error;
  }
}

/**
 * Get complete product details including pricing, shipping, and promos
 * @param {string} itemId - MongoDB ObjectId of the inventory item
 * @returns {Promise<Object>} Complete product data
 */
export async function getCompleteProductDetails(itemId) {
  try {
    const [item, pricing, shipping, promos] = await Promise.all([
      getInventoryItem(itemId),
      getItemPricing(itemId).catch(() => null), // Handle case where pricing might not exist
      getItemShipping(itemId).catch(() => null), // Handle case where shipping might not exist
      getItemPromos(itemId, true).catch(() => null) // Handle case where promos might not exist
    ]);

    return {
      item: item.inventory,
      pricing: pricing?.pricing || null,
      shipping: shipping?.shipping || null,
      promos: promos?.promos || []
    };
  } catch (error) {
    console.error('Error fetching complete product details:', error);
    throw error;
  }
}
