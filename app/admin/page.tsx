'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Loader2,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { adminAPI, productsAPI } from '@/lib/api'
import { Product, Order } from '@/data/types'
import { clsx } from 'clsx'

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [topProducts, setTopProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true)
        const [statsData, ordersRes, productsData] = await Promise.all([
          adminAPI.analytics.getDashboard(),
          adminAPI.orders.getAll(),
          productsAPI.getAll({ limit: 5 })
        ])
        setStats(statsData)
        setRecentOrders(ordersRes.orders.slice(0, 5))
        setTopProducts(productsData.products)
      } catch (error) {
        console.error('Error fetching dashboard:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const formatPrice = (price: number) => {
    return `RWF ${price.toLocaleString()}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700'
      case 'PROCESSING': return 'bg-blue-100 text-blue-700'
      case 'SHIPPED': return 'bg-purple-100 text-purple-700'
      case 'DELIVERED': return 'bg-green-100 text-green-700'
      case 'CANCELLED': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="ml-64 min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        </main>
      </div>
    )
  }

  const statsCards = [
    {
      name: 'Total Revenue',
      value: formatPrice(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'bg-primary-100 text-primary-600',
    },
    {
      name: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-sage-100 text-sage-700',
    },
    {
      name: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-primary-50 text-primary-700',
    },
    {
      name: 'Total Users',
      value: (stats?.totalUsers || 0).toLocaleString(),
      icon: Users,
      color: 'bg-sage-50 text-sage-800',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="md:ml-64 flex-1 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="outline" size="sm">View Store</Button></Link>
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="font-semibold text-primary-700">A</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat) => (
              <div key={stat.name} className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-lg text-gray-900">Recent Orders</h2>
                <Link href="/admin/orders" className="text-sm text-primary-600 font-medium">View All</Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{order.id.slice(0, 8)}...</p>
                        <p className="text-sm text-gray-500">{order.shippingName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatPrice(order.total)}</p>
                        <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(order.status))}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="font-semibold text-lg text-gray-900">Top Products</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-earth-100 rounded-lg flex items-center justify-center font-bold text-earth-400">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500">{typeof product.category === 'string' ? product.category : product.category.name}</p>
                      </div>
                      <div className="text-right font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
