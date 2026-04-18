import { Order } from './types'

// Mock orders with real Nyirangarama products
export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: 'user-1',
    items: [
      {
        product: {
          id: '1',
          name: 'Agashya Passion Juice 1L',
          description: 'Pure passion fruit juice made from organically grown passion fruits',
          price: 10000,
          category: 'juices',
          image: '/images/products/agashya-passion.jpg',
          rating: 4.9,
          reviews: 324,
          inStock: true,
          weight: '1L',
        },
        quantity: 2,
      },
      {
        product: {
          id: '6',
          name: 'Akabanga Chili Oil 100ml',
          description: 'Rwanda\'s famous spicy chili oil',
          price: 3000,
          category: 'chili',
          image: '/images/products/akabanga-100ml.jpg',
          rating: 4.9,
          reviews: 567,
          inStock: true,
          weight: '100ml',
        },
        quantity: 1,
      },
    ],
    total: 23000,
    status: 'DELIVERED',
    createdAt: '2024-03-15T10:30:00Z',
    shippingName: 'Jean Pierre',
    shippingPhone: '+250 788 305 558',
    shippingAddress: 'Nyirangarama, Rulindo District, Rwanda',
    shippingNotes: 'Leave at the gate',
  },
  {
    id: 'ORD-002',
    userId: 'user-1',
    items: [
      {
        product: {
          id: '6',
          name: 'Akabanga Chili Oil 100ml',
          description: 'Rwanda\'s famous spicy chili oil',
          price: 3000,
          category: 'chili',
          image: '/images/products/akabanga-100ml.jpg',
          rating: 4.9,
          reviews: 567,
          inStock: true,
          weight: '100ml',
        },
        quantity: 3,
      },
      {
        product: {
          id: '11',
          name: 'Natural Honey 500gr',
          description: 'Pure, raw honey harvested from Nyirangarama',
          price: 4000,
          category: 'spreads',
          image: '/images/products/honey-500gr.jpg',
          rating: 4.9,
          reviews: 312,
          inStock: true,
          weight: '500g',
        },
        quantity: 2,
      },
    ],
    total: 17000,
    status: 'PROCESSING',
    createdAt: '2024-04-10T14:20:00Z',
    shippingName: 'Jean Pierre',
    shippingPhone: '+250 788 305 558',
    shippingAddress: 'Nyirangarama, Rulindo District, Rwanda',
  },
  {
    id: 'ORD-003',
    userId: 'user-1',
    items: [
      {
        product: {
          id: '2',
          name: 'Agashya Pineapple Juice 1L',
          description: 'Fresh pineapple juice crafted from ripe Rwandan pineapples',
          price: 10000,
          category: 'juices',
          image: '/images/products/agashya-pineapple.jpg',
          rating: 4.8,
          reviews: 289,
          inStock: true,
          weight: '1L',
        },
        quantity: 2,
      },
      {
        product: {
          id: '10',
          name: 'Strawberry Jam 500gr',
          description: 'Homemade-style strawberry jam made with fresh Rwandan strawberries',
          price: 2000,
          category: 'spreads',
          image: '/images/products/strawberry-jam.jpg',
          rating: 4.6,
          reviews: 178,
          inStock: true,
          weight: '500g',
        },
        quantity: 1,
      },
    ],
    total: 22000,
    status: 'SHIPPED',
    createdAt: '2024-04-12T09:15:00Z',
    shippingName: 'Jean Pierre',
    shippingPhone: '+250 788 305 558',
    shippingAddress: 'Nyirangarama, Rulindo District, Rwanda',
  },
  {
    id: 'ORD-004',
    userId: 'user-1',
    items: [
      {
        product: {
          id: '11',
          name: 'Natural Honey 500gr',
          description: 'Pure, raw honey harvested from Nyirangarama',
          price: 4000,
          category: 'spreads',
          image: '/images/products/honey-500gr.jpg',
          rating: 4.9,
          reviews: 312,
          inStock: true,
          weight: '500g',
        },
        quantity: 1,
      },
      {
        product: {
          id: '3',
          name: 'Agashya Strawberry Juice 1L',
          description: 'Delicious strawberry juice made from fresh strawberries',
          price: 10000,
          category: 'juices',
          image: '/images/products/agashya-strawberry.jpg',
          rating: 4.7,
          reviews: 198,
          inStock: true,
          weight: '1L',
        },
        quantity: 1,
      },
      {
        product: {
          id: '7',
          name: 'Akabanga Chili Oil 20ml',
          description: 'The famous Akabanga chili oil in a pocket-sized 20ml bottle',
          price: 800,
          category: 'chili',
          image: '/images/products/akabanga-20ml.jpg',
          rating: 4.8,
          reviews: 423,
          inStock: true,
          weight: '20ml',
        },
        quantity: 5,
      },
    ],
    total: 18000,
    status: 'PENDING',
    createdAt: '2024-04-14T16:45:00Z',
    shippingName: 'Jean Pierre',
    shippingPhone: '+250 788 305 558',
    shippingAddress: 'Nyirangarama, Rulindo District, Rwanda',
    shippingNotes: 'Call on arrival',
  },
]

export const getOrdersByUserId = (userId: string): Order[] => {
  return mockOrders.filter(order => order.userId === userId)
}

export const getOrderById = (id: string): Order | undefined => {
  return mockOrders.find(order => order.id === id)
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
  }).format(price)
}

export const getStatusColor = (status: Order['status']): string => {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
