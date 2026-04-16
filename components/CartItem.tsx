'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { CartItem as CartItemType } from '@/data/types'
import { useCartStore } from '@/lib/store'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  const handleDecrease = () => {
    updateQuantity(item.product.id, item.quantity - 1)
  }

  const handleIncrease = () => {
    updateQuantity(item.product.id, item.quantity + 1)
  }

  const handleRemove = () => {
    removeItem(item.product.id)
  }

  const itemTotal = item.product.price * item.quantity

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-b-0">
      <div className="relative w-20 h-20 rounded-xl bg-earth-100 flex-shrink-0 overflow-hidden">
        {item.product.image ? (
          <img
            src={item.product.image}
            alt={item.product.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-earth-400 text-lg font-medium">
              {item.product.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-gray-900 line-clamp-1">
              {item.product.name}
            </h4>
            {item.product.weight && (
              <p className="text-sm text-gray-500">{item.product.weight}</p>
            )}
          </div>
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrease}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-medium text-gray-900">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <span className="font-semibold text-gray-900">
            {new Intl.NumberFormat('en-RW', {
              style: 'currency',
              currency: 'RWF',
              minimumFractionDigits: 0,
            }).format(itemTotal)}
          </span>
        </div>
      </div>
    </div>
  )
}
