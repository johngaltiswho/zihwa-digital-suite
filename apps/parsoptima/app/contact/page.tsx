"use client";

import React from "react";
import { 
        MapPin, Phone,Headset,
} from "lucide-react";


export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-[#fcfdfe] font-sans">


      {/* 1. SHOPPER-CENTRIC HERO */}
      <section className="relative py-6 lg:py-8 bg-white border-b border-slate-100 overflow-hidden">
        {/* Soft background glow for Beauty & Pharma blend */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/5 blur-[120px] rounded-full -ml-64 -mb-64" />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <Headset size={14} /> Customer Care Hub
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-[#1a3a5a] tracking-tighter uppercase leading-[0.95]">
              How can we <br /> 
              <span className="text-[#00a651]">Help you  ?</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl">
              From tracking your medicine delivery to choosing the right skincare — our experts are here to support your journey to wellness and beauty.
            </p>
          </div>
        </div>
      </section>

       

      {/* 3. CONTACT CHANNELS & FORM */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-20 py-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT: CHANNEL INFO */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-[#1a3a5a] uppercase tracking-tighter mb-4">Contact Us</h2>
              <div className="w-12 h-1 bg-green-500 rounded-full" />
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400"><Phone size={24}/></div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Customer Helpline</p>
                  <p className="text-xl font-bold text-[#1a3a5a]">info@parsoptima.com</p>
                  <p className="text-xl font-bold text-[#1a3a5a]">+91-9972508616</p>
                </div>
              </div>

              {/* <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400"><MessageSquare size={24}/></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">WhatsApp Business</p>
                  <p className="text-xl font-bold text-green-600">Chat with us</p>
                </div>
              </div> */}

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400"><MapPin size={24}/></div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">HQ & Logistics Hub</p>
                  <p className="text-slate-700 font-semibold leading-relaxed">
                    #403,22nd Cross Rd,2nd Sector <br />
                    HSR Layout,Bangalore <br />
                    Karnataka - 560102
                  </p>
                </div>
              </div>
            </div>

            {/* <div className="p-8 bg-slate-900 rounded-[32px] text-white space-y-4 shadow-2xl">
               <ShieldCheck className="text-green-500" size={32} />
               <h4 className="font-bold text-lg">Your Privacy is Protected</h4>
               <p className="text-xs text-slate-400 leading-relaxed font-medium">All medical and beauty inquiries are handled with 100% confidentiality by our certified team.</p>
            </div> */}
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="lg:col-span-7">
            <div className="bg-white p-10 lg:p-14 rounded-[40px] border border-slate-100 shadow-2xl">
              <h3 className="text-2xl font-bold text-[#1a3a5a] uppercase mb-6 ">Send a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 ml-4 uppercase tracking-widest">Full Name</label>
                      <input type="text" className="w-full h-14 px-6 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500/20 font-bold text-sm outline-none" placeholder="John Doe" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 ml-4 uppercase tracking-widest">Phone Number</label>
                      <input type="tel" className="w-full h-14 px-6 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500/20 font-bold text-sm outline-none" placeholder="+91..." />
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 ml-4 uppercase tracking-widest">Select Topic</label>
                  <select className="w-full h-14 px-6 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500/20 font-bold text-sm outline-none appearance-none cursor-pointer">
                    <option>Medicine Order Status</option>
                    <option>Skincare Product Inquiry</option>
                    <option>Prescription Upload Help</option>
                    <option>Business Partnership</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 ml-4 uppercase tracking-widest">Your Message</label>
                  <textarea rows={4} className="w-full p-6 bg-slate-50 rounded-3xl border-none focus:ring-2 focus:ring-green-500/20 font-bold text-sm outline-none resize-none" placeholder="How can we help you?" />
                </div>

                <button className="w-full bg-[#1a3a5a] hover:bg-[#00a651] text-white h-16 rounded-2xl font-bold uppercase text-xs tracking-[0.1em] transition-all shadow-xl shadow-[#1a3a5a]/10">
                  Submit Request
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}