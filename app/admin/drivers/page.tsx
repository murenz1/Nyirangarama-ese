'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Truck,
  Search,
  Plus,
  Edit,
  Trash2,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  X,
  Star,
  MessageSquare,
  Loader2,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { adminAPI } from '@/lib/api'
import { clsx } from 'clsx'

export default function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [addModal, setAddModal] = useState(false)
  const [smsModal, setSmsModal] = useState<{ driverId: string; message: string } | null>(null)
  const [editModal, setEditModal] = useState<any>(null)

  useEffect(() => {
    fetchDrivers()
  }, [])

  async function fetchDrivers() {
    try {
      setIsLoading(true)
      const data = await adminAPI.drivers.getAll()
      setDrivers(data)
    } catch (error) {
      console.error('Error fetching drivers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this driver?')) {
      try {
        await adminAPI.drivers.delete(id)
        setDrivers(drivers.filter(d => d.id !== id))
      } catch (error) {
        alert('Failed to delete driver')
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-700'
      case 'busy': return 'bg-amber-100 text-amber-700'
      case 'offline': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone?.includes(searchQuery)
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-gray-900">Drivers Management</h1>
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="outline" size="sm">View Store</Button></Link>
              <Button size="sm" onClick={() => setAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Driver
              </Button>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="bg-white rounded-2xl shadow-soft p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search drivers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="BUSY">Busy</option>
                <option value="OFFLINE">Offline</option>
              </select>
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
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Driver</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDrivers.map((driver) => (
                      <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-semibold text-primary-700">
                              {driver.name.charAt(0)}
                            </div>
                            <p className="font-medium text-gray-900">{driver.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-sm">{driver.phone || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={clsx('px-3 py-1 rounded-full text-xs font-medium uppercase',
                            driver.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                              driver.status === 'BUSY' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700')}>
                            {driver.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setSmsModal({ driverId: driver.id, message: '' })} className="p-2 text-gray-400 hover:text-green-600">
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditModal(driver)} className="p-2 text-gray-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(driver.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!isLoading && filteredDrivers.length === 0 && (
              <div className="text-center py-20 text-gray-500">No drivers found</div>
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {(addModal || editModal) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              <form onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = {
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                  vehicleType: formData.get('vehicleType') as string,
                  vehiclePlate: formData.get('vehiclePlate') as string,
                  status: formData.get('status') as string,
                }
                try {
                  if (editModal) {
                    await adminAPI.drivers.update(editModal.id, data)
                  } else {
                    await adminAPI.drivers.create(data)
                  }
                  fetchDrivers()
                  setAddModal(false)
                  setEditModal(null)
                } catch (error) {
                  alert('Error saving driver')
                }
              }}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{editModal ? 'Edit' : 'Add'} Driver</h3>
                  <button type="button" onClick={() => { setAddModal(false); setEditModal(null); }}><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input name="name" required defaultValue={editModal?.name} className="w-full px-4 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input name="email" type="email" required defaultValue={editModal?.email} className="w-full px-4 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input name="phone" required defaultValue={editModal?.phone} className="w-full px-4 py-2 border rounded-xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                      <input name="vehicleType" required defaultValue={editModal?.vehicleType} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Plate Number</label>
                      <input name="vehiclePlate" required defaultValue={editModal?.vehiclePlate} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select name="status" defaultValue={editModal?.status || 'AVAILABLE'} className="w-full px-4 py-2 border rounded-xl bg-white">
                      <option value="AVAILABLE">Available</option>
                      <option value="BUSY">Busy</option>
                      <option value="OFFLINE">Offline</option>
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
