import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, CreditCard, Smartphone, Wallet, CheckCircle, MapPin, Calendar, Phone, Mail, User, Building2, Banknote, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const PaymentPage = () => {
  const navigate = useNavigate()
  const { items, getTotalPrice, deliveryDetails, clearCart } = useCart()
  const { user } = useAuth()
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    upiId: '',
    walletType: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    transactionId: '',
    chequeNumber: '',
    ddNumber: ''
  })
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  // Redirect if cart is empty or no delivery details
  useEffect(() => {
    if (items.length === 0) {
      navigate('/products')
    }
    if (!deliveryDetails) {
      navigate('/delivery-details')
    }
  }, [items, deliveryDetails, navigate])

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Pay with your credit or debit card'
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      description: 'Pay using UPI apps like PhonePe, Google Pay'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Pay using digital wallets'
    },
    {
      id: 'rtgs',
      name: 'RTGS Transfer',
      icon: Building2,
      description: 'Real Time Gross Settlement (₹2 lakhs+)'
    },
    {
      id: 'neft',
      name: 'NEFT Transfer',
      icon: Banknote,
      description: 'National Electronic Funds Transfer'
    },
    {
      id: 'cheque',
      name: 'Cheque Payment',
      icon: Receipt,
      description: 'Pay via cheque (subject to clearance)'
    },
    {
      id: 'dd',
      name: 'Demand Draft',
      icon: Receipt,
      description: 'Pay via demand draft'
    }
  ]

  const handlePaymentMethodChange = (methodId) => {
    setSelectedPaymentMethod(methodId)
    setErrors({})
    setPaymentData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
      upiId: '',
      walletType: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      transactionId: '',
      chequeNumber: '',
      ddNumber: ''
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPaymentData(prev => ({
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

  const validatePaymentData = () => {
    const newErrors = {}

    if (!selectedPaymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method'
      return false
    }

    if (selectedPaymentMethod === 'card') {
      if (!paymentData.cardNumber) {
        newErrors.cardNumber = 'Card number is required'
      } else if (!/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number'
      }

      if (!paymentData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required'
      } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
        newErrors.expiryDate = 'Please enter expiry date in MM/YY format'
      }

      if (!paymentData.cvv) {
        newErrors.cvv = 'CVV is required'
      } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV'
      }

      if (!paymentData.cardName) {
        newErrors.cardName = 'Cardholder name is required'
      }
    }

    if (selectedPaymentMethod === 'upi') {
      if (!paymentData.upiId) {
        newErrors.upiId = 'UPI ID is required'
      } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(paymentData.upiId)) {
        newErrors.upiId = 'Please enter a valid UPI ID'
      }
    }

    if (selectedPaymentMethod === 'wallet') {
      if (!paymentData.walletType) {
        newErrors.walletType = 'Please select a wallet type'
      }
    }

    if (selectedPaymentMethod === 'rtgs' || selectedPaymentMethod === 'neft') {
      if (!paymentData.bankName) {
        newErrors.bankName = 'Bank name is required'
      }
      if (!paymentData.accountNumber) {
        newErrors.accountNumber = 'Account number is required'
      } else if (!/^\d{9,18}$/.test(paymentData.accountNumber)) {
        newErrors.accountNumber = 'Please enter a valid account number'
      }
      if (!paymentData.ifscCode) {
        newErrors.ifscCode = 'IFSC code is required'
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(paymentData.ifscCode.toUpperCase())) {
        newErrors.ifscCode = 'Please enter a valid IFSC code'
      }
      if (!paymentData.accountHolderName) {
        newErrors.accountHolderName = 'Account holder name is required'
      }
      if (!paymentData.transactionId) {
        newErrors.transactionId = 'Transaction ID is required'
      }
    }

    if (selectedPaymentMethod === 'cheque') {
      if (!paymentData.chequeNumber) {
        newErrors.chequeNumber = 'Cheque number is required'
      }
      if (!paymentData.bankName) {
        newErrors.bankName = 'Bank name is required'
      }
    }

    if (selectedPaymentMethod === 'dd') {
      if (!paymentData.ddNumber) {
        newErrors.ddNumber = 'DD number is required'
      }
      if (!paymentData.bankName) {
        newErrors.bankName = 'Bank name is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayment = async () => {
    if (!validatePaymentData()) return

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setOrderPlaced(true)
      
      // Clear cart after successful order
      setTimeout(() => {
        clearCart()
        navigate('/')
      }, 3000)
    }, 2000)
  }

  const totalAmount = getTotalPrice()

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-lg">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-4">
            Your order has been confirmed and will be delivered soon.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to homepage...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Payment</h1>
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Payment Methods */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</h2>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  const isSelected = selectedPaymentMethod === method.id
                  
                  return (
                    <div
                      key={method.id}
                      onClick={() => handlePaymentMethodChange(method.id)}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 text-sm">{method.name}</h3>
                          <p className="text-xs text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm mt-2">{errors.paymentMethod}</p>
              )}
            </div>
          </div>

          {/* Right Side - Payment Details and Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Form */}
            {selectedPaymentMethod && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h2>
                
                {selectedPaymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <Input
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={errors.cardNumber ? 'border-red-500' : ''}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <Input
                          name="expiryDate"
                          value={paymentData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={errors.expiryDate ? 'border-red-500' : ''}
                        />
                        {errors.expiryDate && (
                          <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <Input
                          name="cvv"
                          value={paymentData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={4}
                          className={errors.cvv ? 'border-red-500' : ''}
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name *
                      </label>
                      <Input
                        name="cardName"
                        value={paymentData.cardName}
                        onChange={handleInputChange}
                        placeholder="Enter cardholder name"
                        className={errors.cardName ? 'border-red-500' : ''}
                      />
                      {errors.cardName && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'upi' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPI ID *
                    </label>
                    <Input
                      name="upiId"
                      value={paymentData.upiId}
                      onChange={handleInputChange}
                      placeholder="yourname@paytm"
                      className={errors.upiId ? 'border-red-500' : ''}
                    />
                    {errors.upiId && (
                      <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>
                    )}
                  </div>
                )}

                {selectedPaymentMethod === 'wallet' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Wallet *
                    </label>
                    <select
                      name="walletType"
                      value={paymentData.walletType}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.walletType ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a wallet</option>
                      <option value="paytm">Paytm</option>
                      <option value="phonepe">PhonePe</option>
                      <option value="gpay">Google Pay</option>
                      <option value="amazonpay">Amazon Pay</option>
                    </select>
                    {errors.walletType && (
                      <p className="text-red-500 text-sm mt-1">{errors.walletType}</p>
                    )}
                  </div>
                )}

                {(selectedPaymentMethod === 'rtgs' || selectedPaymentMethod === 'neft') && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Bank Transfer Details</h3>
                      <p className="text-sm text-blue-700">
                        {selectedPaymentMethod === 'rtgs' 
                          ? 'RTGS is available for amounts ₹2 lakhs and above. Transfer will be processed in real-time.'
                          : 'NEFT transfers are processed in batches throughout the day.'
                        }
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Name *
                        </label>
                        <Input
                          name="bankName"
                          value={paymentData.bankName}
                          onChange={handleInputChange}
                          placeholder="Enter bank name"
                          className={errors.bankName ? 'border-red-500' : ''}
                        />
                        {errors.bankName && (
                          <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number *
                        </label>
                        <Input
                          name="accountNumber"
                          value={paymentData.accountNumber}
                          onChange={handleInputChange}
                          placeholder="Enter account number"
                          className={errors.accountNumber ? 'border-red-500' : ''}
                        />
                        {errors.accountNumber && (
                          <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          IFSC Code *
                        </label>
                        <Input
                          name="ifscCode"
                          value={paymentData.ifscCode}
                          onChange={handleInputChange}
                          placeholder="e.g., SBIN0001234"
                          className={errors.ifscCode ? 'border-red-500' : ''}
                        />
                        {errors.ifscCode && (
                          <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Holder Name *
                        </label>
                        <Input
                          name="accountHolderName"
                          value={paymentData.accountHolderName}
                          onChange={handleInputChange}
                          placeholder="Enter account holder name"
                          className={errors.accountHolderName ? 'border-red-500' : ''}
                        />
                        {errors.accountHolderName && (
                          <p className="text-red-500 text-sm mt-1">{errors.accountHolderName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction ID *
                      </label>
                      <Input
                        name="transactionId"
                        value={paymentData.transactionId}
                        onChange={handleInputChange}
                        placeholder="Enter transaction ID from your bank"
                        className={errors.transactionId ? 'border-red-500' : ''}
                      />
                      {errors.transactionId && (
                        <p className="text-red-500 text-sm mt-1">{errors.transactionId}</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'cheque' && (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-yellow-800 mb-2">Cheque Payment</h3>
                      <p className="text-sm text-yellow-700">
                        Please ensure the cheque is drawn in favor of our company name. 
                        Order will be processed only after cheque clearance.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cheque Number *
                        </label>
                        <Input
                          name="chequeNumber"
                          value={paymentData.chequeNumber}
                          onChange={handleInputChange}
                          placeholder="Enter cheque number"
                          className={errors.chequeNumber ? 'border-red-500' : ''}
                        />
                        {errors.chequeNumber && (
                          <p className="text-red-500 text-sm mt-1">{errors.chequeNumber}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Name *
                        </label>
                        <Input
                          name="bankName"
                          value={paymentData.bankName}
                          onChange={handleInputChange}
                          placeholder="Enter bank name"
                          className={errors.bankName ? 'border-red-500' : ''}
                        />
                        {errors.bankName && (
                          <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'dd' && (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Demand Draft Payment</h3>
                      <p className="text-sm text-green-700">
                        Please ensure the DD is drawn in favor of our company name. 
                        Order will be processed upon receipt of the DD.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          DD Number *
                        </label>
                        <Input
                          name="ddNumber"
                          value={paymentData.ddNumber}
                          onChange={handleInputChange}
                          placeholder="Enter DD number"
                          className={errors.ddNumber ? 'border-red-500' : ''}
                        />
                        {errors.ddNumber && (
                          <p className="text-red-500 text-sm mt-1">{errors.ddNumber}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Name *
                        </label>
                        <Input
                          name="bankName"
                          value={paymentData.bankName}
                          onChange={handleInputChange}
                          placeholder="Enter bank name"
                          className={errors.bankName ? 'border-red-500' : ''}
                        />
                        {errors.bankName && (
                          <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Delivery Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Details</h2>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">{deliveryDetails?.fullName}</p>
                    <p className="text-sm text-gray-600">{deliveryDetails?.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-800">{deliveryDetails?.deliveryAddress}</p>
                    <p className="text-sm text-gray-600">
                      {deliveryDetails?.city}, {deliveryDetails?.state} - {deliveryDetails?.pinCode}
                    </p>
                  </div>
                </div>

                {deliveryDetails?.preferredDeliveryDate && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Preferred: {new Date(deliveryDetails.preferredDeliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">x {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      ₹{(item.currentPrice * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                  <span className="text-xl font-bold text-blue-600">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={!selectedPaymentMethod || isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing Payment...' : 'Pay Now'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
