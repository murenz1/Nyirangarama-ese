import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Nyirangarama',
  description: 'Privacy Policy for Nyirangarama online store',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-earth-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Privacy Policy
            </h1>
            <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-600 leading-relaxed">
                  Nyirangarama is committed to protecting your privacy. This Privacy Policy explains how we 
                  collect, use, disclose, and safeguard your information when you visit our website or make 
                  a purchase. Please read this privacy policy carefully. By using our platform, you consent 
                  to the practices described in this policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may collect the following types of information:
                </p>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>Name, email address, and phone number</li>
                  <li>Shipping and billing addresses</li>
                  <li>Payment information (processed securely by our payment partners)</li>
                  <li>Account login credentials</li>
                </ul>
                <h3 className="font-semibold text-gray-900 mb-2">Non-Personal Information</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>IP address</li>
                  <li>Pages visited and time spent on our platform</li>
                  <li>Referring website addresses</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">3. How We Collect Information</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We collect information through:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Direct interactions when you create an account or place an order</li>
                  <li>Automated technologies such as cookies and web beacons</li>
                  <li>Third-party service providers (payment processors, analytics)</li>
                  <li>Communication with our customer service team</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">4. How We Use Your Information</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use your information for the following purposes:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Processing and fulfilling your orders</li>
                  <li>Managing your account and providing customer support</li>
                  <li>Sending order confirmations and updates</li>
                  <li>Communicating about promotions and new products (with your consent)</li>
                  <li>Improving our website and services</li>
                  <li>Preventing fraud and ensuring security</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to enhance your experience on our platform. 
                  These technologies help us:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Remember your preferences and login information</li>
                  <li>Keep items in your shopping cart</li>
                  <li>Understand how you use our website</li>
                  <li>Deliver relevant advertisements</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  You can manage cookie preferences through your browser settings. However, disabling cookies 
                  may affect the functionality of our platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">6. Information Sharing and Disclosure</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may share your information with:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>Service Providers:</strong> Payment processors, delivery companies, and IT support</li>
                  <li><strong>Business Partners:</strong> With your consent for joint promotions</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  We do not sell your personal information to third parties for marketing purposes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">7. Data Security</h2>
                <p className="text-gray-600 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction. However, 
                  no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
                <p className="text-gray-600 leading-relaxed">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined 
                  in this Privacy Policy, unless a longer retention period is required by law. When your 
                  information is no longer needed, we will securely delete or anonymize it.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">9. Your Rights and Choices</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to or restrict certain processing activities</li>
                  <li>Data portability (receive data in a structured format)</li>
                  <li>Withdraw consent at any time</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our platform is not intended for children under 16 years of age. We do not knowingly 
                  collect personal information from children under 16. If you are a parent or guardian 
                  and believe your child has provided us with personal information, please contact us 
                  immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">11. Third-Party Links</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our platform may contain links to third-party websites. We are not responsible for the 
                  privacy practices or content of these websites. We encourage you to review the privacy 
                  policies of any third-party sites you visit.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">12. Changes to This Policy</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this 
                  page with an updated revision date. We encourage you to review this policy periodically 
                  to stay informed about how we are protecting your information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our 
                  data practices, please contact us:
                </p>
                <div className="text-gray-600">
                  <p>Email: info@sinarwanda.rw</p>
                  <p>Phone: +250 788 305 558</p>
                  <p>Address: Nyirangarama, Rulindo District, Northern Province, Rwanda</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
