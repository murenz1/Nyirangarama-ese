'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, CreditCard, Truck, Shield, MapPin } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useCartStore } from '@/lib/store'
import { useAuthStore } from '@/lib/store'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: 'Kigali',
    notes: '',
  })

  const totalPrice = getTotalPrice()
  const shippingCost = totalPrice > 50000 ? 0 : 2500
  const finalTotal = totalPrice + shippingCost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPlacingOrder(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    setIsPlacingOrder(false)
    setIsSuccess(true)
    clearCart()
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-earth-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-earth-50">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 mb-8">
              Thank you for your order. We will send you a confirmation email shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
              <Link href="/account">
                <Button>View Orders</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-earth-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/cart"
              className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Checkout
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary-600" />
                    </div>
                    <h2 className="font-semibold text-lg text-gray-900">
                      Contact Information
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+250 78 123 4567"
                      required
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-sage-600" />
                    </div>
                    <h2 className="font-semibold text-lg text-gray-900">
                      Shipping Address
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <Input
                      label="Street Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="KG 123 St, Kigali"
                      required
                    />
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any special instructions for delivery..."
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-terracotta/10 rounded-full flex items-center justify-center">
                      <Truck className="w-5 h-5 text-terracotta" />
                    </div>
                    <h2 className="font-semibold text-lg text-gray-900">
                      Payment Method
                    </h2>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">
                      Payment on delivery. You will pay when your order is delivered.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isPlacingOrder}
                  className="w-full"
                >
                  Place Order
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
                <h2 className="font-semibold text-lg text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-earth-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-earth-400 font-bold">
                          {item.product.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} x {new Intl.NumberFormat('en-RW', {
                            style: 'currency',
                            currency: 'RWF',
                            minimumFractionDigits: 0,
                          }).format(item.product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>
                      {new Intl.NumberFormat('en-RW', {
                        style: 'currency',
                        currency: 'RWF',
                        minimumFractionDigits: 0,
                      }).format(totalPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? 'Free' : new Intl.NumberFormat('en-RW', {
                        style: 'currency',
                        currency: 'RWF',
                        minimumFractionDigits: 0,
                      }).format(shippingCost)}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-xl text-primary-600">
                        {new Intl.NumberFormat('en-RW', {
                          style: 'currency',
                          currency: 'RWF',
                          minimumFractionDigits: 0,
                        }).format(finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
