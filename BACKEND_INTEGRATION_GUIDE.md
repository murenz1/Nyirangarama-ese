# Nyirangarama Backend Integration Guide

## Overview
This guide provides comprehensive documentation for connecting the Nyirangarama frontend to a backend API. The frontend is built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

---

## Table of Contents
1. [Frontend Architecture](#frontend-architecture)
2. [API Endpoints Specification](#api-endpoints-specification)
3. [Data Models](#data-models)
4. [Authentication Flow](#authentication-flow)
5. [State Management Integration](#state-management-integration)
6. [Implementation Checklist](#implementation-checklist)
7. [Third-Party Integrations](#third-party-integrations)

---

## Frontend Architecture

### Tech Stack
- **Framework**: Next.js 16.2.3 (App Router)
- **Language**: TypeScript 6.0.2
- **Styling**: Tailwind CSS 4.2.2
- **State Management**: Zustand 5.0.12 with persistence
- **Icons**: Lucide React
- **Utilities**: clsx for conditional classes

### Project Structure
```
nyirangarama/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Customer-facing pages
│   │   ├── page.tsx       # Homepage
│   │   ├── shop/page.tsx  # Product listing
│   │   ├── product/[id]/  # Product detail
│   │   ├── cart/page.tsx  # Shopping cart
│   │   ├── checkout/      # Checkout flow
│   │   ├── account/       # User account
│   │   ├── wishlist/      # Wishlist page
│   │   ├── track/         # Order tracking
│   │   ├── contact/       # Contact form
│   │   ├── terms/         # Terms of Service
│   │   └── privacy/       # Privacy Policy
│   ├── admin/             # Admin dashboard
│   │   ├── page.tsx       # Admin dashboard
│   │   ├── products/      # Product management
│   │   ├── orders/        # Order management
│   │   ├── customers/     # Customer management
│   │   ├── drivers/       # Driver management
│   │   ├── inbox/         # Contact messages
│   │   ├── promotions/    # Promo codes
│   │   ├── analytics/     # Sales analytics
│   │   └── settings/      # Store settings
│   ├── auth/              # Authentication
│   │   ├── login/         # Sign in
│   │   ├── signup/        # Sign up
│   │   └── forgot-password/ # Password reset
│   └── layout.tsx         # Root layout
├── components/            # React components
├── data/                  # Mock data & types
├── lib/                   # Utilities & stores
│   ├── store.ts          # Zustand stores
│   └── api.ts            # API service layer
└── public/               # Static assets
```

---

## API Endpoints Specification

### Base URL Configuration
```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
```

### 1. Authentication Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/auth/login` | POST | User login | `{ email, password }` | `{ token, user }` |
| `/auth/signup` | POST | User registration | `{ name, email, password, phone? }` | `{ token, user }` |
| `/auth/logout` | POST | User logout | - | `{ success: true }` |
| `/auth/forgot-password` | POST | Request password reset | `{ email }` | `{ message }` |
| `/auth/reset-password` | POST | Reset password | `{ token, newPassword }` | `{ success: true }` |
| `/auth/profile` | PUT | Update profile | User fields | `{ user }` |
| `/auth/change-password` | PUT | Change password | `{ currentPassword, newPassword }` | `{ success: true }` |

### 2. Products Endpoints

| Endpoint | Method | Description | Query Params | Response |
|----------|--------|-------------|--------------|----------|
| `/products` | GET | Get all products | `category`, `search`, `page`, `limit` | `{ products[], total, pages }` |
| `/products/:id` | GET | Get product by ID | - | Product object |
| `/products/categories` | GET | Get all categories | - | Category[] |
| `/admin/products` | POST | Create product | Product data | New product |
| `/admin/products/:id` | PUT | Update product | Product data | Updated product |
| `/admin/products/:id` | DELETE | Delete product | - | `{ success: true }` |
| `/admin/products/:id/stock` | PUT | Update stock | `{ quantity }` | Updated product |
| `/admin/products/:id/image` | POST | Upload image | FormData (image) | `{ imageUrl }` |

### 3. Orders Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/orders` | GET | Get all orders | `status`, `page`, `limit` | `{ orders[], total, pages }` |
| `/orders/:id` | GET | Get order by ID | - | Order object |
| `/orders/my-orders` | GET | Get user's orders | - | Order[] |
| `/orders` | POST | Create order | Order data | New order |
| `/admin/orders/:id/status` | PUT | Update status | `{ status }` | Updated order |
| `/admin/orders/:id/assign-driver` | PUT | Assign driver | `{ driverId }` | Updated order |
| `/orders/:id/track` | GET | Track order | - | Tracking info |

### 4. Customers Endpoints (Admin)

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/admin/customers` | GET | Get all customers | Customer[] |
| `/admin/customers/:id` | GET | Get customer details | Customer |
| `/admin/customers/:id` | PUT | Update customer | Updated customer |
| `/admin/customers/:id/reset-password` | PUT | Reset password | `{ success: true }` |
| `/admin/customers/:id/orders` | GET | Get customer orders | Order[] |

### 5. Drivers Endpoints (Admin)

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/admin/drivers` | GET | Get all drivers | - | Driver[] |
| `/admin/drivers/available` | GET | Get available drivers | - | Driver[] |
| `/admin/drivers` | POST | Create driver | Driver data | New driver |
| `/admin/drivers/:id` | PUT | Update driver | Driver data | Updated driver |
| `/admin/drivers/:id` | DELETE | Delete driver | - | `{ success: true }` |
| `/admin/drivers/:id/status` | PUT | Update status | `{ status, currentOrderId? }` | Updated driver |
| `/admin/drivers/:id/sms` | POST | Send SMS | `{ message }` | `{ success: true }` |

### 6. Promotions Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/admin/promotions` | GET | Get all promos | - | Promo[] |
| `/promotions/active` | GET | Get active promos | - | Promo[] |
| `/promotions/validate` | POST | Validate promo | `{ code, orderTotal }` | Validation result |
| `/admin/promotions` | POST | Create promo | Promo data | New promo |
| `/admin/promotions/:id` | PUT | Update promo | Promo data | Updated promo |
| `/admin/promotions/:id` | DELETE | Delete promo | - | `{ success: true }` |

### 7. Analytics Endpoints (Admin)

| Endpoint | Method | Description | Query Params | Response |
|----------|--------|-------------|--------------|----------|
| `/admin/analytics/dashboard` | GET | Dashboard stats | `range` | Dashboard data |
| `/admin/analytics/sales` | GET | Sales data | `start`, `end` | Sales[] |
| `/admin/analytics/top-products` | GET | Top products | `limit` | Product[] |
| `/admin/analytics/customers` | GET | Customer stats | - | Customer stats |

### 8. Inbox Endpoints (Admin)

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/admin/inbox` | GET | Get all messages | - | Message[] |
| `/admin/inbox/:id` | GET | Get message | - | Message |
| `/contact` | POST | Send contact form | Contact data | `{ success: true }` |
| `/admin/inbox/:id/reply` | POST | Reply to message | `{ reply }` | Updated message |
| `/admin/inbox/:id/read` | PUT | Mark as read | - | Updated message |
| `/admin/inbox/:id` | DELETE | Delete message | - | `{ success: true }` |

### 9. Settings Endpoints (Admin)

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/admin/settings` | GET | Get settings | - | Settings |
| `/admin/settings` | PUT | Update settings | Settings data | Updated settings |
| `/admin/settings/payment` | PUT | Update payment | Payment settings | Updated |
| `/admin/settings/shipping` | PUT | Update shipping | Shipping settings | Updated |
| `/admin/settings/notifications` | PUT | Update notifications | Notification settings | Updated |

### 10. Wishlist Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/wishlist` | GET | Get wishlist | - | Product[] |
| `/wishlist` | POST | Add to wishlist | `{ productId }` | Updated wishlist |
| `/wishlist/:productId` | DELETE | Remove from wishlist | - | Updated wishlist |
| `/wishlist` | DELETE | Clear wishlist | - | `{ success: true }` |

---

## Data Models

### User Model
```typescript
interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  role: 'customer' | 'admin'
  createdAt: string
}
```

### Product Model
```typescript
interface Product {
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
```

### Order Model
```typescript
interface Order {
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
```

### CartItem Model
```typescript
interface CartItem {
  product: Product
  quantity: number
}
```

### Category Model
```typescript
interface Category {
  id: string
  name: string
  description: string
  image: string
  productCount: number
}
```

### Driver Model
```typescript
interface Driver {
  id: string
  name: string
  phone: string
  email: string
  status: 'available' | 'busy' | 'offline'
  rating: number
  totalDeliveries: number
  vehicleType: string
  vehiclePlate: string
  currentOrderId?: string
  joinedAt: string
}
```

### Promo Code Model
```typescript
interface PromoCode {
  id: string
  code: string
  type: 'percentage' | 'fixed' | 'shipping'
  value: number
  minOrder: number
  maxDiscount: number
  usageLimit: number
  usageCount: number
  startDate: string
  endDate: string
  status: 'active' | 'expired'
}
```

---

## Authentication Flow

### JWT Token Strategy
1. Frontend sends credentials to `/auth/login`
2. Backend validates and returns `{ token, user }`
3. Frontend stores token in `localStorage` (key: `auth-token`)
4. Frontend includes token in all subsequent requests via `Authorization: Bearer {token}` header

### Protected Routes
```typescript
// Middleware pattern for protected routes
const token = localStorage.getItem('auth-token')
if (!token) {
  redirect('/auth/login')
}
```

### Store Integration
The frontend uses Zustand with persistence for auth state:
```typescript
// lib/store.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      // ... methods
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

---

## State Management Integration

### Zustand Stores

#### 1. Cart Store (Persistent)
```typescript
interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}
```

#### 2. Auth Store (Persistent)
```typescript
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}
```

#### 3. Wishlist Store (Persistent)
```typescript
interface WishlistState {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleItem: (product: Product) => void
  clearWishlist: () => void
}
```

### API Integration Pattern
Replace mock implementations in stores with actual API calls:

```typescript
// Example: Updating auth store to use real API
login: async (email: string, password: string) => {
  try {
    const { token, user } = await authAPI.login(email, password)
    localStorage.setItem('auth-token', token)
    set({ user, isAuthenticated: true })
    return true
  } catch (error) {
    return false
  }
}
```

---

## Implementation Checklist

### Phase 1: Core Setup
- [ ] Set up backend API server (Node.js/Express or similar)
- [ ] Configure environment variables (`NEXT_PUBLIC_API_URL`)
- [ ] Set up database (PostgreSQL, MongoDB, or similar)
- [ ] Implement JWT authentication middleware

### Phase 2: Authentication
- [ ] Implement `/auth/login` endpoint
- [ ] Implement `/auth/signup` endpoint
- [ ] Implement `/auth/forgot-password` with email service
- [ ] Implement `/auth/reset-password` endpoint
- [ ] Update frontend auth store to use real API

### Phase 3: Products
- [ ] Create Product model in database
- [ ] Implement CRUD endpoints for products
- [ ] Implement image upload (AWS S3, Cloudinary, or local)
- [ ] Implement category management
- [ ] Update product pages to use real data

### Phase 4: Orders
- [ ] Create Order model with relationships
- [ ] Implement order creation endpoint
- [ ] Implement order status workflow
- [ ] Implement payment integration (MTN Mobile Money, etc.)
- [ ] Update checkout flow

### Phase 5: Drivers & Delivery
- [ ] Create Driver model
- [ ] Implement driver assignment logic
- [ ] Integrate SMS service (Twilio, Africa's Talking, or local provider)
- [ ] Implement order tracking updates

### Phase 6: Admin Features
- [ ] Implement admin authentication/authorization
- [ ] Create admin dashboard endpoints
- [ ] Implement analytics aggregation
- [ ] Set up reporting

### Phase 7: Additional Features
- [ ] Implement wishlist endpoints
- [ ] Implement promo code validation
- [ ] Set up email service (SendGrid, AWS SES)
- [ ] Implement notification system

---

## Third-Party Integrations

### 1. Payment Integration
**Recommended**: MTN Mobile Money API, Airtel Money API
- Endpoint: `/api/payments/mobile-money`
- Flow: Initiate payment → User confirms on phone → Webhook confirmation

### 2. SMS Integration
**Recommended**: Africa's Talking, Twilio, or local SMS provider
```typescript
// Driver notification example
driversAPI.sendSMS(driverId, `New delivery: ${orderId}. Customer: ${customerName}. Address: ${address}`)
```

### 3. Email Service
**Recommended**: SendGrid, AWS SES, or Mailgun
- Order confirmations
- Password reset emails
- Marketing emails (with consent)

### 4. Image Storage
**Recommended**: Cloudinary, AWS S3, or Supabase Storage
- Product images
- User avatars
- Category images

### 5. Analytics (Optional)
**Recommended**: Google Analytics, Mixpanel, or Plausible
- Track page views
- Track conversion funnels
- Track user behavior

---

## Environment Variables

Create `.env.local` file:
```
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Authentication
JWT_SECRET=your-secret-key

# Payment (MTN Mobile Money)
MTN_API_USER=your-api-user
MTN_API_KEY=your-api-key
MTN_SUBSCRIPTION_KEY=your-subscription-key

# SMS (Africa's Talking)
AT_USERNAME=your-username
AT_API_KEY=your-api-key

# Email (SendGrid)
SENDGRID_API_KEY=your-api-key
FROM_EMAIL=noreply@sinarwanda.rw

# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **CORS**: Configure CORS to allow only your frontend domain
3. **Rate Limiting**: Implement rate limiting on auth endpoints
4. **Input Validation**: Validate all inputs on backend
5. **SQL Injection**: Use parameterized queries or ORM
6. **XSS Protection**: Sanitize user-generated content
7. **CSRF Protection**: Implement CSRF tokens for state-changing operations

---

## Testing Strategy

### API Testing
- Use Postman or Insomnia to test all endpoints
- Test authentication flow thoroughly
- Test error responses

### Frontend Testing
- Test all user flows (login, purchase, etc.)
- Test responsive design
- Test with slow network (throttling)

---

## Deployment Notes

### Frontend Deployment
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**

### Backend Deployment
- **Railway**, **Render**, or **Heroku** (Easy)
- **AWS EC2** or **DigitalOcean** (More control)
- **Google Cloud Run** (Serverless)

### Database Deployment
- **Supabase** (PostgreSQL + Auth + Storage)
- **Railway** (PostgreSQL)
- **MongoDB Atlas** (MongoDB)

---

## Support & Resources

### Frontend
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Zustand: https://docs.pmnd.rs/zustand

### Backend Suggestions
- **Node.js + Express**: Good for JavaScript ecosystem
- **NestJS**: Enterprise-grade Node.js framework
- **Django**: Python with built-in admin
- **Laravel**: PHP with excellent ecosystem

### Database Suggestions
- **PostgreSQL**: Robust relational database
- **MongoDB**: Flexible document database
- **Supabase**: PostgreSQL with realtime features

---

## Summary

The Nyirangarama frontend is a complete, market-ready e-commerce platform with:
- Full customer shopping experience
- Complete admin dashboard
- Delivery management system
- Wishlist and order tracking
- Responsive design with brand consistency

To make it production-ready, implement the backend API following this guide's specifications. The API layer (`lib/api.ts`) is already structured and ready to connect to your backend.

**Next Steps**:
1. Set up your backend with the specified endpoints
2. Configure environment variables
3. Update stores to use real API calls
4. Deploy and test
5. Monitor and iterate

---

*Generated for Nyirangarama E-commerce Platform*
