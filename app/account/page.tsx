'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Package, MapPin, LogOut, Edit2, Check, Loader2 } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { OrderCard } from '@/components/OrderCard'
import { useAuthStore } from '@/lib/store'
import { ordersAPI } from '@/lib/api'
import { Order } from '@/data/types'

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  })

  useEffect(() => {
    async function fetchOrders() {
      if (!isAuthenticated) return
      try {
        setIsLoadingOrders(true)
        const orders = await ordersAPI.getUserOrders()
        setUserOrders(orders)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setIsLoadingOrders(false)
      }
    }
    fetchOrders()
  }, [isAuthenticated])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    updateUser(formData)
    setIsEditing(false)
    setIsSaving(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-earth-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to view your account.</p>
            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary-600">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <h2 className="font-semibold text-gray-900">{user?.name}</h2>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    )
                  })}
                  <hr className="my-4 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-bold text-gray-900">
                      Profile Information
                    </h2>
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <form className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          label="Full Name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                        <Input
                          label="Email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                        <Input
                          label="Phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+250 78 123 4567"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false)
                            setFormData({
                              name: user?.name || '',
                              email: user?.email || '',
                              phone: user?.phone || '',
                              address: user?.address || '',
                            })
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={handleSave}
                          isLoading={isSaving}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Full Name</p>
                          <p className="font-medium text-gray-900">{user?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Email</p>
                          <p className="font-medium text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Phone</p>
                          <p className="font-medium text-gray-900">
                            {user?.phone || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Member Since</p>
                          <p className="font-medium text-gray-900">
                            {new Date(user?.createdAt || '').toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <h2 className="font-display text-xl font-bold text-gray-900">
                    Order History
                  </h2>
                  {isLoadingOrders ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                    </div>
                  ) : userOrders.length > 0 ? (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">
                        No orders yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        When you place orders, they will appear here.
                      </p>
                      <Link href="/shop">
                        <Button>Start Shopping</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-bold text-gray-900">
                      Shipping Address
                    </h2>
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <form className="space-y-4">
                      <Input
                        label="Address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="KG 123 St, Kigali, Rwanda"
                      />
                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false)
                            setFormData({
                              name: user?.name || '',
                              email: user?.email || '',
                              phone: user?.phone || '',
                              address: user?.address || '',
                            })
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={handleSave}
                          isLoading={isSaving}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Save Address
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Default Address</p>
                      <p className="font-medium text-gray-900">
                        {user?.address || 'No address provided'}
                      </p>
                      {user?.phone && (
                        <p className="text-gray-600 mt-2">Phone: {user.phone}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
