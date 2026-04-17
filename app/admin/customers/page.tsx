'use client'

import { useState, useEffect } from 'react'
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
  X,
  Loader2,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { adminAPI } from '@/lib/api'
import { clsx } from 'clsx'

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [viewModal, setViewModal] = useState<string | null>(null)

  const [customers, setCustomers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function fetchCustomers() {
    try {
      setIsLoading(true)
      const data = await adminAPI.customers.getAll()
      setCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return `RWF ${price.toLocaleString()}`
  }

  async function toggleRole(id: string, currentRole: string) {
    if (confirm(`Are you sure you want to change this user's role to ${currentRole === 'admin' ? 'customer' : 'admin'}?`)) {
      try {
        const newRole = currentRole === 'admin' ? 'customer' : 'admin'
        await adminAPI.customers.update(id, { role: newRole })
        fetchCustomers()
      } catch (error) {
        alert('Failed to update role. Please ensure you have super-admin privileges.')
      }
    }
  }

  const filteredCustomers = customers
    .filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || customer.role === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'orders') return (b.ordersCount || 0) - (a.ordersCount || 0)
      return 0
    })

  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 md:ml-64 min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-gray-900">User & Role Management</h1>
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="outline" size="sm">View Store</Button></Link>
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="font-semibold text-primary-700">A</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : customers.length}</p>
                  <p className="text-sm text-gray-500">Total Users</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-sage-700" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? '...' : customers.filter(c => c.role === 'admin').length}
                  </p>
                  <p className="text-sm text-gray-500">Administrators</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : formatPrice(totalRevenue)}</p>
                  <p className="text-sm text-gray-500">Global Customer LTV</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins Only</option>
                  <option value="customer">Customers Only</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User Details</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Orders</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={clsx(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              customer.role === 'admin' ? "bg-primary-600 text-white" : "bg-primary-100 text-primary-700"
                            )}>
                              <span className="font-semibold">{customer.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{customer.name}</p>
                              <p className="text-xs text-gray-500">{customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{customer.ordersCount || 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleRole(customer.id, customer.role)}
                            className={clsx(
                              'group relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all border outline-none min-w-[100px] justify-center',
                              customer.role === 'admin'
                                ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                                : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                            )}
                            title={`Change to ${customer.role === 'admin' ? 'customer' : 'admin'}`}
                          >
                            <span className={clsx(
                              "w-2 h-2 rounded-full",
                              customer.role === 'admin' ? "bg-purple-500 animate-pulse" : "bg-blue-500"
                            )} />
                            {customer.role}
                            <ArrowUpDown className="w-3 h-3 ml-1 opacity-40 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setViewModal(customer.id)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!isLoading && filteredCustomers.length === 0 && (
              <div className="text-center py-20 pb-32">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No users match your filters</p>
                <Button variant="ghost" className="mt-4" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>Clear all filters</Button>
              </div>
            )}
          </div>
        </div>

        {/* View Modal */}
        {viewModal && (() => {
          const customer = customers.find(c => c.id === viewModal)
          if (!customer) return null
          return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-xl text-gray-900">User Details</h3>
                  <button onClick={() => setViewModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={clsx(
                      "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold",
                      customer.role === 'admin' ? "bg-primary-600 text-white" : "bg-primary-100 text-primary-700"
                    )}>
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-gray-900">{customer.name}</h4>
                      <p className="text-gray-500">{customer.email}</p>
                      <span className={clsx(
                        'mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase',
                        customer.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      )}>
                        {customer.role}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                      <p className="font-bold text-lg text-gray-900">{customer.ordersCount || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Total Spent</p>
                      <p className="font-bold text-lg text-gray-900">{formatPrice(customer.totalSpent || 0)}</p>
                    </div>
                  </div>

                  {customer.phone && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                      <p className="font-medium text-gray-900">{customer.phone}</p>
                    </div>
                  )}

                  <div className="mt-4 bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Account Created</p>
                    <p className="font-medium text-gray-900">
                      {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

      </main>
    </div>
  )
}
