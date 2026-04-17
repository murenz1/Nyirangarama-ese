'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Star, ShoppingCart, Minus, Plus, ArrowLeft, Heart, Share2, Check, Loader2 } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/Button'
import { ProductCard } from '@/components/ProductCard'
import { productsAPI } from '@/lib/api'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { Product } from '@/data/types'
import { clsx } from 'clsx'

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const addItem = useCartStore((state) => state.addItem)
  const { isInWishlist, toggleItem } = useWishlistStore()

  useEffect(() => {
    async function fetchData() {
      if (!params.id) return
      try {
        setIsLoading(true)
        const data = await productsAPI.getById(params.id as string)
        setProduct(data)

        // Fetch related products (same category)
        const productsRes = await productsAPI.getAll({ limit: 10 })
        const filtered = productsRes.products.filter(
          (p: Product) => (typeof p.category === 'string' ? p.category : p.category.id) ===
            (typeof data.category === 'string' ? data.category : data.category.id) &&
            p.id !== data.id
        ).slice(0, 4)
        setRelatedProducts(filtered)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  const inWishlist = product ? isInWishlist(product.id) : false

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you are looking for does not exist.</p>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-earth-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/shop"
              className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Link>
          </div>
        </div>

        {/* Product Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Image */}
              <div className="relative aspect-square bg-earth-100 overflow-hidden rounded-2xl lg:rounded-none">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-9xl font-display font-bold text-earth-400/50">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                )}
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-sage-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    New
                  </span>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white text-gray-900 px-6 py-3 rounded-full text-lg font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 lg:p-8 lg:pl-0 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-primary-600 font-medium uppercase tracking-wider">
                      {typeof product.category === 'string' ? product.category : product.category.name}
                    </span>
                    {product.weight && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-500">{product.weight}</span>
                      </>
                    )}
                  </div>

                  <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{product.rating}</span>
                      <span className="text-gray-500">({product.reviews} reviews)</span>
                    </div>
                  </div>

                  <p className="text-3xl font-bold text-primary-600 mb-6">
                    {new Intl.NumberFormat('en-RW', {
                      style: 'currency',
                      currency: 'RWF',
                      minimumFractionDigits: 0,
                    }).format(product.price)}
                  </p>

                  <p className="text-gray-600 leading-relaxed mb-8">
                    {product.description}
                  </p>

                  {/* Ingredients */}
                  {product.ingredients && product.ingredients.length > 0 && (
                    <div className="mb-8">
                      <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.ingredients.map((ingredient, index) => (
                          <span
                            key={index}
                            className="bg-earth-100 text-earth-700 px-3 py-1 rounded-full text-sm"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nutritional Info */}
                  {product.nutritionalInfo && (
                    <div className="mb-8">
                      <h3 className="font-semibold text-gray-900 mb-3">Nutritional Info (per serving)</h3>
                      <div className="grid grid-cols-4 gap-4">
                        {product.nutritionalInfo.calories && (
                          <div className="bg-earth-50 rounded-xl p-3 text-center">
                            <p className="text-lg font-bold text-gray-900">{product.nutritionalInfo.calories}</p>
                            <p className="text-xs text-gray-600">Calories</p>
                          </div>
                        )}
                        {product.nutritionalInfo.protein && (
                          <div className="bg-earth-50 rounded-xl p-3 text-center">
                            <p className="text-lg font-bold text-gray-900">{product.nutritionalInfo.protein}g</p>
                            <p className="text-xs text-gray-600">Protein</p>
                          </div>
                        )}
                        {product.nutritionalInfo.carbs && (
                          <div className="bg-earth-50 rounded-xl p-3 text-center">
                            <p className="text-lg font-bold text-gray-900">{product.nutritionalInfo.carbs}g</p>
                            <p className="text-xs text-gray-600">Carbs</p>
                          </div>
                        )}
                        {product.nutritionalInfo.fat && (
                          <div className="bg-earth-50 rounded-xl p-3 text-center">
                            <p className="text-lg font-bold text-gray-900">{product.nutritionalInfo.fat}g</p>
                            <p className="text-xs text-gray-600">Fat</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  {product.inStock ? (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-200 rounded-xl">
                          <button
                            onClick={() => handleQuantityChange(-1)}
                            className="px-4 py-3 text-gray-600 hover:text-primary-600 transition-colors"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="w-12 text-center font-semibold text-gray-900">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(1)}
                            className="px-4 py-3 text-gray-600 hover:text-primary-600 transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        <Button
                          size="lg"
                          onClick={handleAddToCart}
                          className="flex-1"
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-5 h-5 mr-2" />
                              Added!
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-green-600 flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" />
                        In Stock
                      </p>
                    </>
                  ) : (
                    <Button size="lg" disabled className="w-full">
                      Out of Stock
                    </Button>
                  )}

                  <div className="flex items-center justify-center gap-4 pt-4">
                    <button
                      onClick={() => product && toggleItem(product)}
                      className={clsx(
                        'flex items-center gap-2 transition-colors',
                        inWishlist ? 'text-red-500' : 'text-gray-600 hover:text-primary-600'
                      )}
                    >
                      <Heart className={clsx('w-5 h-5', inWishlist && 'fill-current')} />
                      <span className="text-sm">
                        {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                      </span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
