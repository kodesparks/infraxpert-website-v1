import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

const MainLayout = ({ children }) => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef(null)
  const mobileButtonRef = useRef(null)
  
  const isActive = (path) => {
    return location.pathname === path
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target) &&
        mobileButtonRef.current &&
        !mobileButtonRef.current.contains(event.target)
      ) {
        closeMobileMenu()
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu()
  }, [location.pathname])

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
            
            {/* Desktop Navigation */}
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
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-all duration-300 font-medium whitespace-nowrap cursor-pointer"
                >
                  Sign Up
                </Link>
                <Link 
                  to="/products" 
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium whitespace-nowrap cursor-pointer"
                >
                  Cart
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              ref={mobileButtonRef}
              onClick={toggleMobileMenu}
              className="md:hidden flex items-center justify-center w-10 h-10 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="text-xl text-gray-700" />
              ) : (
                <Menu className="text-xl text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          <div 
            ref={mobileMenuRef}
            className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
            }`}
          >
            <nav className="bg-white rounded-xl shadow-2xl p-4 space-y-2 border border-gray-100">
              <Link 
                to="/" 
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-blue-700 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/products') 
                    ? 'bg-blue-700 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm'
                }`}
              >
                Products
              </Link>
              <Link 
                to="/services" 
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/services') 
                    ? 'bg-blue-700 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm'
                }`}
              >
                Services
              </Link>
              <Link 
                to="/about" 
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/about') 
                    ? 'bg-blue-700 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm'
                }`}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/contact') 
                    ? 'bg-blue-700 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm'
                }`}
              >
                Contact
              </Link>
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <Link 
                  to="/login" 
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg font-medium transition-all duration-200 text-center"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-violet-700 transition-all duration-300 text-center shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
                <Link 
                  to="/products" 
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 text-center"
                >
                  Cart
                </Link>
              </div>
            </nav>
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
