"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import NewsLetter from "../../components/NewsLetter";

export default function JapaneseIngredientsPage() {
  return (
    <main className="bg-white min-h-screen font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[450px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image 
          src="https://s3.ap-south-1.amazonaws.com/stalksnspice.com/landing-page/japanese-ingredients-banner.jpg"
          alt="Authentic Japanese Ingredients"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight max-w-4xl mb-8 italic">
            Authentic Japanese <br /> Ingredients
          </h1>
          <p className="text-white text-lg md:text-xl font-medium max-w-2xl mb-10 opacity-90 uppercase tracking-[0.3em]">
            One stop shop for your japanese ingredients!
          </p>
          <Link 
            href="/shop/Japanese-c62145207" 
            className="bg-[#8B2323] hover:bg-white hover:text-black text-white font-black uppercase tracking-[0.2em] px-12 py-5 rounded-full transition-all shadow-2xl active:scale-95 flex items-center gap-3"
          >
            Shop Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* 2. MAIN CONTENT SECTION */}
      <section className="max-w-[1000px] mx-auto px-6 py-20">
        
        {/* Centered Header with Line */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter mb-4">
            Meshiagare! <span className="text-[#8B2323]">Enjoy Your Meal.</span>
          </h2>
          <div className="w-24 h-1.5 bg-[#8B2323] mx-auto rounded-full" />
        </div>

        {/* Left Aligned Text Body */}
        <div className="text-gray-700 leading-relaxed space-y-10 text-lg text-left">
          <div className="space-y-6">
            <p>
              Who doesn't love Japanese cuisine! Japanese ingredients and foods provide a sublime culinary experience and pleasure. The unique flavours of Japanese ingredients & cuisine are inextricably mixed with aesthetics, tradition, culture, and rich history. They are easy to cook, wholesome, and nourishing.
            </p>
            <p>
              For those of you who have fallen in love with the charms of Japanese cuisine and want to try your hand at cooking up a culinary delight, here's a handy simplified shopping list. (Yes, you do need authentic Japanese ingredients to get that authentic Japanese taste!)
            </p>
          </div>

          {/* Sub-Header */}
          <div className="pt-6">
            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight italic border-b-2 border-gray-100 pb-4 mb-10">
              What's Cooking, Japan?
            </h3>
            <p className="mb-12">
              The ingredients used make up for a major part of the genuine taste experience. The Japanese ingredients like rice, noodles, sauces and pastes, etc differ from the regular ingredients. If you start cooking with the right kind of ingredients, you will be whipping up authentic Japanese delicacies that will have everyone drooling for more!
            </p>

            {/* Ingredients Grid */}
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
              <section>
                <h4 className="text-xl font-black text-[#8B2323] uppercase mb-3 tracking-widest">Sushi Rice</h4>
                <p className="text-base">
                  Everyday is Sushi day! It is a delightful plate of happiness! For authentic Japanese cooking you will require Japanese short-grain rice. It is also called <Link href="/shop/Topps-Sushi-Rice-1-kg-p377773011" className="font-bold underline decoration-[#8B2323] hover:text-black transition-colors">‘Sushi Rice.’</Link> The rice grains differ from the regular variety in being short and plump. They also cling together when properly cooked.
                </p>
              </section>

              <section>
                <h4 className="text-xl font-black text-[#8B2323] uppercase mb-3 tracking-widest">Cooking Sake</h4>
                <p className="text-base">
                  <Link href="/shop/Sakura-Cooking-Sake-1-8L-p243701424" className="font-bold underline decoration-[#8B2323] hover:text-black transition-colors">Cooking Sake</Link>, is used as a seasoning and glazing agent in Japanese cooking. It is a type of rice wine that adds a distinct sweetness to dishes. Cooking Sake enhances the overall flavour of a dish.
                </p>
              </section>

              <section>
                <h4 className="text-xl font-black text-[#8B2323] uppercase mb-3 tracking-widest">Sushi Nori Sheet</h4>
                <p className="text-base">
                  Nori is a dried edible seaweed used in Japanese cuisine. It has a strong and distinctive flavour and is often used to wrap rolls of sushi (rice balls). Explore <Link href="/shop/Yokoso-Sushi-Nori-Sheet-10-Sheets-p252024255" className="font-bold underline decoration-[#8B2323] hover:text-black transition-colors">Nori sheets</Link> here.
                </p>
              </section>

              <section>
                <h4 className="text-xl font-black text-[#8B2323] uppercase mb-3 tracking-widest">Wasabi</h4>
                <p className="text-base">
                  Spicy and pungent in flavour, <Link href="/shop/Yokoso-Wasabi-Paste-43g-p267390892" className="font-bold underline decoration-[#8B2323] hover:text-black transition-colors">Wasabi</Link> is commonly served with sushi and sashimi - it has a fiery and spicy taste. Wasabi has a pungent flavour and gives a hit of heat as soon as you take the first bite. Wasabi is available as a <Link href="/shop/Yokoso-Wasabi-Powder-1Kg-p238632037" className="font-bold underline decoration-[#8B2323] hover:text-black transition-colors">dried powder</Link> or in a tube as a paste.
                </p>
              </section>

              <section>
                <h4 className="text-xl font-black text-[#8B2323] uppercase mb-3 tracking-widest">Soba (Buckwheat)</h4>
                <p className="text-base">
                  Made from buckwheat flour, or a combination of buckwheat and wheat flours, <Link href="/shop/Yokoso-Japanese-Soba-Buckwheat-Noodles-300g-p377772759" className="font-bold underline decoration-[#8B2323] hover:text-black transition-colors">Soba Noodles</Link> is a key staple in Japanese cuisine. It can be served chilled with a dipping sauce, or served in a hot broth as a noodle soup.
                </p>
              </section>

              <section>
                <h4 className="text-xl font-black text-[#8B2323] uppercase mb-3 tracking-widest">Udon Noodles</h4>
                <p className="text-base">
                  <Link href="/shop/Sakura-Udon-Noodles-300g-p382915609" className="font-bold underline decoration-[#8B2323] hover:text-black transition-colors">Udon Noodles</Link> are thick, slippery and smooth. In other words, they are lusciously delicious! Udon Noodles can be served in a hot noodle soup, cold with dipping, or stir-fried.
                </p>
              </section>
            </div>
          </div>

          {/* Brands Footer */}
          <section className="pt-20 border-t border-gray-100">
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-6">The Flavours of Japan at Stalks N Spice</h3>
            <p>
              Stalks N Spice has a wide range of Authentic Japanese ingredients and other imported ingredients that caters to every taste, recipe and application. We have some of the best brands in our <Link href="/" className="text-[#8B2323] font-bold underline decoration-2 underline-offset-4">Japanese Gourmet Food Store</Link> such as Riso Scotti, Yokoso, Sakura, Kokuho, Topps, etc.
            </p>
          </section>
        </div>
      </section>

      {/* 3. WHY STALKS N SPICE SECTION */}
      <section className="bg-gray-50 py-20 text-center">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black mb-16 uppercase tracking-[0.3em]">Why Stalks N Spice?</h2>
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { n: 1, t: "Delivery Within 45min*", d: "Get your orders delivered within 45min by choosing priority delivery on checkout!" },
              { n: 2, t: "Everything in 1 Basket", d: "Rather than multiple vendors, get your entire order delivered from a single source at once." },
              { n: 3, t: "Wholesale Prices", d: "Associated with HORECA since 1997, we pass the best prices directly to you." }
            ].map(item => (
              <div key={item.n} className="flex flex-col items-center">
                <div className="text-8xl font-black text-red-900 mb-6 opacity-80">{item.n}</div>
                <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">{item.t}</h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-xs">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NEWSLETTER */}
      <div className="pb-20">
        <NewsLetter />
      </div>
    </main>
  );
}