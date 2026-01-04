import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Phone, Mail, MapPin, User } from 'lucide-react'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.name) {
      newErrors.name = 'Name is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitError(false)
    setSubmitSuccess(false)

    try {
      // TODO: Add API call to submit contact form
      console.log('Submitting contact form:', formData)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitSuccess(true)
      setFormData({ name: '', email: '' })
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitError(true)
      setTimeout(() => {
        setSubmitError(false)
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Contact Section */}
      <section className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>
              <h5 className="text-lg sm:text-xl text-gray-700 font-medium">
                Any questions or remarks? Just write us a message!
              </h5>
            </div>

            {/* Contact Form */}
            <div className="mb-0">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Email and Name Fields - Side by Side on larger screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Email Field */}
                  <div className="sm:col-span-1">
                    <Label htmlFor="email-bb9b" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </Label>
                    <Input
                      id="email-bb9b"
                      name="email"
                      type="email"
                      placeholder="Enter a valid email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full h-12 px-4 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Name Field */}
                  <div className="sm:col-span-1">
                    <Label htmlFor="name-bb9b" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </Label>
                    <Input
                      id="name-bb9b"
                      name="name"
                      type="text"
                      placeholder="Enter your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full h-12 px-4 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-left">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="border-none px-6 py-2.5 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <input type="submit" value="submit" className="hidden" />
                </div>

                {/* Success Message */}
                {submitSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                    Thank you! Your message has been sent.
                  </div>
                )}

                {/* Error Message */}
                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                    Unable to send your message. Please fix errors then try again.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* About Us Card */}
            <div className="text-center bg-gray-100 rounded-2xl p-8 sm:p-10 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
                About Us
              </h4>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Construction Materials<br />
                Expert Consultation<br />
              </p>
            </div>

            {/* Phone Card */}
            <div className="text-center bg-gray-100 rounded-2xl p-8 sm:p-10 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
                Phone (Landline)
              </h4>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <a href="tel:+919000390909" className="hover:text-blue-600 transition-colors font-medium">
                  +91 9000390909
                </a>
                <br />
                <span className="text-xs text-gray-600 mt-2 block">Our official customer care number</span>
              </p>
            </div>

            {/* Office Location Card */}
            <div className="text-center bg-gray-100 rounded-2xl p-8 sm:p-10 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
                Our Office Location
              </h4>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                India
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
