import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Home,
  XCircle,
  ArrowLeft,
  MapPin,
  Phone,
  Building2,
  CreditCard,
  Calendar,
  TruckIcon,
  PackageCheck,
  PackageX
} from 'lucide-react'
import * as orderService from '@/services/order'

// Complete order journey steps in sequence
const ORDER_JOURNEY = [
  { status: 'pending', label: 'Order Placed', icon: Package },
  { status: 'vendor_accepted', label: 'Order Accepted by Vendor', icon: CheckCircle2 },
  { status: 'payment_done', label: 'Payment Completed', icon: CreditCard },
  { status: 'order_confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
  { status: 'truck_loading', label: 'Loading for Dispatch', icon: TruckIcon },
  { status: 'in_transit', label: 'In Transit', icon: Truck },
  { status: 'shipped', label: 'Shipped', icon: Package },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: Home },
  { status: 'delivered', label: 'Delivered', icon: PackageCheck }
]

// Status configuration with icons and colors
const STATUS_CONFIG = {
  pending: {
    label: 'Order Placed',
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Your order has been placed and is waiting for vendor confirmation.'
  },
  vendor_accepted: {
    label: 'Order Accepted by Vendor',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: 'Vendor has accepted your order and will process it soon.'
  },
  payment_done: {
    label: 'Payment Completed',
    icon: CreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Payment has been received and verified.'
  },
  order_confirmed: {
    label: 'Order Confirmed',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: 'Your order is confirmed and being prepared for dispatch.'
  },
  truck_loading: {
    label: 'Loading for Dispatch',
    icon: TruckIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    description: 'Your order is being loaded for dispatch.',
    animated: true
  },
  in_transit: {
    label: 'In Transit',
    icon: Truck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Your order is on the way to the delivery location.',
    animated: true
  },
  shipped: {
    label: 'Shipped',
    icon: Package,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    description: 'Your order has been shipped and is in transit.'
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    icon: Home,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    description: 'Your order is out for delivery and will reach you soon.',
    animated: true
  },
  delivered: {
    label: 'Delivered',
    icon: PackageCheck,
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    description: 'Your order has been delivered successfully.'
  },
  cancelled: {
    label: 'Cancelled',
    icon: PackageX,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: 'This order has been cancelled.'
  }
}

const OrderTrackingPage = () => {
  const { leadId } = useParams()
  const navigate = useNavigate()
  const [tracking, setTracking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTrackingInfo()
  }, [leadId])

  const loadTrackingInfo = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await orderService.getOrderTracking(leadId)
      setTracking(response.tracking)
    } catch (err) {
      console.error('Error loading tracking info:', err)
      setError('Failed to load tracking information. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Tracking</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={loadTrackingInfo} className="mr-2">
            Try Again
          </Button>
          <Button onClick={() => navigate('/orders')} variant="outline">
            Back to Orders
          </Button>
        </Card>
      </div>
    )
  }

  if (!tracking) {
    return null
  }

  const currentStatusConfig = STATUS_CONFIG[tracking.currentStatus?.status] || STATUS_CONFIG.pending
  const CurrentIcon = currentStatusConfig.icon
  const isAnimated = currentStatusConfig.animated

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button 
          onClick={() => navigate('/orders')} 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Button>

        {/* Order Header */}
        <Card className="mb-6 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {tracking.order?.formattedLeadId || `Order #${leadId}`}
              </h1>
              <p className="text-gray-600">
                Order Total: ₹{(tracking.order?.totalAmount || 0).toLocaleString()}
              </p>
            </div>
            {tracking.canCancel && (
              <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                Cancel Order
              </Button>
            )}
          </div>
        </Card>

        {/* Current Status - Large Banner */}
        <Card className={`mb-6 p-8 border-2 ${currentStatusConfig.borderColor} ${currentStatusConfig.bgColor}`}>
          <div className="flex flex-col items-center text-center">
            <div className={`mb-4 ${isAnimated ? 'animate-bounce' : ''}`}>
              <CurrentIcon className={`w-20 h-20 ${currentStatusConfig.color}`} />
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${currentStatusConfig.color}`}>
              {currentStatusConfig.label}
            </h2>
            <p className="text-gray-700 text-lg mb-2">
              {currentStatusConfig.description}
            </p>
            {tracking.currentStatus?.lastUpdated && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Updated: {new Date(tracking.currentStatus.lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
        </Card>

        {/* Truck Loading Animation - Special Case */}
        {tracking.currentStatus?.status === 'truck_loading' && (
          <Card className="mb-6 p-6 bg-gradient-to-r from-orange-50 to-yellow-50">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Loading in Progress</h3>
              <div className="flex items-center justify-center gap-4 mb-4">
                {/* Animated Truck */}
                <div className="relative">
                  <TruckIcon className="w-16 h-16 text-orange-600 animate-pulse" />
                  <div className="absolute -top-2 -right-2">
                    <Package className="w-8 h-8 text-orange-500 animate-bounce" />
                  </div>
                </div>
                {/* Loading Boxes Animation */}
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-orange-400 rounded animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-4 h-4 bg-orange-400 rounded animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-4 h-4 bg-orange-400 rounded animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
              <p className="text-gray-700">Your order is being carefully loaded onto the delivery vehicle</p>
            </div>
          </Card>
        )}

        {/* Complete Order Journey Timeline */}
        <Card className="mb-6 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Order Journey</h3>
          <div className="space-y-4">
            {ORDER_JOURNEY.map((step, index) => {
              const currentStatus = tracking.currentStatus?.status
              const stepStatusConfig = STATUS_CONFIG[step.status] || STATUS_CONFIG.pending
              const StatusIcon = step.icon
              const isLast = index === ORDER_JOURNEY.length - 1
              
              // Determine if this step is completed, current, or future
              const currentStepIndex = ORDER_JOURNEY.findIndex(s => s.status === currentStatus)
              const isCompleted = index < currentStepIndex
              const isCurrent = index === currentStepIndex
              const isFuture = index > currentStepIndex
              
              // Get actual status data from timeline if available
              const actualStatusData = tracking.statusTimeline?.find(s => s.status === step.status)
              
              // Style based on status
              let iconClasses, textClasses, bgClasses, borderClasses, lineClasses
              if (isCompleted || isCurrent) {
                iconClasses = stepStatusConfig.color
                textClasses = stepStatusConfig.color
                bgClasses = stepStatusConfig.bgColor
                borderClasses = stepStatusConfig.borderColor
                lineClasses = stepStatusConfig.bgColor
              } else {
                // Future steps in gray
                iconClasses = 'text-gray-400'
                textClasses = 'text-gray-400'
                bgClasses = 'bg-gray-50'
                borderClasses = 'border-gray-200'
                lineClasses = 'bg-gray-100'
              }

              return (
                <div key={index} className="flex gap-4">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full ${bgClasses} ${borderClasses} border-2 flex items-center justify-center ${isCurrent ? 'animate-pulse' : ''}`}>
                      <StatusIcon className={`w-5 h-5 ${iconClasses}`} />
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 h-full min-h-[40px] ${lineClasses}`}></div>
                    )}
                  </div>

                  {/* Timeline Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold ${textClasses}`}>
                        {step.label}
                        {isCurrent && <span className="ml-2 text-sm font-normal">(Current)</span>}
                        {isFuture && <span className="ml-2 text-sm font-normal text-gray-400">(Upcoming)</span>}
                      </h4>
                      {actualStatusData?.date && (
                        <span className="text-sm text-gray-500">
                          {new Date(actualStatusData.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    {actualStatusData?.remarks && (
                      <p className="text-sm text-gray-600">{actualStatusData.remarks}</p>
                    )}
                    {!actualStatusData && isFuture && (
                      <p className="text-sm text-gray-400 italic">This step will be updated as your order progresses</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Cancelled Order Message */}
        {tracking.currentStatus?.status === 'cancelled' && (
          <Card className="mb-6 p-6 border-red-200 bg-red-50">
            <div className="flex items-center gap-4">
              <XCircle className="w-12 h-12 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-1">Order Cancelled</h3>
                <p className="text-red-700">
                  This order has been cancelled. If you have any questions about the cancellation, 
                  please contact our customer support.
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery Information */}
          {tracking.delivery && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Delivery Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tracking.delivery.deliveryStatus && (
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold text-gray-800 capitalize">
                      {String(tracking.delivery.deliveryStatus).replace(/_/g, ' ')}
                    </p>
                  </div>
                )}
                {tracking.delivery.driverName && (
                  <div>
                    <p className="text-sm text-gray-600">Driver Name</p>
                    <p className="font-semibold text-gray-800">{tracking.delivery.driverName}</p>
                  </div>
                )}
                {tracking.delivery.driverPhone && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Driver Phone</p>
                      <p className="font-semibold text-gray-800">{tracking.delivery.driverPhone}</p>
                    </div>
                  </div>
                )}
                {tracking.delivery.driverLicenseNo && (
                  <div>
                    <p className="text-sm text-gray-600">Driver License</p>
                    <p className="font-semibold text-gray-800">{tracking.delivery.driverLicenseNo}</p>
                  </div>
                )}
                {tracking.delivery.truckNumber && (
                  <div>
                    <p className="text-sm text-gray-600">Truck Number</p>
                    <p className="font-semibold text-gray-800">{tracking.delivery.truckNumber}</p>
                  </div>
                )}
                {tracking.delivery.vehicleType && (
                  <div>
                    <p className="text-sm text-gray-600">Vehicle Type</p>
                    <p className="font-semibold text-gray-800">{tracking.delivery.vehicleType}</p>
                  </div>
                )}
                {tracking.delivery.capacityTons !== undefined && tracking.delivery.capacityTons !== null && (
                  <div>
                    <p className="text-sm text-gray-600">Vehicle Capacity (tons)</p>
                    <p className="font-semibold text-gray-800">{tracking.delivery.capacityTons}</p>
                  </div>
                )}
                {tracking.delivery.estimatedArrival && (
                  <div>
                    <p className="text-sm text-gray-600">Estimated Arrival</p>
                    <p className="font-semibold text-gray-800">{new Date(tracking.delivery.estimatedArrival).toLocaleString()}</p>
                  </div>
                )}
                {tracking.delivery.startTime && (
                  <div>
                    <p className="text-sm text-gray-600">Start Time</p>
                    <p className="font-semibold text-gray-800">{new Date(tracking.delivery.startTime).toLocaleString()}</p>
                  </div>
                )}
                {(tracking.delivery.address || tracking.delivery.pincode) && (
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Delivery To</p>
                      <p className="font-semibold text-gray-800">
                        {tracking.delivery.address} {tracking.delivery.pincode ? `( ${tracking.delivery.pincode} )` : ''}
                      </p>
                    </div>
                  </div>
                )}
                {tracking.delivery.lastLocation?.address && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-600">Last Known Location</p>
                    <p className="font-semibold text-gray-800">{tracking.delivery.lastLocation.address}</p>
                  </div>
                )}
                {(tracking.delivery.lastLocation?.lat !== undefined || tracking.delivery.lastLocation?.lng !== undefined) && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-600">Coordinates</p>
                    <p className="font-semibold text-gray-800">
                      {tracking.delivery.lastLocation?.lat ?? '—'}, {tracking.delivery.lastLocation?.lng ?? '—'}
                    </p>
                  </div>
                )}
                {tracking.delivery.deliveryNotes && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="font-semibold text-gray-800">{tracking.delivery.deliveryNotes}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Payment Information */}
          {tracking.payment && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className={`font-semibold capitalize ${
                    tracking.payment.paymentStatus === 'successful' 
                      ? 'text-green-600' 
                      : tracking.payment.paymentStatus === 'pending'
                      ? 'text-orange-600'
                      : 'text-red-600'
                  }`}>
                    {tracking.payment.paymentStatus}
                  </p>
                </div>
                {tracking.payment.paidAmount !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">Paid Amount</p>
                    <p className="font-semibold text-gray-800">
                      ₹{tracking.payment.paidAmount.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Vendor Information */}
          {tracking.vendor && (
            <Card className="p-6 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Vendor Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tracking.vendor.name && (
                  <div>
                    <p className="text-sm text-gray-600">Vendor Name</p>
                    <p className="font-semibold text-gray-800">{tracking.vendor.name}</p>
                  </div>
                )}
                {tracking.vendor.companyName && (
                  <div>
                    <p className="text-sm text-gray-600">Company Name</p>
                    <p className="font-semibold text-gray-800">{tracking.vendor.companyName}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => navigate('/orders')} 
            variant="outline"
            className="flex-1"
          >
            View All Orders
          </Button>
          <Button 
            onClick={loadTrackingInfo}
            className="flex-1"
          >
            Refresh Status
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OrderTrackingPage

