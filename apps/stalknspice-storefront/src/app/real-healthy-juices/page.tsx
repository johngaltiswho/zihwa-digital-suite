"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ShoppingCart, CheckCircle2 } from "lucide-react";
import NewsLetter from "../../components/NewsLetter";

// Mock data for 'daburReal' products loop
const daburRealProducts = [
  { name: "Real Activ Apple", image: "https://s3.ap-south-1.amazonaws.com/stalksnspice.com/landing-page/monin.jpg", url: "#" },
  { name: "Real Activ Orange Carrot", image: "https://s3.ap-south-1.amazonaws.com/stalksnspice.com/landing-page/monin.jpg", url: "#" },
  { name: "Real Activ Beetroot Carrot", image: "https://s3.ap-south-1.amazonaws.com/stalksnspice.com/landing-page/monin.jpg", url: "#" },
  { name: "Real Activ Cucumber Spinach", image: "https://s3.ap-south-1.amazonaws.com/stalksnspice.com/landing-page/monin.jpg", url: "#" },
];

export default function RealJuicesLandingPage() {
  return (
    <main className="bg-white min-h-screen font-sans">
      
      {/* 1. JUMBOTRON HERO SECTION */}
      <section className="relative w-full h-[500px] md:h-[650px] overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <Image 
          src="https://s3.ap-south-1.amazonaws.com/stalksnspice.com/landing-page/dabur-real-banner.jpg"
          alt="Dabur Real Activ Juices"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight max-w-4xl mb-8">
            Real Healthy Juices <br /> in India You Should Try
          </h1>
          <p className="text-white text-lg md:text-xl font-medium max-w-2xl mb-10 opacity-90">
            Healthy juices consist of minerals and vitamins that keep you fit and active. Goodness of 100% fruit juice- with 0% Added Sugars!
          </p>
          <Link 
            href="/shop" 
            className="bg-[#8B2323] hover:bg-white hover:text-black text-white font-black uppercase tracking-[0.2em] px-12 py-5 rounded-full transition-all shadow-2xl active:scale-95 flex items-center gap-3"
          >
            Shop Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* 2. EDUCATIONAL CONTENT SECTION */}
      <section className="max-w-[1000px] mx-auto px-6 py-20">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter mb-6">
            Pure Fruit. <span className="text-[#8B2323]">Zero Compromise.</span>
          </h2>
          <div className="w-24 h-1.5 bg-[#8B2323] rounded-full mb-12" />
        </div>

        <div className="text-gray-700 leading-relaxed space-y-8 text-lg text-left">
          <p>
            In a sultry country like ours, juice is an ever popular drink. Juices quench the thirst, refresh the mind and help our body replenish the lost nutrients. They come in various forms - freshly made <Link href="#" className="text-[#8B2323] font-bold underline decoration-2 underline-offset-4">real fruit juices</Link>, packaged juices with or without fruit extracts, carbonated beverages etc,.
          </p>
          <p>
            But though juices are loved by all, they are quite controversial when it comes to the question of determining how healthy and real the drink actually is. The main deterrent to categorize the beverage as 'healthy' is the high sugar content in it. Lack of fibre content is another setback.
          </p>

          {/* Callout Box */}
          <div className="bg-gray-50 p-10 rounded-[50px] border border-gray-100 my-16">
            <h3 className="text-2xl font-black text-gray-900 uppercase mb-4">So Can a Juice be Tasty & Healthy?</h3>
            <p className="italic text-xl text-gray-600">
              "The answer is a definite YES! Delightfully refreshing, juices can provide you with a healthy dose of fruit/vegetable. They pack a lot more of the essentials into one glass than a plateful of the same veggie/fruit. A glass of juice can easily fit into a hectic lifestyle."
            </p>
          </div>

          <p>
            Healthy juices consist of minerals and vitamins that keep you fit and active. There are juices that give you the goodness of 100% fruit juice- with 0% Added Sugars and 0% Added Preservatives. You can safely juice up with healthy juices and savour the taste of 100% fruit juice with the goodness of phytonutrients for a nourished, balanced lifestyle.
          </p>

          {/* Nutrient Packed List */}
          <div className="pt-10 space-y-12">
            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight italic">Juice up your lifestyle!</h3>
            
            <div className="grid md:grid-cols-2 gap-12">
              <section>
                <h4 className="text-xl font-black text-[#8B2323] uppercase mb-4">1. Apple</h4>
                <p className="text-base">Apple is the best that health-conscious, fitness-savvy individuals can ask for. Apple is fat free and low in sodium, yet rich in antioxidants, essential nutrients, and dietary fiber. For the love of apples, <Link href="#" className="font-bold underline text-gray-900">Apple real fruit juice</Link> is the one you should be trying.</p>
              </section>

              <section>
                <h4 className="text-xl font-black text-[#8B2323] uppercase mb-4">2. Orange carrot</h4>
                <p className="text-base">A juice made from oranges and sweet crispy carrots is a wonderful way to stay healthy. Carrots are rich in antioxidant nutrients ß-Carotene and oranges are rich in Vitamin C. While the ß-Carotene gets converted into Vitamin A which helps maintain vision and skin health, the Vitamin C helps strengthen immunity.</p>
              </section>

              <section>
                <h4 className="text-xl font-black text-[#8B2323] uppercase mb-4">3. Beetroot Carrot</h4>
                <p className="text-base">Juice made from beetroot and carrot is one of the best healthy juices, rich in natural antioxidant nutrient ß-Carotene. ß-Carotene, through body physiological activity gets converted into Vitamin A, which is helpful for a healthy vision and skin.</p>
              </section>

              <section>
                <h4 className="text-xl font-black text-[#8B2323] uppercase mb-4">4. Cucumber Spinach Juice</h4>
                <p className="text-base">This fruit and vegetable juice is your perfect start for an active day. It is rich in the goodness of mixed fruits and vegetables. If taken on a daily basis, it can provide you all that you need to stay healthy.</p>
              </section>
            </div>
          </div>

          {/* Brand Section */}
          <section className="pt-20 border-t border-gray-100">
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-6">Real Juices by Real!</h3>
            <p>
              <span className="font-bold text-gray-900">Réal Activ</span> is a range of unsweetened juices that has No Added Sugars or Preservatives. It is one of the leading fruit juice brands in India. Réal Activ juices are made from concentrated fruit extracts, with the same amount of water as found in the original fruit. All you get is pure fruit. Réal Activ's Tetra Pak technology keeps the juices fresh for 6 months without harmful ingredients.
            </p>
          </section>
        </div>
      </section>

      {/* 3. WHY STALKS N SPICE SECTION (Consistent with Home Page) */}
      <section className="bg-gray-50 py-20 text-center">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black mb-16 uppercase tracking-[0.3em]">Why Stalks N Spice?</h2>
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { n: 1, t: "Delivery Within 45min*", d: "Get your orders delivered within 45min by choosing priority delivery on checkout! Pincodes apply." },
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

      {/* 4. BEST SELLERS PRODUCT GRID */}
      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-widest mb-12 text-center">Best Sellers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {daburRealProducts.map((prod, i) => (
            <Link href={prod.url} key={i} className="group">
              <div className="bg-white rounded-[40px] aspect-square overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-xl transition-all p-6 flex items-center justify-center">
                <Image 
                  src={prod.image} 
                  width={200} 
                  height={200} 
                  alt={prod.name} 
                  className="object-contain group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <p className="mt-6 font-bold text-center text-gray-800 uppercase text-xs tracking-widest">{prod.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="pb-20">
        <NewsLetter />
      </div>
    </main>
  );
}