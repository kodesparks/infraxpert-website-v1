import React, { createContext, useContext, useReducer, useCallback } from 'react'

// Order status constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned'
}

// Order status display info
export const ORDER_STATUS_INFO = {
  [ORDER_STATUS.PENDING]: {
    label: 'Pending',
    color: 'yellow',
    icon: '⏳',
    description: 'Order received, awaiting confirmation'
  },
  [ORDER_STATUS.CONFIRMED]: {
    label: 'Confirmed',
    color: 'blue',
    icon: '✅',
    description: 'Order confirmed, preparing for processing'
  },
  [ORDER_STATUS.PROCESSING]: {
    label: 'Processing',
    color: 'purple',
    icon: '🔄',
    description: 'Order is being processed and prepared'
  },
  [ORDER_STATUS.SHIPPED]: {
    label: 'Shipped',
    color: 'indigo',
    icon: '📦',
    description: 'Order has been shipped from warehouse'
  },
  [ORDER_STATUS.IN_TRANSIT]: {
    label: 'In Transit',
    color: 'blue',
    icon: '🚚',
    description: 'Order is on the way to your location'
  },
  [ORDER_STATUS.OUT_FOR_DELIVERY]: {
    label: 'Out for Delivery',
    color: 'green',
    icon: '🚛',
    description: 'Order is out for delivery today'
  },
  [ORDER_STATUS.DELIVERED]: {
    label: 'Delivered',
    color: 'green',
    icon: '🎉',
    description: 'Order has been delivered successfully'
  },
  [ORDER_STATUS.CANCELLED]: {
    label: 'Cancelled',
    color: 'red',
    icon: '❌',
    description: 'Order has been cancelled'
  },
  [ORDER_STATUS.RETURNED]: {
    label: 'Returned',
    color: 'orange',
    icon: '↩️',
    description: 'Order has been returned'
  }
}

// Initial state
const initialState = {
  orders: [],
  loading: false,
  error: null,
  selectedOrder: null
}

// Action types
const ORDERS_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
  SET_ORDERS: 'SET_ORDERS',
  SELECT_ORDER: 'SELECT_ORDER',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

// Reducer
const ordersReducer = (state, action) => {
  switch (action.type) {
    case ORDERS_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case ORDERS_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    
    case ORDERS_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }
    
    case ORDERS_ACTIONS.ADD_ORDER:
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        loading: false,
        error: null
      }
    
    case ORDERS_ACTIONS.UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? { ...order, ...action.payload } : order
        ),
        selectedOrder: state.selectedOrder?.id === action.payload.id 
          ? { ...state.selectedOrder, ...action.payload }
          : state.selectedOrder
      }
    
    case ORDERS_ACTIONS.SET_ORDERS:
      return {
        ...state,
        orders: action.payload,
        loading: false,
        error: null
      }
    
    case ORDERS_ACTIONS.SELECT_ORDER:
      return {
        ...state,
        selectedOrder: action.payload
      }
    
    default:
      return state
  }
}

// Context
const OrdersContext = createContext()

// Provider component
export const OrdersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ordersReducer, initialState)

  // Generate unique order ID
  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  }

  // Create new order from cart
  const createOrder = useCallback((cartData, paymentData, deliveryData) => {
    const orderId = generateOrderId()
    const order = {
      id: orderId,
      orderNumber: orderId,
      items: cartData.items || [],
      totalAmount: cartData.totalAmount || 0,
      deliveryCharges: cartData.deliveryCharges || 0,
      finalAmount: cartData.finalAmount || 0,
      status: ORDER_STATUS.PENDING,
      paymentMethod: paymentData.method || 'unknown',
      paymentStatus: 'pending',
      deliveryAddress: deliveryData,
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      trackingNumber: `TRK-${Date.now()}`,
      statusHistory: [
        {
          status: ORDER_STATUS.PENDING,
          timestamp: new Date().toISOString(),
          description: 'Order placed successfully'
        }
      ],
      notes: '',
      customerInfo: {
        name: deliveryData.name || 'Customer',
        phone: deliveryData.phone || '',
        email: deliveryData.email || ''
      }
    }

    dispatch({ type: ORDERS_ACTIONS.ADD_ORDER, payload: order })
    return order
  }, [])

  // Update order status
  const updateOrderStatus = useCallback((orderId, newStatus, description = '') => {
    const order = state.orders.find(o => o.id === orderId)
    if (!order) return

    const statusUpdate = {
      status: newStatus,
      statusHistory: [
        ...order.statusHistory,
        {
          status: newStatus,
          timestamp: new Date().toISOString(),
          description: description || ORDER_STATUS_INFO[newStatus]?.description || 'Status updated'
        }
      ]
    }

    dispatch({ type: ORDERS_ACTIONS.UPDATE_ORDER, payload: { id: orderId, ...statusUpdate } })
  }, [state.orders])

  // Get orders by status
  const getOrdersByStatus = useCallback((status) => {
    return state.orders.filter(order => order.status === status)
  }, [state.orders])

  // Get order by ID
  const getOrderById = useCallback((orderId) => {
    return state.orders.find(order => order.id === orderId)
  }, [state.orders])

  // Cancel order
  const cancelOrder = useCallback((orderId, reason = '') => {
    updateOrderStatus(orderId, ORDER_STATUS.CANCELLED, reason || 'Order cancelled by customer')
  }, [updateOrderStatus])

  // Simulate order progression (for demo purposes)
  const simulateOrderProgress = useCallback((orderId) => {
    const order = getOrderById(orderId)
    if (!order || order.status === ORDER_STATUS.DELIVERED || order.status === ORDER_STATUS.CANCELLED) {
      return
    }

    const statusFlow = [
      ORDER_STATUS.CONFIRMED,
      ORDER_STATUS.PROCESSING,
      ORDER_STATUS.SHIPPED,
      ORDER_STATUS.IN_TRANSIT,
      ORDER_STATUS.OUT_FOR_DELIVERY,
      ORDER_STATUS.DELIVERED
    ]

    const currentIndex = statusFlow.indexOf(order.status)
    if (currentIndex >= 0 && currentIndex < statusFlow.length - 1) {
      const nextStatus = statusFlow[currentIndex + 1]
      updateOrderStatus(orderId, nextStatus)
    }
  }, [getOrderById, updateOrderStatus])

  // Get order statistics
  const getOrderStats = useCallback(() => {
    const stats = {
      total: state.orders.length,
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      inTransit: 0,
      outForDelivery: 0,
      delivered: 0,
      cancelled: 0
    }

    state.orders.forEach(order => {
      switch (order.status) {
        case ORDER_STATUS.PENDING:
          stats.pending++
          break
        case ORDER_STATUS.CONFIRMED:
          stats.confirmed++
          break
        case ORDER_STATUS.PROCESSING:
          stats.processing++
          break
        case ORDER_STATUS.SHIPPED:
          stats.shipped++
          break
        case ORDER_STATUS.IN_TRANSIT:
          stats.inTransit++
          break
        case ORDER_STATUS.OUT_FOR_DELIVERY:
          stats.outForDelivery++
          break
        case ORDER_STATUS.DELIVERED:
          stats.delivered++
          break
        case ORDER_STATUS.CANCELLED:
          stats.cancelled++
          break
      }
    })

    return stats
  }, [state.orders])

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: ORDERS_ACTIONS.CLEAR_ERROR })
  }, [])

  // Set loading
  const setLoading = useCallback((loading) => {
    dispatch({ type: ORDERS_ACTIONS.SET_LOADING, payload: loading })
  }, [])

  // Set error
  const setError = useCallback((error) => {
    dispatch({ type: ORDERS_ACTIONS.SET_ERROR, payload: error })
  }, [])

  const value = {
    // State
    orders: state.orders,
    loading: state.loading,
    error: state.error,
    selectedOrder: state.selectedOrder,
    
    // Actions
    createOrder,
    updateOrderStatus,
    getOrdersByStatus,
    getOrderById,
    cancelOrder,
    simulateOrderProgress,
    getOrderStats,
    clearError,
    setLoading,
    setError,
    
    // Constants
    ORDER_STATUS,
    ORDER_STATUS_INFO
  }

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  )
}

// Custom hook
export const useOrders = () => {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider')
  }
  return context
}
