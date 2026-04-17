export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string | { id: string; name: string }
  categoryId?: string
  image: string
  rating: number
  reviews: number
  inStock: boolean
  weight?: string
  ingredients?: string[]
  nutritionalInfo?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
  }
  isFeatured?: boolean
  isNew?: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  createdAt: string
  shippingName: string
  shippingPhone: string
  shippingAddress: string
  shippingNotes?: string
  assignedDriver?: {
    id: string
    name: string
    phone: string
    vehicleType: string
    vehiclePlate: string
  }
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  role: 'customer' | 'admin'
  createdAt: string
}
