import { useState, useEffect } from 'react'
import { getInventoryCategories } from '@/services/inventory'

export const useCategories = () => {
  const [categories, setCategories] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getInventoryCategories()
        setCategories(response.categories || {})
      } catch (err) {
        setError(err.message || 'Failed to load categories')
        setCategories({})
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  return { categories, loading, error }
}
