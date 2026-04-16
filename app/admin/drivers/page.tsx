'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Truck,
  Search,
  Plus,
  Edit,
  Trash2,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  X,
  Star,
  Package,
  MessageSquare,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { clsx } from 'clsx'

// Mock drivers data
interface Driver {
  id: string
  name: string
  phone: string
  email: string
  status: 'available' | 'busy' | 'offline'
  rating: number
  totalDeliveries: number
  vehicleType: string
  vehiclePlate: string
  currentOrderId?: string
  joinedAt: string
}

const mockDrivers: Driver[] = [
  {
    id: 'DRV-001',
    name: 'Emmanuel Mutabazi',
    phone: '+250 788 111 222',
    email: 'emmanuel.m@example.com',
    status: 'available',
    rating: 4.8,
    totalDeliveries: 156,
    vehicleType: 'Motorcycle',
    vehiclePlate: 'RAA 123A',
    joinedAt: '2023-06-15',
  },
  {
    id: 'DRV-002',
    name: 'Jean Bosco',
    phone: '+250 789 333 444',
    email: 'jean.b@example.com',
    status: 'busy',
    rating: 4.6,
    totalDeliveries: 89,
    vehicleType: 'Motorcycle',
    vehiclePlate: 'RAB 456B',
    currentOrderId: 'ORD-456',
    joinedAt: '2023-08-20',
  },
  {
    id: 'DRV-003',
    name: 'Claire Uwimana',
    phone: '+250 785 555 666',
    email: 'claire.u@example.com',
    status: 'available',
    rating: 4.9,
    totalDeliveries: 234,
    vehicleType: 'Car',
    vehiclePlate: 'RAC 789C',
    joinedAt: '2023-05-10',
  },
  {
    id: 'DRV-004',
    name: 'Patrick Niyonzima',
    phone: '+250 788 777 888',
    email: 'patrick.n@example.com',
    status: 'offline',
    rating: 4.5,
    totalDeliveries: 67,
    vehicleType: 'Motorcycle',
    vehiclePlate: 'RAD 012D',
    joinedAt: '2024-01-15',
  },
  {
    id: 'DRV-005',
    name: 'Sandrine Ingabire',
    phone: '+250 789 999 000',
    email: 'sandrine.i@example.com',
    status: 'available',
    rating: 4.7,
    totalDeliveries: 123,
    vehicleType: 'Car',
    vehiclePlate: 'RAE 345E',
    joinedAt: '2023-09-01',
  },
]

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<string | null>(null)
  const [smsModal, setSmsModal] = useState<{ driverId: string; message: string } | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: 'Motorcycle',
    vehiclePlate: '',
  })

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone.includes(searchQuery) ||
      driver.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const availableCount = drivers.filter(d => d.status === 'available').length
  const busyCount = drivers.filter(d => d.status === 'busy').length
  const offlineCount = drivers.filter(d => d.status === 'offline').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700'
      case 'busy': return 'bg-amber-100 text-amber-700'
      case 'offline': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />
      case 'busy': return <Clock className="w-4 h-4" />
      case 'offline': return <XCircle className="w-4 h-4" />
    }
  }

  const handleAdd = () => {
    const newDriver: Driver = {
      id: `DRV-${String(drivers.length + 1).padStart(3, '0')}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      vehicleType: formData.vehicleType,
      vehiclePlate: formData.vehiclePlate.toUpperCase(),
      status: 'available',
      rating: 5.0,
      totalDeliveries: 0,
      joinedAt: new Date().toISOString().split('T')[0],
    }
    setDrivers([...drivers, newDriver])
    setAddModal(false)
    setFormData({ name: '', phone: '', email: '', vehicleType: 'Motorcycle', vehiclePlate: '' })
    alert('Driver added successfully!')
  }

  const handleEdit = (driverId: string, updatedData: Partial<Driver>) => {
    setDrivers(drivers.map(d => d.id === driverId ? { ...d, ...updatedData } : d))
    setEditModal(null)
    alert('Driver updated successfully!')
  }

  const handleDelete = (driverId: string) => {
    setDrivers(drivers.filter(d => d.id !== driverId))
    setDeleteModal(null)
    alert('Driver removed successfully!')
  }

  const handleSendSMS = (driverId: string, message: string) => {
    const driver = drivers.find(d => d.id === driverId)
    if (driver) {
      alert(`SMS sent to ${driver.name} at ${driver.phone}:\n\n${message}`)
      setSmsModal(null)
    }
  }

  // Make available drivers accessible to other components via window object
  if (typeof window !== 'undefined') {
    (window as any).availableDrivers = drivers.filter(d => d.status === 'available')
    ;(window as any).allDrivers = drivers
    ;(window as any).setDriverStatus = (driverId: string, status: Driver['status'], orderId?: string) => {
      setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, status, currentOrderId: orderId } : d))
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
              Drivers Management
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{drivers.length}</p>
                  <p className="text-sm text-gray-500">Total Drivers</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{availableCount}</p>
                  <p className="text-sm text-gray-500">Available</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{busyCount}</p>
                  <p className="text-sm text-gray-500">On Delivery</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{offlineCount}</p>
                  <p className="text-sm text-gray-500">Offline</p>
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
                  placeholder="Search drivers by name, phone, or plate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="busy">On Delivery</option>
                  <option value="offline">Offline</option>
                </select>
                <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <Button onClick={() => setAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Driver
              </Button>
            </div>
          </div>

          {/* Drivers Table */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Driver</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Performance</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-primary-700">
                              {driver.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{driver.name}</p>
                            <p className="text-sm text-gray-500">{driver.id}</p>
                            {driver.currentOrderId && (
                              <p className="text-xs text-amber-600 font-medium">
                                Order: {driver.currentOrderId}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {driver.phone}
                          </div>
                          <div className="text-sm text-gray-500">{driver.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{driver.vehicleType}</p>
                          <p className="text-gray-500">{driver.vehiclePlate}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={clsx(
                            'px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1.5',
                            getStatusColor(driver.status)
                          )}>
                            {getStatusIcon(driver.status)}
                            {driver.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-gray-900">{driver.rating}</span>
                          </div>
                          <p className="text-gray-500">{driver.totalDeliveries} deliveries</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSmsModal({ driverId: driver.id, message: '' })}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Send SMS"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditModal(driver.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal(driver.id)}
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

            {filteredDrivers.length === 0 && (
              <div className="text-center py-12">
                <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No drivers found</p>
              </div>
            )}
          </div>

          {/* Add Driver Modal */}
          {addModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-xl text-gray-900">Add New Driver</h3>
                  <button onClick={() => setAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter driver name"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+250 7XX XXX XXX"
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="driver@example.com"
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                      <select
                        value={formData.vehicleType}
                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                      >
                        <option value="Motorcycle">Motorcycle</option>
                        <option value="Car">Car</option>
                        <option value="Bicycle">Bicycle</option>
                        <option value="Van">Van</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Plate</label>
                      <input
                        type="text"
                        value={formData.vehiclePlate}
                        onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                        placeholder="RAA 123A"
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setAddModal(false)}>Cancel</Button>
                  <Button onClick={handleAdd}>Add Driver</Button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Driver Modal */}
          {editModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-xl text-gray-900">Edit Driver</h3>
                  <button onClick={() => setEditModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {(() => {
                  const driver = drivers.find(d => d.id === editModal)
                  if (!driver) return null
                  return (
                    <>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            defaultValue={driver.name}
                            id="edit-name"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                              type="tel"
                              defaultValue={driver.phone}
                              id="edit-phone"
                              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                              type="email"
                              defaultValue={driver.email}
                              id="edit-email"
                              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                            <select
                              defaultValue={driver.vehicleType}
                              id="edit-vehicle"
                              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                            >
                              <option value="Motorcycle">Motorcycle</option>
                              <option value="Car">Car</option>
                              <option value="Bicycle">Bicycle</option>
                              <option value="Van">Van</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Plate</label>
                            <input
                              type="text"
                              defaultValue={driver.vehiclePlate}
                              id="edit-plate"
                              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            defaultValue={driver.status}
                            id="edit-status"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                          >
                            <option value="available">Available</option>
                            <option value="busy">On Delivery</option>
                            <option value="offline">Offline</option>
                          </select>
                        </div>
                      </div>
                      <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setEditModal(null)}>Cancel</Button>
                        <Button onClick={() => {
                          const name = (document.getElementById('edit-name') as HTMLInputElement).value
                          const phone = (document.getElementById('edit-phone') as HTMLInputElement).value
                          const email = (document.getElementById('edit-email') as HTMLInputElement).value
                          const vehicleType = (document.getElementById('edit-vehicle') as HTMLSelectElement).value
                          const vehiclePlate = (document.getElementById('edit-plate') as HTMLInputElement).value
                          const status = (document.getElementById('edit-status') as HTMLSelectElement).value as Driver['status']
                          handleEdit(editModal, { name, phone, email, vehicleType, vehiclePlate, status })
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
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Remove Driver</h3>
                  <p className="text-gray-500 mb-6">Are you sure you want to remove this driver? This action cannot be undone.</p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancel</Button>
                    <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(deleteModal)}>Remove</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SMS Modal */}
          {smsModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">Send SMS to Driver</h3>
                  <button onClick={() => setSmsModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {(() => {
                  const driver = drivers.find(d => d.id === smsModal.driverId)
                  if (!driver) return null
                  return (
                    <>
                      <p className="text-sm text-gray-500 mb-4">
                        Sending to: <span className="font-medium text-gray-900">{driver.name}</span> ({driver.phone})
                      </p>
                      <textarea
                        rows={4}
                        value={smsModal.message}
                        onChange={(e) => setSmsModal({ ...smsModal, message: e.target.value })}
                        placeholder="Type your message..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none mb-4"
                      />
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setSmsModal(null)}>Cancel</Button>
                        <Button onClick={() => handleSendSMS(smsModal.driverId, smsModal.message)}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send SMS
                        </Button>
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
