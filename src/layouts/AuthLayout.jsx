import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {children}
    </div>
  )
}

export default AuthLayout
