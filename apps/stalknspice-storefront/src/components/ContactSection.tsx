"use client";
import React from "react";

export default function ContactSection() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-10 font-sans">
      {/* 1. Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-800 tracking-tight mb-4">CONTACT US</h1>
        <div className="w-52 h-[1px] bg-black mx-auto"></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 items-start">
        
        {/* 2. Left Side: Form (Span 2 columns) */}
        <div className="lg:col-span-2">
          <form className="space-y-6">
            
            {/* Top Row: Name, Email, Phone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-full px-6 py-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400" 
                />
                <label className="block mt-2 text-sm font-medium text-gray-600">Your Name</label>
              </div>
              
              <div className="text-center">
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded-full px-6 py-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400" 
                />
                <label className="block mt-2 text-sm font-medium text-gray-600">Your Email</label>
              </div>

              <div className="text-center">
                <input 
                  type="tel" 
                  className="w-full border border-gray-300 rounded-full px-6 py-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400" 
                />
                <label className="block mt-2 text-sm font-medium text-gray-600">Your Phone Number</label>
              </div>
            </div>

            {/* Middle Row: Subject */}
            <div className="text-center">
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-full px-6 py-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400" 
              />
              <label className="block mt-2 text-sm font-medium text-gray-600">Subject</label>
            </div>

            {/* Bottom Row: Message */}
            <div className="text-center">
              <textarea 
                rows={4}
                className="w-full border border-gray-300 rounded-[35px] px-8 py-6 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none" 
              />
              <label className="block mt-2 text-sm font-medium text-gray-600">Your Message</label>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-4">
              <button 
                type="submit"
                className="bg-[#8B2323] hover:bg-[#721c1c] text-white font-bold px-14 py-2 rounded-full transition-all shadow-md active:scale-95"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* 3. Right Side: Details */}
        <div className="space-y-6 text-gray-800">
          <div>
            <h3 className="font-bold text-lg">Customer Service Enquires:</h3>
            <p className="text-gray-700">Email ID: <span className="text-gray-600">umamaheshwar@stalknspice.com</span></p>
          </div>

          <div>
            <h3 className="font-bold text-lg">Mailing Address:</h3>
            <p className="text-gray-700 leading-relaxed">
              #403, 22nd Cross, 2nd Sector<br />
              HSR Layout, Bangalore, India, 560102
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg">Business Hours:</h3>
            <p className="text-gray-700">
              Monday-Friday from 9:00AM-6:00PM (IST)
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}