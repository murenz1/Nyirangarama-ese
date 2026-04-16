'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { products } from '@/data/products'
import { mockOrders, formatPrice, getStatusColor } from '@/data/orders'
import { clsx } from 'clsx'

// Stats data
const stats = [
  {
    name: 'Total Revenue',
    value: 'RWF 1,245,000',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-primary-100 text-primary-600',
  },
  {
    name: 'Total Orders',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingBag,
    color: 'bg-sage-100 text-sage-700',
  },
  {
    name: 'Total Products',
    value: '15',
    change: '+2',
    trend: 'up',
    icon: Package,
    color: 'bg-primary-50 text-primary-700',
  },
  {
    name: 'Total Customers',
    value: '1,234',
    change: '+15.3%',
    trend: 'up',
    icon: Users,
    color: 'bg-sage-50 text-sage-800',
  },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [productSearch, setProductSearch] = useState('')
  const [orderSearch, setOrderSearch] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  )

  const filteredOrders = mockOrders.filter(
    (o) =>
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(orderSearch.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-gray-900">
              Dashboard
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
          {/* Tabs */}
          <div className="flex items-center gap-2 mb-8 border-b border-gray-200">
            {[
              { id: 'dashboard', label: 'Overview' },
              { id: 'products', label: 'Products' },
              { id: 'orders', label: 'Orders' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'px-4 py-3 font-medium transition-colors relative',
                  activeTab === tab.id
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                )}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                  const Icon = stat.icon
                  const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown
                  return (
                    <div
                      key={stat.name}
                      className="bg-white rounded-2xl shadow-soft p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{stat.name}</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {stat.value}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            <TrendIcon className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">
                              {stat.change}
                            </span>
                            <span className="text-sm text-gray-500">
                              vs last month
                            </span>
                          </div>
                        </div>
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Recent Orders & Top Products */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-semibold text-lg text-gray-900">
                      Recent Orders
                    </h2>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {mockOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{order.id}</p>
                            <p className="text-sm text-gray-500">
                              {order.shippingAddress.fullName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatPrice(order.total)}
                            </p>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="font-semibold text-lg text-gray-900">
                      Top Products
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {products.slice(0, 5).map((product, index) => (
                      <div key={product.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-earth-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="font-bold text-earth-400">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {product.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatPrice(product.price)}
                            </p>
                            <p className="text-sm text-green-600">
                              {product.reviews} reviews
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="font-semibold text-lg text-gray-900">
                  All Products ({filteredProducts.length})
                </h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </div>
                  <Button size="sm">
                    <Package className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-earth-100 rounded-lg flex items-center justify-center">
                              <span className="text-earth-400 font-bold">
                                {product.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {product.weight}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.inStock
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="font-semibold text-lg text-gray-900">
                  All Orders ({filteredOrders.length})
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="hover:bg-gray-50">
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order.id ? null : order.id
                        )
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button className="text-gray-400">
                            {expandedOrder === order.id ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                          <div>
                            <p className="font-medium text-gray-900">{order.id}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right hidden sm:block">
                            <p className="font-medium text-gray-900">
                              {order.shippingAddress.fullName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.items.length} items
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatPrice(order.total)}
                            </p>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="px-4 pb-4 pl-14">
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                          <h4 className="font-medium text-gray-900">Order Items</h4>
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-gray-700">
                                {item.quantity}x {item.product.name}
                              </span>
                              <span className="font-medium text-gray-900">
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                          <div className="border-t border-gray-200 pt-3">
                            <p className="text-sm text-gray-500 mb-1">
                              Shipping Address
                            </p>
                            <p className="text-sm text-gray-700">
                              {order.shippingAddress.address}
                            </p>
                            <p className="text-sm text-gray-700">
                              {order.shippingAddress.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
