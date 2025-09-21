import React, { useState } from 'react'
import { X, MapPin, Calculator, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const PincodePopup = ({ isOpen, onClose, onPincodeSubmit, currentPincode }) => {
  const [pincode, setPincode] = useState(currentPincode || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pincode.trim()) return

    setIsLoading(true)
    try {
      // Simulate API call for distance calculation
      await new Promise(resolve => setTimeout(resolve, 1000))
      onPincodeSubmit(pincode.trim())
      onClose()
    } catch (error) {
      console.error('Error calculating distance:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setPincode(currentPincode || '')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delivery Location</h3>
              <p className="text-sm text-gray-500">Enter your pincode for accurate pricing</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Pincode Input */}
          <div className="space-y-2">
            <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">
              Enter Pincode
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="pincode"
                type="text"
                placeholder="e.g., 500081"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="pl-10 h-12 text-center text-lg font-medium tracking-wider"
                maxLength={6}
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              Enter 6-digit pincode to calculate delivery charges
            </p>
          </div>

          {/* Info Cards */}
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calculator className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Distance-Based Pricing</h4>
                  <p className="text-xs text-blue-700">
                    Delivery charges calculated based on distance from warehouse
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="text-sm font-medium text-green-900">Free Delivery</h4>
                  <p className="text-xs text-green-700">
                    Free delivery for orders above ₹10,000 within 50km
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!pincode.trim() || isLoading}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Calculating...</span>
                </div>
              ) : (
                'Calculate Price'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PincodePopup
