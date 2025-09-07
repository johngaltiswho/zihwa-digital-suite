'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />

      {/* Content */}
      <div className="pt-24 px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-6 text-white">
              Privacy <span className="neon-glow">Policy</span>
            </h1>
            <p className="text-lg text-gray-400 font-light">
              Last updated: December 2024
            </p>
          </div>

          {/* Content */}
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8 md:p-12">
            <div className="prose prose-invert prose-lg max-w-none">
              
              <h2 className="text-3xl font-light text-white mb-6">Our Commitment to Your Privacy</h2>
              <p className="text-gray-300 font-light leading-relaxed mb-8">
                At Fluvium, we understand that your privacy is fundamental to your journey of self-mastery. 
                This Privacy Policy explains how we collect, use, protect, and share your personal information 
                when you use our services, visit our website, or engage with our community.
              </p>

              <h3 className="text-2xl font-light text-white mb-4">Information We Collect</h3>
              <div className="mb-8">
                <h4 className="text-xl font-light text-cyan-400 mb-3">Personal Information You Provide</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6">
                  <li>• Contact information (name, email, phone number, address)</li>
                  <li>• Account credentials and profile information</li>
                  <li>• Payment and billing information</li>
                  <li>• Health and fitness information relevant to your training</li>
                  <li>• Communication preferences and feedback</li>
                  <li>• Training goals, experience level, and progress tracking</li>
                </ul>

                <h4 className="text-xl font-light text-cyan-400 mb-3 mt-6">Information Collected Automatically</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6">
                  <li>• Website usage data and analytics</li>
                  <li>• Device information and browser type</li>
                  <li>• IP address and location data</li>
                  <li>• Cookies and similar tracking technologies</li>
                  <li>• Class attendance and participation records</li>
                </ul>
              </div>

              <h3 className="text-2xl font-light text-white mb-4">How We Use Your Information</h3>
              <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6 mb-8">
                <li>• Provide and personalize our training services</li>
                <li>• Process payments and manage your membership</li>
                <li>• Communicate about classes, events, and updates</li>
                <li>• Track your progress and customize your training experience</li>
                <li>• Ensure safety and security in our facilities</li>
                <li>• Improve our services and develop new offerings</li>
                <li>• Comply with legal obligations and protect our rights</li>
              </ul>

              <h3 className="text-2xl font-light text-white mb-4">Information Sharing and Disclosure</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                We respect your privacy and do not sell your personal information. We may share your information only in these circumstances:
              </p>
              <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6 mb-8">
                <li>• With your explicit consent</li>
                <li>• With service providers who assist in our operations</li>
                <li>• For legal compliance or to protect rights and safety</li>
                <li>• In connection with a business transfer or merger</li>
                <li>• With emergency contacts in case of medical situations</li>
              </ul>

              <h3 className="text-2xl font-light text-white mb-4">Data Security</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-8">
                We implement industry-standard security measures to protect your personal information, 
                including encryption, secure servers, and regular security audits. However, no method 
                of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h3 className="text-2xl font-light text-white mb-4">Your Rights and Choices</h3>
              <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6 mb-8">
                <li>• Access and review your personal information</li>
                <li>• Correct or update inaccurate information</li>
                <li>• Request deletion of your personal information</li>
                <li>• Opt out of marketing communications</li>
                <li>• Restrict certain processing of your information</li>
                <li>• Data portability for certain information</li>
              </ul>

              <h3 className="text-2xl font-light text-white mb-4">Cookies and Tracking</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-8">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                and provide personalized content. You can control cookie preferences through your browser settings, 
                though some features may not function properly if cookies are disabled.
              </p>

              <h3 className="text-2xl font-light text-white mb-4">Third-Party Services</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-8">
                Our website and services may integrate with third-party platforms for payment processing, 
                analytics, and communication. These services have their own privacy policies, and we encourage 
                you to review them.
              </p>

              <h3 className="text-2xl font-light text-white mb-4">Children's Privacy</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-8">
                Our services are not intended for children under 13. We do not knowingly collect personal 
                information from children under 13. If we become aware of such collection, we will take 
                steps to delete the information.
              </p>

              <h3 className="text-2xl font-light text-white mb-4">Changes to This Policy</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-8">
                We may update this Privacy Policy from time to time. We will notify you of material changes 
                by email or through our website. Your continued use of our services after changes take effect 
                constitutes acceptance of the updated policy.
              </p>

              <h3 className="text-2xl font-light text-white mb-4">Contact Us</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                If you have questions about this Privacy Policy or how we handle your personal information, please contact us:
              </p>
              <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
                <p className="text-white font-light mb-2">Fluvium Privacy Team</p>
                <p className="text-cyan-400 mb-1">privacy@fluvium.com</p>
                <p className="text-gray-400 text-sm">Response time: Within 48 hours</p>
              </div>

            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-light">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}