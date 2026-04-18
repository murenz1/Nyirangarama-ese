'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ShoppingBag,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  ArrowUpDown,
  User,
  Edit3,
  Phone,
  Loader2,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { adminAPI } from '@/lib/api'
import { Order } from '@/data/types'
import { clsx } from 'clsx'
import { Toast, ToastType } from '@/components/Toast'

const statusOptions = ['all', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const
type OrderStatus = typeof statusOptions[number]

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [editingStatus, setEditingStatus] = useState<string | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAssigning, setIsAssigning] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type })
  }

  useEffect(() => {
    fetchOrders()
    fetchDrivers()
  }, [])

  async function fetchDrivers() {
    try {
      const data = await adminAPI.drivers.getAll()
      setDrivers(data)
    } catch (error) {
      console.error('Error fetching drivers:', error)
    }
  }

  async function fetchOrders() {
    try {
      setIsLoading(true)
      const data = await adminAPI.orders.getAll()
      setOrders(data.orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function updateOrderStatus(orderId: string, status: string) {
    try {
      await adminAPI.orders.updateStatus(orderId, status)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as any } : o))
      setEditingStatus(null)
      showToast(`Order status updated to ${status}`, 'success')
      // Refresh drivers since status might have updated automatically
      fetchDrivers()
    } catch (error) {
      showToast('Failed to update status', 'error')
    }
  }

  async function assignDriver(orderId: string, driverId: string) {
    if (!driverId) return
    try {
      setIsAssigning(orderId)
      await adminAPI.orders.assignDriver(orderId, driverId)
      const updatedOrders = await adminAPI.orders.getAll()
      setOrders(updatedOrders.orders)
      setIsAssigning(null)
      fetchDrivers() // Update driver list statuses
      showToast('Driver assigned successfully', 'success')
    } catch (error) {
      showToast('Failed to assign driver', 'error')
      setIsAssigning(null)
    }
  }

  const formatPrice = (price: number) => {
    return `RWF ${price.toLocaleString()}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700'
      case 'PROCESSING': return 'bg-blue-100 text-blue-700'
      case 'SHIPPED': return 'bg-purple-100 text-purple-700'
      case 'DELIVERED': return 'bg-green-100 text-green-700'
      case 'CANCELLED': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />
      case 'PROCESSING': return <Package className="w-4 h-4" />
      case 'SHIPPED': return <Truck className="w-4 h-4" />
      case 'DELIVERED': return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED': return <X className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.shippingName?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === 'total') return b.total - a.total
      if (sortBy === 'status') return a.status.localeCompare(b.status)
      return 0
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="md:ml-64 flex-1 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-gray-900">
              Orders
            </h1>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  View Store
                </Button>
              </Link>
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="font-semibold text-primary-700">A</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Summary */}
          {!isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {statusOptions.filter(s => s !== 'all').map((status) => {
                const count = orders.filter(o => o.status === status).length
                return (
                  <div key={status} className="bg-white rounded-xl shadow-soft p-4">
                    <div className="flex items-center gap-3">
                      <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', getStatusColor(status))}>
                        {getStatusIcon(status)}
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                        <p className="text-sm text-gray-500 capitalize">{status}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-soft p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all appearance-none bg-white font-medium"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 bg-white rounded-2xl">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            ) : filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center', getStatusColor(order.status))}>
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                        <p className="text-sm font-medium text-primary-600">
                          {order.shippingName || 'Guest Customer'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                        <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
                      </div>

                      {editingStatus === order.id ? (
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
                          onBlur={() => setEditingStatus(null)}
                          autoFocus
                        >
                          {statusOptions.filter(s => s !== 'all').map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingStatus(order.id)}
                          className={clsx('px-4 py-2 rounded-full text-sm font-medium capitalize flex items-center gap-2', getStatusColor(order.status))}
                        >
                          {order.status}
                          <Edit3 className="w-3 h-3" />
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="p-6 bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Shipping Details</h4>
                        <div className="text-sm space-y-1 text-gray-600 mb-4">
                          <p><span className="font-medium">Phone:</span> {order.shippingPhone}</p>
                          <p><span className="font-medium">Address:</span> {order.shippingAddress}</p>
                        </div>

                        <h4 className="font-semibold text-gray-900 mb-2">Driver Assignment</h4>
                        <div className="flex items-center gap-3">
                          <select
                            className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                            value={order.assignedDriver?.id || ''}
                            onChange={(e) => assignDriver(order.id, e.target.value)}
                            disabled={isAssigning === order.id}
                          >
                            <option value="">Select a driver</option>
                            {[...drivers].sort((a, b) => {
                              if (a.status === 'AVAILABLE' && b.status !== 'AVAILABLE') return -1
                              if (a.status !== 'AVAILABLE' && b.status === 'AVAILABLE') return 1
                              return 0
                            }).map(driver => (
                              <option key={driver.id} value={driver.id}>
                                {driver.status === 'AVAILABLE' ? '🟢' : '🔴'} {driver.name} ({driver.status})
                              </option>
                            ))}
                          </select>
                          {isAssigning === order.id && <Loader2 className="w-4 h-4 animate-spin text-primary-600" />}
                        </div>
                        {order.assignedDriver && (
                          <div className="mt-2 text-xs text-primary-600 flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            Assigned to {order.assignedDriver.name}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                        <div className="space-y-2">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm bg-white p-2 rounded-lg shadow-sm">
                              <span>{item.product?.name || 'Product'} x {item.quantity}</span>
                              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {!isLoading && filteredOrders.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl shadow-soft">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </div>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </main>
    </div>
  )
}
