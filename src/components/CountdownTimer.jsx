import React, { useState, useEffect } from 'react'
import { Clock, AlertCircle } from 'lucide-react'

const CountdownTimer = ({ 
  orderPlacedAt, 
  timeWindowHours = 48 
}) => {
  const [timeLeft, setTimeLeft] = useState(null)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!orderPlacedAt) return

    const calculateTimeLeft = () => {
      const now = new Date()
      const orderDate = new Date(orderPlacedAt)
      const expirationTime = new Date(orderDate.getTime() + (timeWindowHours * 60 * 60 * 1000))
      
      const difference = expirationTime.getTime() - now.getTime()
      
      if (difference <= 0) {
        setIsExpired(true)
        return null
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      return { hours, minutes, seconds }
    }

    // Calculate immediately
    const initialTimeLeft = calculateTimeLeft()
    setTimeLeft(initialTimeLeft)

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)
    }, 1000)

    return () => clearInterval(timer)
  }, [orderPlacedAt, timeWindowHours])

  if (!orderPlacedAt) return null

  if (isExpired) {
    return (
      <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="w-4 h-4 text-red-600" />
        <div>
          <p className="text-red-800 font-medium text-sm">Changes No Longer Allowed</p>
          <p className="text-red-600 text-xs">
            The 48-hour window for making changes has expired
          </p>
        </div>
      </div>
    )
  }

  if (!timeLeft) return null

  const { hours, minutes, seconds } = timeLeft

  return (
    <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <Clock className="w-4 h-4 text-blue-600" />
      <div>
        <p className="text-blue-800 font-medium text-sm">
          Time Remaining for Changes
        </p>
        <p className="text-blue-600 text-xs">
          {hours}h {minutes}m {seconds}s left
        </p>
      </div>
    </div>
  )
}

export default CountdownTimer
