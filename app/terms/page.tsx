import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Nyirangarama',
  description: 'Terms of Service for Nyirangarama online store',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-earth-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Terms of Service
            </h1>
            <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-600 leading-relaxed">
                  Welcome to Nyirangarama. These Terms of Service govern your use of our website and services. 
                  By accessing or using our platform, you agree to be bound by these terms. Please read them carefully.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">2. Definitions</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>"Platform"</strong> refers to the Nyirangarama website and mobile applications.</li>
                  <li><strong>"User"</strong> refers to any individual who accesses or uses our platform.</li>
                  <li><strong>"Products"</strong> refers to goods available for purchase on our platform.</li>
                  <li><strong>"Services"</strong> refers to all services provided by Nyirangarama.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  To access certain features of our platform, you may need to create an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Provide accurate and complete information during registration</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Promptly update your account information if it changes</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">4. Orders and Payments</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  By placing an order on our platform, you agree to the following:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>All prices are in Rwandan Francs (RWF) and inclusive of applicable taxes</li>
                  <li>We reserve the right to refuse or cancel orders at our discretion</li>
                  <li>Payment must be made using approved payment methods</li>
                  <li>Orders are subject to product availability</li>
                  <li>Delivery times are estimates and may vary</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">5. Shipping and Delivery</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We offer the following shipping options within Rwanda:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Standard Delivery (3-5 business days): 2,000 RWF</li>
                  <li>Express Delivery (1-2 business days): 5,000 RWF</li>
                  <li>Same Day Delivery (Kigali only): 8,000 RWF</li>
                  <li>Free shipping on orders over 50,000 RWF</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">6. Returns and Refunds</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We accept returns under the following conditions:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Items must be returned within 7 days of delivery</li>
                  <li>Products must be unopened and in original packaging</li>
                  <li>Perishable items cannot be returned unless defective</li>
                  <li>Refunds will be processed within 5-7 business days</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">7. Prohibited Activities</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Users are prohibited from:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Using the platform for illegal purposes</li>
                  <li>Attempting to breach security measures</li>
                  <li>Providing false or misleading information</li>
                  <li>Interfering with other users' access to the platform</li>
                  <li>Reselling products without authorization</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
                <p className="text-gray-600 leading-relaxed">
                  All content on our platform, including text, graphics, logos, and images, is the property 
                  of Nyirangarama or its licensors and is protected by copyright and other intellectual property laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed">
                  Nyirangarama shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages arising from your use of our platform or products. Our total liability 
                  shall not exceed the amount paid for the specific product giving rise to the liability.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately 
                  upon posting to the platform. Your continued use of the platform constitutes acceptance of the modified terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
                <p className="text-gray-600 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 text-gray-600">
                  <p>Email: info@sinarwanda.rw</p>
                  <p>Phone: +250 788 305 558</p>
                  <p>Address: Nyirangarama, Rulindo District, Northern Province, Rwanda</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms of Service shall be governed by and construed in accordance with the laws of 
                  the Republic of Rwanda. Any disputes arising under these terms shall be subject to the 
                  exclusive jurisdiction of the courts of Rwanda.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
