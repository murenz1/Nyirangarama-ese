'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  ShoppingBag,
  DollarSign,
  ChevronDown,
  Eye,
  ArrowUpDown,
  User,
  Edit,
  X,
  Lock,
  Key,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { mockOrders, formatPrice, getStatusColor } from '@/data/orders'
import { clsx } from 'clsx'

// Mock customers data derived from orders
const mockCustomers = [
  {
    id: 'CUST-001',
    name: 'Jean Pierre',
    email: 'jean.pierre@example.com',
    phone: '+250 788 305 558',
    orders: 12,
    totalSpent: 245000,
    lastOrder: '2024-03-15T10:30:00Z',
    status: 'active',
  },
  {
    id: 'CUST-002',
    name: 'Marie Claire',
    email: 'marie.claire@example.com',
    phone: '+250 788 123 456',
    orders: 8,
    totalSpent: 178000,
    lastOrder: '2024-03-10T14:20:00Z',
    status: 'active',
  },
  {
    id: 'CUST-003',
    name: 'Patrick Mugabe',
    email: 'patrick.m@example.com',
    phone: '+250 789 987 654',
    orders: 5,
    totalSpent: 95000,
    lastOrder: '2024-03-05T09:15:00Z',
    status: 'inactive',
  },
  {
    id: 'CUST-004',
    name: 'Alice Uwase',
    email: 'alice.u@example.com',
    phone: '+250 785 456 789',
    orders: 15,
    totalSpent: 320000,
    lastOrder: '2024-03-18T16:45:00Z',
    status: 'active',
  },
  {
    id: 'CUST-005',
    name: 'Robert Habineza',
    email: 'robert.h@example.com',
    phone: '+250 788 777 888',
    orders: 3,
    totalSpent: 45000,
    lastOrder: '2024-02-28T11:30:00Z',
    status: 'inactive',
  },
]

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [viewModal, setViewModal] = useState<string | null>(null)
  const [editModal, setEditModal] = useState<string | null>(null)
  const [passwordModal, setPasswordModal] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const filteredCustomers = mockCustomers
    .filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery)
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'orders') return b.orders - a.orders
      if (sortBy === 'spent') return b.totalSpent - a.totalSpent
      if (sortBy === 'lastOrder') return new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime()
      return 0
    })

  const totalCustomers = mockCustomers.length
  const activeCustomers = mockCustomers.filter(c => c.status === 'active').length
  const totalRevenue = mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-gray-900">
              Customers
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{totalCustomers}</p>
                  <p className="text-sm text-gray-500">Total Customers</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-sage-700" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{activeCustomers}</p>
                  <p className="text-sm text-gray-500">Active Customers</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-soft p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
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
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
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
                  <option value="name">Sort by Name</option>
                  <option value="orders">Sort by Orders</option>
                  <option value="spent">Sort by Spent</option>
                  <option value="lastOrder">Sort by Last Order</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Orders</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Spent</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Order</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-primary-700">
                              {customer.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{customer.name}</p>
                            <p className="text-sm text-gray-500">{customer.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{customer.orders}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {formatPrice(customer.totalSpent)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(customer.lastOrder).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          'px-3 py-1 rounded-full text-xs font-medium capitalize',
                          customer.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        )}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewModal(customer.id)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditModal(customer.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setPasswordModal(customer.id)}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No customers found</p>
              </div>
            )}
          </div>

          {/* View Customer Modal */}
          {viewModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {(() => {
                  const customer = mockCustomers.find(c => c.id === viewModal)
                  if (!customer) return null
                  const customerOrders = mockOrders.filter(o => o.shippingAddress.fullName === customer.name)
                  return (
                    <>
                      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-xl text-gray-900">Customer Details</h3>
                        <button onClick={() => setViewModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-semibold text-primary-700">{customer.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg text-gray-900">{customer.name}</h4>
                            <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700')}>
                              {customer.status}
                            </span>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{customer.email}</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">{customer.phone}</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500">Total Orders</p>
                            <p className="font-medium text-gray-900">{customer.orders}</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500">Total Spent</p>
                            <p className="font-medium text-gray-900">{formatPrice(customer.totalSpent)}</p>
                          </div>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-3">Recent Orders</h4>
                        <div className="space-y-2">
                          {customerOrders.slice(0, 3).map(order => (
                            <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                              <span className="font-medium text-gray-900">{order.id}</span>
                              <span className="text-sm text-gray-500">{formatPrice(order.total)}</span>
                              <span className={clsx('px-2 py-1 rounded-full text-xs', getStatusColor(order.status))}>{order.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}

          {/* Edit Customer Modal */}
          {editModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-xl text-gray-900">Edit Customer</h3>
                  <button onClick={() => setEditModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {(() => {
                    const customer = mockCustomers.find(c => c.id === editModal)
                    if (!customer) return null
                    return (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input type="text" defaultValue={customer.name} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input type="email" defaultValue={customer.email} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <input type="tel" defaultValue={customer.phone} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select defaultValue={customer.status} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </>
                    )
                  })()}
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setEditModal(null)}>Cancel</Button>
                  <Button onClick={() => { setEditModal(null); alert('Customer updated!') }}>Save Changes</Button>
                </div>
              </div>
            </div>
          )}

          {/* Password Reset Modal */}
          {passwordModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">Reset Password</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {mockCustomers.find(c => c.id === passwordModal)?.name}
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => { setPasswordModal(null); setNewPassword(''); setConfirmPassword('') }}>Cancel</Button>
                  <Button
                    onClick={() => {
                      if (newPassword !== confirmPassword) {
                        alert('Passwords do not match!')
                        return
                      }
                      if (newPassword.length < 6) {
                        alert('Password must be at least 6 characters!')
                        return
                      }
                      setPasswordModal(null)
                      setNewPassword('')
                      setConfirmPassword('')
                      alert('Password reset successfully!')
                    }}
                  >
                    Reset Password
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
