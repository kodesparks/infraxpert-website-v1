
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
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
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
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
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
