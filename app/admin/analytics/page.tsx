'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { adminAPI } from '@/lib/api'
import { clsx } from 'clsx'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30days')
  const [stats, setStats] = useState<any>(null)
  const [salesData, setSalesData] = useState<any[]>([])
  const [topSellingProducts, setTopSellingProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  async function fetchAnalytics() {
    try {
      setIsLoading(true)
      const [statsData, salesRes, topProductsRes] = await Promise.all([
        adminAPI.analytics.getDashboard(),
        adminAPI.analytics.getSales(
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          new Date().toISOString()
        ),
        adminAPI.analytics.getTopProducts(5)
      ])

      setStats(statsData)

      // Process sales data for chart
      // Backend returns raw orders, we might need to group by day/month
      setSalesData(salesRes)
      setTopSellingProducts(topProductsRes)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return `RWF ${price.toLocaleString()}`
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

  const totalRevenue = stats?.totalRevenue || 0
  const totalOrders = stats?.totalOrders || 0
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-gray-900">Analytics</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="pl-9 pr-8 py-2 rounded-xl border border-gray-200 outline-none transition-all appearance-none bg-white text-sm"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <Link href="/"><Button variant="outline" size="sm">View Store</Button></Link>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+12.5%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+8.2%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-sage-700" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(avgOrderValue)}</p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                    <TrendingDown className="w-4 h-4" />
                    <span>-2.1%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-1 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="font-semibold text-gray-900 mb-6">Sales Overview (Last 30 Days)</h3>
              <div className="h-64 flex items-end gap-2 overflow-x-auto pb-4">
                {salesData.length > 0 ? salesData.map((data, idx) => (
                  <div key={idx} className="flex-shrink-0 w-8 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-primary-500 rounded-t-sm"
                      style={{ height: `${Math.min(200, (data.total / 10000) * 100)}px` }}
                    />
                    <span className="text-[10px] text-gray-400 rotate-45 mt-2">
                      {new Date(data.createdAt).getDate()}/{new Date(data.createdAt).getMonth() + 1}
                    </span>
                  </div>
                )) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No sales data found for this period
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Top Selling Products</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-900">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Units Sold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topSellingProducts.map((product, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize">{product.category?.name || 'N/A'}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{product.totalSold || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {topSellingProducts.length === 0 && (
                <div className="p-10 text-center text-gray-400">No data available</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
