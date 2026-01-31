import React, { useEffect, useState } from 'react'
import { useSearchParams, useLocation, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import * as authService from '@/services/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Mail } from 'lucide-react'
import { toast } from 'sonner'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const token = searchParams.get('token')
  const emailFromQuery = searchParams.get('email')
  const { completeVerification } = useAuth()
  const [status, setStatus] = useState(token ? 'loading' : 'form') // 'form' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState(() => location.state?.email || emailFromQuery || '')
  const [otp, setOtp] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Link verification: GET /verify-email?token=xxx
  useEffect(() => {
    if (!token) return
    let cancelled = false
    const run = async () => {
      try {
        const data = await authService.verifyEmail(token)
        if (cancelled) return
        setStatus('success')
        setMessage(data?.message || 'Email verified successfully.')
        if (data?.accessToken && data?.refreshToken) {
          completeVerification(data)
          return
        }
      } catch (err) {
        if (cancelled) return
        setStatus('error')
        setMessage(err.response?.data?.message || 'Invalid or expired verification link.')
      }
    }
    run()
    return () => { cancelled = true }
  }, [token, completeVerification])

  const handleSubmitOtp = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email.')
      return
    }
    if (!otp.trim() || otp.length < 6) {
      toast.error('Please enter the 6-digit code from your email.')
      return
    }
    setIsSubmitting(true)
    try {
      const data = await authService.verifyEmailWithOtp(email.trim(), otp.trim())
      if (data?.accessToken && data?.refreshToken) {
        setStatus('success')
        setMessage(data?.message || 'Email verified successfully.')
        try {
          completeVerification(data)
        } catch (e) {
          toast.error('Something went wrong. Please try signing in.')
          console.error('completeVerification error:', e)
        }
        return
      }
      setStatus('success')
      setMessage(data?.message || 'Email verified successfully.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired code. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {status === 'form' && 'Verify your email'}
            {status === 'loading' && 'Verifying your email…'}
            {status === 'success' && 'Email verified'}
            {status === 'error' && 'Verification failed'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {status === 'form' && "We've sent a 6-digit code to your email. Enter the code from the email below to verify."}
            {status === 'loading' && 'Please wait.'}
            {status === 'success' && 'Your email has been verified successfully.'}
            {status === 'error' && "We could not verify your email with this link."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === 'form' && (
            <form onSubmit={handleSubmitOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verify-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="verify-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="verify-otp">6-digit code</Label>
                <Input
                  id="verify-otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  autoComplete="one-time-code"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Verifying…' : 'Verify'}
              </Button>
            </form>
          )}

          {status === 'loading' && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent" />
            </div>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <p className="text-center text-gray-700">{message}</p>
              <p className="text-center text-sm text-gray-500">Redirecting to home…</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
              </div>
              <p className="text-center text-gray-700">{message}</p>
              <div className="flex justify-center">
                <Button asChild>
                  <Link to="/">Go to Home</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyEmailPage
