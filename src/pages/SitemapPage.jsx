import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Compass, Hammer, ArrowLeft, Home } from 'lucide-react'

const SitemapPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center space-y-6">
        
        {/* Animated Icon Container */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 text-blue-600 rounded-full mb-2 animate-bounce relative">
          <Compass className="w-10 h-10" />
          <div className="absolute -bottom-1 -right-1 bg-yellow-400 p-1.5 rounded-full border-2 border-white text-gray-950">
            <Hammer className="w-4 h-4 animate-pulse" />
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Sitemap
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full uppercase tracking-wider">
            <Hammer className="w-3.5 h-3.5" />
            Under Development
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed text-sm">
          We are currently building the site directory to help you navigate our services better. Please check back soon for the complete sitemap.
        </p>

        <hr className="border-gray-100" />

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

      </div>
    </div>
  )
}

export default SitemapPage
