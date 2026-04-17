'use client'

import { useState, useEffect } from 'react'
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
  Clock,
  ChevronDown,
  Loader2,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { adminAPI } from '@/lib/api'
import { clsx } from 'clsx'

export default function PromotionsPage() {
  const [promos, setPromos] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState<any>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    fetchPromos()
  }, [])

  async function fetchPromos() {
    try {
      setIsLoading(true)
      const data = await adminAPI.promotions.getAll()
      setPromos(data)
    } catch (error) {
      console.error('Error fetching promos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      try {
        await adminAPI.promotions.delete(id)
        setPromos(promos.filter(p => p.id !== id))
      } catch (error) {
        alert('Failed to delete promotion')
      }
    }
  }

  const filteredPromos = promos.filter((p) =>
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeCount = promos.filter(p => new Date(p.endDate) > new Date()).length
  const totalUsage = promos.reduce((sum, p) => sum + (p.usageCount || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-gray-900">Promotions</h1>
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="outline" size="sm">View Store</Button></Link>
              <Button size="sm" onClick={() => setAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" /> Create Promo
              </Button>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

          <div className="bg-white rounded-2xl shadow-soft p-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none"
              />
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
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Code</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Value</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Usage</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPromos.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-gray-900">
                          <div className="flex items-center gap-2">
                            {p.code}
                            <button onClick={() => handleCopy(p.code)} className="p-1 text-gray-400 hover:text-primary-600">
                              {copiedCode === p.code ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">{p.type === 'PERCENTAGE' ? `${p.value}%` : `RWF ${p.value}`}</td>
                        <td className="px-6 py-4">{p.usageCount || 0} / {p.usageLimit || '∞'}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setEditModal(p)} className="p-2 text-gray-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!isLoading && filteredPromos.length === 0 && (
              <div className="text-center py-20 text-gray-500">No promotions found</div>
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {(addModal || editModal) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = {
                  code: formData.get('code') as string,
                  type: formData.get('type') as string,
                  value: parseFloat(formData.get('value') as string),
                  minOrder: parseFloat(formData.get('minOrder') as string) || 0,
                  usageLimit: parseInt(formData.get('usageLimit') as string) || null,
                  startDate: formData.get('startDate') as string,
                  endDate: formData.get('endDate') as string,
                  status: formData.get('status') as string,
                }
                try {
                  if (editModal) {
                    await adminAPI.promotions.update(editModal.id, data)
                  } else {
                    await adminAPI.promotions.create(data)
                  }
                  fetchPromos()
                  setAddModal(false)
                  setEditModal(null)
                } catch (error) {
                  alert('Error saving promotion')
                }
              }}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{editModal ? 'Edit' : 'Create'} Promotion</h3>
                  <button type="button" onClick={() => { setAddModal(false); setEditModal(null); }}><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Promo Code</label>
                    <input name="code" required defaultValue={editModal?.code} className="w-full px-4 py-2 border rounded-xl uppercase" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Discount Type</label>
                      <select name="type" defaultValue={editModal?.type || 'PERCENTAGE'} className="w-full px-4 py-2 border rounded-xl bg-white">
                        <option value="PERCENTAGE">Percentage</option>
                        <option value="FIXED">Fixed Amount</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Value</label>
                      <input name="value" type="number" required defaultValue={editModal?.value} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Min Order</label>
                      <input name="minOrder" type="number" defaultValue={editModal?.minOrder || 0} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Usage Limit</label>
                      <input name="usageLimit" type="number" defaultValue={editModal?.usageLimit || ''} placeholder="Unlimited" className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <input name="startDate" type="datetime-local" required defaultValue={editModal ? new Date(editModal.startDate).toISOString().slice(0, 16) : ''} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Date</label>
                      <input name="endDate" type="datetime-local" required defaultValue={editModal ? new Date(editModal.endDate).toISOString().slice(0, 16) : ''} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select name="status" defaultValue={editModal?.status || 'ACTIVE'} className="w-full px-4 py-2 border rounded-xl bg-white">
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="p-6 border-t flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => { setAddModal(false); setEditModal(null); }}>Cancel</Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
