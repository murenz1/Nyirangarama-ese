'use client'

import { useState } from 'react'
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
  MessageSquare,
  Phone,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { mockOrders, formatPrice, getStatusColor } from '@/data/orders'
import { clsx } from 'clsx'

const statusOptions = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const
type OrderStatus = typeof statusOptions[number]

interface Driver {
  id: string
  name: string
  phone: string
  status: 'available' | 'busy' | 'offline'
  vehicleType: string
  vehiclePlate: string
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [editingStatus, setEditingStatus] = useState<string | null>(null)
  const [orders, setOrders] = useState(mockOrders)
  const [assignModal, setAssignModal] = useState<string | null>(null)
  const [drivers, setDrivers] = useState<Driver[]>([])

  // Get available drivers from window or local state
  const getAvailableDrivers = (): Driver[] => {
    if (typeof window !== 'undefined' && (window as any).availableDrivers) {
      return (window as any).availableDrivers
    }
    return drivers.filter(d => d.status === 'available')
  }

  const setDriverStatus = (driverId: string, status: Driver['status'], orderId?: string) => {
    if (typeof window !== 'undefined' && (window as any).setDriverStatus) {
      (window as any).setDriverStatus(driverId, status, orderId)
    }
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, status } : d))
  }

  const filteredOrders = mockOrders
    .filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.shippingAddress.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === 'total') return b.total - a.total
      if (sortBy === 'status') return a.status.localeCompare(b.status)
      return 0
    })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'processing': return <Package className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <X className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 min-h-screen">
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
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {statusOptions.filter(s => s !== 'all').map((status) => {
              const count = mockOrders.filter(o => o.status === status).length
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

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-soft p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
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

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all appearance-none bg-white"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all appearance-none bg-white"
                >
                  <option value="date">Sort by Date</option>
                  <option value="total">Sort by Total</option>
                  <option value="status">Sort by Status</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders.filter(order => {
              const matchesSearch =
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.shippingAddress.fullName.toLowerCase().includes(searchQuery.toLowerCase())
              const matchesStatus = statusFilter === 'all' || order.status === statusFilter
              return matchesSearch && matchesStatus
            }).sort((a, b) => {
              if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              if (sortBy === 'total') return b.total - a.total
              if (sortBy === 'status') return a.status.localeCompare(b.status)
              return 0
            }).map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center', getStatusColor(order.status))}>
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <p className="text-sm font-medium text-primary-600">{order.shippingAddress.fullName}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                        <p className="text-sm text-gray-500">{order.items.length} items</p>
                      </div>

                      {editingStatus === order.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => {
                              const newStatus = e.target.value as Exclude<OrderStatus, 'all'>
                              setOrders(orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o))
                              setEditingStatus(null)
                            }}
                            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-500 outline-none"
                            autoFocus
                          >
                            {statusOptions.filter((s): s is Exclude<typeof s, 'all'> => s !== 'all').map(status => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => setEditingStatus(null)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingStatus(order.id)}
                          className={clsx('px-4 py-2 rounded-full text-sm font-medium capitalize flex items-center gap-2 hover:opacity-80 transition-opacity', getStatusColor(order.status))}
                        >
                          {order.status}
                          <Edit3 className="w-3 h-3" />
                        </button>
                      )}

                      {/* Assign Driver Button - only for pending/processing orders */}
                      {(order.status === 'pending' || order.status === 'processing') && !order.assignedDriver && (
                        <button
                          onClick={() => setAssignModal(order.id)}
                          className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-primary-200 transition-colors"
                        >
                          <Truck className="w-4 h-4" />
                          Assign Driver
                        </button>
                      )}

                      {order.assignedDriver && (
                        <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          {order.assignedDriver.name}
                        </div>
                      )}

                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order.id && (
                  <div className="p-6 bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Customer Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-700">
                            <span className="font-medium">Name:</span> {order.shippingAddress.fullName}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Address:</span> {order.shippingAddress.address}
                          </p>
                          {order.shippingAddress.notes && (
                            <p className="text-gray-700">
                              <span className="font-medium">Notes:</span> {order.shippingAddress.notes}
                            </p>
                          )}
                        </div>

                        {/* Assigned Driver Info */}
                        {order.assignedDriver && (
                          <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
                            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                              <Truck className="w-4 h-4" />
                              Assigned Driver
                            </h4>
                            <div className="space-y-1 text-sm">
                              <p className="text-green-800 font-medium">{order.assignedDriver.name}</p>
                              <p className="text-green-700 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {order.assignedDriver.phone}
                              </p>
                              <p className="text-green-700">
                                {order.assignedDriver.vehicleType} • {order.assignedDriver.vehiclePlate}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 text-sm">{item.product.name}</p>
                                <p className="text-xs text-gray-500">
                                  {formatPrice(item.product.price)} × {item.quantity}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-900">
                                {formatPrice(item.product.price * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-soft">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </div>

          {/* Assign Driver Modal */}
          {assignModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-xl text-gray-900">Assign Driver</h3>
                  <button onClick={() => setAssignModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {(() => {
                  const order = orders.find(o => o.id === assignModal)
                  const availableDrivers = getAvailableDrivers()
                  if (!order) return null

                  const handleAssign = (driver: Driver) => {
                    // Update order with assigned driver
                    setOrders(prev => prev.map(o => o.id === order.id ? {
                      ...o,
                      assignedDriver: driver,
                      status: 'processing'
                    } : o))

                    // Update driver status to busy
                    setDriverStatus(driver.id, 'busy', order.id)

                    // Send SMS notification simulation
                    const smsMessage = `New delivery assigned!\nOrder: ${order.id}\nCustomer: ${order.shippingAddress.fullName}\nPhone: ${order.shippingAddress.phone}\nAddress: ${order.shippingAddress.address}\nTotal: ${formatPrice(order.total)}\nItems: ${order.items.length}`

                    alert(`SMS sent to ${driver.name} at ${driver.phone}:\n\n${smsMessage}`)

                    setAssignModal(null)
                  }

                  return (
                    <>
                      <div className="p-6">
                        <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-gray-500">Order</p>
                          <p className="font-semibold text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
                          <p className="text-sm text-gray-500">{order.shippingAddress.address}</p>
                        </div>

                        <h4 className="font-medium text-gray-900 mb-3">Available Drivers ({availableDrivers.length})</h4>

                        {availableDrivers.length === 0 ? (
                          <div className="text-center py-8 bg-gray-50 rounded-xl">
                            <Truck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No available drivers</p>
                            <p className="text-sm text-gray-400 mt-1">All drivers are currently busy or offline</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {availableDrivers.map((driver) => (
                              <div
                                key={driver.id}
                                onClick={() => handleAssign(driver)}
                                className="p-4 border border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-all"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                      <span className="font-semibold text-primary-700 text-sm">
                                        {driver.name.split(' ').map(n => n[0]).join('')}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">{driver.name}</p>
                                      <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        {driver.phone}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        {driver.vehicleType} • {driver.vehiclePlate}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    Available
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="p-6 border-t border-gray-100 flex justify-end">
                        <Button variant="outline" onClick={() => setAssignModal(null)}>Cancel</Button>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
