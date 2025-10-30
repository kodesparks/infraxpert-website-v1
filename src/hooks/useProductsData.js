import { useState, useEffect } from 'react'
import { getInventoryWithPricing } from '@/services/inventory'
import { useCategories } from './useCategories'

export const useProductsData = (userPincode) => {
  const [productsWithPricing, setProductsWithPricing] = useState([])
  const [pricingLoading, setPricingLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const { categories, loading: categoriesLoading } = useCategories()

  // Fetch products with pricing (works with or without pincode)
  useEffect(() => {
    const fetchProductsWithPricing = async () => {
      try {
        setPricingLoading(true)
        setError(null)
        console.log('🔄 Fetching products with pincode:', userPincode)
        const response = await getInventoryWithPricing({
          pincode: userPincode, // Can be null/undefined - API handles both cases
          page: 1,
          limit: 50
        })

        // Handle both response formats: with success wrapper and without
        if (response.success && response.data) {
          console.log('✅ Got products with success wrapper:', response.data.inventory?.length, 'items')
          setProductsWithPricing(response.data.inventory || [])
        } else if (response.inventory) {
          // Handle direct response format (without success wrapper)
          console.log('✅ Got products without success wrapper:', response.inventory?.length, 'items')
          setProductsWithPricing(response.inventory || [])
        } else {
          console.warn('⚠️ Backend pricing response not successful:', response)
          setProductsWithPricing([])
        }
      } catch (err) {
        console.error('Error fetching products with pricing:', err)
        setError(err.message || 'Failed to load products')
        setProductsWithPricing([])
      } finally {
        setPricingLoading(false)
      }
    }

    fetchProductsWithPricing()
  }, [userPincode])

  return {
    productsWithPricing,
    pricingLoading,
    error,
    categories,
    categoriesLoading
  }
}
