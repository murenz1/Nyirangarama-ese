'use client'

import { useState } from 'react'
import { Search, Truck, Package, CheckCircle, Clock, MapPin, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { mockOrders, getStatusColor } from '@/data/orders'
import { Order } from '@/data/types'
import { clsx } from 'clsx'

const statusSteps = [
  { status: 'pending', label: 'Order Placed', icon: Clock },
  { status: 'processing', label: 'Processing', icon: Package },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle },
]

const statusDescriptions: Record<string, string> = {
  pending: 'Your order has been received and is being prepared.',
  processing: 'Your order is being packed and prepared for shipment.',
  shipped: 'Your order is on its way to you.',
  delivered: 'Your order has been delivered successfully.',
  cancelled: 'This order has been cancelled.',
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null)
  const [error, setError] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSearching(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const order = mockOrders.find((o) => o.id.toLowerCase() === orderId.toLowerCase())
    
    if (order) {
      setSearchedOrder(order)
    } else {
      setError('Order not found. Please check your order ID and try again.')
      setSearchedOrder(null)
    }

    setIsSearching(false)
  }

  const getCurrentStep = (status: string) => {
    const index = statusSteps.findIndex((step) => step.status === status)
    return index >= 0 ? index : 0
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-earth-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
              Track Your Order
            </h1>
            <p className="text-gray-600 mt-2">
              Enter your order ID to check the status of your delivery
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  label="Order ID"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g., ORD-001"
                  required
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  isLoading={isSearching}
                  className="w-full sm:w-auto"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Track Order
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Order Details */}
          {searchedOrder && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="text-xl font-bold text-gray-900">{searchedOrder.id}</p>
                  </div>
                  <div className={clsx(
                    'px-4 py-2 rounded-full text-sm font-medium',
                    getStatusColor(searchedOrder.status)
                  )}>
                    {searchedOrder.status.charAt(0).toUpperCase() + searchedOrder.status.slice(1)}
                  </div>
                </div>

                <p className="text-gray-600">
                  {statusDescriptions[searchedOrder.status]}
                </p>
              </div>

              {/* Tracking Timeline */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="font-semibold text-lg text-gray-900 mb-6">Order Status</h2>
                
                <div className="relative">
                  {/* Progress Bar */}
                  <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-primary-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${(getCurrentStep(searchedOrder.status) / (statusSteps.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {statusSteps.map((step, index) => {
                      const Icon = step.icon
                      const currentStep = getCurrentStep(searchedOrder.status)
                      const isCompleted = index <= currentStep
                      const isCurrent = index === currentStep

                      return (
                        <div key={step.status} className="flex flex-col items-center">
                          <div
                            className={clsx(
                              'w-12 h-12 rounded-full flex items-center justify-center z-10 transition-colors',
                              isCompleted
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-200 text-gray-400'
                            )}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="mt-3 text-center">
                            <p
                              className={clsx(
                                'text-sm font-medium',
                                isCompleted ? 'text-gray-900' : 'text-gray-400'
                              )}
                            >
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-xs text-primary-600 mt-1">Current</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                  </div>
                  <div className="text-gray-600 space-y-1">
                    <p className="font-medium text-gray-900">{searchedOrder.shippingAddress.fullName}</p>
                    <p>{searchedOrder.shippingAddress.phone}</p>
                    <p>{searchedOrder.shippingAddress.address}</p>
                    {searchedOrder.shippingAddress.notes && (
                      <p className="text-sm text-gray-500 mt-2">
                        Note: {searchedOrder.shippingAddress.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                      <Truck className="w-5 h-5 text-sage-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Delivery Information</h3>
                  </div>
                  <div className="text-gray-600 space-y-2">
                    <div className="flex justify-between">
                      <span>Order Date:</span>
                      <span className="font-medium">
                        {new Date(searchedOrder.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span className="font-medium">{searchedOrder.items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('en-RW', {
                          style: 'currency',
                          currency: 'RWF',
                          minimumFractionDigits: 0,
                        }).format(searchedOrder.total)}
                      </span>
                    </div>
                    {searchedOrder.assignedDriver && (
                      <div className="pt-2 border-t border-gray-100 mt-2">
                        <p className="text-sm text-gray-500">Assigned Driver</p>
                        <p className="font-medium text-gray-900">{searchedOrder.assignedDriver.name}</p>
                        <p className="text-sm">{searchedOrder.assignedDriver.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {searchedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-400 font-bold">
                            {item.product.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x{' '}
                          {new Intl.NumberFormat('en-RW', {
                            style: 'currency',
                            currency: 'RWF',
                            minimumFractionDigits: 0,
                          }).format(item.product.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {new Intl.NumberFormat('en-RW', {
                            style: 'currency',
                            currency: 'RWF',
                            minimumFractionDigits: 0,
                          }).format(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
