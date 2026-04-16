'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Mail,
  Tag,
  Truck,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/drivers', label: 'Drivers', icon: Truck },
  { href: '/admin/inbox', label: 'Inbox', icon: Mail },
  { href: '/admin/promotions', label: 'Promotions', icon: Tag },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="SINA"
              className="h-8 w-auto"
            />
            <span className="font-display font-bold text-lg text-primary-700">
              Admin
            </span>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                'hover:bg-gray-100',
                {
                  'bg-primary-100 text-primary-700 font-semibold': isActive,
                  'text-gray-700 hover:text-primary-600': !isActive,
                },
                isCollapsed && 'justify-center'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
