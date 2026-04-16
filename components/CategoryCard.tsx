'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Category } from '@/data/types'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/shop?category=${category.id}`}
      className="group relative block overflow-hidden rounded-2xl bg-white shadow-soft hover:shadow-hover transition-all duration-300"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-earth-100">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-display font-bold text-earth-300">
              {category.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full mb-2">
            {category.productCount} Products
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {category.description}
        </p>
        <span className="inline-flex items-center text-sm font-medium text-primary-600 group-hover:text-primary-700">
          Explore
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  )
}
