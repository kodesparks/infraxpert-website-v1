
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { OrdersProvider } from '@/contexts/OrdersContext'
import { PincodeProvider } from '@/contexts/PincodeContext'
import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import HomePage from '@/pages/HomePage'
import ProductsPage from '@/pages/ProductsPage'
import ServicesPage from '@/pages/ServicesPage'
import AboutPage from '@/pages/AboutPage'
import ContactPage from '@/pages/ContactPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import UserProfilePage from '@/pages/UserProfilePage'
import DeliveryDetailsPage from '@/pages/DeliveryDetailsPage'
import PaymentPage from '@/pages/PaymentPage'
import PlaceOrderPage from '@/pages/PlaceOrderPage'
import OrdersPage from '@/pages/OrdersPage'
import OrderTrackingPage from '@/pages/OrderTrackingPage'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <PincodeProvider>
          <CartProvider>
            <OrdersProvider>
            <Routes>
          {/* Authentication pages - No header */}
          <Route path="/login" element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          } />
          <Route path="/signup" element={
            <AuthLayout>
              <SignupPage />
            </AuthLayout>
          } />
          <Route path="/forgot-password" element={
            <AuthLayout>
              <ForgotPasswordPage />
            </AuthLayout>
          } />
          
          {/* Main app pages - With header */}
          <Route path="/" element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          } />
          <Route path="/products" element={
            <MainLayout>
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            </MainLayout>
          } />
          <Route path="/services" element={
            <MainLayout>
              <ServicesPage />
            </MainLayout>
          } />
          <Route path="/orders" element={
            <MainLayout>
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            </MainLayout>
          } />
          <Route path="/about" element={
            <MainLayout>
              <AboutPage />
            </MainLayout>
          } />
          <Route path="/contact" element={
            <MainLayout>
              <ContactPage />
            </MainLayout>
          } />
          <Route path="/profile" element={
            <MainLayout>
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            </MainLayout>
          } />
          <Route path="/delivery-details" element={
            <MainLayout>
              <ProtectedRoute>
                <DeliveryDetailsPage />
              </ProtectedRoute>
            </MainLayout>
          } />
          <Route path="/payment" element={
            <MainLayout>
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            </MainLayout>
          } />
          <Route path="/place-order" element={
            <MainLayout>
              <ProtectedRoute>
                <PlaceOrderPage />
              </ProtectedRoute>
            </MainLayout>
          } />
          <Route path="/orders/track/:leadId" element={
            <MainLayout>
              <ProtectedRoute>
                <OrderTrackingPage />
              </ProtectedRoute>
            </MainLayout>
          } />
          </Routes>
            </OrdersProvider>
          </CartProvider>
        </PincodeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
