import { URLS } from "@/lib/apiUrls";
import FetchRequestData from '@/lib/axios';

const { apiRequest } = FetchRequestData();

/**
 * Validate pincode using backend API
 * @param {string} pincode - 6 digit pincode
 * @returns {Promise<Object>} Validation result with coordinates
 */
export async function validatePincode(pincode) {
  try {
    const response = await apiRequest({
      url: URLS.validatePincode,
      method: 'post',
      data: { pincode },
      setAuthznHeader: false, // No authentication required for public APIs
      sessionSource: "cookie",
    });
    return response.data;
  } catch (error) {
    console.error('Error validating pincode:', error);
    throw error;
  }
}

/**
 * Calculate delivery charges for items
 * @param {string} pincode - 6 digit pincode
 * @param {Array} items - Array of items with itemId and quantity
 * @returns {Promise<Object>} Delivery calculation result
 */
export async function calculateDelivery(pincode, items) {
  try {
    const response = await apiRequest({
      url: URLS.calculateDelivery,
      method: 'post',
      data: {
        pincode,
        items
      },
      setAuthznHeader: false, // No authentication required for public APIs
      sessionSource: "cookie",
    });
    return response.data;
  } catch (error) {
    console.error('Error calculating delivery:', error);
    throw error;
  }
}

/**
 * Estimate delivery time for a pincode
 * @param {string} pincode - 6 digit pincode
 * @returns {Promise<Object>} Delivery time estimates
 */
export async function estimateDeliveryTime(pincode) {
  try {
    const response = await apiRequest({
      url: URLS.estimateDeliveryTime(pincode),
      method: 'get',
      setAuthznHeader: false, // No authentication required for public APIs
      sessionSource: "cookie",
    });
    return response.data;
  } catch (error) {
    console.error('Error estimating delivery time:', error);
    throw error;
  }
}
