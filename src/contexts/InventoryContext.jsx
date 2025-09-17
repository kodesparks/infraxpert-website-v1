import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getInventoryItems,
  getInventoryCategories,
  getInventorySubcategories,
  getCompleteProductDetails,
  calculateShippingCost,
  calculatePromoDiscount,
  getActivePromos
} from "@/services/inventory";

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  // State for inventory items
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });
  
  // State for filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    category: '',
    subCategory: '',
    search: '',
    isActive: true
  });
  
  // State for categories
  const [categories, setCategories] = useState({});
  const [subcategories, setSubcategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  
  // State for active promos
  const [activePromos, setActivePromos] = useState([]);
  const [promosLoading, setPromosLoading] = useState(false);
  
  // State for product details
  const [productDetails, setProductDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Load inventory items
  const loadInventoryItems = useCallback(async (newFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedFilters = { ...filters, ...newFilters };
      const response = await getInventoryItems(updatedFilters);
      
      setInventoryItems(response.inventory || []);
      setPagination(response.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false
      });
      
      setFilters(updatedFilters);
    } catch (err) {
      console.error('Error loading inventory items:', err);
      setError(err.message || 'Failed to load inventory items');
      setInventoryItems([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load categories
  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const response = await getInventoryCategories();
      setCategories(response.categories || {});
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Load subcategories for a specific category
  const loadSubcategories = useCallback(async (category) => {
    if (!category) {
      setSubcategories([]);
      return;
    }
    
    try {
      const response = await getInventorySubcategories(category);
      setSubcategories(response.subcategories || []);
    } catch (err) {
      console.error('Error loading subcategories:', err);
      setSubcategories([]);
    }
  }, []);

  // Load active promos
  const loadActivePromos = useCallback(async () => {
    setPromosLoading(true);
    try {
      const response = await getActivePromos();
      setActivePromos(response.promos || []);
    } catch (err) {
      console.error('Error loading active promos:', err);
      setActivePromos([]);
    } finally {
      setPromosLoading(false);
    }
  }, []);

  // Load complete product details
  const loadProductDetails = useCallback(async (itemId) => {
    if (!itemId) return null;
    
    // Check if we already have the details cached
    if (productDetails[itemId]) {
      return productDetails[itemId];
    }
    
    setDetailsLoading(true);
    try {
      const details = await getCompleteProductDetails(itemId);
      setProductDetails(prev => ({
        ...prev,
        [itemId]: details
      }));
      return details;
    } catch (err) {
      console.error('Error loading product details:', err);
      return null;
    } finally {
      setDetailsLoading(false);
    }
  }, [productDetails]);

  // Calculate shipping cost
  const calculateShipping = useCallback(async (itemCode, orderValue) => {
    try {
      const response = await calculateShippingCost(itemCode, orderValue);
      return response.shipping;
    } catch (err) {
      console.error('Error calculating shipping:', err);
      throw err;
    }
  }, []);

  // Calculate promo discount
  const calculatePromo = useCallback(async (promoId, orderValue) => {
    try {
      const response = await calculatePromoDiscount(promoId, orderValue);
      return response.calculation;
    } catch (err) {
      console.error('Error calculating promo:', err);
      throw err;
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }; // Reset to page 1 when filters change
    loadInventoryItems(updatedFilters);
  }, [filters, loadInventoryItems]);

  // Change page
  const changePage = useCallback((page) => {
    loadInventoryItems({ ...filters, page });
  }, [filters, loadInventoryItems]);

  // Search items
  const searchItems = useCallback((searchTerm) => {
    updateFilters({ search: searchTerm });
  }, [updateFilters]);

  // Filter by category
  const filterByCategory = useCallback((category) => {
    updateFilters({ category, subCategory: '' }); // Clear subcategory when category changes
    loadSubcategories(category);
  }, [updateFilters, loadSubcategories]);

  // Filter by subcategory
  const filterBySubcategory = useCallback((subCategory) => {
    updateFilters({ subCategory });
  }, [updateFilters]);

  // Clear filters
  const clearFilters = useCallback(() => {
    const defaultFilters = {
      page: 1,
      limit: 20,
      category: '',
      subCategory: '',
      search: '',
      isActive: true
    };
    loadInventoryItems(defaultFilters);
    setSubcategories([]);
  }, [loadInventoryItems]);

  // Refresh data
  const refreshData = useCallback(() => {
    loadInventoryItems();
    loadCategories();
    loadActivePromos();
  }, [loadInventoryItems, loadCategories, loadActivePromos]);

  // Load initial data
  useEffect(() => {
    loadInventoryItems();
    loadCategories();
    loadActivePromos();
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    if (filters.category) {
      loadSubcategories(filters.category);
    } else {
      setSubcategories([]);
    }
  }, [filters.category, loadSubcategories]);

  // Transform inventory items to match the existing product structure
  const transformInventoryToProducts = useCallback((items) => {
    return items.map(item => {
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
        discount: Math.round(discount),
        originalPrice: Math.round(originalPrice),
        currentPrice: Math.round(currentPrice),
        unit: `/${item.units.toLowerCase()}`,
        rating: 4.5, // Default rating since not provided in API
        reviews: Math.floor(Math.random() * 1000) + 100, // Random reviews since not provided
        features: [
          item.grade || 'Premium Grade',
          item.specification || 'Quality Assured'
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
    });
  }, [productDetails]);

  const value = {
    // State
    inventoryItems,
    loading,
    error,
    pagination,
    filters,
    categories,
    subcategories,
    categoriesLoading,
    activePromos,
    promosLoading,
    productDetails,
    detailsLoading,
    
    // Actions
    loadInventoryItems,
    loadCategories,
    loadSubcategories,
    loadActivePromos,
    loadProductDetails,
    calculateShipping,
    calculatePromo,
    updateFilters,
    changePage,
    searchItems,
    filterByCategory,
    filterBySubcategory,
    clearFilters,
    refreshData,
    transformInventoryToProducts
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
