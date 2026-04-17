'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product, CartItem, User } from '@/data/types'
import { authAPI, wishlistAPI } from './api'

// ==================== CART STORE (client-side only) ====================
interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          )

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }

          return {
            items: [...state.items, { product, quantity }],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// ==================== AUTH STORE (real API) ====================
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, phone?: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  updateProfile: (userData: Partial<User>) => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const { token, user } = await authAPI.login(email, password)
          localStorage.setItem('auth-token', token)
          set({ user, isAuthenticated: true })
          return true
        } catch (error) {
          console.error('Login failed:', error)
          return false
        }
      },

      signup: async (name: string, email: string, password: string, phone?: string) => {
        try {
          const { token, user } = await authAPI.signup(name, email, password, phone)
          localStorage.setItem('auth-token', token)
          set({ user, isAuthenticated: true })
          return true
        } catch (error) {
          console.error('Signup failed:', error)
          return false
        }
      },

      logout: () => {
        localStorage.removeItem('auth-token')
        set({ user: null, isAuthenticated: false })
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }))
      },

      updateProfile: async (userData) => {
        try {
          const updatedUser = await authAPI.updateProfile(userData)
          set({ user: updatedUser })
          return true
        } catch (error) {
          console.error('Update profile failed:', error)
          return false
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// ==================== WISHLIST STORE (real API) ====================
interface WishlistState {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleItem: (product: Product) => void
  clearWishlist: () => void
  syncWithServer: () => Promise<void>
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const exists = state.items.find((item) => item.id === product.id)
          if (exists) return state
          return { items: [...state.items, product] }
        })
        // Also sync to server if logged in
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
        if (token) {
          wishlistAPI.add(product.id).catch(console.error)
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }))
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
        if (token) {
          wishlistAPI.remove(productId).catch(console.error)
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId)
      },

      toggleItem: (product) => {
        const isInWishlist = get().isInWishlist(product.id)
        if (isInWishlist) {
          get().removeItem(product.id)
        } else {
          get().addItem(product)
        }
      },

      clearWishlist: () => {
        set({ items: [] })
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
        if (token) {
          wishlistAPI.clear().catch(console.error)
        }
      },

      syncWithServer: async () => {
        try {
          const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
          if (!token) return
          const serverItems = await wishlistAPI.getAll()
          set({ items: serverItems })
        } catch (error) {
          console.error('Failed to sync wishlist:', error)
        }
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
