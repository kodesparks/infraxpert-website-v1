import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'
import * as orderService from '@/services/order'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        )
      }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      }
    
    case 'SET_CART':
      return {
        ...state,
        items: action.payload || []
      }
    
    case 'SET_DELIVERY_DETAILS':
      return {
        ...state,
        deliveryDetails: action.payload
      }
    
    case 'SET_ORDER_SUMMARY':
      return {
        ...state,
        orderSummary: action.payload
      }
    
    default:
      return state
  }
}

const initialState = {
  items: [],
  deliveryDetails: null,
  orderSummary: null
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const [isLoading, setIsLoading] = useState(false)

  // No server-side cart sync - pure local state management

  const addToCart = async (product, deliveryData = {}) => {
    try {
      // Prepare data for API call
      const cartData = {
        itemCode: product.id,
        qty: product.quantity || 1,
        deliveryAddress: deliveryData.deliveryAddress || '',
        deliveryPincode: deliveryData.deliveryPincode || '',
        deliveryExpectedDate: deliveryData.deliveryExpectedDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        custPhoneNum: deliveryData.custPhoneNum || '',
        receiverMobileNum: deliveryData.receiverMobileNum || deliveryData.custPhoneNum || ''
      }

      // Call API to add to cart
      const response = await orderService.addToCart(cartData)
      
      if (response && response.order) {
        // Update local cart state with API response
        const cartItem = {
          id: product.id,
          name: product.name,
          image: product.image,
          currentPrice: product.currentPrice,
          quantity: product.quantity || 1,
          leadId: response.order.leadId,
          orderNumber: response.order.formattedLeadId
        }
        
        dispatch({ type: 'ADD_TO_CART', payload: cartItem })
        return response.order
      }
    } catch (error) {
      console.error('Error adding to cart via API:', error)
      // Fallback to local cart if API fails
      dispatch({ type: 'ADD_TO_CART', payload: product })
      throw error
    }
  }

  const removeFromCart = async (productId, leadId = null) => {
    try {
      if (leadId) {
        // Call API to remove from cart - pass only the item ID string
        await orderService.removeFromCart(leadId, productId)
      }
      
      // Update local cart state
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
    } catch (error) {
      console.error('Error removing from cart via API:', error)
      // Fallback to local cart if API fails
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
      throw error
    }
  }

  const updateQuantity = async (productId, quantity, leadId = null) => {
    try {
      if (leadId && quantity > 0) {
        // Call API to update order quantity
        const updateData = {
          items: [{ itemCode: productId, qty: quantity }]
        }
        await orderService.updateOrder(leadId, updateData)
        
        // Update local cart state after successful API call
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
      } else if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        await removeFromCart(productId, leadId)
      } else {
        // Update local cart state for items without leadId
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      // Fallback to local cart if API fails
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
      throw error
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const setDeliveryDetails = (details) => {
    dispatch({ type: 'SET_DELIVERY_DETAILS', payload: details })
  }

  const setOrderSummary = (summary) => {
    dispatch({ type: 'SET_ORDER_SUMMARY', payload: summary })
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.currentPrice * item.quantity), 0)
  }

  const value = {
    ...state,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setDeliveryDetails,
    setOrderSummary,
    getTotalItems,
    getTotalPrice
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
