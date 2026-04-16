import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product, CartItem, User, Order } from '@/data/types'

// Cart Store
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

// Auth Store
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

// Mock user data
const MOCK_USER: User = {
  id: 'user-1',
  email: 'jean@example.com',
  name: 'Jean Pierre',
  phone: '+250 78 123 4567',
  address: 'KG 123 St, Kigali, Rwanda',
  role: 'customer',
  createdAt: '2024-01-15T10:00:00Z',
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Mock authentication - in real app, this would call an API
        if (email === 'jean@example.com' && password === 'password123') {
          set({ user: MOCK_USER, isAuthenticated: true })
          return true
        }
        return false
      },

      signup: async (name: string, email: string, password: string) => {
        // Mock signup - in real app, this would call an API
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name,
          role: 'customer',
          createdAt: new Date().toISOString(),
        }
        set({ user: newUser, isAuthenticated: true })
        return true
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }))
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Wishlist Store
interface WishlistState {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleItem: (product: Product) => void
  clearWishlist: () => void
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
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }))
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
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
