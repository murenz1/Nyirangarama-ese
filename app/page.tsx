'use client'

import Link from 'next/link'
import { ArrowRight, Leaf, Heart, Truck } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import { CategoryCard } from '@/components/CategoryCard'
import { Button } from '@/components/Button'
import { categories } from '@/data/categories'
import { getFeaturedProducts } from '@/data/products'

export default function HomePage() {
  const featuredProducts = getFeaturedProducts().slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-sage-50 via-cream to-earth-100 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="inline-block bg-sage-100 text-sage-700 px-4 py-1.5 rounded-full text-sm font-medium">
                  SINA Rwanda - Nyirangarama
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Taste the Authentic Flavors of{' '}
                  <span className="text-primary-600">Nyirangarama</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                  ISO 22000:2018 Certified. Discover Agashya juices, Akabanga chili oil, 
                  natural honey, and traditional Rwandan products made with excellence since 1985.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/shop">
                    <Button size="lg">
                      Shop Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" size="lg">
                      Our Story
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-sage-500" />
                    <span className="text-sm text-gray-600">100% Natural</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-terracotta" />
                    <span className="text-sm text-gray-600">Made with Love</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary-500" />
                    <span className="text-sm text-gray-600">Fast Delivery</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-sage-200 to-earth-200 overflow-hidden">
                  <img 
                    src="/images/hero/hero-main.jpg"
                    alt="Nyirangarama Products"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-4">
                  <p className="text-2xl font-bold text-gray-900">15+</p>
                  <p className="text-sm text-gray-600">Premium Products</p>
                </div>
                <div className="absolute -top-6 -right-6 bg-primary-600 text-white rounded-2xl shadow-lg p-4">
                  <p className="text-2xl font-bold">ISO</p>
                  <p className="text-sm text-primary-100">22000:2018</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Browse by Category
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our diverse range of authentic Rwandan products, 
                each crafted with care and tradition.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 lg:py-24 bg-earth-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Featured Products
                </h2>
                <p className="text-gray-600 max-w-xl">
                  Our most loved products, carefully selected for their exceptional quality and taste.
                </p>
              </div>
              <Link href="/shop">
                <Button variant="outline">
                  View All Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Brand Story Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-earth-200 to-sage-200 overflow-hidden">
                    <img 
                      src="/images/hero/brand-story.jpg"
                      alt="Nyirangarama Honey"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-3xl bg-primary-100 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary-600">40+</p>
                      <p className="text-sm text-primary-700">Years of Excellence</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <span className="inline-block bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium">
                  About SINA Rwanda
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
                  SINA GERARD/Ese URWIBUTSO Since 1985
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    SINA GERARD/Ese URWIBUTSO is owned and managed by Mr. SINA Gerard. 
                    Located at Nyirangarama in Rulindo District, Northern Province, 
                    about 45 Km from Kigali City on the Kigali-Musanze-Rubavu main road.
                  </p>
                  <p>
                    <strong>Mission:</strong> Processing and delivering standardized products 
                    and providing high quality services. Being influential through providing 
                    excellent made in Rwanda products, being competitive worldwide and 
                    enhancing social economic development.
                  </p>
                  <p>
                    <strong>Core Values:</strong> God above all; Integrity within our 
                    commitment; Innovation; Bring to perfection our work; Reliability. 
                    We are ISO 22000:2018 Certified company with Halal certification.
                  </p>
                </div>
                <div className="flex flex-wrap gap-8 pt-4">
                  <div>
                    <p className="text-3xl font-bold text-primary-600">15+</p>
                    <p className="text-sm text-gray-600">Product Lines</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary-600">ISO</p>
                    <p className="text-sm text-gray-600">22000:2018</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary-600">Halal</p>
                    <p className="text-sm text-gray-600">Certified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Gallery Section */}
        <section className="py-16 lg:py-24 bg-earth-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Product Gallery
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our range of authentic Rwandan products, from refreshing juices 
                to spicy chili oil and natural honey.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-soft">
                <img 
                  src="/images/products/agashya-passion.jpg"
                  alt="Agashya Passion Juice"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-soft">
                <img 
                  src="/images/products/agashya-pineapple.jpg"
                  alt="Agashya Pineapple Juice"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-soft">
                <img 
                  src="/images/products/agashya-strawberry.jpg"
                  alt="Agashya Strawberry Juice"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-soft">
                <img 
                  src="/images/products/akabanga-100ml.jpg"
                  alt="Akabanga Chili Oil"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-soft">
                <img 
                  src="/images/products/honey-500gr.jpg"
                  alt="Natural Honey"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-soft">
                <img 
                  src="/images/products/strawberry-jam.jpg"
                  alt="Strawberry Jam"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 lg:py-24 bg-sage-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Subscribe to our newsletter for exclusive offers, new product announcements, 
              and stories from Rwanda.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
