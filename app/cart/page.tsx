'use client'

import Link from 'next/link'
import { ShoppingCart, ArrowRight, Trash2 } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/Button'
import { CartItem } from '@/components/CartItem'
import { useCartStore } from '@/lib/store'

export default function CartPage() {
  const { items, clearCart, getTotalPrice } = useCartStore()
  const totalPrice = getTotalPrice()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-earth-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
              Shopping Cart
            </h1>
            <p className="text-gray-600 mt-2">
              Review your items and proceed to checkout
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {items.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-lg text-gray-900">
                      Cart Items ({items.length})
                    </h2>
                    <button
                      onClick={clearCart}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Cart
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <CartItem key={item.product.id} item={item} />
                    ))}
                  </div>
                </div>

                <Link
                  href="/shop"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mt-6"
                >
                  ← Continue Shopping
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
                  <h2 className="font-semibold text-lg text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>
                        {new Intl.NumberFormat('en-RW', {
                          style: 'currency',
                          currency: 'RWF',
                          minimumFractionDigits: 0,
                        }).format(totalPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-bold text-xl text-primary-600">
                          {new Intl.NumberFormat('en-RW', {
                            style: 'currency',
                            currency: 'RWF',
                            minimumFractionDigits: 0,
                          }).format(totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <Button size="lg" className="w-full">
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Shipping and taxes calculated at checkout
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. 
                Explore our products and find something you love!
              </p>
              <Link href="/shop">
                <Button size="lg">
                  Start Shopping
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
