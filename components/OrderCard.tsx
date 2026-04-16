'use client'

import { ChevronDown, ChevronUp, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Order } from '@/data/types'
import { formatDate, formatPrice, getStatusColor } from '@/data/orders'

interface OrderCardProps {
  order: Order
}

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
}

const statusLabels = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const StatusIcon = statusIcons[order.status]

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="font-semibold text-gray-900">{order.id}</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
              order.status
            )}`}
          >
            <StatusIcon className="w-4 h-4" />
            {statusLabels[order.status]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Date</p>
            <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total</p>
            <p className="font-medium text-gray-900">{formatPrice(order.total)}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-2">
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
          </p>
          <div className="space-y-2">
            {order.items.slice(0, isExpanded ? undefined : 2).map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  {item.quantity}x {item.product.name}
                </span>
                <span className="font-medium text-gray-900">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {order.items.length > 2 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {isExpanded ? (
                <>
                  Show less <ChevronUp className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  Show {order.items.length - 2} more items{' '}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Shipping Address</p>
          <div className="text-sm text-gray-700">
            <p className="font-medium">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.address}</p>
            {order.shippingAddress.notes && (
              <p className="text-gray-500 mt-1">Note: {order.shippingAddress.notes}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
