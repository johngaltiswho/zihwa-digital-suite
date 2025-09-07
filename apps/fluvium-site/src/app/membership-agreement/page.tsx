'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MembershipAgreement() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />

      {/* Content */}
      <div className="pt-24 px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-6 text-white">
              Membership <span className="neon-glow">Agreement</span>
            </h1>
            <p className="text-lg text-gray-400 font-light">
              Your commitment to the warrior's path
            </p>
          </div>

          {/* Content */}
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8 md:p-12">
            <div className="prose prose-invert prose-lg max-w-none">
              
              <h2 className="text-3xl font-light text-white mb-6">Welcome to the Tribe</h2>
              <p className="text-gray-300 font-light leading-relaxed mb-8">
                This Membership Agreement represents more than a contract—it's your commitment to growth, 
                respect, and the warrior's code. By joining Fluvium, you become part of a community 
                dedicated to transformation through Brazilian Jiu-Jitsu, mindfulness, and authentic connection.
              </p>

              <h3 className="text-2xl font-light text-white mb-4">Membership Types and Benefits</h3>
              <div className="mb-8">
                <h4 className="text-xl font-light text-cyan-400 mb-3">Tribe Training</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6 mb-6">
                  <li>• Unlimited access to group Brazilian Jiu-Jitsu classes</li>
                  <li>• Flow state and presence training sessions</li>
                  <li>• Access to open mat sessions</li>
                  <li>• Community events and workshops</li>
                  <li>• Basic access to Humility Database</li>
                </ul>

                <h4 className="text-xl font-light text-cyan-400 mb-3">Inner Circle</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6 mb-6">
                  <li>• All Tribe Training benefits</li>
                  <li>• Private coaching sessions (quantity varies by tier)</li>
                  <li>• Personalized training plans</li>
                  <li>• Priority booking for workshops and seminars</li>
                  <li>• Full access to Humility Database</li>
                  <li>• Executive wellness consultations</li>
                  <li>• Exclusive Inner Circle events</li>
                </ul>

                <h4 className="text-xl font-light text-cyan-400 mb-3">Immersions</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6">
                  <li>• Intensive weekend workshops</li>
                  <li>• Multi-day retreats and training camps</li>
                  <li>• Guest instructor seminars</li>
                  <li>• Competition preparation intensives</li>
                  <li>• Leadership and mindset bootcamps</li>
                </ul>
              </div>

              <h3 className="text-2xl font-light text-white mb-4">Membership Terms and Conditions</h3>
              <div className="mb-8">
                <h4 className="text-xl font-light text-cyan-400 mb-3">Commitment Period</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6 mb-6">
                  <li>• Monthly memberships: 30-day commitment, auto-renewing</li>
                  <li>• Annual memberships: 12-month commitment with discounted rates</li>
                  <li>• Inner Circle: Minimum 6-month commitment required</li>
                  <li>• Immersions: Individual event registration</li>
                </ul>

                <h4 className="text-xl font-light text-cyan-400 mb-3">Payment Terms</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6 mb-6">
                  <li>• Membership fees are due in advance of service period</li>
                  <li>• Automatic billing occurs on your monthly anniversary date</li>
                  <li>• Failed payments result in account suspension after 5 days</li>
                  <li>• Late fees may apply for overdue accounts</li>
                  <li>• Payment methods: Credit card, bank transfer, or approved alternatives</li>
                </ul>

                <h4 className="text-xl font-light text-cyan-400 mb-3">Cancellation Policy</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6">
                  <li>• Monthly memberships: 30-day written notice required</li>
                  <li>• Annual memberships: Cancellation available with medical documentation</li>
                  <li>• Inner Circle: 60-day notice required after minimum commitment</li>
                  <li>• No refunds for partial months or unused services</li>
                  <li>• Freeze options available for medical reasons or extended travel</li>
                </ul>
              </div>

              <h3 className="text-2xl font-light text-white mb-4">Code of Conduct</h3>
              <div className="mb-8">
                <h4 className="text-xl font-light text-cyan-400 mb-3">Respect and Honor</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6 mb-6">
                  <li>• Treat all members, instructors, and staff with respect</li>
                  <li>• Honor the traditions and culture of Brazilian Jiu-Jitsu</li>
                  <li>• Maintain a growth mindset and help others do the same</li>
                  <li>• Leave your ego at the door—every roll is a learning opportunity</li>
                  <li>• Support your training partners' safety and development</li>
                </ul>

                <h4 className="text-xl font-light text-cyan-400 mb-3">Facility Etiquette</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6 mb-6">
                  <li>• Arrive clean and well-groomed with trimmed nails</li>
                  <li>• Wear clean, appropriate training attire</li>
                  <li>• Bow when entering and leaving the mat area</li>
                  <li>• Clean and sanitize equipment after use</li>
                  <li>• Maintain appropriate volume and language</li>
                  <li>• Respect personal belongings and facility property</li>
                </ul>

                <h4 className="text-xl font-light text-cyan-400 mb-3">Training Safety</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6">
                  <li>• Follow all instructor guidance and safety protocols</li>
                  <li>• Communicate any injuries or limitations immediately</li>
                  <li>• Tap early and respect taps immediately</li>
                  <li>• Match intensity appropriately to your partner's experience</li>
                  <li>• Report any unsafe behavior or conditions</li>
                </ul>
              </div>

              <h3 className="text-2xl font-light text-white mb-4">Health and Safety Requirements</h3>
              <div className="mb-8">
                <h4 className="text-xl font-light text-cyan-400 mb-3">Medical Clearance</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6 mb-6">
                  <li>• Complete health questionnaire and liability waiver</li>
                  <li>• Obtain physician clearance if over 40 or with health conditions</li>
                  <li>• Maintain current health insurance coverage</li>
                  <li>• Disclose any medications that may affect training</li>
                </ul>

                <h4 className="text-xl font-light text-cyan-400 mb-3">Injury Protocol</h4>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6">
                  <li>• Report all injuries immediately to instructors</li>
                  <li>• Seek appropriate medical attention for injuries</li>
                  <li>• Obtain medical clearance before returning from injury</li>
                  <li>• Follow modified training protocols as recommended</li>
                </ul>
              </div>

              <h3 className="text-2xl font-light text-white mb-4">Privacy and Media</h3>
              <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6 mb-8">
                <li>• Photography and video recording require explicit permission</li>
                <li>• Fluvium may use your likeness for promotional purposes</li>
                <li>• Respect the privacy of other members' training</li>
                <li>• Social media posts should reflect positively on the community</li>
                <li>• Confidential information shared in training remains private</li>
              </ul>

              <h3 className="text-2xl font-light text-white mb-4">Consequences of Violations</h3>
              <div className="mb-8">
                <p className="text-gray-300 font-light leading-relaxed mb-4">
                  Violations of this agreement may result in:
                </p>
                <ul className="text-gray-300 font-light leading-relaxed space-y-2 ml-6">
                  <li>• Verbal warning and coaching conversation</li>
                  <li>• Written warning and temporary suspension</li>
                  <li>• Membership termination without refund</li>
                  <li>• Legal action for property damage or safety violations</li>
                </ul>
              </div>

              <h3 className="text-2xl font-light text-white mb-4">Community Values</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-8">
                As a Fluvium member, you commit to embodying our core values of Presence, Flow, Resilience, 
                and Tribe. This means showing up authentically, supporting your training partners, embracing 
                challenges as growth opportunities, and contributing to a culture of excellence and respect.
              </p>

              <h3 className="text-2xl font-light text-white mb-4">Agreement Acceptance</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-8">
                By signing this Membership Agreement, you acknowledge that you have read, understood, and 
                agree to comply with all terms and conditions. You understand the inherent risks of martial 
                arts training and agree to participate at your own risk.
              </p>

              <h3 className="text-2xl font-light text-white mb-4">Contact for Questions</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                Questions about your membership or this agreement? We're here to help:
              </p>
              <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
                <p className="text-white font-light mb-2">Fluvium Membership Team</p>
                <p className="text-cyan-400 mb-1">membership@fluvium.com</p>
                <p className="text-gray-400 text-sm">Available 7 days a week for member support</p>
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