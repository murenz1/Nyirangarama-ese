'use client'

import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          // Variants
          'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-soft hover:shadow-hover':
            variant === 'primary',
          'bg-earth-600 text-white hover:bg-earth-700 focus:ring-earth-500':
            variant === 'secondary',
          'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500':
            variant === 'outline',
          'text-gray-600 hover:text-primary-600 hover:bg-gray-100':
            variant === 'ghost',
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500':
            variant === 'danger',
          // Sizes
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2.5 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </button>
  )
}
