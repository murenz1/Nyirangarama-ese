'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useAuthStore } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const success = await login(formData.email, formData.password)

    if (success) {
      // Small delay to ensure store is updated
      setTimeout(() => {
        const user = useAuthStore.getState().user
        if (user?.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/account')
        }
      }, 100)
    } else {
      setError('Invalid email or password.')
    }

    setIsLoading(false)
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
            <p className="text-gray-600 mt-2">Welcome back!</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <h1 className="font-display text-2xl font-bold text-gray-900 mb-6 text-center">
              Sign In
            </h1>

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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jean@example.com"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                Sign In
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign up
                </Link>
              </p>
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
