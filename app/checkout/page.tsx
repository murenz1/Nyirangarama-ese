'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, CreditCard, Truck, Shield, MapPin } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useCartStore, useAuthStore } from '@/lib/store'
import { ordersAPI } from '@/lib/api'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
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
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/checkout')
      return
    }

    setIsPlacingOrder(true)
    try {
      await ordersAPI.create({
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        total: finalTotal,
        shippingName: formData.fullName,
        shippingPhone: formData.phone,
        shippingAddress: `${formData.address}, ${formData.city}`,
        shippingNotes: formData.notes
      })

      setIsSuccess(true)
      clearCart()
    } catch (error) {
      alert('Failed to place order. Please try again.')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-earth-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
            <Link href="/shop"><Button>Continue Shopping</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-earth-50">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-8">Thank you for your order. We will process it shortly.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop"><Button variant="outline">Continue Shopping</Button></Link>
              <Link href="/account"><Button>View Orders</Button></Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <div className="flex items-center gap-3 mb-6 font-bold text-gray-900">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary-600" />
                    </div>
                    Contact Information
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                    <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                    <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+250..." required />
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <div className="flex items-center gap-3 mb-6 font-bold text-gray-900">
                    <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-sage-600" />
                    </div>
                    Shipping Address
                  </div>
                  <div className="space-y-4">
                    <Input label="Street Address" name="address" value={formData.address} onChange={handleInputChange} required />
                    <Input label="City" name="city" value={formData.city} onChange={handleInputChange} required />
                    <textarea name="notes" rows={3} value={formData.notes} onChange={handleInputChange} placeholder="Order notes..." className="w-full px-4 py-2 border rounded-xl" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <div className="flex items-center gap-3 mb-6 font-bold text-gray-900">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <Truck className="w-5 h-5 text-amber-600" />
                    </div>
                    Payment Method
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                    Payment on delivery. We accept MTN MoMo, Airtel Money, or Cash.
                  </div>
                </div>

                <Button type="submit" size="lg" isLoading={isPlacingOrder} className="w-full">Place Order</Button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
                <h2 className="font-semibold text-lg mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.product.name} x {item.quantity}</span>
                      <span className="font-semibold">RWF {(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary-600">RWF {finalTotal.toLocaleString()}</span>
                  </div>
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
