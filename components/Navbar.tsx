'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, User, Menu, X, Search, ChevronDown, Heart, Truck } from 'lucide-react'
import { useCartStore, useAuthStore, useWishlistStore } from '@/lib/store'
import { Button } from './Button'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())
  const wishlistCount = useWishlistStore((state) => state.items.length)
  const { user, isAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="SINA Rwanda"
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <span className="font-display font-bold text-xl text-primary-700 leading-tight">
                Nyirangarama
              </span>
              <p className="text-xs text-gray-500">SINA Rwanda</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <motion.button
              className="hidden sm:flex p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Wishlist */}
            <Link href="/wishlist" className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Heart className="w-5 h-5" />
              </motion.div>
              {mounted && wishlistCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

            {/* Track Order */}
            <Link href="/track" className="p-2 text-gray-600 hover:text-primary-600 transition-colors" title="Track Order">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Truck className="w-5 h-5" />
              </motion.div>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ShoppingCart className="w-5 h-5" />
              </motion.div>
              {mounted && totalItems > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative hidden md:block">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium text-sm">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              ) : (
                <Link href="/auth/login">
                  <Button size="sm">Sign In</Button>
                </Link>
              )}

              {/* User Dropdown */}
              {isUserMenuOpen && isAuthenticated && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 font-semibold"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account?tab=orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      My Orders
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <nav className="px-4 py-3 space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg font-medium"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg font-medium"
            >
              Shop
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg font-medium"
            >
              Contact Us
            </Link>
            <hr className="my-2 border-gray-100" />
            {isAuthenticated ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg font-medium"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
