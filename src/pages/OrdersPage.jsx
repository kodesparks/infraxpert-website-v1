import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye, 
  RefreshCw,
  Filter,
  Search,
  Calendar,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  Star,
  MessageCircle,
  Download,
  CreditCard as PaymentIcon,
  AlertCircle,
  CheckCircle2,
  Search as SearchIcon,
  Truck as TruckIcon,
  Package2,
  CircleCheck,
  CircleX,
  CircleAlert
} from 'lucide-react'
import { useOrders, ORDER_STATUS, ORDER_STATUS_INFO } from '@/contexts/OrdersContext'
import * as orderService from '@/services/order'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const OrdersPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { 
    orders, 
    loading, 
    error, 
    loadOrders,
    getOrdersByStatus, 
    getOrderStats, 
    updateOrderStatus, 
    simulateOrderProgress, 
    cancelOrder 
  } = useOrders()
  
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)

  // Load orders on component mount
  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // Show success message if redirected from order placement
  useEffect(() => {
    if (location.state?.message) {
      // You can add a toast notification here
      console.log('Success message:', location.state.message)
    }
  }, [location.state])

  // Filter orders based on selected status and search term
  const filteredOrders = useMemo(() => {
    let filtered = orders

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = getOrdersByStatus(selectedStatus)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.phone.includes(searchTerm) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    return filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
  }, [orders, selectedStatus, searchTerm, getOrdersByStatus])

  // Get order statistics
  const stats = getOrderStats()

  // Customer-focused status filters
  const statusFilters = [
    { value: 'all', label: 'All Orders', count: stats.total, icon: Package, color: 'blue' },
    { value: ORDER_STATUS.PENDING, label: 'Order Placed', count: stats.pending, icon: Clock, color: 'yellow' },
    { value: ORDER_STATUS.CONFIRMED, label: 'Confirmed', count: stats.confirmed, icon: CheckCircle, color: 'blue' },
    { value: ORDER_STATUS.PROCESSING, label: 'Preparing', count: stats.processing, icon: RefreshCw, color: 'purple' },
    { value: ORDER_STATUS.SHIPPED, label: 'Shipped', count: stats.shipped, icon: Truck, color: 'indigo' },
    { value: ORDER_STATUS.IN_TRANSIT, label: 'On the Way', count: stats.inTransit, icon: Truck, color: 'blue' },
    { value: ORDER_STATUS.OUT_FOR_DELIVERY, label: 'Out for Delivery', count: stats.outForDelivery, icon: Truck, color: 'green' },
    { value: ORDER_STATUS.DELIVERED, label: 'Delivered', count: stats.delivered, icon: CheckCircle, color: 'green' },
    { value: ORDER_STATUS.CANCELLED, label: 'Cancelled', count: stats.cancelled, icon: XCircle, color: 'red' }
  ]

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status color classes
  const getStatusClasses = (status) => {
    const statusInfo = ORDER_STATUS_INFO[status]
    const colorMap = {
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200'
    }
    return colorMap[statusInfo?.color] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Handle payment for vendor accepted orders
  const handlePayment = (order) => {
    navigate('/payment', { 
      state: { 
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.finalAmount || order.totalAmount
      } 
    })
  }

  // Load detailed order information
  const loadOrderDetails = async (orderId) => {
    setIsLoadingDetails(true)
    try {
      const response = await orderService.getOrderDetails(orderId)
      if (response && response.order) {
        setOrderDetails(response.order)
      }
    } catch (error) {
      console.error('Error loading order details:', error)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  // Handle view details
  const handleViewDetails = async (order) => {
    setSelectedOrder(order)
    // Load detailed order information from API
    await loadOrderDetails(order.id)
  }

  // Customer-friendly order card component
  const OrderCard = ({ order }) => {
    const statusInfo = ORDER_STATUS_INFO[order.status]
    const isVendorAccepted = order.status === ORDER_STATUS.CONFIRMED
    
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{order.orderNumber}</h3>
              <p className="text-sm text-gray-500">Ordered on {formatDate(order.orderDate)}</p>
            </div>
          </div>
          
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusClasses(order.status)}`}>
              {statusInfo?.icon} {statusInfo?.label}
            </span>
          </div>
        </div>

        {/* Payment Required Alert */}
        {isVendorAccepted && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Payment Required</p>
                <p className="text-xs text-blue-600">Vendor has accepted your order. Please complete payment to proceed.</p>
              </div>
              <Button
                onClick={() => handlePayment(order)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <PaymentIcon className="w-4 h-4 mr-1" />
                Pay Now
              </Button>
            </div>
          </div>
        )}

        {/* Order Items Preview */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h4>
          <div className="space-y-2">
            {(order.items || []).slice(0, 2).map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <img
                  src={item.image || '/placeholder-image.jpg'}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  ₹{((item.currentPrice || item.price || 0) * (item.quantity || 1)).toLocaleString()}
                </p>
              </div>
            ))}
            {(order.items || []).length > 2 && (
              <p className="text-xs text-gray-500 text-center py-2">
                +{(order.items || []).length - 2} more items
              </p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="text-lg font-bold text-gray-900">₹{(order.finalAmount || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Payment: {order.paymentMethod}</span>
            <span>Est. Delivery: {formatDate(order.estimatedDelivery)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleViewDetails(order)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
          
          <div className="flex space-x-2">
            {order.status === ORDER_STATUS.DELIVERED && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-green-200 text-green-600 hover:bg-green-50"
              >
                <Star className="w-3 h-3 mr-1" />
                Rate Order
              </Button>
            )}
            {order.status !== ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.CANCELLED && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Support
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="text-xs border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <Download className="w-3 h-3 mr-1" />
              Invoice
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Order details modal
  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null

    // Use API order details if available, otherwise fallback to local order data
    const displayOrder = orderDetails || order

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{displayOrder.orderNumber || displayOrder.formattedLeadId}</h2>
              <p className="text-sm text-gray-500">{formatDate(displayOrder.orderDate)}</p>
              {isLoadingDetails && (
                <p className="text-xs text-blue-600 mt-1">Loading detailed information...</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <XCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
              <div className="space-y-4">
                {/* Order Placed */}
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    order.status === ORDER_STATUS.PENDING || 
                    order.status === ORDER_STATUS.CONFIRMED || 
                    order.status === ORDER_STATUS.PROCESSING || 
                    order.status === ORDER_STATUS.SHIPPED || 
                    order.status === ORDER_STATUS.IN_TRANSIT || 
                    order.status === ORDER_STATUS.OUT_FOR_DELIVERY || 
                    order.status === ORDER_STATUS.DELIVERED
                      ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900">Order Placed</span>
                      <span className="text-sm text-gray-500">{formatDate(order.orderDate)}</span>
                    </div>
                    <p className="text-sm text-gray-600">Your order has been received and is being processed</p>
                  </div>
                </div>

                {/* Vendor Verifying */}
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    order.status === ORDER_STATUS.CONFIRMED || 
                    order.status === ORDER_STATUS.PROCESSING || 
                    order.status === ORDER_STATUS.SHIPPED || 
                    order.status === ORDER_STATUS.IN_TRANSIT || 
                    order.status === ORDER_STATUS.OUT_FOR_DELIVERY || 
                    order.status === ORDER_STATUS.DELIVERED
                      ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <SearchIcon className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900">Vendor Verifying</span>
                      <span className="text-sm text-gray-500">
                        {order.status === ORDER_STATUS.PENDING ? 'In Progress' : 'Completed'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.status === ORDER_STATUS.PENDING 
                        ? 'Vendor is reviewing your order' 
                        : 'Vendor has accepted your order'
                      }
                    </p>
                  </div>
                </div>

                {/* Order Accepted */}
                {order.status !== ORDER_STATUS.PENDING && (
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      order.status === ORDER_STATUS.CONFIRMED || 
                      order.status === ORDER_STATUS.PROCESSING || 
                      order.status === ORDER_STATUS.SHIPPED || 
                      order.status === ORDER_STATUS.IN_TRANSIT || 
                      order.status === ORDER_STATUS.OUT_FOR_DELIVERY || 
                      order.status === ORDER_STATUS.DELIVERED
                        ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Order Accepted</span>
                        <span className="text-sm text-gray-500">Completed</span>
                      </div>
                      <p className="text-sm text-gray-600">Vendor has accepted your order</p>
                    </div>
                  </div>
                )}

                {/* Payment Required */}
                {order.status === ORDER_STATUS.CONFIRMED && (
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-yellow-500" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Payment Required</span>
                        <span className="text-sm text-gray-500">Pending</span>
                      </div>
                      <p className="text-sm text-gray-600">Please complete payment to proceed with your order</p>
                    </div>
                  </div>
                )}

                {/* Payment Done */}
                {(order.status === ORDER_STATUS.PROCESSING || 
                  order.status === ORDER_STATUS.SHIPPED || 
                  order.status === ORDER_STATUS.IN_TRANSIT || 
                  order.status === ORDER_STATUS.OUT_FOR_DELIVERY || 
                  order.status === ORDER_STATUS.DELIVERED) && (
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Payment Done</span>
                        <span className="text-sm text-gray-500">Completed</span>
                      </div>
                      <p className="text-sm text-gray-600">Payment has been processed successfully</p>
                    </div>
                  </div>
                )}

                {/* Order Confirmed */}
                {(order.status === ORDER_STATUS.PROCESSING || 
                  order.status === ORDER_STATUS.SHIPPED || 
                  order.status === ORDER_STATUS.IN_TRANSIT || 
                  order.status === ORDER_STATUS.OUT_FOR_DELIVERY || 
                  order.status === ORDER_STATUS.DELIVERED) && (
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <CircleCheck className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Order Confirmed</span>
                        <span className="text-sm text-gray-500">Completed</span>
                      </div>
                      <p className="text-sm text-gray-600">Your order is confirmed and being prepared</p>
                    </div>
                  </div>
                )}

                {/* Shipped */}
                {(order.status === ORDER_STATUS.SHIPPED || 
                  order.status === ORDER_STATUS.IN_TRANSIT || 
                  order.status === ORDER_STATUS.OUT_FOR_DELIVERY || 
                  order.status === ORDER_STATUS.DELIVERED) && (
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Package2 className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Shipped</span>
                        <span className="text-sm text-gray-500">Completed</span>
                      </div>
                      <p className="text-sm text-gray-600">Your order has been shipped from the warehouse</p>
                    </div>
                  </div>
                )}

                {/* In Transit */}
                {(order.status === ORDER_STATUS.IN_TRANSIT || 
                  order.status === ORDER_STATUS.OUT_FOR_DELIVERY || 
                  order.status === ORDER_STATUS.DELIVERED) && (
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <TruckIcon className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">In Transit</span>
                        <span className="text-sm text-gray-500">Completed</span>
                      </div>
                      <p className="text-sm text-gray-600">Your order is on the way to your location</p>
                    </div>
                  </div>
                )}

                {/* Out for Delivery */}
                {(order.status === ORDER_STATUS.OUT_FOR_DELIVERY || 
                  order.status === ORDER_STATUS.DELIVERED) && (
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Out for Delivery</span>
                        <span className="text-sm text-gray-500">Completed</span>
                      </div>
                      <p className="text-sm text-gray-600">Your order is out for delivery today</p>
                    </div>
                  </div>
                )}

                {/* Delivered */}
                {order.status === ORDER_STATUS.DELIVERED && (
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Delivered</span>
                        <span className="text-sm text-gray-500">Completed</span>
                      </div>
                      <p className="text-sm text-gray-600">Your order has been delivered successfully</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {(displayOrder.items || []).map((item, index) => {
                  // Handle both local order format and API response format
                  const itemName = item.name || item.itemCode?.itemDescription || 'Product'
                  const itemImage = item.image || item.itemCode?.primaryImage || '/placeholder-image.jpg'
                  const itemQuantity = item.quantity || item.qty || 1
                  const itemPrice = item.currentPrice || item.price || item.unitPrice || 0
                  const totalCost = item.totalCost || (itemPrice * itemQuantity)
                  
                  return (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={itemImage}
                        alt={itemName}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{itemName}</h4>
                        <p className="text-sm text-gray-500">Qty: {itemQuantity}</p>
                        {item.itemCode?.formattedItemCode && (
                          <p className="text-xs text-gray-400">Code: {item.itemCode.formattedItemCode}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{totalCost.toLocaleString()}
                        </p>
                        {item.unitPrice && (
                          <p className="text-xs text-gray-500">₹{item.unitPrice.toLocaleString()} each</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Customer & Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {displayOrder.customerInfo?.name || displayOrder.custUserId?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {displayOrder.customerInfo?.phone || displayOrder.custUserId?.phone || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {displayOrder.customerInfo?.email || displayOrder.custUserId?.email || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {displayOrder.deliveryAddress || displayOrder.deliveryAddress?.address || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {displayOrder.deliveryPincode || displayOrder.deliveryAddress?.pincode || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Est. Delivery: {formatDate(displayOrder.estimatedDelivery || displayOrder.deliveryExpectedDate)}
                    </span>
                  </div>
                  {displayOrder.receiverMobileNum && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Receiver: {displayOrder.receiverMobileNum}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment & Total */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    ₹{(displayOrder.totalAmount || displayOrder.subTotal || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charges:</span>
                  <span className="font-medium">
                    ₹{(displayOrder.deliveryCharges || displayOrder.deliveryCost || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">
                    ₹{(displayOrder.taxAmount || displayOrder.tax || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="font-semibold text-gray-900">
                    ₹{(displayOrder.finalAmount || displayOrder.totalAmount || displayOrder.grandTotal || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">
                    {displayOrder.paymentMethod || displayOrder.paymentType || 'N/A'}
                  </span>
                </div>
                {displayOrder.paymentStatus && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`font-medium ${
                      displayOrder.paymentStatus === 'completed' ? 'text-green-600' : 
                      displayOrder.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {displayOrder.paymentStatus}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track your orders and manage your purchases</p>
        </div>

        {/* Order Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statusFilters.slice(0, 4).map(filter => {
            const Icon = filter.icon
            const colorMap = {
              blue: 'from-blue-500 to-blue-600',
              yellow: 'from-yellow-500 to-yellow-600',
              green: 'from-green-500 to-green-600',
              red: 'from-red-500 to-red-600'
            }
            return (
              <div key={filter.value} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${colorMap[filter.color] || 'from-gray-500 to-gray-600'} rounded-full flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{filter.count}</p>
                    <p className="text-sm text-gray-600">{filter.label}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {statusFilters.map(filter => {
                const Icon = filter.icon
                const isActive = selectedStatus === filter.value
                return (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedStatus(filter.value)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{filter.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {filter.count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search your orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-700" />
              <p className="text-gray-600">Loading orders...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No orders found' : 'No orders yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'No orders match your search criteria. Try adjusting your search terms.' 
                  : 'You haven\'t placed any orders yet. Start shopping to see your orders here!'
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => navigate('/products')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Start Shopping
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </div>
  )
}

export default OrdersPage
