import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

const MainLayout = ({ children }) => {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-700 font-['Pacifico']">
                InfraXpert
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-blue-700' 
                    : 'text-gray-700 hover:text-blue-700'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className={`font-medium transition-colors ${
                  isActive('/products') 
                    ? 'text-blue-700' 
                    : 'text-gray-700 hover:text-blue-700'
                }`}
              >
                Products
              </Link>
              <Link 
                to="/services" 
                className={`font-medium transition-colors ${
                  isActive('/services') 
                    ? 'text-blue-700' 
                    : 'text-gray-700 hover:text-blue-700'
                }`}
              >
                Services
              </Link>
              <Link 
                to="/about" 
                className={`font-medium transition-colors ${
                  isActive('/about') 
                    ? 'text-blue-700' 
                    : 'text-gray-700 hover:text-blue-700'
                }`}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`font-medium transition-colors ${
                  isActive('/contact') 
                    ? 'text-blue-700' 
                    : 'text-gray-700 hover:text-blue-700'
                }`}
              >
                Contact
              </Link>
              <Link 
                to="/products" 
                className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-all duration-300 font-medium whitespace-nowrap cursor-pointer"
              >
                Cart
              </Link>
            </nav>
            <button className="md:hidden flex items-center justify-center w-8 h-8 cursor-pointer">
              <Menu className="text-xl text-gray-700" />
            </button>
          </div>
        </div>
      </header>
      
      <main>
        {children}
      </main>
    </div>
  )
}

export default MainLayout
