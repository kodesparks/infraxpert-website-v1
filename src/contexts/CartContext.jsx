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
        items: state.items.filter(item => item.leadId !== action.payload)
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
    
    case 'UPDATE_QUANTITY_WITH_API_DATA':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { 
                ...item, 
                quantity: Math.max(1, action.payload.quantity),
                totalPrice: action.payload.totalPrice,
                deliveryCharges: action.payload.deliveryCharges,
                orderStatus: action.payload.orderStatus
              }
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
        deliveryPincode: deliveryData.deliveryPincode || product.deliveryPincode || '',
        deliveryAddress: deliveryData.deliveryAddress || '',
        deliveryExpectedDate: deliveryData.deliveryExpectedDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        custPhoneNum: deliveryData.custPhoneNum || '',
        receiverMobileNum: deliveryData.receiverMobileNum || deliveryData.custPhoneNum || ''
      }

      // Debug: Log the cart data being sent to API
      console.log('🛒 Cart Data being sent to API:', cartData)
      
      // Call API to add to cart
      const response = await orderService.addToCart(cartData)
      
      if (response && response.order) {
        // Update local cart state with API response data
        const cartItem = {
          id: product.id,
          name: product.name,
          image: product.image,
          currentPrice: product.currentPrice, // Base price
          totalPrice: response.order.totalAmount, // Total amount including delivery
          deliveryCharges: response.order.deliveryCharges, // Delivery charges
          quantity: product.quantity || 1,
          leadId: response.order.leadId,
          orderNumber: response.order.formattedLeadId,
          // Additional order data from API
          orderStatus: response.order.orderStatus,
          vendorId: response.order.vendorId,
          deliveryDetails: response.order.deliveryDetails
        }
        
        // Debug: Log the cart item being added
        console.log('🛒 Cart item being added:', cartItem)
        
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

  const removeFromCart = async (leadId) => {
    try {
      if (leadId) {
        // Call API to remove order from cart
        await orderService.removeFromCart(leadId)
      }
      
      // Update local cart state - remove all items with this leadId
      dispatch({ type: 'REMOVE_FROM_CART', payload: leadId })
    } catch (error) {
      console.error('Error removing from cart via API:', error)
      // Fallback to local cart if API fails
      dispatch({ type: 'REMOVE_FROM_CART', payload: leadId })
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
        const response = await orderService.updateOrder(leadId, updateData)
        
        // Debug: Log the update response
        console.log('🔄 Quantity update response:', response)
        
        // Update local cart state with API response data
        if (response && response.order) {
          dispatch({ 
            type: 'UPDATE_QUANTITY_WITH_API_DATA', 
            payload: { 
              id: productId, 
              quantity,
              totalPrice: response.order.totalAmount,
              deliveryCharges: response.order.deliveryCharges,
              orderStatus: response.order.orderStatus
            } 
          })
        } else {
          // Fallback to basic quantity update
          dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
        }
      } else if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        await removeFromCart(leadId)
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

  const clearCart = async () => {
    try {
      // Call API to clear all pending orders from cart
      await orderService.clearCart()
      // Update local cart state after successful API call
      dispatch({ type: 'CLEAR_CART' })
    } catch (error) {
      console.error('Error clearing cart via API:', error)
      // Still clear local state even if API fails
      dispatch({ type: 'CLEAR_CART' })
      throw error
    }
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
    return state.items.reduce((total, item) => {
      // Use totalPrice from API response if available, otherwise fallback to currentPrice * quantity
      const itemTotal = item.totalPrice || (item.currentPrice * item.quantity)
      return total + itemTotal
    }, 0)
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
