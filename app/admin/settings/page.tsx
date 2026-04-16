'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  Bell,
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
  Save,
  Check,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { clsx } from 'clsx'

const tabs = [
  { id: 'general', label: 'General', icon: Store },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-gray-900">
              Settings
            </h1>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className={clsx(saved && 'border-green-500 text-green-600')}
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
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
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-soft p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={clsx(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors',
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-soft p-6">
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-4">Store Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Store Name
                          </label>
                          <input
                            type="text"
                            defaultValue="Nyirangarama"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Business Email
                          </label>
                          <input
                            type="email"
                            defaultValue="info@sinarwanda.rw"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            defaultValue="+250 788 305 558"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Website URL
                          </label>
                          <input
                            type="url"
                            defaultValue="https://sinarwanda.rw"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <hr className="border-gray-200" />

                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-4">Address</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Street Address
                          </label>
                          <input
                            type="text"
                            defaultValue="Nyirangarama, Rulindo District"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                          />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              City
                            </label>
                            <input
                              type="text"
                              defaultValue="Rulindo"
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Province
                            </label>
                            <input
                              type="text"
                              defaultValue="Northern Province"
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Country
                            </label>
                            <input
                              type="text"
                              defaultValue="Rwanda"
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Settings */}
                {activeTab === 'payment' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-4">Payment Methods</h3>
                      <div className="space-y-3">
                        {[
                          { name: 'Mobile Money (MTN, Airtel)', enabled: true },
                          { name: 'Bank Transfer', enabled: true },
                          { name: 'Cash on Delivery', enabled: true },
                          { name: 'Credit/Debit Card', enabled: false },
                        ].map((method) => (
                          <div key={method.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <span className="font-medium text-gray-900">{method.name}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked={method.enabled} className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <hr className="border-gray-200" />

                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-4">Currency Settings</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Default Currency
                          </label>
                          <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all bg-white">
                            <option value="RWF">Rwandan Franc (RWF)</option>
                            <option value="USD">US Dollar (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Tax Rate (%)
                          </label>
                          <input
                            type="number"
                            defaultValue="18"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Settings */}
                {activeTab === 'shipping' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-4">Shipping Options</h3>
                      <div className="space-y-3">
                        {[
                          { name: 'Standard Delivery (3-5 days)', price: 2000, enabled: true },
                          { name: 'Express Delivery (1-2 days)', price: 5000, enabled: true },
                          { name: 'Same Day Delivery (Kigali only)', price: 8000, enabled: true },
                          { name: 'Free Shipping (Orders over 50,000 RWF)', price: 0, enabled: true },
                        ].map((option) => (
                          <div key={option.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div>
                              <span className="font-medium text-gray-900">{option.name}</span>
                              <p className="text-sm text-gray-500">{option.price === 0 ? 'Free' : `${option.price.toLocaleString()} RWF`}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked={option.enabled} className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-4">Email Notifications</h3>
                      <div className="space-y-3">
                        {[
                          { name: 'New Order Notifications', enabled: true },
                          { name: 'Order Status Updates', enabled: true },
                          { name: 'Customer Messages', enabled: true },
                          { name: 'Low Stock Alerts', enabled: true },
                          { name: 'Daily Sales Report', enabled: false },
                          { name: 'Marketing & Promotions', enabled: false },
                        ].map((notification) => (
                          <div key={notification.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <span className="font-medium text-gray-900">{notification.name}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked={notification.enabled} className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-4">Change Password</h3>
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <hr className="border-gray-200" />

                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-4">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900">Enable 2FA</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
