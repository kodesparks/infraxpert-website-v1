import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, preLoader } = useAuth()
  const location = useLocation()

  // Show loading while checking authentication
  if (preLoader) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    )
  }

  // If not authenticated, redirect to login with return url
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirectUrl=${encodeURIComponent(location.pathname)}`} replace />
  }

  // If authenticated, render the protected component
  return children
}

export default ProtectedRoute
