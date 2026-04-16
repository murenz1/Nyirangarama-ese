// API Service Layer for Nyirangarama Backend Integration
// This file provides the structure for connecting to a backend API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }

    // Check if response has content
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }
    
    return null as T
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// ==================== AUTHENTICATION ====================

export const authAPI = {
  login: async (email: string, password: string) => {
    return fetchAPI<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  signup: async (name: string, email: string, password: string, phone?: string) => {
    return fetchAPI<{ token: string; user: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone }),
    })
  },

  logout: async () => {
    return fetchAPI('/auth/logout', {
      method: 'POST',
    })
  },

  forgotPassword: async (email: string) => {
    return fetchAPI('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  resetPassword: async (token: string, newPassword: string) => {
    return fetchAPI('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    })
  },

  updateProfile: async (userData: Partial<any>) => {
    return fetchAPI('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return fetchAPI('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  },
}

// ==================== PRODUCTS ====================

export const productsAPI = {
  getAll: async (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    return fetchAPI<{ products: any[]; total: number; pages: number }>(
      `/products?${queryParams.toString()}`
    )
  },

  getById: async (id: string) => {
    return fetchAPI<any>(`/products/${id}`)
  },

  getCategories: async () => {
    return fetchAPI<any[]>('/products/categories')
  },

  create: async (productData: any) => {
    return fetchAPI('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  },

  update: async (id: string, productData: any) => {
    return fetchAPI(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  },

  delete: async (id: string) => {
    return fetchAPI(`/admin/products/${id}`, {
      method: 'DELETE',
    })
  },

  updateStock: async (id: string, quantity: number) => {
    return fetchAPI(`/admin/products/${id}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
  },

  uploadImage: async (id: string, file: File) => {
    const formData = new FormData()
    formData.append('image', file)

    return fetch(`/admin/products/${id}/image`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth-token') || ''}`,
      },
    })
  },
}

// ==================== ORDERS ====================

export const ordersAPI = {
  getAll: async (params?: { status?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    return fetchAPI<{ orders: any[]; total: number; pages: number }>(
      `/orders?${queryParams.toString()}`
    )
  },

  getById: async (id: string) => {
    return fetchAPI<any>(`/orders/${id}`)
  },

  getUserOrders: async () => {
    return fetchAPI<any[]>('/orders/my-orders')
  },

  create: async (orderData: any) => {
    return fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  },

  updateStatus: async (id: string, status: string) => {
    return fetchAPI(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  },

  assignDriver: async (orderId: string, driverId: string) => {
    return fetchAPI(`/admin/orders/${orderId}/assign-driver`, {
      method: 'PUT',
      body: JSON.stringify({ driverId }),
    })
  },

  track: async (orderId: string) => {
    return fetchAPI<any>(`/orders/${orderId}/track`)
  },
}

// ==================== CUSTOMERS ====================

export const customersAPI = {
  getAll: async () => {
    return fetchAPI<any[]>('/admin/customers')
  },

  getById: async (id: string) => {
    return fetchAPI<any>(`/admin/customers/${id}`)
  },

  update: async (id: string, customerData: any) => {
    return fetchAPI(`/admin/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    })
  },

  resetPassword: async (id: string, newPassword: string) => {
    return fetchAPI(`/admin/customers/${id}/reset-password`, {
      method: 'PUT',
      body: JSON.stringify({ newPassword }),
    })
  },

  getCustomerOrders: async (id: string) => {
    return fetchAPI<any[]>(`/admin/customers/${id}/orders`)
  },
}

// ==================== DRIVERS ====================

export const driversAPI = {
  getAll: async () => {
    return fetchAPI<any[]>('/admin/drivers')
  },

  getAvailable: async () => {
    return fetchAPI<any[]>('/admin/drivers/available')
  },

  create: async (driverData: any) => {
    return fetchAPI('/admin/drivers', {
      method: 'POST',
      body: JSON.stringify(driverData),
    })
  },

  update: async (id: string, driverData: any) => {
    return fetchAPI(`/admin/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(driverData),
    })
  },

  delete: async (id: string) => {
    return fetchAPI(`/admin/drivers/${id}`, {
      method: 'DELETE',
    })
  },

  updateStatus: async (id: string, status: string, currentOrderId?: string) => {
    return fetchAPI(`/admin/drivers/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, currentOrderId }),
    })
  },

  sendSMS: async (id: string, message: string) => {
    return fetchAPI(`/admin/drivers/${id}/sms`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    })
  },
}

// ==================== PROMOTIONS ====================

export const promotionsAPI = {
  getAll: async () => {
    return fetchAPI<any[]>('/admin/promotions')
  },

  getActive: async () => {
    return fetchAPI<any[]>('/promotions/active')
  },

  validate: async (code: string, orderTotal: number) => {
    return fetchAPI<any>('/promotions/validate', {
      method: 'POST',
      body: JSON.stringify({ code, orderTotal }),
    })
  },

  create: async (promoData: any) => {
    return fetchAPI('/admin/promotions', {
      method: 'POST',
      body: JSON.stringify(promoData),
    })
  },

  update: async (id: string, promoData: any) => {
    return fetchAPI(`/admin/promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(promoData),
    })
  },

  delete: async (id: string) => {
    return fetchAPI(`/admin/promotions/${id}`, {
      method: 'DELETE',
    })
  },
}

// ==================== ANALYTICS ====================

export const analyticsAPI = {
  getDashboard: async (timeRange?: string) => {
    const query = timeRange ? `?range=${timeRange}` : ''
    return fetchAPI<any>(`/admin/analytics/dashboard${query}`)
  },

  getSales: async (startDate: string, endDate: string) => {
    return fetchAPI<any>(`/admin/analytics/sales?start=${startDate}&end=${endDate}`)
  },

  getTopProducts: async (limit: number = 10) => {
    return fetchAPI<any[]>(`/admin/analytics/top-products?limit=${limit}`)
  },

  getCustomerStats: async () => {
    return fetchAPI<any>('/admin/analytics/customers')
  },
}

// ==================== INBOX / MESSAGES ====================

export const inboxAPI = {
  getAll: async () => {
    return fetchAPI<any[]>('/admin/inbox')
  },

  getById: async (id: string) => {
    return fetchAPI<any>(`/admin/inbox/${id}`)
  },

  create: async (messageData: any) => {
    return fetchAPI('/contact', {
      method: 'POST',
      body: JSON.stringify(messageData),
    })
  },

  reply: async (id: string, reply: string) => {
    return fetchAPI(`/admin/inbox/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ reply }),
    })
  },

  markAsRead: async (id: string) => {
    return fetchAPI(`/admin/inbox/${id}/read`, {
      method: 'PUT',
    })
  },

  delete: async (id: string) => {
    return fetchAPI(`/admin/inbox/${id}`, {
      method: 'DELETE',
    })
  },
}

// ==================== SETTINGS ====================

export const settingsAPI = {
  get: async () => {
    return fetchAPI<any>('/admin/settings')
  },

  update: async (settings: any) => {
    return fetchAPI('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  },

  updatePayment: async (paymentSettings: any) => {
    return fetchAPI('/admin/settings/payment', {
      method: 'PUT',
      body: JSON.stringify(paymentSettings),
    })
  },

  updateShipping: async (shippingSettings: any) => {
    return fetchAPI('/admin/settings/shipping', {
      method: 'PUT',
      body: JSON.stringify(shippingSettings),
    })
  },

  updateNotifications: async (notificationSettings: any) => {
    return fetchAPI('/admin/settings/notifications', {
      method: 'PUT',
      body: JSON.stringify(notificationSettings),
    })
  },
}

// ==================== WISHLIST ====================

export const wishlistAPI = {
  getAll: async () => {
    return fetchAPI<any[]>('/wishlist')
  },

  add: async (productId: string) => {
    return fetchAPI('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    })
  },

  remove: async (productId: string) => {
    return fetchAPI(`/wishlist/${productId}`, {
      method: 'DELETE',
    })
  },

  clear: async () => {
    return fetchAPI('/wishlist', {
      method: 'DELETE',
    })
  },
}

// Export all APIs
export const API = {
  auth: authAPI,
  products: productsAPI,
  orders: ordersAPI,
  customers: customersAPI,
  drivers: driversAPI,
  promotions: promotionsAPI,
  analytics: analyticsAPI,
  inbox: inboxAPI,
  settings: settingsAPI,
  wishlist: wishlistAPI,
}

export default API
