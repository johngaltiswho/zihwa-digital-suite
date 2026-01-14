"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewsLetter from "../../components/NewsLetter";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white min-h-screen font-sans">
      {/* Main Content Container */}
      <section className="max-w-[1000px] mx-auto px-6 py-12 md:py-4">
        
        {/* HEADER - Centered Title & Line */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 uppercase tracking-tighter">
            Privacy <span className="text-[#8B2323]">Policy</span>
          </h1>
          <div className="w-24 h-1 bg-[#8B2323] mx-auto rounded-full" />
        </div>

        {/* TEXT BODY - Left Aligned */}
        <div className="text-gray-700 leading-relaxed space-y-6 text-lg text-left">
          
          <p>
            This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from https://stalksnspice.com/ (the "Site").
          </p>

          {/* SECTION 1 */}
          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-2 border-b border-gray-100 pb-2">PERSONAL INFORMATION WE COLLECT</h2>
            <p className="mb-2">
              When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as "Device Information".
            </p>
            <p className="mb-4 font-bold text-gray-900">We collect Device Information using the following technologies:</p>
            <ul className="space-y-4 mb-6">
              <li>1) <span className="font-bold text-gray-900">Cookies</span> are data files that are placed on your device or computer and often include an anonymous unique identifier. For more information about cookies, and how to disable cookies, visit http://www.allaboutcookies.org.</li>
              <li>2) <span className="font-bold text-gray-900">Log files</span> track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.</li>
              <li>3) <span className="font-bold text-gray-900">Web beacons, tags, and pixels</span> are electronic files used to record information about how you browse the Site.</li>
            </ul>
            <p>
              Additionally when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number. We refer to this information as "Order Information".
            </p>
            <p className="mt-4">
              When we talk about "Personal Information" in this Privacy Policy, we are talking both about Device Information and Order Information.
            </p>
          </section>

          {/* SECTION 2 */}
          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">HOW DO WE USE YOUR PERSONAL INFORMATION?</h2>
            <p className="mb-2">
              We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to: Communicate with you; Screen our orders for potential risk or fraud; and When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.
            </p>
            <p>
              We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our Site (for example, by generating analytics about how our customers browse and interact with the Site, and to assess the success of our marketing and advertising campaigns).
            </p>
          </section>

          {/* SECTION 3 */}
          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">SHARING YOUR PERSONAL INFORMATION</h2>
            <p className="mb-2">
              We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use ecwid to power our online store--you can read more about how ecwids uses your Personal Information here: <a href="https://www.ecwid.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#8B2323] underline">https://www.ecwid.com/privacy-policy</a>.
            </p>
            <p className="mb-2">
              We also use Google Analytics to help us understand how our customers use the Site-- you can read more about how Google uses your Personal Information here: <a href="https://www.google.com/intl/en/policies/privacy/" target="_blank" rel="noopener noreferrer" className="text-[#8B2323] underline">https://www.google.com/intl/en/policies/privacy/</a>. You can also opt-out of Google Analytics here: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#8B2323] underline">https://tools.google.com/dlpage/gaoptout</a>.
            </p>
            <p>
              Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.
            </p>
          </section>

          {/* SECTION 4 */}
          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">BEHAVIOURAL ADVERTISING</h2>
            <p className="mb-2">
              As described above, we use your Personal Information to provide you with targeted advertisements or marketing communications we believe may be of interest to you. For more information about how targeted advertising works, you can visit the Network Advertising Initiative’s (NAI) educational page at http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work.
            </p>
            <p className="mb-2">
              You can opt out of targeted advertising by emailing us at <span className="text-[#8B2323] font-bold">stalksnspice@yahoo.com</span>.
            </p>
            <p>
              Additionally, you can opt out of some of these services by visiting the Digital Advertising Alliance’s opt-out portal at: http://optout.aboutads.info/.
            </p>
          </section>

          {/* SECTION 5 */}
          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-2 border-b border-gray-100 pb-2">DO NOT TRACK</h2>
            <p>
              Please note that we do not alter our Site’s data collection and use practices when we see a Do Not Track signal from your browser.
            </p>
          </section>

          {/* SECTION 6 */}
          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-2 border-b border-gray-100 pb-2">DATA RETENTION</h2>
            <p>
              When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
            </p>
          </section>

          {/* SECTION 7 */}
          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-2 border-b border-gray-100 pb-2">CHANGES</h2>
            <p>
              We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.
            </p>
          </section>

          {/* SECTION 8 */}
          <section className="bg-gray-50 p-8 md:p-12 rounded-[40px] border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">CONTACT US</h2>
            <p className="mb-4">
              For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <span className="text-[#8B2323] font-bold">stalksnspice@yahoo.com</span> or by mail using the details provided below:
            </p>
            <p className="font-bold text-gray-900">
              #403, 22nd Cross, 2nd Sector, HSR Layout, Bangalore, 560102, Bangalore, KA, 560102, India.
            </p>
          </section>

        </div>

        {/* RETURN HOME BUTTON */}
        <div className="mt-10 pt-10 border-t border-gray-100 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 bg-[#8B2323] hover:bg-black text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all shadow-lg active:scale-95"
          >
            <ArrowLeft size={18} /> Return Home
          </Link>
        </div>

      </section>

      <div className="pb-10">
        <NewsLetter />
      </div>
    </main>
  );
}