# Nyirangarama E-Commerce Frontend

A modern e-commerce frontend built for Nyirangarama (SINA Rwanda), featuring authentic Rwandan products including Agashya juices, Akabanga chili oil, natural honey, and more.

## Features

- **Homepage**: Hero section with real company info, product categories, featured products, brand story, and product gallery
- **Shop Page**: Product grid with category filters and search functionality
- **Product Details**: Full product information with images, pricing, and add to cart
- **Cart System**: Add/remove items, update quantities, persistent storage via Zustand
- **Checkout**: Complete order form with customer details and order summary
- **Authentication**: Login/signup with mock authentication
- **User Account**: Profile management, order history, and address management
- **Admin Dashboard**: Statistics, product management, and order tracking

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (with localStorage persistence)
- **Icons**: Lucide React
- **UI Components**: Custom components with Tailwind CSS

## Product Data

All product data is sourced from the official Nyirangarama website: https://sinarwanda.rw/

Real products include:
- **Agashya Juices**: Passion, Pineapple, Strawberry (1L and 500ml)
- **Akabanga Chili Oil**: 100ml, 20ml, and Olive Oil blends
- **Bread Spreads**: Natural Honey 500gr, Strawberry Jam 500gr
- **Akanozo Flour**: Premium wheat flour
- **Akarusho**: Traditional banana wine
- **Natural Water**: Spring water from Rulindo mountains

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

- **Email**: jean@example.com
- **Password**: password123

## Project Structure

```
nyirangarama/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Homepage
│   ├── shop/page.tsx      # Shop page
│   ├── product/[id]/     # Product detail page
│   ├── cart/page.tsx      # Cart page
│   ├── checkout/page.tsx  # Checkout page
│   ├── auth/login/        # Login page
│   ├── auth/signup/       # Signup page
│   ├── account/page.tsx   # User account page
│   └── admin/page.tsx     # Admin dashboard
├── components/            # Reusable UI components
├── data/                  # Mock data (products, categories, orders)
├── lib/                   # Store configuration (Zustand)
├── styles/               # Global styles
└── public/               # Static assets
```

## Company Information

**SINA Rwanda (Ese URWIBUTSO)**
- **Owner**: Mr. SINA Gerard
- **Location**: Nyirangarama, Rulindo District, Northern Province, Rwanda
- **Distance**: 45 Km from Kigali City on Kigali-Musanze-Rubavu main road
- **Certifications**: ISO 22000:2018, Halal Certified
- **Mission**: Processing and delivering standardized products and providing high quality services
- **Core Values**: God above all; Integrity; Innovation; Perfection; Reliability

## Design System

- **Colors**: Warm earth tones (terracotta, sage, honey, cream)
- **Typography**: Inter for body, Playfair Display for headings
- **Components**: Rounded corners, soft shadows, smooth transitions
- **Layout**: Mobile-first responsive design

## Notes

- This is a frontend-only implementation with mock data
- No backend API calls are made
- Cart and auth state persist in localStorage
- Product images are loaded from the official Nyirangarama website

## License

MIT License - Built for educational purposes.
