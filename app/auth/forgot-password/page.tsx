'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call to send reset email
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock validation
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="font-display font-bold text-3xl text-primary-700">
                Nyirangarama
              </span>
            </Link>
            <p className="text-gray-600 mt-2">Reset your password</p>
          </div>

          {/* Forgot Password Form */}
          <div className="bg-white rounded-2xl shadow-soft p-8">
            {!isSubmitted ? (
              <>
                <h1 className="font-display text-2xl font-bold text-gray-900 mb-2 text-center">
                  Forgot Password?
                </h1>
                <p className="text-gray-600 text-center mb-6 text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />

                  <Button
                    type="submit"
                    size="lg"
                    isLoading={isLoading}
                    className="w-full"
                  >
                    Send Reset Link
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="font-display text-xl font-bold text-gray-900 mb-2">
                  Check Your Email
                </h2>
                <p className="text-gray-600 mb-6 text-sm">
                  We've sent a password reset link to{' '}
                  <span className="font-medium text-gray-900">{formData.email}</span>.{' '}
                  Please check your inbox and follow the instructions.
                </p>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            © {new Date().getFullYear()} Nyirangarama. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
