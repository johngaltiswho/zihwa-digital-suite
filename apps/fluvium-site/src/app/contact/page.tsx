'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />

      {/* Content */}
      <div className="pt-24 px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-6 text-white">
              Contact <span className="neon-glow">Us</span>
            </h1>
            <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto">
              Ready to begin your journey? Have questions about our programs? 
              We're here to help guide you to the path that's right for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
              <h2 className="text-3xl font-light text-white mb-6">Get In Touch</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-300 font-light mb-2">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white font-light focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-300 font-light mb-2">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white font-light focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-gray-300 font-light mb-2">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white font-light focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="interest" className="block text-gray-300 font-light mb-2">I'm interested in *</label>
                  <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white font-light focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                  >
                    <option value="">Select your interest</option>
                    <option value="tribe-training">Tribe Training (Group Classes)</option>
                    <option value="inner-circle">Inner Circle (Private Coaching)</option>
                    <option value="immersions">Immersions (Workshops & Retreats)</option>
                    <option value="corporate">Corporate Training</option>
                    <option value="general">General Information</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-300 font-light mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white font-light focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300 resize-vertical"
                    placeholder="Tell us about your goals, experience level, or any questions you have..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-8 py-4 text-lg font-medium tracking-wider hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 rounded-lg"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
                <h2 className="text-3xl font-light text-white mb-6">Reach Out Directly</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-black text-xl font-bold flex-shrink-0">
                      ✉
                    </div>
                    <div>
                      <h3 className="text-white font-light mb-1">Email</h3>
                      <p className="text-cyan-400 mb-1">info@fluvium.co</p>
                      <p className="text-gray-400 text-sm">We respond within 24 hours</p>
                    </div>
                  </div>


                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-black text-xl font-bold flex-shrink-0">
                      📍
                    </div>
                    <div>
                      <h3 className="text-white font-light mb-1">Locations</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Bangalore, IN
                      </p>
                      <p className="text-cyan-400 text-sm mt-2">+ Virtual sessions available</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
                <h2 className="text-3xl font-light text-white mb-6">Quick Questions?</h2>
                
                <div className="space-y-4">
                  <div className="border-b border-gray-700/30 pb-4">
                    <h3 className="text-white font-light mb-2">New to BJJ?</h3>
                    <p className="text-gray-400 text-sm">Our beginner-friendly classes welcome all experience levels. No prior martial arts experience required.</p>
                  </div>

                  <div className="border-b border-gray-700/30 pb-4">
                    <h3 className="text-white font-light mb-2">Pricing Questions?</h3>
                    <p className="text-gray-400 text-sm">We offer flexible membership options starting at $149/month. Inner Circle pricing available upon consultation.</p>
                  </div>

                  <div className="border-b border-gray-700/30 pb-4">
                    <h3 className="text-white font-light mb-2">Corporate Programs?</h3>
                    <p className="text-gray-400 text-sm">Yes! We offer executive wellness programs and team-building workshops for companies.</p>
                  </div>

                  <div>
                    <h3 className="text-white font-light mb-2">Trial Classes?</h3>
                    <p className="text-gray-400 text-sm">First class is complimentary. Come experience the Fluvium difference before committing.</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
                <h2 className="text-3xl font-light text-white mb-6">Follow Our Journey</h2>
                
                <div className="flex space-x-4">
                  <a href="https://www.instagram.com/fluvium" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 transition-all duration-300">
                    <span className="text-lg">📷</span>
                  </a>
                  <a href="https://www.youtube.com/@fluvium4341" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 transition-all duration-300">
                    <span className="text-lg">📺</span>
                  </a>
                </div>
                
                <p className="text-gray-400 text-sm mt-4">
                  Follow us for training tips, member spotlights, and insights from the warrior's path.
                </p>
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