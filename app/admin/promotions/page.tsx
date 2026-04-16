'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Tag,
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Check,
  X,
  Percent,
  Calendar,
  Clock,
  ChevronDown,
  Eye,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { clsx } from 'clsx'

// Mock promo codes
const mockPromos = [
  {
    id: 'PROMO-001',
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    minOrder: 10000,
    maxDiscount: 5000,
    usageLimit: 100,
    usageCount: 45,
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    status: 'active',
  },
  {
    id: 'PROMO-002',
    code: 'SUMMER50',
    type: 'percentage',
    value: 50,
    minOrder: 50000,
    maxDiscount: 15000,
    usageLimit: 50,
    usageCount: 12,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    status: 'active',
  },
  {
    id: 'PROMO-003',
    code: 'FREESHIP',
    type: 'shipping',
    value: 0,
    minOrder: 25000,
    maxDiscount: 5000,
    usageLimit: 200,
    usageCount: 89,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
  },
  {
    id: 'PROMO-004',
    code: 'FLASH5000',
    type: 'fixed',
    value: 5000,
    minOrder: 30000,
    maxDiscount: 5000,
    usageLimit: 30,
    usageCount: 30,
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    status: 'expired',
  },
]

export default function PromotionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [promos, setPromos] = useState(mockPromos)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrder: '',
    maxDiscount: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
  })

  const filteredPromos = promos.filter((promo) => {
    const matchesSearch = promo.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || promo.status === statusFilter
    const matchesType = typeFilter === 'all' || promo.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const activeCount = promos.filter(p => p.status === 'active').length
  const expiredCount = promos.filter(p => p.status === 'expired').length
  const totalUsage = promos.reduce((sum, p) => sum + p.usageCount, 0)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleDelete = (id: string) => {
    setPromos(promos.filter(p => p.id !== id))
    setDeleteModal(null)
  }

  const handleAdd = () => {
    const newPromo = {
      id: `PROMO-${String(promos.length + 1).padStart(3, '0')}`,
      code: formData.code.toUpperCase(),
      type: formData.type as 'percentage' | 'fixed' | 'shipping',
      value: Number(formData.value),
      minOrder: Number(formData.minOrder),
      maxDiscount: Number(formData.maxDiscount),
      usageLimit: Number(formData.usageLimit),
      usageCount: 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'active',
    }
    setPromos([...promos, newPromo])
    setAddModal(false)
    setFormData({ code: '', type: 'percentage', value: '', minOrder: '', maxDiscount: '', usageLimit: '', startDate: '', endDate: '' })
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage': return 'Percentage Off'
      case 'fixed': return 'Fixed Amount'
      case 'shipping': return 'Free Shipping'
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage': return 'bg-purple-100 text-purple-700'
      case 'fixed': return 'bg-blue-100 text-blue-700'
      case 'shipping': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
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
              Promotions
            </h1>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  View Store
                </Button>
              </Link>
              <Button size="sm" onClick={() => setAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Promo
              </Button>
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="font-semibold text-primary-700">A</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Tag className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{activeCount}</p>
                  <p className="text-sm text-gray-500">Active Promos</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{expiredCount}</p>
                  <p className="text-sm text-gray-500">Expired Promos</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Percent className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{totalUsage}</p>
                  <p className="text-sm text-gray-500">Total Usage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-soft p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search promo codes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all appearance-none bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="shipping">Free Shipping</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <Eye className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Promos Table */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Code</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Value</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Usage</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Valid Period</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPromos.map((promo) => (
                    <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                            {promo.code}
                          </span>
                          <button
                            onClick={() => handleCopy(promo.code)}
                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                          >
                            {copiedCode === promo.code ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', getTypeColor(promo.type))}>
                          {getTypeLabel(promo.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">
                            {promo.type === 'percentage' && `${promo.value}% off`}
                            {promo.type === 'fixed' && `RWF ${promo.value.toLocaleString()} off`}
                            {promo.type === 'shipping' && 'Free shipping'}
                          </p>
                          <p className="text-gray-500">Min: RWF {promo.minOrder.toLocaleString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">{promo.usageCount} / {promo.usageLimit}</p>
                          <div className="w-24 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full"
                              style={{ width: `${(promo.usageCount / promo.usageLimit) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          <p>{new Date(promo.startDate).toLocaleDateString()}</p>
                          <p>to {new Date(promo.endDate).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          'px-3 py-1 rounded-full text-xs font-medium capitalize',
                          promo.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        )}>
                          {promo.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditModal(promo.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal(promo.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPromos.length === 0 && (
              <div className="text-center py-12">
                <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No promo codes found</p>
              </div>
            )}
          </div>

          {/* Add Modal */}
          {addModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-xl text-gray-900">Create Promo Code</h3>
                  <button onClick={() => setAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. SUMMER20"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                    >
                      <option value="percentage">Percentage Off</option>
                      <option value="fixed">Fixed Amount Off</option>
                      <option value="shipping">Free Shipping</option>
                    </select>
                  </div>
                  {formData.type !== 'shipping' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {formData.type === 'percentage' ? 'Discount %' : 'Discount Amount (RWF)'}
                      </label>
                      <input
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Min Order (RWF)</label>
                      <input
                        type="number"
                        value={formData.minOrder}
                        onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount (RWF)</label>
                      <input
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setAddModal(false)}>Cancel</Button>
                  <Button onClick={handleAdd}>Create Promo</Button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {editModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-xl text-gray-900">Edit Promo Code</h3>
                  <button onClick={() => setEditModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {(() => {
                  const promo = promos.find(p => p.id === editModal)
                  if (!promo) return null
                  return (
                    <>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                          <input
                            type="text"
                            defaultValue={promo.code}
                            id="edit-code"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                          <select
                            defaultValue={promo.type}
                            id="edit-type"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                          >
                            <option value="percentage">Percentage Off</option>
                            <option value="fixed">Fixed Amount Off</option>
                            <option value="shipping">Free Shipping</option>
                          </select>
                        </div>
                        {promo.type !== 'shipping' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {promo.type === 'percentage' ? 'Discount %' : 'Discount Amount (RWF)'}
                            </label>
                            <input
                              type="number"
                              defaultValue={promo.value}
                              id="edit-value"
                              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                            />
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Order (RWF)</label>
                            <input
                              type="number"
                              defaultValue={promo.minOrder}
                              id="edit-minOrder"
                              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount (RWF)</label>
                            <input
                              type="number"
                              defaultValue={promo.maxDiscount}
                              id="edit-maxDiscount"
                              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                          <input
                            type="number"
                            defaultValue={promo.usageLimit}
                            id="edit-usageLimit"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                              type="date"
                              defaultValue={promo.startDate}
                              id="edit-startDate"
                              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                              type="date"
                              defaultValue={promo.endDate}
                              id="edit-endDate"
                              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            defaultValue={promo.status}
                            id="edit-status"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                          >
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                          </select>
                        </div>
                      </div>
                      <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setEditModal(null)}>Cancel</Button>
                        <Button onClick={() => {
                          const code = (document.getElementById('edit-code') as HTMLInputElement).value.toUpperCase()
                          const type = (document.getElementById('edit-type') as HTMLSelectElement).value
                          const value = type === 'shipping' ? 0 : Number((document.getElementById('edit-value') as HTMLInputElement).value)
                          const minOrder = Number((document.getElementById('edit-minOrder') as HTMLInputElement).value)
                          const maxDiscount = Number((document.getElementById('edit-maxDiscount') as HTMLInputElement).value)
                          const usageLimit = Number((document.getElementById('edit-usageLimit') as HTMLInputElement).value)
                          const startDate = (document.getElementById('edit-startDate') as HTMLInputElement).value
                          const endDate = (document.getElementById('edit-endDate') as HTMLInputElement).value
                          const status = (document.getElementById('edit-status') as HTMLSelectElement).value
                          setPromos(promos.map(p => p.id === editModal ? {
                            ...p,
                            code,
                            type,
                            value,
                            minOrder,
                            maxDiscount,
                            usageLimit,
                            startDate,
                            endDate,
                            status
                          } : p))
                          setEditModal(null)
                          alert('Promo code updated!')
                        }}>Save Changes</Button>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {deleteModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Delete Promo Code</h3>
                  <p className="text-gray-500 mb-6">Are you sure you want to delete this promo code? This action cannot be undone.</p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancel</Button>
                    <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(deleteModal)}>Delete</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
