import React, { createContext, useContext, useReducer, useCallback } from 'react'
import * as orderService from '@/services/order'

// Order status constants - mapped to API statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  ORDER_PLACED: 'order_placed',
  CONFIRMED: 'vendor_accepted',
  PROCESSING: 'payment_done',
  ORDER_CONFIRMED: 'order_confirmed',
  TRUCK_LOADING: 'truck_loading',
  IN_TRANSIT: 'in_transit',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned'
}

// UI Status mapping for display
export const UI_ORDER_STATUS = {
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
    label: 'In Cart',
    color: 'yellow',
    icon: 'Clock',
    description: 'Item in cart, ready to place order'
  },
  [ORDER_STATUS.ORDER_PLACED]: {
    label: 'Order Placed',
    color: 'orange',
    icon: 'Package',
    description: 'Order placed, awaiting vendor confirmation'
  },
  [ORDER_STATUS.CONFIRMED]: {
    label: 'Order Accepted',
    color: 'blue',
    icon: 'CheckCircle',
    description: 'Order accepted - Payment required'
  },
  [ORDER_STATUS.PROCESSING]: {
    label: 'Payment Completed',
    color: 'purple',
    icon: 'CreditCard',
    description: 'Payment processed successfully'
  },
  [ORDER_STATUS.ORDER_CONFIRMED]: {
    label: 'Order Confirmed',
    color: 'green',
    icon: 'CheckCircle',
    description: 'Your order is confirmed and being prepared for dispatch'
  },
  [ORDER_STATUS.TRUCK_LOADING]: {
    label: 'Loading',
    color: 'orange',
    icon: 'Truck',
    description: 'Your order is being loaded onto delivery vehicle'
  },
  [ORDER_STATUS.SHIPPED]: {
    label: 'Dispatched',
    color: 'indigo',
    icon: 'Package',
    description: 'Order dispatched from warehouse'
  },
  [ORDER_STATUS.IN_TRANSIT]: {
    label: 'On the Way',
    color: 'blue',
    icon: 'Truck',
    description: 'Order is in transit to your location'
  },
  [ORDER_STATUS.OUT_FOR_DELIVERY]: {
    label: 'Out for Delivery',
    color: 'green',
    icon: 'Truck',
    description: 'Order is out for delivery today'
  },
  [ORDER_STATUS.DELIVERED]: {
    label: 'Delivered',
    color: 'green',
    icon: 'CheckCircle',
    description: 'Order has been delivered successfully'
  },
  [ORDER_STATUS.CANCELLED]: {
    label: 'Cancelled',
    color: 'red',
    icon: 'XCircle',
    description: 'Order has been cancelled'
  },
  [ORDER_STATUS.RETURNED]: {
    label: 'Returned',
    color: 'orange',
    icon: 'RotateCcw',
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

  // Load customer orders from API
  const loadOrders = useCallback(async (status = null) => {
    try {
      dispatch({ type: ORDERS_ACTIONS.SET_LOADING, payload: true })
      
      const params = {}
      if (status) params.status = status
      
      const response = await orderService.getCustomerOrders(params)
      
      if (response && response.orders) {
        // Transform API orders to UI format
        const transformedOrders = response.orders.map(order => ({
          ...order,
          id: order.leadId || order._id,
          orderNumber: order.formattedLeadId || order.leadId,
          items: (order.items || []).map(item => ({
            id: item.itemCode?._id || item.itemCode?.id,
            name: item.itemCode?.itemDescription || 'Product',
            image: item.itemCode?.primaryImage || '/placeholder-image.jpg',
            price: item.unitPrice || 0,
            currentPrice: item.unitPrice || 0,
            quantity: item.qty || 1,
            totalCost: item.totalCost || 0
          })),
          totalAmount: order.totalAmount || 0,
          deliveryCharges: 0, // Will be calculated
          finalAmount: order.totalAmount || 0,
          status: order.orderStatus || ORDER_STATUS.PENDING,
          orderDate: order.orderDate,
          estimatedDelivery: order.deliveryExpectedDate,
          deliveryAddress: order.deliveryAddress,
          deliveryPincode: order.deliveryPincode,
          customerName: order.custUserId?.name || 'Customer',
          customerPhone: order.custUserId?.phone || '',
          customerEmail: order.custUserId?.email || '',
          paymentMethod: order.paymentMethod || 'Pending',
          vendorId: order.vendorId?._id,
          vendorName: order.vendorId?.name,
          statusHistory: order.statusHistory || [{
            status: order.orderStatus || ORDER_STATUS.PENDING,
            timestamp: order.orderDate,
            description: ORDER_STATUS_INFO[order.orderStatus || ORDER_STATUS.PENDING]?.description || 'Order status updated'
          }],
          customerInfo: {
            name: order.custUserId?.name || 'Customer',
            phone: order.custUserId?.phone || '',
            email: order.custUserId?.email || ''
          },

        }))
        
        dispatch({ type: ORDERS_ACTIONS.SET_ORDERS, payload: transformedOrders })
      }
    } catch (error) {
      console.error('Error loading orders:', error)
      dispatch({ type: ORDERS_ACTIONS.SET_ERROR, payload: error.message || 'Failed to load orders' })
    }
  }, [])

  // Add item to cart via API
  const addToCart = useCallback(async (itemData) => {
    try {
      dispatch({ type: ORDERS_ACTIONS.SET_LOADING, payload: true })
      
      const response = await orderService.addToCart(itemData)
      
      if (response && response.order) {
        // Transform API order to UI format
        const transformedOrder = {
          ...response.order,
          id: response.order.leadId,
          orderNumber: response.order.formattedLeadId,
          items: (response.order.items || []).map(item => ({
            id: item.itemCode?._id || item.itemCode?.id,
            name: item.itemCode?.itemDescription || 'Product',
            image: item.itemCode?.primaryImage || '/placeholder-image.jpg',
            price: item.unitPrice || 0,
            currentPrice: item.unitPrice || 0,
            quantity: item.qty || 1,
            totalCost: item.totalCost || 0
          })),
          totalAmount: response.order.totalAmount || 0,
          deliveryCharges: 0,
          finalAmount: response.order.totalAmount || 0,
          status: response.order.orderStatus || ORDER_STATUS.PENDING,
          orderDate: response.order.orderDate,
          estimatedDelivery: null,
          deliveryAddress: itemData.deliveryAddress,
          deliveryPincode: itemData.deliveryPincode,
          customerName: 'Current User',
          customerPhone: itemData.custPhoneNum,
          customerEmail: '',
          paymentMethod: 'Pending',
          vendorId: response.order.vendorId?._id,
          vendorName: response.order.vendorId?.name,
          statusHistory: [{
            status: response.order.orderStatus || ORDER_STATUS.PENDING,
            timestamp: response.order.orderDate,
            description: ORDER_STATUS_INFO[response.order.orderStatus || ORDER_STATUS.PENDING]?.description || 'Order status updated'
          }],
          customerInfo: {
            name: 'Current User',
            phone: itemData.custPhoneNum,
            email: ''
          }
        }
        
        dispatch({ type: ORDERS_ACTIONS.ADD_ORDER, payload: transformedOrder })
        return transformedOrder
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      dispatch({ type: ORDERS_ACTIONS.SET_ERROR, payload: error.message || 'Failed to add item to cart' })
      throw error
    }
  }, [])

  // Create new order from cart (legacy function for compatibility)
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

  // Place order via API
  const placeOrder = useCallback(async (leadId, orderData) => {
    try {
      dispatch({ type: ORDERS_ACTIONS.SET_LOADING, payload: true })
      
      const response = await orderService.placeOrder(leadId, orderData)
      
      if (response && response.order) {
        // Update the order in state
        const statusUpdate = {
          status: ORDER_STATUS.PENDING,
          deliveryAddress: orderData.deliveryAddress,
          deliveryPincode: orderData.deliveryPincode,
          estimatedDelivery: orderData.deliveryExpectedDate,
          statusHistory: [
            {
              status: ORDER_STATUS.PENDING,
              timestamp: new Date().toISOString(),
              description: 'Order placed successfully'
            }
          ]
        }
        
        dispatch({ type: ORDERS_ACTIONS.UPDATE_ORDER, payload: { id: leadId, ...statusUpdate } })
        return response.order
      }
    } catch (error) {
      console.error('Error placing order:', error)
      dispatch({ type: ORDERS_ACTIONS.SET_ERROR, payload: error.message || 'Failed to place order' })
      throw error
    }
  }, [])

  // Process payment via API
  const processPayment = useCallback(async (leadId, paymentData) => {
    try {
      dispatch({ type: ORDERS_ACTIONS.SET_LOADING, payload: true })
      
      const response = await orderService.processPayment(leadId, paymentData)
      
      if (response && response.payment) {
        // Update order status to payment done
        const statusUpdate = {
          status: ORDER_STATUS.PROCESSING,
          paymentMethod: paymentData.paymentType,
          paymentStatus: response.payment.paymentStatus,
          statusHistory: [
            {
              status: ORDER_STATUS.PROCESSING,
              timestamp: new Date().toISOString(),
              description: 'Payment processed successfully'
            }
          ]
        }
        
        dispatch({ type: ORDERS_ACTIONS.UPDATE_ORDER, payload: { id: leadId, ...statusUpdate } })
        return response.payment
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      dispatch({ type: ORDERS_ACTIONS.SET_ERROR, payload: error.message || 'Failed to process payment' })
      throw error
    }
  }, [])

  // Update order status (legacy function for compatibility)
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
      orderPlaced: 0,
      confirmed: 0,
      processing: 0,
      orderConfirmed: 0,
      truckLoading: 0,
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
        case ORDER_STATUS.ORDER_PLACED:
          stats.orderPlaced++
          break
        case ORDER_STATUS.CONFIRMED:
          stats.confirmed++
          break
        case ORDER_STATUS.PROCESSING:
          stats.processing++
          break
        case ORDER_STATUS.ORDER_CONFIRMED:
          stats.orderConfirmed++
          break
        case ORDER_STATUS.TRUCK_LOADING:
          stats.truckLoading++
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
    
    // API Actions
    loadOrders,
    addToCart,
    placeOrder,
    processPayment,
    
    // Legacy Actions (for compatibility)
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
