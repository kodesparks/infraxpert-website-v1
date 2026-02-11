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
  User,
  Package2,
  CircleCheck,
  CircleX,
  CircleAlert
} from 'lucide-react'
import { useOrders, ORDER_STATUS, ORDER_STATUS_INFO } from '@/contexts/OrdersContext'
import * as orderService from '@/services/order'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import AddressChangeModal from '@/components/AddressChangeModal'
import DeliveryDateChangeModal from '@/components/DeliveryDateChangeModal'
import ChangeHistory from '@/components/ChangeHistory'
import CountdownTimer from '@/components/CountdownTimer'

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
  const [mobileTrackingOrder, setMobileTrackingOrder] = useState(null)
  const [showMobileOrderFlow, setShowMobileOrderFlow] = useState(false)
  
  // Change functionality state
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showDateModal, setShowDateModal] = useState(false)
  const [changeEligibility, setChangeEligibility] = useState(null)
  const [isLoadingEligibility, setIsLoadingEligibility] = useState(false)
  const [pdfLoading, setPdfLoading] = useState({ quote: null, salesOrder: null, invoice: null, ewaybill: null })
  // Order flow (live): place order → vendor accept → order confirmed (Quote created & emailed) → payment done (SO created & emailed) → later Invoice.
  // Order response includes zohoQuoteId, zohoSalesOrderId, zohoInvoiceId when set. APIs unchanged; backend tested with npm run test:zoho-flow.
  // At a time show only one PDF: Quote at Order Accepted; once Sales Order comes, show only Sales Order; at delivery show only Invoice + E-way.
  const isOrderPlacedOnly = (status) => status === ORDER_STATUS.ORDER_PLACED
  const isOrderAcceptedOrLater = (status) => status && status !== ORDER_STATUS.PENDING && status !== ORDER_STATUS.ORDER_PLACED
  const isDeliveryStage = (status) => [ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.DELIVERED].includes(status)
  // Quote only when Order Accepted (vendor_accepted); hide once order_confirmed / payment_done / etc.
  const isQuoteAvailable = (status) => status === ORDER_STATUS.CONFIRMED
  // Sales Order only when order confirmed or payment done (not vendor_accepted, not delivery); hide Quote when this shows.
  const isSalesOrderAvailable = (status) => [ORDER_STATUS.ORDER_CONFIRMED, ORDER_STATUS.PROCESSING, ORDER_STATUS.TRUCK_LOADING, ORDER_STATUS.SHIPPED].includes(status)

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

  // Customer-focused status filters - properly mapped to API statuses
  const statusFilters = [
    { value: 'all', label: 'All Orders', count: stats.total, icon: Package, color: 'blue' },
    { value: ORDER_STATUS.ORDER_PLACED, label: 'Order Placed', count: stats.orderPlaced, icon: Package, color: 'orange' },
    { value: ORDER_STATUS.CONFIRMED, label: 'Order Accepted', count: stats.confirmed, icon: CheckCircle, color: 'blue' },
    { value: ORDER_STATUS.PROCESSING, label: 'Payment Done', count: stats.processing, icon: RefreshCw, color: 'purple' },
    { value: ORDER_STATUS.ORDER_CONFIRMED, label: 'Order Confirmed', count: stats.orderConfirmed, icon: CheckCircle, color: 'green' },
    { value: ORDER_STATUS.TRUCK_LOADING, label: 'Loading', count: stats.truckLoading, icon: Truck, color: 'orange' },
    { value: ORDER_STATUS.SHIPPED, label: 'Dispatched', count: stats.shipped, icon: Package, color: 'indigo' },
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
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      red: 'bg-red-100 text-red-800 border-red-200'
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

  // Handle track order
  const handleTrackOrder = (order) => {
    navigate(`/orders/track/${order.id}`)
  }

  // Check if order can be tracked (order_confirmed onwards)
  const canTrackOrder = (status) => {
    const trackableStatuses = [
      ORDER_STATUS.ORDER_CONFIRMED,
      ORDER_STATUS.TRUCK_LOADING,
      ORDER_STATUS.IN_TRANSIT,
      ORDER_STATUS.SHIPPED,
      ORDER_STATUS.OUT_FOR_DELIVERY,
      ORDER_STATUS.DELIVERED
    ]
    return trackableStatuses.includes(status)
  }

  // Load detailed order information (order + deliveryInfo + paymentInfo from API)
  const loadOrderDetails = async (orderId) => {
    setIsLoadingDetails(true)
    try {
      const response = await orderService.getOrderDetails(orderId)
      if (response && response.order) {
        setOrderDetails({
          ...response.order,
          deliveryInfo: response.deliveryInfo ?? null,
          paymentInfo: response.paymentInfo ?? null
        })
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
    // Check change eligibility
    await checkChangeEligibility(order.leadId || order.id || order.orderNumber)
  }

  // Check if order is eligible for changes
  const checkChangeEligibility = async (leadId) => {
    try {
      setIsLoadingEligibility(true)
      const response = await orderService.checkChangeEligibility(leadId)
      setChangeEligibility(response)
    } catch (error) {
      console.error('Error checking change eligibility:', error)
      setChangeEligibility(null)
    } finally {
      setIsLoadingEligibility(false)
    }
  }

  // Handle address change success
  const handleAddressChangeSuccess = (message) => {
    // Refresh order details
    if (selectedOrder) {
      loadOrderDetails(selectedOrder.id)
      checkChangeEligibility(selectedOrder.leadId || selectedOrder.id || selectedOrder.orderNumber)
    }
    // You can add a toast notification here
    console.log('Success:', message)
  }

  // Handle delivery date change success
  const handleDateChangeSuccess = (message) => {
    // Refresh order details
    if (selectedOrder) {
      loadOrderDetails(selectedOrder.id)
      checkChangeEligibility(selectedOrder.leadId || selectedOrder.id || selectedOrder.orderNumber)
    }
    // You can add a toast notification here
    console.log('Success:', message)
  }

  const getLeadId = (order) => order?.leadId || order?.id || order?.orderNumber

  const handleDownloadPdf = async (order, type) => {
    const leadId = getLeadId(order)
    if (!leadId) return
    const keyMap = { quote: 'quote', 'sales-order': 'salesOrder', invoice: 'invoice', ewaybill: 'ewaybill' }
    const key = keyMap[type] || type
    setPdfLoading(prev => ({ ...prev, [key]: leadId }))
    try {
      let blob
      const nameMap = {
        quote: `quote-${leadId}.pdf`,
        'sales-order': `sales-order-${leadId}.pdf`,
        invoice: `invoice-${leadId}.pdf`,
        ewaybill: `ewaybill-${leadId}.pdf`
      }
      if (type === 'quote') blob = await orderService.getQuotePdf(leadId)
      else if (type === 'sales-order') blob = await orderService.getSalesOrderPdf(leadId)
      else if (type === 'invoice') blob = await orderService.getInvoicePdf(leadId)
      else if (type === 'ewaybill') blob = await orderService.getEwaybillPdf(leadId)
      else return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = nameMap[type] || `${type}-${leadId}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      let message = err.response?.data?.message
      if (typeof message !== 'string' && err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text()
          const json = JSON.parse(text)
          message = json.message
        } catch (_) {}
      }
      if (type === 'quote') {
        const status = order?.orderStatus ?? order?.status
        const isOrderPlacedOrPending = status === ORDER_STATUS.ORDER_PLACED || status === ORDER_STATUS.PENDING || status === 'order_placed' || status === 'pending'
        toast.error(isOrderPlacedOrPending ? 'Quote is generated when the order is confirmed.' : (message || 'Quote not available; try again in a moment.'))
      } else if (message) {
        toast.error(message)
      } else {
        console.error(`Error downloading ${type} PDF:`, err)
      }
    } finally {
      setPdfLoading(prev => ({ ...prev, [key]: null }))
    }
  }

  const OrderTimeline = ({ order, baseOrder, variant = 'desktop' }) => {
    const timelineOrder = order || baseOrder
    if (!timelineOrder && !baseOrder) return null

    const currentStatus = timelineOrder?.status || baseOrder?.status
    const normalizedStatus = currentStatus || ORDER_STATUS.PENDING
    const orderDate = timelineOrder?.orderDate || baseOrder?.orderDate

    const isPendingStage = normalizedStatus === ORDER_STATUS.PENDING || normalizedStatus === ORDER_STATUS.ORDER_PLACED
    const showOrderAccepted = normalizedStatus && ![ORDER_STATUS.PENDING, ORDER_STATUS.ORDER_PLACED].includes(normalizedStatus)
    const showPaymentRequired = normalizedStatus === ORDER_STATUS.CONFIRMED
    const showPaymentDone = [
      ORDER_STATUS.PROCESSING,
      ORDER_STATUS.SHIPPED,
      ORDER_STATUS.IN_TRANSIT,
      ORDER_STATUS.OUT_FOR_DELIVERY,
      ORDER_STATUS.DELIVERED
    ].includes(normalizedStatus)
    const showOrderConfirmed = showPaymentDone
    const showShipped = [
      ORDER_STATUS.SHIPPED,
      ORDER_STATUS.IN_TRANSIT,
      ORDER_STATUS.OUT_FOR_DELIVERY,
      ORDER_STATUS.DELIVERED
    ].includes(normalizedStatus)
    const showInTransit = [
      ORDER_STATUS.IN_TRANSIT,
      ORDER_STATUS.OUT_FOR_DELIVERY,
      ORDER_STATUS.DELIVERED
    ].includes(normalizedStatus)
    const showOutForDelivery = [ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.DELIVERED].includes(normalizedStatus)
    const showDelivered = normalizedStatus === ORDER_STATUS.DELIVERED

    const stepCircleClass = (active) => `w-4 h-4 rounded-full ${active ? 'bg-green-500' : 'bg-gray-300'}`
    const badgeColorClasses = {
      current: 'bg-blue-100 text-blue-700',
      progress: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-orange-100 text-orange-700'
    }
    const circleColorClasses = {
      current: 'bg-blue-500',
      progress: 'bg-yellow-500',
      completed: 'bg-green-500',
      pending: 'bg-orange-500',
      upcoming: 'bg-gray-300'
    }

    const timelineSteps = [
      {
        key: 'orderPlaced',
        label: 'Order Placed',
        icon: Package,
        description: 'Your order has been received and is being processed',
        badgeLabel: isPendingStage ? 'Current' : 'Completed',
        badgeStatus: isPendingStage ? 'current' : 'completed',
        timestamp: orderDate ? formatDate(orderDate) : null
      },
      {
        key: 'vendorVerifying',
        label: 'Vendor Verifying',
        icon: SearchIcon,
        description: isPendingStage ? 'Vendor is reviewing your order' : 'Vendor has accepted your order',
        badgeLabel: isPendingStage ? 'In Progress' : 'Completed',
        badgeStatus: isPendingStage ? 'progress' : 'completed'
      }
    ]

    if (showOrderAccepted) {
      timelineSteps.push({
        key: 'orderAccepted',
        label: 'Order Accepted',
        icon: CheckCircle2,
        description: 'Vendor has accepted your order',
        badgeLabel: 'Completed',
        badgeStatus: 'completed'
      })
    }

    if (showPaymentRequired) {
      timelineSteps.push({
        key: 'paymentRequired',
        label: 'Payment Required',
        icon: CreditCard,
        description: 'Please complete payment to proceed with your order',
        badgeLabel: 'Pending',
        badgeStatus: 'pending'
      })
    }

    if (showPaymentDone) {
      timelineSteps.push({
        key: 'paymentDone',
        label: 'Payment Done',
        icon: CheckCircle,
        description: 'Payment has been processed successfully',
        badgeLabel: 'Completed',
        badgeStatus: 'completed'
      })
    }

    if (showOrderConfirmed) {
      timelineSteps.push({
        key: 'orderConfirmed',
        label: 'Order Confirmed',
        icon: CircleCheck,
        description: 'Your order is confirmed and being prepared',
        badgeLabel: 'Completed',
        badgeStatus: 'completed'
      })
    }

    if (showShipped) {
      timelineSteps.push({
        key: 'shipped',
        label: 'Shipped',
        icon: Package2,
        description: 'Your order has been shipped from the warehouse',
        badgeLabel: 'Completed',
        badgeStatus: 'completed'
      })
    }

    if (showInTransit) {
      timelineSteps.push({
        key: 'inTransit',
        label: 'In Transit',
        icon: TruckIcon,
        description: 'Your order is on the way to your location',
        badgeLabel: 'Completed',
        badgeStatus: 'completed'
      })
    }

    if (showOutForDelivery) {
      timelineSteps.push({
        key: 'outForDelivery',
        label: 'Out for Delivery',
        icon: Truck,
        description: 'Your order is out for delivery today',
        badgeLabel: 'Completed',
        badgeStatus: 'completed'
      })
    }

    if (showDelivered) {
      timelineSteps.push({
        key: 'delivered',
        label: 'Delivered',
        icon: CheckCircle,
        description: 'Your order has been delivered successfully',
        badgeLabel: 'Completed',
        badgeStatus: 'completed'
      })
    }

    if (variant === 'mobile') {
      return (
        <div className="space-y-4">
          {timelineSteps.map((step, index) => {
            const Icon = step.icon
            const badgeClass = badgeColorClasses[step.badgeStatus] || badgeColorClasses.completed
            const circleClass = circleColorClasses[step.badgeStatus] || circleColorClasses.completed

            return (
              <div key={step.key} className="relative pl-10">
                {index < timelineSteps.length - 1 && (
                  <div className="absolute left-4 top-4 w-0.5 h-[calc(100%-16px)] bg-gray-200" />
                )}
                <div className={`absolute left-2 top-3 w-4 h-4 rounded-full ${circleClass}`} />
                <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-900">{step.label}</span>
                    </div>
                    {step.badgeLabel && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${badgeClass}`}>
                        {step.badgeLabel}
                      </span>
                    )}
                  </div>
                  {step.timestamp && (
                    <p className="text-xs text-gray-500 mt-2">{step.timestamp}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className={stepCircleClass(true)} />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">Order Placed</span>
                {orderDate && <span className="text-sm text-gray-500">{formatDate(orderDate)}</span>}
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isPendingStage ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}
                >
                  {isPendingStage ? 'Current' : 'Completed'}
                </span>
              </div>
              <p className="text-sm text-gray-600">Your order has been received and is being processed</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className={stepCircleClass(!isPendingStage)} />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <SearchIcon className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">Vendor Verifying</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isPendingStage ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}
                >
                  {isPendingStage ? 'In Progress' : 'Completed'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {isPendingStage ? 'Vendor is reviewing your order' : 'Vendor has accepted your order'}
              </p>
            </div>
          </div>

          {showOrderAccepted && (
            <div className="flex items-center space-x-3">
              <div className={stepCircleClass(showOrderAccepted)} />
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

          {showPaymentRequired && (
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

          {showPaymentDone && (
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

          {showOrderConfirmed && (
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

          {showShipped && (
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

          {showInTransit && (
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

          {showOutForDelivery && (
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

          {showDelivered && (
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
    )
  }

  // Customer-friendly order card component
  const OrderCard = ({ order }) => {
    const statusInfo = ORDER_STATUS_INFO[order.status]
    const paymentStatus = order.paymentStatus || order.payment_status || ''
    const isPaymentPending = typeof paymentStatus === 'string' && paymentStatus.toLowerCase() === 'pending'
    const showPayNow = (order.status === ORDER_STATUS.CONFIRMED || isPaymentPending);
    // const custPaid = order.customerPaymentDetails?.utrNum
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-all duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate max-w-[160px] sm:max-w-[220px]">{order.orderNumber}</h3>
              <p className="text-xs text-gray-500 truncate max-w-[180px]">{formatDate(order.orderDate)}</p>
            </div>
          </div>
          
          <div className="text-right shrink-0">
            <button
              type="button"
              onClick={() => setMobileTrackingOrder(order)}
              className={`inline-flex sm:hidden items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${getStatusClasses(order.status)}`}
            >
              {statusInfo?.label}
            </button>
            <span className={`hidden sm:inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${getStatusClasses(order.status)}`}>
              {statusInfo?.label}
            </span>
          </div>
        </div>

        {/* Payment Required Alert */}
        {showPayNow && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-xs font-medium text-blue-800">Payment Pending</p>
                <p className="text-xs text-blue-600">Complete payment to confirm your order</p>
              </div>
              <Button
                onClick={() => handlePayment(order)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
              >
                <PaymentIcon className="w-3 h-3 mr-1" />
                Pay Now
              </Button>
            </div>
          </div>
        )}

        {/* Order Items Preview */}
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Items</h4>
          <div className="space-y-1">
            {(order.items || []).slice(0, 1).map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <img
                  src={item.image || '/placeholder-image.jpg'}
                  alt={item.name}
                  className="w-6 h-6 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate" title={item.name}>{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                </div>
                {/* Price hidden for now
                <p className="text-xs font-semibold text-gray-900">
                  ₹{((item.currentPrice || item.price || 0) * (item.quantity || 1)).toLocaleString()}
                </p>
                */}
              </div>
            ))}
            {(order.items || []).length > 1 && (
              <p className="text-xs text-gray-500 text-center py-1">
                +{(order.items || []).length - 1} more items
              </p>
            )}
          </div>
        </div>

        {/* Order Summary - price hidden for now
        <div className="bg-gray-50 rounded p-2 mb-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Total</span>
            <span className="text-sm font-bold text-gray-900">₹{(order.finalAmount || 0).toLocaleString()}</span>
          </div>
        </div>
        */}

        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => handleViewDetails(order)}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium transition-colors text-xs"
          >
            <Eye className="w-3 h-3" />
            <span>View</span>
          </button>
          
          <div className="flex flex-wrap gap-1">
            {canTrackOrder(order.status) && (
              <Button
                onClick={() => handleTrackOrder(order)}
                variant="outline"
                size="sm"
                className="text-xs px-2 py-1 h-6"
              >
                <TruckIcon className="w-3 h-3 mr-1" />
                Track
              </Button>
            )}
            {order.status === ORDER_STATUS.DELIVERED && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-green-200 text-green-600 hover:bg-green-50 px-2 py-1 h-6"
              >
                <Star className="w-3 h-3 mr-1" />
                Rate
              </Button>
            )}
            {/* Order Accepted only: Quote (remove once Sales Order available). */}
            {isQuoteAvailable(order.status) && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-gray-200 text-gray-600 hover:bg-gray-50 px-2 py-1 h-6"
                onClick={() => handleDownloadPdf(order, 'quote')}
                disabled={pdfLoading.quote === getLeadId(order)}
              >
                <Download className="w-3 h-3 mr-1" />
                {pdfLoading.quote === getLeadId(order) ? '…' : 'Quote'}
              </Button>
            )}
            {/* Order confirmed / payment: Sales Order only (no Quote). */}
            {isSalesOrderAvailable(order.status) && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-gray-200 text-gray-600 hover:bg-gray-50 px-2 py-1 h-6"
                onClick={() => handleDownloadPdf(order, 'sales-order')}
                disabled={pdfLoading.salesOrder === getLeadId(order)}
              >
                <Download className="w-3 h-3 mr-1" />
                {pdfLoading.salesOrder === getLeadId(order) ? '…' : 'Sales Order'}
              </Button>
            )}
            {/* Delivery only: Invoice + E-Way (no Quote, no Sales Order). */}
            {isDeliveryStage(order.status) && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-gray-200 text-gray-600 hover:bg-gray-50 px-2 py-1 h-6"
                  onClick={() => handleDownloadPdf(order, 'invoice')}
                  disabled={pdfLoading.invoice === getLeadId(order)}
                >
                  <Download className="w-3 h-3 mr-1" />
                  {pdfLoading.invoice === getLeadId(order) ? '…' : 'Invoice'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-gray-200 text-gray-600 hover:bg-gray-50 px-2 py-1 h-6"
                  onClick={() => handleDownloadPdf(order, 'ewaybill')}
                  disabled={pdfLoading.ewaybill === getLeadId(order)}
                >
                  <Download className="w-3 h-3 mr-1" />
                  {pdfLoading.ewaybill === getLeadId(order) ? '…' : 'E-way bill'}
                </Button>
              </>
            )}
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
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold text-gray-900 break-all">
                {displayOrder.orderNumber || displayOrder.formattedLeadId || displayOrder.leadId}
              </h2>
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
            <OrderTimeline order={displayOrder} baseOrder={order} />

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
                        {/* Price hidden for now
                        <p className="font-semibold text-gray-900">
                          ₹{totalCost.toLocaleString()}
                        </p>
                        {item.unitPrice && (
                          <p className="text-xs text-gray-500">₹{item.unitPrice.toLocaleString()} each</p>
                        )}
                        */}
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
                  {(orderDetails?.deliveryInfo?.userId?.name || 
                    displayOrder.customerInfo?.name || 
                    displayOrder.custUserId?.name) && (
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {orderDetails?.deliveryInfo?.userId?.name || 
                         displayOrder.customerInfo?.name || 
                         displayOrder.custUserId?.name}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {orderDetails?.deliveryInfo?.userId?.phone || 
                       displayOrder.custPhoneNum || 
                       displayOrder.customerInfo?.phone || 
                       displayOrder.custUserId?.phone || 
                       'N/A'}
                    </span>
                  </div>
                  {(orderDetails?.deliveryInfo?.userId?.email || 
                    displayOrder.customerInfo?.email || 
                    displayOrder.custUserId?.email) && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {orderDetails?.deliveryInfo?.userId?.email || 
                         displayOrder.customerInfo?.email || 
                         displayOrder.custUserId?.email}
                      </span>
                    </div>
                  )}
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

            {/* Delivery Tracking – driver, truck, etc. from API deliveryInfo */}
            {(displayOrder.deliveryInfo || displayOrder.delivery || orderDetails?.delivery) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Tracking</h3>
                {(() => {
                  const d = displayOrder.deliveryInfo || displayOrder.delivery || orderDetails?.delivery || {}
                  return (
                    <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        {d.driverName && (
                          <p className="text-sm text-gray-700"><span className="text-gray-500 font-medium">Driver:</span> {d.driverName}</p>
                        )}
                        {d.driverPhone && (
                          <p className="text-sm text-gray-700"><span className="text-gray-500 font-medium">Driver Phone:</span> {d.driverPhone}</p>
                        )}
                        {d.truckNumber && (
                          <p className="text-sm text-gray-700"><span className="text-gray-500 font-medium">Truck Number:</span> {d.truckNumber}</p>
                        )}
                        {d.vehicleType && (
                          <p className="text-sm text-gray-700"><span className="text-gray-500 font-medium">Vehicle Type:</span> {d.vehicleType}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        {(d.expectedDeliveryDate || d.estimatedArrival) && (
                          <p className="text-sm text-gray-700"><span className="text-gray-500 font-medium">Expected Delivery:</span> {formatDate(d.expectedDeliveryDate || d.estimatedArrival)}</p>
                        )}
                        {d.deliveryStatus && (
                          <p className="text-sm text-gray-700"><span className="text-gray-500 font-medium">Delivery Status:</span> {String(d.deliveryStatus).replace(/_/g, ' ')}</p>
                        )}
                        {d.lastLocation?.address && (
                          <p className="text-sm text-gray-700"><span className="text-gray-500 font-medium">Last Location:</span> {d.lastLocation.address}</p>
                        )}
                        {d.deliveryNotes && (
                          <p className="text-sm text-gray-700"><span className="text-gray-500 font-medium">Notes:</span> {d.deliveryNotes}</p>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* Payment Summary – from API paymentInfo when available */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {(displayOrder.paymentInfo?.paymentMethod ?? displayOrder.paymentMethod ?? displayOrder.paymentType) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">
                      {displayOrder.paymentInfo?.paymentMode ?? displayOrder.paymentInfo?.paymentMethod ?? displayOrder.paymentMethod ?? displayOrder.paymentType}
                    </span>
                  </div>
                )}
                {(displayOrder.paymentInfo?.paymentStatus != null || displayOrder.paymentStatus) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`font-medium ${
                      (displayOrder.paymentInfo?.paymentStatus ?? displayOrder.paymentStatus) === 'completed' ? 'text-green-600' : 
                      (displayOrder.paymentInfo?.paymentStatus ?? displayOrder.paymentStatus) === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {String(displayOrder.paymentInfo?.paymentStatus ?? displayOrder.paymentStatus ?? '—').replace(/_/g, ' ')}
                    </span>
                  </div>
                )}
                {displayOrder.paymentInfo?.utrNum && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">UTR Number:</span>
                    <span className="font-medium">{displayOrder.paymentInfo.utrNum}</span>
                  </div>
                )}
                {displayOrder.paymentInfo?.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium">{displayOrder.paymentInfo.transactionId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Documents: Show only one PDF at a time. Order Accepted = Quote only; order confirmed/payment = Sales Order only; delivery = Invoice + E-way only. */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
              <div className="flex flex-wrap gap-3">
                {/* Order Accepted only: Quote */}
                {isQuoteAvailable(displayOrder.status) && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleDownloadPdf(order, 'quote')}
                    disabled={pdfLoading.quote === getLeadId(order)}
                  >
                    <Download className="w-4 h-4" />
                    {pdfLoading.quote === getLeadId(order) ? 'Downloading…' : 'Download Quote'}
                  </Button>
                )}
                {/* Step 4: Download Sales Order (Zoho SO created at payment_done) */}
                {isSalesOrderAvailable(displayOrder.status) && !isDeliveryStage(displayOrder.status) && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleDownloadPdf(order, 'sales-order')}
                    disabled={pdfLoading.salesOrder === getLeadId(order)}
                  >
                    <Download className="w-4 h-4" />
                    {pdfLoading.salesOrder === getLeadId(order) ? 'Downloading…' : 'Sales Order (PDF)'}
                  </Button>
                )}
                {/* Delivery only: Invoice + E-Way */}
                {isDeliveryStage(displayOrder.status) && (
                  <>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => handleDownloadPdf(order, 'invoice')}
                      disabled={pdfLoading.invoice === getLeadId(order)}
                    >
                      <Download className="w-4 h-4" />
                      {pdfLoading.invoice === getLeadId(order) ? 'Downloading…' : 'Invoice (PDF)'}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => handleDownloadPdf(order, 'ewaybill')}
                      disabled={pdfLoading.ewaybill === getLeadId(order)}
                    >
                      <Download className="w-4 h-4" />
                      {pdfLoading.ewaybill === getLeadId(order) ? 'Downloading…' : 'E-way bill (PDF)'}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Change Functionality – hidden once truck_loading or later (can't change delivery date) */}
            {changeEligibility && (() => {
              const orderStatus = displayOrder.orderStatus ?? displayOrder.status
              const noLongerAllowChanges = [
                ORDER_STATUS.TRUCK_LOADING,
                ORDER_STATUS.SHIPPED,
                ORDER_STATUS.IN_TRANSIT,
                ORDER_STATUS.OUT_FOR_DELIVERY,
                ORDER_STATUS.DELIVERED
              ].includes(orderStatus)
              if (noLongerAllowChanges) return null
              return (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Modifications</h3>
                  <CountdownTimer 
                    orderPlacedAt={changeEligibility.order?.orderPlacedAt} 
                    timeWindowHours={48}
                  />
                  {changeEligibility.order?.canMakeChanges && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <Button
                        onClick={() => setShowAddressModal(true)}
                        variant="outline"
                        className="flex items-center justify-center space-x-2 p-4 h-auto"
                      >
                        <MapPin className="w-4 h-4" />
                        <div className="text-left">
                          <div className="font-medium">Change Address</div>
                          <div className="text-xs text-gray-500">Update delivery location</div>
                        </div>
                      </Button>
                      <Button
                        onClick={() => setShowDateModal(true)}
                        variant="outline"
                        className="flex items-center justify-center space-x-2 p-4 h-auto"
                      >
                        <Calendar className="w-4 h-4" />
                        <div className="text-left">
                          <div className="font-medium">Change Delivery Date</div>
                          <div className="text-xs text-gray-500">Update preferred date</div>
                        </div>
                      </Button>
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Change History</h4>
                    <ChangeHistory 
                      addressChanges={changeEligibility.order?.addressChangeHistory || []}
                      deliveryDateChanges={changeEligibility.order?.deliveryDateChangeHistory || []}
                    />
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </div>
    )
  }

  const MobileTrackingModal = ({ order, onClose }) => {
    if (!order) return null

    const statusInfo = ORDER_STATUS_INFO[order.status]

    return (
      <div className="fixed inset-0 z-50 flex sm:hidden items-end bg-black/60 backdrop-blur-sm">
        <div className="w-full bg-white rounded-t-3xl shadow-2xl p-5 max-h-[80vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs uppercase text-gray-500 tracking-wide">Current Status</p>
              <div className="mt-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                {statusInfo?.label || 'Unknown'}
              </div>
              <p className="text-sm text-gray-500 mt-2">Tap through to view each step of your order</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <OrderTimeline order={order} variant="mobile" />
          </div>
        </div>
      </div>
    )
  }

  const MobileOrderFlowModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null

    const interactiveFilters = statusFilters.filter(filter => filter.value !== ORDER_STATUS.CANCELLED)
    const cancelledFilter = statusFilters.find(filter => filter.value === ORDER_STATUS.CANCELLED)

    const handleSelect = (status) => {
      setSelectedStatus(status)
      onClose()
    }

    const renderFilterButton = (filter, colorClasses) => {
      const Icon = filter.icon
      const isActive = selectedStatus === filter.value

      return (
        <button
          key={filter.value}
          type="button"
          onClick={() => handleSelect(filter.value)}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
            isActive
              ? `${colorClasses.activeBg} ${colorClasses.activeBorder} ${colorClasses.activeText}`
              : 'bg-white border-gray-200 text-gray-700'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                isActive ? colorClasses.iconActiveBg : 'bg-gray-100'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? colorClasses.iconActiveText : 'text-gray-500'
                }`}
              />
            </div>
            <div className="text-left min-w-0">
              <p className="text-sm font-semibold truncate">{filter.label}</p>
              <p className="text-xs text-gray-500">Tap to view orders</p>
            </div>
          </div>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              isActive ? colorClasses.badgeActiveBg : 'bg-gray-100 text-gray-600'
            }`}
          >
            {filter.count}
          </span>
        </button>
      )
    }

    const colorMap = {
      blue: {
        activeBg: 'bg-blue-50',
        activeBorder: 'border-blue-200',
        activeText: 'text-blue-700',
        iconActiveBg: 'bg-blue-600',
        iconActiveText: 'text-white',
        badgeActiveBg: 'bg-blue-100 text-blue-700'
      },
      yellow: {
        activeBg: 'bg-yellow-50',
        activeBorder: 'border-yellow-200',
        activeText: 'text-yellow-700',
        iconActiveBg: 'bg-yellow-500',
        iconActiveText: 'text-white',
        badgeActiveBg: 'bg-yellow-100 text-yellow-700'
      },
      orange: {
        activeBg: 'bg-orange-50',
        activeBorder: 'border-orange-200',
        activeText: 'text-orange-700',
        iconActiveBg: 'bg-orange-500',
        iconActiveText: 'text-white',
        badgeActiveBg: 'bg-orange-100 text-orange-700'
      },
      green: {
        activeBg: 'bg-green-50',
        activeBorder: 'border-green-200',
        activeText: 'text-green-700',
        iconActiveBg: 'bg-green-500',
        iconActiveText: 'text-white',
        badgeActiveBg: 'bg-green-100 text-green-700'
      },
      purple: {
        activeBg: 'bg-purple-50',
        activeBorder: 'border-purple-200',
        activeText: 'text-purple-700',
        iconActiveBg: 'bg-purple-500',
        iconActiveText: 'text-white',
        badgeActiveBg: 'bg-purple-100 text-purple-700'
      },
      indigo: {
        activeBg: 'bg-indigo-50',
        activeBorder: 'border-indigo-200',
        activeText: 'text-indigo-700',
        iconActiveBg: 'bg-indigo-500',
        iconActiveText: 'text-white',
        badgeActiveBg: 'bg-indigo-100 text-indigo-700'
      },
      red: {
        activeBg: 'bg-red-50',
        activeBorder: 'border-red-200',
        activeText: 'text-red-700',
        iconActiveBg: 'bg-red-500',
        iconActiveText: 'text-white',
        badgeActiveBg: 'bg-red-100 text-red-700'
      }
    }

    return (
      <div className="fixed inset-0 z-50 flex lg:hidden items-end bg-black/60 backdrop-blur-sm">
        <div className="w-full bg-white rounded-t-3xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase text-gray-500 tracking-wide">Order Flow</p>
              <h3 className="mt-1 text-lg font-semibold text-gray-900">Choose Order Status</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {interactiveFilters
              .filter(filter => filter.value !== 'all')
              .map(filter =>
                renderFilterButton(filter, colorMap[filter.color] || colorMap.blue)
              )}

            {cancelledFilter && renderFilterButton(cancelledFilter, colorMap.red)}

            {statusFilters
              .filter(filter => filter.value === 'all')
              .map(filter =>
                renderFilterButton(filter, colorMap.blue)
              )}
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

        {/* Mobile Search & Order Flow CTA */}
        <div className="lg:hidden mb-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Search Orders</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search your orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <Button
            onClick={() => setShowMobileOrderFlow(true)}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <TruckIcon className="w-4 h-4" />
            View Order Flow
          </Button>
        </div>

        {/* Order Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statusFilters.slice(0, 4).map(filter => {
            const Icon = filter.icon
            const colorMap = {
              blue: 'from-blue-500 to-blue-600',
              yellow: 'from-yellow-500 to-yellow-600',
              orange: 'from-orange-500 to-orange-600',
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

        {/* Two Column Layout: Order Flow (30%) + Orders (70%) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Left Sidebar: Order Flow & Search (30%) */}
          <div className="lg:col-span-3 hidden lg:block">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
              {/* Search Bar */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Search Orders</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search your orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Order Flow Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Order Flow</h3>
                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Status Points */}
                  <div className="space-y-5">
                    {statusFilters
                      .filter(f => f.value !== 'all' && f.value !== ORDER_STATUS.CANCELLED)
                      .map((filter, index, arr) => {
                        const Icon = filter.icon
                        const isActive = selectedStatus === filter.value
                        // Check if this status should show as completed (any order at this status)
                        const hasOrders = filter.count > 0
                        
                        // Determine line color - green if active or has orders
                        const lineColor = isActive || hasOrders ? 'bg-green-500' : 'bg-gray-200'
                        
                        return (
                          <div key={filter.value} className="relative flex items-center">
                            {/* Status Circle */}
                            <button
                              onClick={() => setSelectedStatus(filter.value)}
                              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                                isActive
                                  ? 'bg-green-500 border-green-600 shadow-lg scale-110'
                                  : hasOrders
                                  ? 'bg-green-500 border-green-600'
                                  : 'bg-white border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${
                                isActive || hasOrders ? 'text-white' : 'text-gray-400'
                              }`} />
                            </button>
                            
                            {/* Status Label */}
                            <div 
                              className={`ml-3 flex-1 flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                                isActive
                                  ? 'bg-green-50 border-2 border-green-200'
                                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                              }`}
                              onClick={() => setSelectedStatus(filter.value)}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`font-medium text-xs truncate ${
                                  isActive ? 'text-green-700' : hasOrders ? 'text-gray-700' : 'text-gray-500'
                                }`}>
                                  {filter.label}
                                </span>
                                {isActive && (
                                  <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full whitespace-nowrap">
                                    Current
                                  </span>
                                )}
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ml-2 shrink-0 ${
                                isActive
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {filter.count}
                              </span>
                            </div>
                            
                            {/* Connecting Line */}
                            {index < arr.length - 1 && (
                              <div className={`absolute left-5 top-10 w-0.5 h-5 ${lineColor} transition-colors duration-200`}></div>
                            )}
                          </div>
                        )
                      })}
                    
                    {/* Cancelled Status - Separate */}
                    {(() => {
                      const cancelledFilter = statusFilters.find(f => f.value === ORDER_STATUS.CANCELLED)
                      if (!cancelledFilter) return null
                      
                      return (
                        <div className="relative flex items-center pt-4 border-t border-gray-200">
                          <button
                            onClick={() => setSelectedStatus(ORDER_STATUS.CANCELLED)}
                            className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                              selectedStatus === ORDER_STATUS.CANCELLED
                                ? 'bg-red-500 border-red-600 shadow-lg scale-110'
                                : 'bg-white border-gray-300 hover:border-red-300'
                            }`}
                          >
                            <XCircle className={`w-4 h-4 ${
                              selectedStatus === ORDER_STATUS.CANCELLED ? 'text-white' : 'text-gray-400'
                            }`} />
                          </button>
                          <div 
                            className={`ml-3 flex-1 flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                              selectedStatus === ORDER_STATUS.CANCELLED
                                ? 'bg-red-50 border-2 border-red-200'
                                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                            }`}
                            onClick={() => setSelectedStatus(ORDER_STATUS.CANCELLED)}
                          >
                            <span className={`font-medium text-xs ${
                              selectedStatus === ORDER_STATUS.CANCELLED ? 'text-red-700' : 'text-gray-500'
                            }`}>
                              {cancelledFilter.label}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ml-2 shrink-0 ${
                              selectedStatus === ORDER_STATUS.CANCELLED
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {cancelledFilter.count}
                            </span>
                          </div>
                        </div>
                      )
                    })()}
                    
                    {/* All Orders Button */}
                    {(() => {
                      const allFilter = statusFilters.find(f => f.value === 'all')
                      if (!allFilter) return null
                      
                      return (
                        <div className="relative flex items-center pt-4 border-t border-gray-200">
                          <button
                            onClick={() => setSelectedStatus('all')}
                            className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                              selectedStatus === 'all'
                                ? 'bg-blue-500 border-blue-600 shadow-lg scale-110'
                                : 'bg-white border-gray-300 hover:border-blue-300'
                            }`}
                          >
                            <Package className={`w-4 h-4 ${
                              selectedStatus === 'all' ? 'text-white' : 'text-gray-400'
                            }`} />
                          </button>
                          <div 
                            className={`ml-3 flex-1 flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                              selectedStatus === 'all'
                                ? 'bg-blue-50 border-2 border-blue-200'
                                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                            }`}
                            onClick={() => setSelectedStatus('all')}
                          >
                            <span className={`font-medium text-xs ${
                              selectedStatus === 'all' ? 'text-blue-700' : 'text-gray-500'
                            }`}>
                              {allFilter.label}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ml-2 shrink-0 ${
                              selectedStatus === 'all'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {allFilter.count}
                            </span>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content: Orders List (70%) */}
          <div className="lg:col-span-7">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}

        {/* Address Change Modal */}
        <AddressChangeModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          order={selectedOrder}
          onSuccess={handleAddressChangeSuccess}
        />

        {/* Delivery Date Change Modal */}
        <DeliveryDateChangeModal
          isOpen={showDateModal}
          onClose={() => setShowDateModal(false)}
          order={selectedOrder}
          onSuccess={handleDateChangeSuccess}
        />

        <MobileOrderFlowModal
          isOpen={showMobileOrderFlow}
          onClose={() => setShowMobileOrderFlow(false)}
        />

        {mobileTrackingOrder && (
          <MobileTrackingModal
            order={mobileTrackingOrder}
            onClose={() => setMobileTrackingOrder(null)}
          />
        )}
      </div>
    </div>
  )
}

export default OrdersPage
