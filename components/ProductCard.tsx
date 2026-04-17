'use client'

import Link from 'next/link'
import { Star, ShoppingCart, Leaf, CheckCircle, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { Product } from '@/data/types'
import { clsx } from 'clsx'
import { Button } from './Button'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }

  return (
    <motion.div
      className={clsx(
        'group bg-white rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300 overflow-hidden',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-sage-100">
              <span className="text-sage-400 text-sm font-medium">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-sage-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              New
            </span>
          )}
          {product.isFeatured && !product.isNew && (
            <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              Featured
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
          {/* Quick Actions Overlay */}
          {isHovered && (
            <motion.div
              className="absolute top-4 right-4 flex flex-col gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                onClick={(e) => {
                  e.preventDefault()
                  toggleItem(product)
                }}
                className={clsx(
                  'p-2 bg-white rounded-full shadow-soft transition-colors',
                  inWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                )}
                title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className={clsx('w-5 h-5', inWishlist && 'fill-current')} />
              </motion.button>
            </motion.div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.id}`} className="block">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {typeof product.category === 'string' ? product.category : product.category.name}
            </p>
            {product.weight && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                {product.weight}
              </span>
            )}
          </div>
          <h3 className="font-display font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Ingredients preview */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Leaf className="w-3 h-3 text-primary-500" />
                <span className="text-xs text-gray-500 font-medium">Key Ingredients:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {product.ingredients.slice(0, 3).map((ingredient, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-sage-50 text-sage-700 px-2 py-0.5 rounded-md border border-sage-100"
                  >
                    {ingredient}
                  </span>
                ))}
                {product.ingredients.length > 3 && (
                  <span className="text-xs text-gray-400 px-1">+{product.ingredients.length - 3} more</span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900">
              {product.rating}
            </span>
            <span className="text-sm text-gray-500">
              ({product.reviews} reviews)
            </span>
            {product.inStock && (
              <>
                <span className="mx-2 text-gray-300">|</span>
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs text-green-600 font-medium">In Stock</span>
              </>
            )}
          </div>
        </Link>

        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-xl font-bold text-primary-600">
              {new Intl.NumberFormat('en-RW', {
                style: 'currency',
                currency: 'RWF',
                minimumFractionDigits: 0,
              }).format(product.price)}
            </p>
            {product.inStock ? (
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <CheckCircle className="w-4 h-4" />
                In Stock
              </p>
            ) : (
              <p className="text-sm text-red-500 mt-1">Out of Stock</p>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
