'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/Button'
import { productsAPI } from '@/lib/api'
import { Product, Category } from '@/data/types'
import { clsx } from 'clsx'

function ShopContent() {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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
        console.error('Error fetching shop data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === null ||
        (typeof product.category === 'string'
          ? product.category === selectedCategory
          : product.categoryId === selectedCategory || product.category.id === selectedCategory)

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory, products])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-earth-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Products
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Discover our complete collection of authentic Rwandan products,
              crafted with care and tradition.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden"
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside
              className={clsx(
                'lg:w-64 flex-shrink-0',
                isFilterOpen ? 'block' : 'hidden lg:block'
              )}
            >
              <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Categories</h3>
                  {(selectedCategory || searchQuery) && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={clsx(
                      'w-full text-left px-4 py-2.5 rounded-xl transition-colors',
                      selectedCategory === null
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    All Products
                    <span className="float-right text-sm text-gray-400">
                      {products.length}
                    </span>
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={clsx(
                        'w-full text-left px-4 py-2.5 rounded-xl transition-colors',
                        selectedCategory === category.id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      {category.name}
                      <span className="float-right text-sm text-gray-400">
                        {category.productCount}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">Availability</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-600">In Stock Only</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
                </p>
                <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or filters to find what you are looking for.
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
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

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}
