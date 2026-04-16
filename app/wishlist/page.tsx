'use client'

import Link from 'next/link'
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/Button'
import { ProductCard } from '@/components/ProductCard'
import { useWishlistStore } from '@/lib/store'
import { useCartStore } from '@/lib/store'

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const addToCart = useCartStore((state) => state.addItem)

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      addToCart(item, 1)
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-earth-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
                  My Wishlist
                </h1>
                <p className="text-gray-600 mt-2">
                  {items.length} {items.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
              {items.length > 0 && (
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={clearWishlist}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                  <Button onClick={handleAddAllToCart}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add All to Cart
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard product={product} />
                  <button
                    onClick={() => removeItem(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Save your favorite products to your wishlist and easily find them later.
              </p>
              <Link href="/shop">
                <Button size="lg">
                  Browse Products
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
