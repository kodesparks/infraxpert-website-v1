import React, { useState } from 'react'
import { X, MapPin, AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import * as orderService from '@/services/order'

const AddressChangeModal = ({ 
  isOpen, 
  onClose, 
  order, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    newAddress: order?.deliveryAddress || '',
    reason: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

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

    if (!formData.newAddress.trim()) {
      newErrors.newAddress = 'New address is required'
    } else if (formData.newAddress.trim().length < 10) {
      newErrors.newAddress = 'Address must be at least 10 characters'
    } else if (formData.newAddress.trim().length > 500) {
      newErrors.newAddress = 'Address must be less than 500 characters'
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
      await orderService.changeDeliveryAddress(order.leadId || order.id || order.orderNumber, {
        newAddress: formData.newAddress.trim(),
        reason: formData.reason.trim()
      })
      
      onSuccess('Address updated successfully!')
      onClose()
    } catch (error) {
      console.error('Error updating address:', error)
      setErrors({ 
        general: error.response?.data?.message || 'Failed to update address. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Change Delivery Address</h2>
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
          {/* Current Address */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Current Address
            </Label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-600">{order?.deliveryAddress}</p>
              <p className="text-xs text-gray-500 mt-1">Pincode: {order?.deliveryPincode}</p>
            </div>
          </div>

          {/* New Address */}
          <div>
            <Label htmlFor="newAddress" className="text-sm font-medium text-gray-700 mb-2 block">
              New Delivery Address *
            </Label>
            <Textarea
              id="newAddress"
              name="newAddress"
              value={formData.newAddress}
              onChange={handleInputChange}
              placeholder="Enter complete delivery address"
              rows={4}
              className={`w-full ${errors.newAddress ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            />
            {errors.newAddress && (
              <p className="text-red-600 text-sm mt-1">{errors.newAddress}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Must be within the same pincode ({order?.deliveryPincode})
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
              placeholder="Why are you changing the address?"
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
              Address changes are only allowed within 48 hours of order placement
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Updating...' : 'Update Address'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddressChangeModal
