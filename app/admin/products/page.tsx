'use client'

import { useState, useEffect } from 'react'
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
  Loader2,
  Image as ImageIcon,
  Upload,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { productsAPI, adminAPI } from '@/lib/api'
import { Product } from '@/data/types'
import { clsx } from 'clsx'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [viewModal, setViewModal] = useState<string | null>(null)
  const [editModal, setEditModal] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<string | null>(null)
  const [addModal, setAddModal] = useState(false)

  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageExtension, setImageExtension] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const [additionalImages, setAdditionalImages] = useState<{ base64: string, extension: string, previewUrl: string }[]>([])
  const [retainedImages, setRetainedImages] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const ext = file.name.split('.').pop()
      setImageExtension(ext || 'jpg')
      setPreviewImage(URL.createObjectURL(file))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const ext = file.name.split('.').pop() || 'jpg'
      const previewUrl = URL.createObjectURL(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAdditionalImages(prev => [...prev, {
          base64: reader.result as string,
          extension: ext,
          previewUrl
        }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeRetainedImage = (index: number) => {
    setRetainedImages(prev => prev.filter((_, i) => i !== index))
  }

  const resetImageState = () => {
    setImageBase64(null)
    setImageExtension(null)
    setPreviewImage(null)
    setAdditionalImages([])
    setRetainedImages([])
  }

  const openEditModal = (product: Product) => {
    resetImageState()
    setRetainedImages(product.images || [])
    setEditModal(product.id)
  }

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setIsLoading(true)
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll({ limit: 100 }),
        productsAPI.getCategories()
      ])
      setProducts(productsRes.products)
      setCategories(categoriesRes)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchProducts() {
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.products.delete(id)
        setProducts(products.filter(p => p.id !== id))
        setDeleteModal(null)
      } catch (error) {
        alert('Failed to delete product')
      }
    }
  }

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
      const pCategory = typeof p.category === 'string' ? p.category : p.category.name
      const matchesCategory = categoryFilter === 'all' || pCategory === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'category') {
        const catA = typeof a.category === 'string' ? a.category : a.category.name
        const catB = typeof b.category === 'string' ? b.category : b.category.name
        return catA.localeCompare(catB)
      }
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
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
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
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
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
                              <p className="text-sm text-gray-500">{product.weight || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 capitalize">
                            {typeof product.category === 'string' ? product.category : product.category.name}
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
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewModal(product.id)}
                              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(product)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
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
              )}
            </div>

            {!isLoading && filteredProducts.length === 0 && (
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
                              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full capitalize">{typeof product.category === 'string' ? product.category : product.category.name}</span>
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">{product.weight}</span>
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">RWF {product.price.toLocaleString()}</span>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Rating</p>
                                <p className="font-semibold">{product.rating} ★ ({product.reviews} reviews)</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Stock Status</p>
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

          {/* Add Product Modal */}
          {addModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const productData = {
                    name: formData.get('name') as string,
                    price: parseFloat(formData.get('price') as string),
                    weight: formData.get('weight') as string,
                    categoryId: formData.get('categoryId') as string,
                    description: formData.get('description') as string,
                    image: '/images/products/placeholder.jpg',
                    inStock: true,
                    additionalImages: additionalImages.map(img => ({ imageBase64: img.base64, imageExtension: img.extension }))
                  }
                  try {
                    await adminAPI.products.create(productData)
                    fetchData()
                    setAddModal(false)
                    resetImageState()
                  } catch (error) {
                    alert('Error creating product')
                  }
                }}>
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-xl text-gray-900">Add New Product</h3>
                    <button type="button" onClick={() => { setAddModal(false); resetImageState(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Basic Info */}
                    <div className="space-y-4 md:border-r border-gray-100 pr-0 md:pr-6">
                      <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input name="name" type="text" required placeholder="Enter product name" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price (RWF)</label>
                          <input name="price" type="number" required placeholder="0" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                          <input name="weight" type="text" placeholder="e.g. 500g" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select name="categoryId" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none">
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" rows={4} placeholder="Enter product description" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none" />
                      </div>
                    </div>
                    {/* Right Column: Media */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 mb-2">Product Media</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Main Cover Image</label>
                        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          {previewImage ? (
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-white flex-shrink-0 shadow-sm border border-gray-200">
                              <img src={previewImage} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-24 h-24 rounded-xl bg-white border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                              <ImageIcon className="w-8 h-8 opacity-50" />
                            </div>
                          )}
                          <div className="flex-1">
                            <label className="cursor-pointer flex items-center justify-center w-full px-4 py-2 border-2 border-primary-100 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors text-sm font-semibold">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Main Image
                              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                            <p className="text-xs text-gray-500 mt-2 text-center">Suggested: 800x800px. PNG, JPG max 2MB.</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                          <span>Product Gallery <span className="font-normal text-gray-400 ml-1">(Optional)</span></span>
                          <span className="text-xs text-gray-500">{additionalImages.length} images</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {additionalImages.map((img, idx) => (
                            <div key={`add-${idx}`} className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden group shadow-sm border border-gray-200">
                              <img src={img.previewUrl} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removeAdditionalImage(idx)} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-6 h-6" />
                              </button>
                            </div>
                          ))}
                          <label className="cursor-pointer aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-500 hover:bg-primary-50 flex flex-col items-center justify-center text-gray-400 hover:text-primary-600 transition-colors">
                            <Plus className="w-6 h-6 mb-1" />
                            <span className="text-xs font-semibold">Add Image</span>
                            <input type="file" accept="image/*" multiple onChange={handleAdditionalImageChange} className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => { setAddModal(false); resetImageState(); }}>Cancel</Button>
                    <Button type="submit">Publish Product</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Edit Product Modal */}
          {editModal && (() => {
            const product = products.find(p => p.id === editModal)
            if (!product) return null
            return (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const productData = {
                      name: formData.get('name') as string,
                      price: parseFloat(formData.get('price') as string),
                      weight: formData.get('weight') as string,
                      categoryId: formData.get('categoryId') as string,
                      description: formData.get('description') as string,
                      inStock: formData.get('inStock') === 'true',
                      ...(imageBase64 && { imageBase64, imageExtension }),
                      additionalImages: additionalImages.map(img => ({ imageBase64: img.base64, imageExtension: img.extension })),
                      retainedImages
                    }
                    try {
                      await adminAPI.products.update(editModal, productData)
                      fetchData()
                      setEditModal(null)
                      resetImageState()
                    } catch (error) {
                      alert('Error updating product')
                    }
                  }}>
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-semibold text-xl text-gray-900">Edit Product</h3>
                      <button type="button" onClick={() => { setEditModal(null); resetImageState(); }} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column: Basic Info */}
                      <div className="space-y-4 md:border-r border-gray-100 pr-0 md:pr-6">
                        <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                          <input name="name" type="text" required defaultValue={product.name} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (RWF)</label>
                            <input name="price" type="number" required defaultValue={product.price} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                            <input name="weight" type="text" defaultValue={product.weight || ''} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <select name="categoryId" defaultValue={product.categoryId || (typeof product.category === 'object' ? product.category.id : '')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none">
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                          <select name="inStock" defaultValue={product.inStock ? 'true' : 'false'} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none">
                            <option value="true">In Stock</option>
                            <option value="false">Out of Stock</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea name="description" rows={4} defaultValue={product.description} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none" />
                        </div>
                      </div>

                      {/* Right Column: Media */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 mb-2">Product Media</h4>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Main Cover Image</label>
                          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            {previewImage || product.image ? (
                              <div className="w-24 h-24 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-200 flex-shrink-0">
                                <img src={previewImage || product.image || '/images/products/placeholder.jpg'} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-24 h-24 rounded-xl bg-white border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                                <ImageIcon className="w-8 h-8 opacity-50" />
                              </div>
                            )}
                            <div className="flex-1">
                              <label className="cursor-pointer flex items-center justify-center w-full px-4 py-2 border-2 border-primary-100 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors text-sm font-semibold">
                                <Upload className="w-4 h-4 mr-2" />
                                Replace Main Image
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                            <span>Product Gallery</span>
                            <span className="text-xs text-gray-500">{retainedImages.length + additionalImages.length} images</span>
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {/* Retained images */}
                            {retainedImages.map((src, idx) => (
                              <div key={`ret-${idx}`} className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden group shadow-sm border border-gray-200">
                                <img src={src} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeRetainedImage(idx)} className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trash2 className="w-6 h-6" />
                                </button>
                              </div>
                            ))}
                            {/* Additional images */}
                            {additionalImages.map((img, idx) => (
                              <div key={`add-${idx}`} className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden group shadow-sm border border-gray-200">
                                <img src={img.previewUrl} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeAdditionalImage(idx)} className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trash2 className="w-6 h-6" />
                                </button>
                              </div>
                            ))}
                            <label className="cursor-pointer aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-500 hover:bg-primary-50 flex flex-col items-center justify-center text-gray-400 hover:text-primary-600 transition-colors">
                              <Plus className="w-6 h-6 mb-1" />
                              <span className="text-xs font-semibold">Add Image</span>
                              <input type="file" accept="image/*" multiple onChange={handleAdditionalImageChange} className="hidden" />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => { setEditModal(null); resetImageState(); }}>Cancel</Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </div>
              </div>
            )
          })()}
        </div>
      </main>
    </div>
  )
}
