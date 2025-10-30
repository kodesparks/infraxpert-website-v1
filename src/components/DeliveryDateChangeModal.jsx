import React, { useState } from 'react'
import { X, Calendar, AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import * as orderService from '@/services/order'

const DeliveryDateChangeModal = ({ 
  isOpen, 
  onClose, 
  order, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    newDeliveryDate: '',
    reason: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Set initial date when modal opens
  React.useEffect(() => {
    if (isOpen && order?.deliveryExpectedDate) {
      const currentDate = new Date(order.deliveryExpectedDate)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      // Set to tomorrow if current date is in the past, otherwise use current date
      const minDate = currentDate > tomorrow ? currentDate : tomorrow
      setFormData(prev => ({
        ...prev,
        newDeliveryDate: minDate.toISOString().slice(0, 16) // Format for datetime-local input
      }))
    }
  }, [isOpen, order?.deliveryExpectedDate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.newDeliveryDate) {
      newErrors.newDeliveryDate = 'New delivery date is required'
    } else {
      const selectedDate = new Date(formData.newDeliveryDate)
      const now = new Date()
      
      if (selectedDate <= now) {
        newErrors.newDeliveryDate = 'Delivery date must be in the future'
      }
    }

    if (formData.reason && formData.reason.length > 200) {
      newErrors.reason = 'Reason must be less than 200 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLoading(true)
      // Convert to ISO string for API
      const isoDate = new Date(formData.newDeliveryDate).toISOString()
      
      await orderService.changeDeliveryDate(order.leadId || order.id || order.orderNumber, {
        newDeliveryDate: isoDate,
        reason: formData.reason.trim()
      })
      
      onSuccess('Delivery date updated successfully!')
      onClose()
    } catch (error) {
      console.error('Error updating delivery date:', error)
      setErrors({ 
        general: error.response?.data?.message || 'Failed to update delivery date. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrentDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Change Delivery Date</h2>
              <p className="text-sm text-gray-500">Order #{order?.leadId || order?.id || order?.orderNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Date */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Current Delivery Date
            </Label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-600">
                {formatCurrentDate(order?.deliveryExpectedDate)}
              </p>
            </div>
          </div>

          {/* New Date */}
          <div>
            <Label htmlFor="newDeliveryDate" className="text-sm font-medium text-gray-700 mb-2 block">
              New Delivery Date *
            </Label>
            <input
              type="datetime-local"
              id="newDeliveryDate"
              name="newDeliveryDate"
              value={formData.newDeliveryDate}
              onChange={handleInputChange}
              min={new Date().toISOString().slice(0, 16)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.newDeliveryDate ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            {errors.newDeliveryDate && (
              <p className="text-red-600 text-sm mt-1">{errors.newDeliveryDate}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Select a future date and time for delivery
            </p>
          </div>

          {/* Reason */}
          <div>
            <Label htmlFor="reason" className="text-sm font-medium text-gray-700 mb-2 block">
              Reason for Change (Optional)
            </Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Why are you changing the delivery date?"
              rows={3}
              className={`w-full ${errors.reason ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            />
            {errors.reason && (
              <p className="text-red-600 text-sm mt-1">{errors.reason}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.reason.length}/200 characters
            </p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Time Warning */}
          <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Clock className="w-4 h-4 text-yellow-600" />
            <p className="text-yellow-800 text-sm">
              Delivery date changes are only allowed within 48 hours of order placement
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? 'Updating...' : 'Update Date'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DeliveryDateChangeModal
