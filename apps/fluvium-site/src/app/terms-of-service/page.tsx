'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-gray-800/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/fluvium-logo-glow-teal.png"
              alt="Fluvium Logo"
              width={120}
              height={48}
              className="cursor-pointer neon-glow animate-pulse-glow"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#about" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">About</Link>
            <Link href="/#offerings" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">Offerings</Link>
            <Link href="/#humility-db" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">Humility DB</Link>
            <Link href="/#founder" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">Founder</Link>
            <button className="neon-border bg-transparent text-white px-6 py-2 text-sm font-light tracking-wider hover:bg-cyan-400/10 transition-all duration-300">
              Join the Tribe
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="pt-24 px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-6 text-white">
              Terms of <span className="neon-glow">Service</span>
            </h1>
            <p className="text-lg text-gray-400 font-light">
              Last updated: December 2024
            </p>
          </div>

          {/* Content */}
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8 md:p-12">
            <div className="prose prose-invert prose-lg max-w-none">
              
              <h2 className="text-3xl font-light text-white mb-6">Agreement to Terms</h2>
              <p className="text-gray-300 font-light leading-relaxed mb-8">
                Welcome to Fluvium. These Terms of Service govern your use of our website, services, 
                and facilities. By accessing or using our services, you agree to be bound by these terms. 
                If you disagree with any part of these terms, you may not access our services.
              </p>

              <h3 className="text-2xl font-light text-white mb-4">Use of Services</h3>
              <div className="mb-8">
                <h4 className="text-xl font-light text-cyan-400 mb-3">Eligibility</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6 mb-6">
                  <li>• You must be at least 18 years old to use our services</li>
                  <li>• Minors may participate with proper guardian consent and supervision</li>
                  <li>• You must provide accurate and complete information</li>
                  <li>• You are responsible for maintaining account security</li>
                </ul>

                <h4 className="text-xl font-light text-cyan-400 mb-3">Acceptable Use</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6">
                  <li>• Respect all members, instructors, and staff</li>
                  <li>• Follow all facility rules and safety guidelines</li>
                  <li>• Use equipment properly and report any damage</li>
                  <li>• Maintain appropriate hygiene and attire</li>
                  <li>• No harassment, discrimination, or inappropriate behavior</li>
                  <li>• No photography or recording without explicit permission</li>
                </ul>
              </div>

              <h3 className="text-2xl font-light text-white mb-4">Membership and Payments</h3>
              <div className="mb-8">
                <h4 className="text-xl font-light text-cyan-400 mb-3">Membership Terms</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6 mb-6">
                  <li>• Memberships are personal and non-transferable</li>
                  <li>• Membership fees are due in advance</li>
                  <li>• Late payments may result in suspension of services</li>
                  <li>• Cancellation policies vary by membership type</li>
                </ul>

                <h4 className="text-xl font-light text-cyan-400 mb-3">Refund Policy</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6">
                  <li>• Membership fees are generally non-refundable</li>
                  <li>• Exceptions may be made for medical reasons with documentation</li>
                  <li>• Unused class packages may be transferred within policy limits</li>
                  <li>• Event cancellations will receive appropriate refunds</li>
                </ul>
              </div>

              <h3 className="text-2xl font-light text-white mb-4">Health and Safety</h3>
              <div className="mb-8">
                <h4 className="text-xl font-light text-cyan-400 mb-3">Assumption of Risk</h4>
                <p className="text-gray-300 font-light leading-relaxed mb-4">
                  Brazilian Jiu-Jitsu and martial arts training involve inherent risks including but not limited to:
                </p>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6 mb-6">
                  <li>• Physical injury from contact and grappling</li>
                  <li>• Muscle strains, sprains, and bruising</li>
                  <li>• Joint injuries and submissions</li>
                  <li>• Cuts, scrapes, and mat burn</li>
                </ul>

                <h4 className="text-xl font-light text-cyan-400 mb-3">Medical Requirements</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6">
                  <li>• Consult your physician before beginning training</li>
                  <li>• Disclose any medical conditions or injuries</li>
                  <li>• Maintain current health insurance</li>
                  <li>• Follow all instructor safety guidelines</li>
                  <li>• Stop training if you feel unwell or injured</li>
                </ul>
              </div>

              <h3 className="text-2xl font-light text-white mb-4">Intellectual Property</h3>
              <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6 mb-8">
                <li>• All content, techniques, and materials are proprietary to Fluvium</li>
                <li>• You may not record, copy, or distribute our content without permission</li>
                <li>• Respect the intellectual property of instructors and guest teachers</li>
                <li>• Any content you create may be used by Fluvium for promotional purposes</li>
              </ul>

              <h3 className="text-2xl font-light text-white mb-4">Privacy and Data</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-8">
                Your privacy is important to us. Please review our Privacy Policy for details on how we 
                collect, use, and protect your personal information. By using our services, you consent 
                to our privacy practices as outlined in our Privacy Policy.
              </p>

              <h3 className="text-2xl font-light text-white mb-4">Facility Rules</h3>
              <div className="mb-8">
                <h4 className="text-xl font-light text-cyan-400 mb-3">General Conduct</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6 mb-6">
                  <li>• Check in upon arrival and follow all protocols</li>
                  <li>• Clean and sanitize equipment after use</li>
                  <li>• Wear appropriate training attire (gi, rashguards, etc.)</li>
                  <li>• Remove shoes before entering mat areas</li>
                  <li>• Keep personal belongings in designated areas</li>
                </ul>

                <h4 className="text-xl font-light text-cyan-400 mb-3">Training Etiquette</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6">
                  <li>• Bow when entering and leaving the mat</li>
                  <li>• Listen attentively during instruction</li>
                  <li>• Ask questions respectfully</li>
                  <li>• Tap early and often to avoid injury</li>
                  <li>• Control your intensity based on your partner's skill level</li>
                </ul>
              </div>

              <h3 className="text-2xl font-light text-white mb-4">Limitation of Liability</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-8">
                To the fullest extent permitted by law, Fluvium, its instructors, and staff shall not be 
                liable for any indirect, incidental, special, or consequential damages arising from your 
                use of our services. Our total liability shall not exceed the amount you paid for services 
                in the preceding 12 months.
              </p>

              <h3 className="text-2xl font-light text-white mb-4">Termination</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-8">
                We may terminate or suspend your access to our services immediately, without prior notice, 
                for conduct that we believe violates these Terms of Service or is harmful to other users, 
                us, or third parties, or for any other reason.
              </p>

              <h3 className="text-2xl font-light text-white mb-4">Changes to Terms</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-8">
                We reserve the right to modify these terms at any time. We will notify users of material 
                changes via email or website notice. Continued use of our services after changes constitutes 
                acceptance of the new terms.
              </p>

              <h3 className="text-2xl font-light text-white mb-4">Governing Law</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-8">
                These Terms of Service are governed by and construed in accordance with the laws of the 
                jurisdiction in which our primary facility is located, without regard to conflict of law principles.
              </p>

              <h3 className="text-2xl font-light text-white mb-4">Contact Information</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
                <p className="text-white font-light mb-2">Fluvium Legal Team</p>
                <p className="text-cyan-400 mb-1">legal@fluvium.com</p>
                <p className="text-gray-400 text-sm">Response time: Within 72 hours</p>
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
    </main>
  );
}