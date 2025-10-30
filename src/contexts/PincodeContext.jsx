import React, { createContext, useContext, useState, useEffect } from 'react'
import { validatePincode, calculateDelivery } from '@/services/location'

const PincodeContext = createContext()

export const usePincode = () => {
  const context = useContext(PincodeContext)
  if (!context) {
    throw new Error('usePincode must be used within a PincodeProvider')
  }
  return context
}

export const PincodeProvider = ({ children }) => {
  const [userPincode, setUserPincode] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [showPincodeModal, setShowPincodeModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load saved pincode on app start
  useEffect(() => {
    const loadSavedPincode = async () => {
      try {
        const savedPincode = localStorage.getItem('userPincode')
        const savedLocation = localStorage.getItem('userLocation')

        if (savedPincode && savedLocation) {
          const location = JSON.parse(savedLocation)
          setUserPincode(savedPincode)
          setUserLocation(location)
        } else {
          setShowPincodeModal(true)
        }
      } catch (error) {
        console.error('Error loading saved pincode:', error)
        setShowPincodeModal(true)
      }
    }
    loadSavedPincode()
  }, [])

  const handlePincodeSet = async (pincodeData) => {
    try {
      setIsLoading(true)
      const { pincode, location } = pincodeData
      
      // Save to localStorage
      localStorage.setItem('userPincode', pincode)
      localStorage.setItem('userLocation', JSON.stringify(location))
      
      // Update state
      setUserPincode(pincode)
      setUserLocation(location)
      setShowPincodeModal(false)
    } catch (error) {
      console.error('Error saving pincode:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePincode = () => {
    setShowPincodeModal(true)
  }

  const value = {
    userPincode,
    userLocation,
    showPincodeModal,
    setShowPincodeModal,
    handlePincodeSet,
    handleChangePincode,
    isLoading,
  }

  return (
    <PincodeContext.Provider value={value}>
      {children}
    </PincodeContext.Provider>
  )
}