import React from 'react'
import { Clock, MapPin, Calendar, User } from 'lucide-react'

const ChangeHistory = ({ 
  addressChanges = [], 
  deliveryDateChanges = [] 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDeliveryDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (addressChanges.length === 0 && deliveryDateChanges.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500 text-sm text-center">
          No changes made to this order yet
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Address Changes */}
      {addressChanges.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 text-blue-600 mr-2" />
            Address Changes ({addressChanges.length})
          </h4>
          <div className="space-y-3">
            {addressChanges.map((change, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatDate(change.changedAt)}
                    </span>
                  </div>
                  {change.changedBy && (
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">{change.changedBy}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">From:</p>
                    <p className="text-sm text-gray-700 bg-red-50 p-2 rounded border-l-2 border-red-200">
                      {change.oldAddress}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">To:</p>
                    <p className="text-sm text-gray-700 bg-green-50 p-2 rounded border-l-2 border-green-200">
                      {change.newAddress}
                    </p>
                  </div>
                  
                  {change.reason && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reason:</p>
                      <p className="text-sm text-gray-600 italic">"{change.reason}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Date Changes */}
      {deliveryDateChanges.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 text-green-600 mr-2" />
            Delivery Date Changes ({deliveryDateChanges.length})
          </h4>
          <div className="space-y-3">
            {deliveryDateChanges.map((change, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatDate(change.changedAt)}
                    </span>
                  </div>
                  {change.changedBy && (
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">{change.changedBy}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">From:</p>
                    <p className="text-sm text-gray-700 bg-red-50 p-2 rounded border-l-2 border-red-200">
                      {formatDeliveryDate(change.oldDate)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">To:</p>
                    <p className="text-sm text-gray-700 bg-green-50 p-2 rounded border-l-2 border-green-200">
                      {formatDeliveryDate(change.newDate)}
                    </p>
                  </div>
                  
                  {change.reason && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reason:</p>
                      <p className="text-sm text-gray-600 italic">"{change.reason}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ChangeHistory
