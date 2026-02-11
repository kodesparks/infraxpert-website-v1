import React from 'react'
import { Link } from 'react-router-dom'
import { Truck, Shield, Clock, ShoppingCart, User, MapPin, Check, Calculator, Headphones, FileText, DollarSign, Globe, Award, Smartphone, CreditCard, Phone, Award as AwardIcon, Underline } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import heroBackground from '@/assets/images/hero-background.jpg'
import cementImage from '@/assets/images/cement.jpg'
import steelImage from '@/assets/images/steel.jpg'
import mixerImage from '@/assets/images/mixer.jpg'
import warehouseImage from '@/assets/images/warehouse.jpg'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  const handleProtectedAction = (action) => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      window.location.href = `/login?redirectUrl=${encodeURIComponent(window.location.pathname)}`
    } else {
      // User is authenticated, proceed with action
      if (action === 'products') {
        window.location.href = '/products'
      } else if (action === 'cart') {
        window.location.href = '/products' // Assuming cart is on products page
      }
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center text-white py-20"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(52, 93, 235, 0.8), rgba(131, 47, 227, 0.8)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-6 w-full">
          <div className="max-w-4xl text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-[#fbbf24]">Construction Materials</span> for Every Project
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed max-w-2xl">
              Your trusted partner for cement, steel, and concrete mix supplies. Quality materials, competitive prices, and reliable delivery for construction projects of all sizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => handleProtectedAction('cart')}
                className="bg-gradient-to-r from-[#345deb] to-[#832fe3] text-white px-12 py-5 rounded-xl text-xl font-bold hover:from-[#2d4fd8] hover:to-[#7a2ad8] transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 whitespace-nowrap cursor-pointer border-2 border-[#fbbf24]"
              >
                Cart
              </button>
              <button 
                onClick={() => handleProtectedAction('products')}
                className="bg-[#345deb] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#2d4fd8] transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
              >
                View Products
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3">
                  <Truck className="text-3xl text-[#fbbf24]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
                <p className="text-sm opacity-90">Quick and reliable delivery to your construction site</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3">
                  <Shield className="text-3xl text-[#fbbf24]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Quality</h3>
                <p className="text-sm opacity-90">Top-grade materials that meet industry standards</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3">
                  <Clock className="text-3xl text-[#fbbf24]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
                <p className="text-sm opacity-90">Round-the-clock customer service and support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-[#345deb] to-[#832fe3]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center text-white">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full">
                <ShoppingCart className="text-2xl text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500K+</div>
              <div className="text-lg opacity-90">Orders Delivered</div>
            </div>
            <div className="text-center text-white">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full">
                <User className="text-2xl text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1M+</div>
              <div className="text-lg opacity-90">Happy Clients</div>
            </div>
            <div className="text-center text-white">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full">
                <MapPin className="text-2xl text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">11K+</div>
              <div className="text-lg opacity-90">Pincodes Served</div>
            </div>
            <div className="text-center text-white">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full">
                <Clock className="text-2xl text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
              <div className="text-lg opacity-90">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Product Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Comprehensive range of construction materials sourced from trusted manufacturers and delivered with guaranteed quality assurance.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer">
              <div className="relative overflow-hidden">
                <img src={cementImage} alt="Cement" className="w-full h-64 object-cover object-top group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Cement</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">Quality cement from top brands. OPC, PPC, and specialty cement varieties for all construction needs.</p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="flex items-center justify-center w-4 h-4 mr-3">
                      <Check className="text-blue-700" />
                    </div>
                    OPC & PPC Grades
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="flex items-center justify-center w-4 h-4 mr-3">
                      <Check className="text-blue-700" />
                    </div>
                    ISI Certified
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="flex items-center justify-center w-4 h-4 mr-3">
                      <Check className="text-blue-700" />
                    </div>
                    Bulk & Retail
                  </div>
                </div>
                <button 
                  onClick={() => handleProtectedAction('cart')}
                  className="block w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-violet-700 transition-all duration-300 whitespace-nowrap cursor-pointer text-center"
                >
                  View Products
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer">
              <div className="relative overflow-hidden">
                <img src={steelImage} alt="Steel" className="w-full h-64 object-cover object-top group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Steel</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">High-grade steel bars, rods, and structural steel. TMT bars, mild steel, and reinforcement steel for robust construction.</p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="flex items-center justify-center w-4 h-4 mr-3">
                      <Check className="text-blue-700" />
                    </div>
                    TMT Bars
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="flex items-center justify-center w-4 h-4 mr-3">
                      <Check className="text-blue-700" />
                    </div>
                    Structural Steel
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="flex items-center justify-center w-4 h-4 mr-3">
                      <Check className="text-blue-700" />
                    </div>
                    Custom Lengths
                  </div>
                </div>
                <button 
                  onClick={() => handleProtectedAction('cart')}
                  className="block w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-violet-700 transition-all duration-300 whitespace-nowrap cursor-pointer text-center"
                >
                  View Products
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer">
              <div className="relative overflow-hidden">
                <img src={mixerImage} alt="Concrete Mix" className="w-full h-64 object-cover object-top group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Concrete Mix</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">Ready-to-use concrete mix solutions. Custom grades, additives, and specialized mixes for various construction applications.</p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="flex items-center justify-center w-4 h-4 mr-3">
                      <Check className="text-blue-700" />
                    </div>
                    Ready Mix
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="flex items-center justify-center w-4 h-4 mr-3">
                      <Check className="text-blue-700" />
                    </div>
                    Custom Grades
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="flex items-center justify-center w-4 h-4 mr-3">
                      <Check className="text-blue-700" />
                    </div>
                    Site Delivery
                  </div>
                </div>
                <button 
                  onClick={() => handleProtectedAction('cart')}
                  className="block w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-violet-700 transition-all duration-300 whitespace-nowrap cursor-pointer text-center"
                >
                  View Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Services & Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Beyond supplying materials, we provide comprehensive services to support your construction projects from planning to completion.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8 hover:bg-blue-50 transition-all duration-300 group">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
                <Calculator className="text-2xl text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Material Estimation</h3>
              <p className="text-gray-600 leading-relaxed">Expert calculation of material requirements for your project with accurate quantity estimates.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 hover:bg-blue-50 transition-all duration-300 group">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
                <Truck className="text-2xl text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Logistics Support</h3>
              <p className="text-gray-600 leading-relaxed">Comprehensive transportation and delivery solutions to ensure materials reach your site on time.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 hover:bg-blue-50 transition-all duration-300 group">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
                <Shield className="text-2xl text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quality Assurance</h3>
              <p className="text-gray-600 leading-relaxed">Rigorous quality testing and certification to guarantee materials meet industry standards.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 hover:bg-blue-50 transition-all duration-300 group">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
                <Headphones className="text-2xl text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Technical Consultation</h3>
              <p className="text-gray-600 leading-relaxed">Professional guidance from our engineering team for material selection and application.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 hover:bg-blue-50 transition-all duration-300 group">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
                <Clock className="text-2xl text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Just-in-Time Delivery</h3>
              <p className="text-gray-600 leading-relaxed">Scheduled delivery system to optimize your construction timeline and reduce storage costs.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 hover:bg-blue-50 transition-all duration-300 group">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
                <FileText className="text-2xl text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Coming Soon</h3>
              <p className="text-gray-600 leading-relaxed">will be available soon.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose InfraXpert Section */}
      <section className="py-20 bg-gradient-to-br from-blue-700 via-violet-700 to-purple-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why Choose InfraXpert?</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">Experience the difference with India's most trusted construction material supplier. Here's what sets us apart from the competition.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                <DollarSign className="text-2xl text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Competitive Pricing</h3>
              <p className="text-blue-100 leading-relaxed">Direct partnerships with manufacturers ensure best market rates without compromising quality.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                <Globe className="text-2xl text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Across Telengana and Andhra Pradesh</h3>
              <p className="text-blue-100 leading-relaxed">Extensive distribution network covering 11k+ pincodes across India for seamless supply chain.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                <Award className="text-2xl text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Quality Guarantee</h3>
              <p className="text-blue-100 leading-relaxed">All materials are ISI certified with quality assurance and replacement guarantee.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                <Smartphone className="text-2xl text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Digital Platform</h3>
              <p className="text-blue-100 leading-relaxed">Easy ordering through our digital platform with real-time tracking and transparent pricing.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                <CreditCard className="text-2xl text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Credit Facilities</h3>
              <p className="text-blue-100 leading-relaxed">Flexible payment terms and credit facilities for established contractors and builders.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                <Phone className="text-2xl text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Technical Support</h3>
              <p className="text-blue-100 leading-relaxed">24/7 technical assistance from our team of construction material experts and engineers.</p>
            </div>
          </div>
          <div className="text-center mt-16">
            <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-bold hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer">Start Your Project Today</button>
          </div>
        </div>
      </section>

      {/* About InfraXpert Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">About InfraXpert</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">Since 2008, InfraXpert has been at the forefront of India's construction materials supply industry. What started as a small regional supplier has grown into one of the country's most trusted names in construction materials.</p>
                <p>We specialize in providing premium quality cement, steel, and ready-mix concrete to construction companies, contractors, and builders across India. Our commitment to quality, reliability, and customer service has helped us build lasting relationships with thousands of clients.</p>
                <p>With our advanced digital platform, extensive logistics network, and dedicated customer support team, we're not just supplying materials – we're enabling the infrastructure dreams of modern India.</p>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-700 mb-2">Coming Soon</div>
                  <div className="text-sm text-gray-600 font-medium">Vendor Comming Soon</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-700 mb-2">15+</div>
                  <div className="text-sm text-gray-600 font-medium">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-700 mb-2">Coming Soon</div>
                  <div className="text-sm text-gray-600 font-medium">Annual Turnover Coming Soon</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-700 mb-2">50+</div>
                  <div className="text-sm text-gray-600 font-medium">Cities Served</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-12">
                <button className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-violet-700 transition-all duration-300 whitespace-nowrap cursor-pointer">Learn More</button>
                <button className="border-2 border-blue-700 text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 hover:text-white transition-all duration-300 whitespace-nowrap cursor-pointer">Our Team</button>
              </div>
            </div>
            <div className="relative">
              <img src={warehouseImage} alt="InfraXpert Warehouse" className="rounded-2xl shadow-2xl object-cover object-top w-full h-96" />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 max-w-xs">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                    <AwardIcon className="text-xl text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">ISO Certified</div>
                    <div className="text-sm text-gray-600">Quality Assured</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-8">
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold mb-6 font-['Pacifico'] text-blue-400">InfraXpert</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">India's most trusted construction material supplier. Quality materials, reliable delivery, and exceptional service since 2008.</p>
              <div className="flex space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.856-3.047-1.856 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-blue-400">Company</h4>
              <ul className="space-y-3">
                <li><a className="text-gray-300 hover:text-white transition-colors" href="/about">About Us</a></li>
                <li><a className="text-gray-300 hover:text-white transition-colors" href="/team">Our Team</a></li>
                <li><a className="text-gray-300 hover:text-white transition-colors" href="/careers">Careers</a></li>
                <li><a className="text-gray-300 hover:text-white transition-colors" href="/news">News & Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-blue-400">Products</h4>
              <ul className="space-y-3">
                <li><a className="text-gray-300 hover:text-white transition-colors" href="/products/cement">Cement</a></li>
                <li><a className="text-gray-300 hover:text-white transition-colors" href="/products/steel">Steel & TMT Bars</a></li>
                <li><a className="text-gray-300 hover:text-white transition-colors" href="/products/concrete">Ready Mix Concrete</a></li>
                <li><a className="text-gray-300 hover:text-white transition-colors" href="/bulk-orders">Bulk Orders</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-blue-400">Services</h4>
              <ul className="space-y-3">
                <li><a className="text-gray-300 hover:text-white transition-colors" href="/services/estimation">Material Estimation</a></li>
                <li><a className="text-gray-300 hover:text-white transition-colors" href="/services/logistics">Logistics Support</a></li>
                <li><a className="text-gray-300 hover:text-white transition-colors" href="/services/quality">Quality Assurance</a></li>
                <li><a className="text-gray-300 hover:text-white transition-colors" href="/services/technical">Technical Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-blue-400">Support</h4>
              <ul className="space-y-3 mb-6">
                <li><a className="text-gray-300 hover:text-white transition-colors" href="/contact">Contact Us</a></li>
                <li><a className="text-gray-300 hover:text-white transition-colors" href="/quote">Get Quote</a></li>
                <li><a className="text-gray-300 hover:text-white transition-colors" href="/track">Track Order</a></li>
                <li><a className="text-gray-300 hover:text-white transition-colors" href="/faq">FAQs</a></li>
              </ul>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <div className="flex items-center justify-center w-5 h-5 mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span>+91 9000390909</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="flex items-center justify-center w-5 h-5 mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>support@infraxpert.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">© {new Date().getFullYear()} InfraXpert. All rights reserved.<br/>
              Designed &amp; Developed by {` `}
              <b><a href='https://www.kodespark.com' target='_blank' className="font-bold underline hover:text-white" >
              Kodespark IT
              </a></b>
              </div>
              <div className="flex space-x-6 text-sm">
                <a className="text-gray-400 hover:text-white transition-colors" href="/privacy">Privacy Policy</a>
                <a className="text-gray-400 hover:text-white transition-colors" href="/terms">Terms of Service</a>
                <a className="text-gray-400 hover:text-white transition-colors" href="/sitemap">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
