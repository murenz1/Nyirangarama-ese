'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  Bell,
  Shield,
  Save,
  Check,
  Loader2,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { adminAPI } from '@/lib/api'
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
  const [settings, setSettings] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      setIsLoading(true)
      const data = await adminAPI.settings.get()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await adminAPI.settings.update(settings)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (error) {
      alert('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-gray-900">Settings</h1>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className={clsx(saveSuccess && 'border-green-500 text-green-600')}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : saveSuccess ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {saveSuccess ? 'Saved' : 'Save Changes'}
              </Button>
              <Link href="/"><Button variant="outline" size="sm">View Store</Button></Link>
            </div>
          </div>
        </header>

        <div className="p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-4 gap-6">
              <aside className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-soft p-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors',
                          activeTab === tab.id ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </aside>

              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-soft p-6">
                  {activeTab === 'general' && (
                    <div className="space-y-6">
                      <h3 className="font-semibold text-lg text-gray-900 mb-4">Store Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Name</label>
                          <input
                            type="text"
                            value={settings?.storeName || 'Nyirangarama'}
                            onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                            className="w-full px-4 py-2 border rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                          <input
                            type="email"
                            value={settings?.email || 'info@sinarwanda.rw'}
                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                            className="w-full px-4 py-2 border rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab !== 'general' && (
                    <div className="text-center py-10 text-gray-400 font-medium">
                      Configuration for {activeTab} is managed by the system.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
