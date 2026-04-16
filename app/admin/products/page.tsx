'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  ArrowUpDown,
  X,
  ShoppingBag,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { products } from '@/data/products'
import { mockOrders } from '@/data/orders'
import { clsx } from 'clsx'

// Calculate orders count per product
const getProductOrdersCount = (productId: string) => {
  return mockOrders.reduce((count, order) => {
    return count + order.items.filter(item => item.product.id === productId).length
  }, 0)
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [viewModal, setViewModal] = useState<string | null>(null)
  const [editModal, setEditModal] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<string | null>(null)
  const [addModal, setAddModal] = useState(false)

  const categories = ['all', ...new Set(products.map((p) => p.category))]

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'category') return a.category.localeCompare(b.category)
      return 0
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-gray-900">
              Products
            </h1>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  View Store
                </Button>
              </Link>
              <Button size="sm" onClick={() => setAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="font-semibold text-primary-700">A</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-soft p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all appearance-none bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all appearance-none bg-white"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="category">Sort by Category</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Orders</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.weight}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          'px-3 py-1 rounded-full text-xs font-medium',
                          product.category === 'juices' && 'bg-yellow-100 text-yellow-700',
                          product.category === 'chili' && 'bg-red-100 text-red-700',
                          product.category === 'spreads' && 'bg-purple-100 text-purple-700',
                          product.category === 'baking' && 'bg-orange-100 text-orange-700',
                          product.category === 'snacks' && 'bg-blue-100 text-blue-700',
                          product.category === 'beverages' && 'bg-green-100 text-green-700',
                          product.category === 'dairy' && 'bg-pink-100 text-pink-700',
                          product.category === 'flour' && 'bg-gray-100 text-gray-700',
                          product.category === 'alcoholic' && 'bg-amber-100 text-amber-700',
                        )}>
                          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          RWF {product.price.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          'px-3 py-1 rounded-full text-xs font-medium',
                          product.inStock
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        )}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            {getProductOrdersCount(product.id)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewModal(product.id)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditModal(product.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal(product.id)}
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

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No products found</p>
              </div>
            )}
          </div>

          {/* View Modal */}
          {viewModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {(() => {
                  const product = products.find(p => p.id === viewModal)
                  if (!product) return null
                  return (
                    <>
                      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-xl text-gray-900">Product Details</h3>
                        <button onClick={() => setViewModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-6">
                        <div className="flex gap-6">
                          <div className="w-32 h-32 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-gray-900">{product.name}</h4>
                            <p className="text-gray-500 mt-1">{product.description}</p>
                            <div className="flex gap-4 mt-4 text-sm">
                              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full">{product.category}</span>
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">{product.weight}</span>
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">RWF {product.price.toLocaleString()}</span>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Rating</p>
                                <p className="font-semibold">{product.rating} ★ ({product.reviews} reviews)</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Orders</p>
                                <p className="font-semibold">{getProductOrdersCount(product.id)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Stock</p>
                                <p className="font-semibold">{product.inStock ? 'In Stock' : 'Out of Stock'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {editModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-xl text-gray-900">Edit Product</h3>
                  <button onClick={() => setEditModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {(() => {
                    const product = products.find(p => p.id === editModal)
                    if (!product) return null
                    return (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                          <input type="text" defaultValue={product.name} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (RWF)</label>
                            <input type="number" defaultValue={product.price} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                            <input type="text" defaultValue={product.weight} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                          <select defaultValue={product.inStock ? 'true' : 'false'} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none">
                            <option value="true">In Stock</option>
                            <option value="false">Out of Stock</option>
                          </select>
                        </div>
                      </>
                    )
                  })()}
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setEditModal(null)}>Cancel</Button>
                  <Button onClick={() => { setEditModal(null); alert('Product updated!') }}>Save Changes</Button>
                </div>
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
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Delete Product</h3>
                  <p className="text-gray-500 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancel</Button>
                    <Button className="bg-red-600 hover:bg-red-700" onClick={() => { setDeleteModal(null); alert('Product deleted!') }}>Delete</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Product Modal */}
          {addModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-xl text-gray-900">Add New Product</h3>
                  <button onClick={() => setAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input type="text" placeholder="Enter product name" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (RWF)</label>
                      <input type="number" placeholder="0" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                      <input type="text" placeholder="e.g. 500g" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none">
                      {categories.filter(c => c !== 'all').map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea rows={3} placeholder="Enter product description" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none" />
                  </div>
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setAddModal(false)}>Cancel</Button>
                  <Button onClick={() => { setAddModal(false); alert('Product added!') }}>Add Product</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
