"use client";
import React from "react";

export default function PrivacyPolicy() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white min-h-screen pt-12 pb-10 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* HEADER */}
        <div className="border-b-2 border-black pb-8 mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-[#1a3a5a] tracking-tighter uppercase mb-4">
            Privacy <span className="text-[#00a651]">Policy</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            Last Updated: {currentDate}
          </p>
        </div>

        {/* CONTENT BODY */}
        <div className="prose prose-slate max-w-none space-y-10 text-slate-700">
          
          <section>
            <p className="text-lg leading-relaxed">
              At <span className="font-bold text-black uppercase">Pars Optima Enterprises</span>, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Pars Optima Enterprises and how we use it.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tight">1. Information We Collect</h2>
            <p className="leading-relaxed">
              The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
            </p>
            <ul className="list-disc pl-6 space-y-2 font-medium">
              <li>Contact Information (Name, Email, Phone Number)</li>
              <li>Shipping and Billing Address</li>
              <li>Pharmaceutical Prescriptions (where legally required for medical products)</li>
              <li>Payment Information (processed securely via encrypted gateways)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tight">2. How We Use Your Information</h2>
            <p>We use the information we collect in various ways, including to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate, and maintain our website and services</li>
              <li>Improve, personalize, and expand our product range (Cosmetics & Pharmaceuticals)</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you, either directly or through one of our partners</li>
              <li>Process your transactions and send you related information including purchase confirmations and invoices</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tight">3. Log Files</h2>
            <p>
              Pars Optima Enterprises follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tight">4. Cookies and Web Beacons</h2>
            <p>
              Like any other website, Pars Optima Enterprises uses &apos;cookies&apos;. These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tight">5. Third Party Privacy Policies</h2>
            <p>
              Pars Optima Enterprises&apos;s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tight">6. Data Protection Rights</h2>
            <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
              <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate.</li>
              <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
            </ul>
          </section>

          <section className="p-8 bg-slate-50 border-l-4 border-[#00a651] mt-12">
            <h2 className="text-xl font-black text-[#1a3a5a] uppercase tracking-tight mb-2">Contact Us</h2>
            <p className="text-sm">
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at 
              <span className="font-bold text-[#00a651]"> support@parsoptima.com</span>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}