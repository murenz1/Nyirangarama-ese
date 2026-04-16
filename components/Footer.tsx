'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="SINA Rwanda"
                className="h-10 w-auto"
              />
              <div>
                <span className="font-display font-bold text-xl text-white block">
                  Nyirangarama
                </span>
                <span className="text-xs text-primary-400">SINA Rwanda</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-primary-200 leading-relaxed">
              Discover authentic Rwandan flavors with our premium selection of 
              juices, sauces, biscuits, and traditional delicacies.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="#"
                className="p-2 text-primary-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="p-2 text-primary-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.986 11.988 11.986s11.987-5.366 11.987-11.986C24.004 5.367 18.637.001 12.017.001zm5.724 5.94c.504 0 .916.412.916.916v11.26c0 .503-.412.915-.916.915H6.291c-.503 0-.915-.412-.915-.915V6.856c0-.504.412-.916.915-.916h11.45zm-8.597 2.49a1.752 1.752 0 110 3.504 1.752 1.752 0 010-3.504zm4.333 1.752a4.085 4.085 0 11-8.17 0 4.085 4.085 0 018.17 0z"/>
                </svg>
              </a>
              <a
                href="#"
                className="p-2 text-primary-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-primary-200 hover:text-white transition-colors"
                >
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=juices"
                  className="text-sm text-primary-200 hover:text-white transition-colors"
                >
                  Fresh Juices
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=sauces"
                  className="text-sm text-primary-200 hover:text-white transition-colors"
                >
                  Sauces & Condiments
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=biscuits"
                  className="text-sm text-primary-200 hover:text-white transition-colors"
                >
                  Biscuits & Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-primary-200 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-primary-200 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-primary-200 hover:text-white transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-primary-200 hover:text-white transition-colors"
                >
                  Shipping Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-300 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-primary-200">
                  Nyirangarama, Rulindo District<br />
                  Northern Province, Rwanda<br />
                  45 Km from Kigali City
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-300 flex-shrink-0" />
                <a
                  href="tel:+250788305558"
                  className="text-sm text-primary-200 hover:text-white transition-colors"
                >
                  +250 788 305 558
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-300 flex-shrink-0" />
                <a
                  href="mailto:info@sinarwanda.rw"
                  className="text-sm text-primary-200 hover:text-white transition-colors"
                >
                  info@sinarwanda.rw
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-300">
              © {new Date().getFullYear()} Nyirangarama. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-primary-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-primary-300 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
