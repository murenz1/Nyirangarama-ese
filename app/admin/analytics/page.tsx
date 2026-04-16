'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { formatPrice } from '@/data/orders'
import { clsx } from 'clsx'

// Mock analytics data
const salesData = [
  { month: 'Jan', sales: 45000, orders: 12 },
  { month: 'Feb', sales: 52000, orders: 15 },
  { month: 'Mar', sales: 48000, orders: 14 },
  { month: 'Apr', sales: 61000, orders: 18 },
  { month: 'May', sales: 55000, orders: 16 },
  { month: 'Jun', sales: 67000, orders: 20 },
]

const topProducts = [
  { name: 'Agashya Passion Juice 1L', sales: 234, revenue: 2340000, growth: 12.5 },
  { name: 'Akabanga Chili Oil 100ml', sales: 189, revenue: 567000, growth: 8.3 },
  { name: 'Natural Honey 500gr', sales: 156, revenue: 624000, growth: -2.1 },
  { name: 'Strawberry Jam 500g', sales: 134, revenue: 268000, growth: 15.7 },
  { name: 'Agashya Pineapple Juice 1L', sales: 123, revenue: 1230000, growth: 5.2 },
]

const categoryData = [
  { name: 'Juices', sales: 45, revenue: 4500000, color: 'bg-yellow-500' },
  { name: 'Chili', sales: 25, revenue: 750000, color: 'bg-red-500' },
  { name: 'Spreads', sales: 15, revenue: 600000, color: 'bg-purple-500' },
  { name: 'Baking', sales: 10, revenue: 300000, color: 'bg-orange-500' },
  { name: 'Others', sales: 5, revenue: 150000, color: 'bg-gray-500' },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months')

  const totalRevenue = salesData.reduce((sum, d) => sum + d.sales, 0)
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0)
  const avgOrderValue = Math.round(totalRevenue / totalOrders)

  const maxSales = Math.max(...salesData.map(d => d.sales))

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-gray-900">
              Analytics
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="pl-9 pr-8 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all appearance-none bg-white text-sm"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="1year">Last Year</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
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
          {/* Overview Stats */}
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
                  <p className="text-sm text-gray-500 mb-1">New Customers</p>
                  <p className="text-2xl font-bold text-gray-900">48</p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+15.3%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft p-6">
              <h3 className="font-semibold text-gray-900 mb-6">Sales Overview</h3>
              <div className="h-64 flex items-end gap-4">
                {salesData.map((data, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative">
                      <div
                        className="w-full bg-primary-500 rounded-t-lg transition-all duration-500"
                        style={{ height: `${(data.sales / maxSales) * 200}px` }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-600">
                        {formatPrice(data.sales).replace('RWF ', '')}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="font-semibold text-gray-900 mb-6">Sales by Category</h3>
              <div className="space-y-4">
                {categoryData.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      <span className="text-sm text-gray-500">{cat.sales}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={clsx('h-full rounded-full', cat.color)}
                        style={{ width: `${cat.sales}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatPrice(cat.revenue)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Top Selling Products</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Units Sold</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Revenue</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topProducts.map((product, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-primary-600" />
                          </div>
                          <span className="font-medium text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{product.sales}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{formatPrice(product.revenue)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={clsx(
                          'flex items-center gap-1 text-sm',
                          product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                        )}>
                          {product.growth >= 0 ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                          <span>{Math.abs(product.growth)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
