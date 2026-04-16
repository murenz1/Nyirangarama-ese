export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  shippingAddress: {
    fullName: string
    phone: string
    address: string
    notes?: string
  }
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
