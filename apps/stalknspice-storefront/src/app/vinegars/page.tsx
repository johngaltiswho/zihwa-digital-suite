"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Droplets } from "lucide-react";
import NewsLetter from "../../components/NewsLetter";

export default function VinegarGuidePage() {
  return (
    <main className="bg-white min-h-screen font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[450px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image 
          src="https://s3.ap-south-1.amazonaws.com/stalksnspice.com/landing-page/vinegar-banner.jpg"
          alt="Best Vinegars for Cooking"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight max-w-5xl mb-8 italic">
            List of Best Vinegars <br /> For Cooking Everything Delicious
          </h1>
          <p className="text-white text-lg md:text-xl font-medium max-w-2xl mb-10 opacity-90 uppercase tracking-[0.3em]">
            Everything you should know about vinegar and its types.
          </p>
          <Link 
            href="/shop#!/~/search/keyword=vinegar" 
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
            Vinegar: <span className="text-[#8B2323]">The Essential Guide.</span>
          </h2>
          <div className="w-24 h-1.5 bg-[#8B2323] mx-auto rounded-full" />
        </div>

        {/* Left Aligned Text Body */}
        <div className="text-gray-700 leading-relaxed space-y-10 text-lg text-left">
          <div className="space-y-6">
            <p className="font-bold text-gray-900 text-xl">
              Looking for some of the best kinds of vinegar for cooking delicious recipes? Here is everything you should know about vinegar and its types.
            </p>
            
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic pt-6">
              Vinegar - An ingredient for all seasons.. and seasonings!
            </h3>
            <p>
              A bottle of <Link href="/shop#!/~/search/keyword=vinegar" className="text-[#8B2323] font-bold underline decoration-2 underline-offset-4">Vinegar</Link> is a permanent resident in any kitchen. It is an essential and versatile ingredient that is very useful in cooking as well as baking. Every type of vinegar has its own individual flavor profile. Vinegar is an essential constituent in salads, ketchup, sauces and is even useful in the marination of meat.
            </p>

            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic pt-6">
              So what is Vinegar?
            </h3>
            <p>
              The name 'Vinegar' is derived from the French term 'Vin Aigre', meaning 'sour wine’. It is made by adding bacteria to any type of alcohol—wine, hard cider, beer—or sugars, which is then fermented and converted into acetic acid. The length of time taken for the vinegar to naturally ferment depends on what it is made from. Vinegar is of two types- natural (brewed) and synthetic (non-brewed).
            </p>
            <p>
              Vinegar comes in many forms and there are many different types to choose from. The list of the different types of kinds of vinegar is so expansive and extensive that it can often lead to a person reeling under confusion.
            </p>
          </div>

          {/* Sub-Header */}
          <div className="pt-6">
            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight italic border-b-2 border-gray-100 pb-4 mb-10">
              So, What is The Best Kind of Vinegar for Cooking?
            </h3>
            <p className="mb-12">
              With so many kinds of vinegar to choose from, you may be asking yourself what you really need. But with every Vinegar having a unique flavor and purpose in cooking, the purchase of several different types is often necessitated. Here are a few types of Vinegar and the best ways to use them in the kitchen.
            </p>

            {/* Vinegar Grid */}
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
              <section>
                <h4 className="text-xl font-black text-[#8B2323] uppercase mb-3 tracking-widest flex items-center gap-2">
                  <Droplets size={18} /> 1. Synthetic Vinegar
                </h4>
                <p className="text-base">
                  <Link href="/shop#!/My-Favourite-Synthetic-Vinegar-5L/p/340993062/category=39635075" className="font-bold underline decoration-[#8B2323] hover:text-black transition-colors">Synthetic Vinegar</Link>, which is also called White Vinegar or Distilled Vinegar, is made from a combination of about 5 to 10 percent acetic acid and approximately 90 to 95 percent water. It is used in ketchup, for hard-boiling eggs, and even to make mashed potatoes stay a bright white shade.
                </p>
              </section>

              <section>
                <h4 className="text-xl font-black text-[#8B2323] uppercase mb-3 tracking-widest flex items-center gap-2">
                  <Droplets size={18} /> 2. Wine Vinegar
                </h4>
                <p className="text-base">
                  Wine Vinegar is made from fermented wine. The taste of <Link href="/shop#!/De-Nigris-White-Wine-Vinegar-1000ml/p/195567074/category=0" className="font-bold underline decoration-[#8B2323] hover:text-black transition-colors">Wine Vinegar</Link> is much milder than Synthetic Vinegar. Wine Vinegar finds extensive culinary uses. It is used in salad dressings, <Link href="/shop#!/Desert-Syrups-&-Sauces/c/57288454/offset=0&sort=normal" className="font-bold underline decoration-[#8B2323] hover:text-black transition-colors">sauces</Link>, and even marinades.
                </p>
              </section>

              <section>
                <h4 className="text-xl font-black text-[#8B2323] uppercase mb-3 tracking-widest flex items-center gap-2">
                  <Droplets size={18} /> 3. Balsamic Vinegar
                </h4>
                <p className="text-base">
                  <Link href="/shop#!/Balsamic-Vinegar/c/109025028/offset=0&sort=normal" className="font-bold underline decoration-[#8B2323] hover:text-black transition-colors">Balsamic vinegar</Link> is one of the most popular types. As it ages, its color gets darker, the flavor turns sweeter and the consistency gets thicker. It finds extensive use in salad dressings and marinades.
                </p>
              </section>

              <section>
                <h4 className="text-xl font-black text-[#8B2323] uppercase mb-3 tracking-widest flex items-center gap-2">
                  <Droplets size={18} /> 4. Rice Vinegar
                </h4>
                <p className="text-base">
                  <Link href="/shop#!/Chinese-Cooking-Vinegar/c/89634659/offset=0&sort=normal" className="font-bold underline decoration-[#8B2323] hover:text-black transition-colors">Rice vinegar</Link> is made from fermented rice wine. It has a sweet, delicate flavor and is less acidic. Rice vinegar is used in stir-fry, salads, noodles, and even vegetable salads.
                </p>
              </section>

              <section>
                <h4 className="text-xl font-black text-[#8B2323] uppercase mb-3 tracking-widest flex items-center gap-2">
                  <Droplets size={18} /> 5. Apple Cider Vinegar
                </h4>
                <p className="text-base">
                  Apple cider vinegar is made from fermented apple juice. A blend of <Link href="/shop#!/My-Favourite-Apple-Cider-Vinegar-475ml/p/241725503/category=39635075" className="font-bold underline decoration-[#8B2323] hover:text-black transition-colors">apple cider vinegar</Link> and olive oil can be used for salad vinaigrette. It is also known for improving digestion and detoxification.
                </p>
              </section>

              <section>
                <h4 className="text-xl font-black text-[#8B2323] uppercase mb-3 tracking-widest flex items-center gap-2">
                  <Droplets size={18} /> 6. Malt Vinegar
                </h4>
                <p className="text-base">
                  <Link href="/shop#!/Heinz-Vinegar-Malt-568-ml/p/174568689/category=0" className="font-bold underline decoration-[#8B2323] hover:text-black transition-colors">Malt vinegar</Link> is made from malting barley. It is used as an ingredient in the traditional recipes for fish and chips, beans on toast, and even for making pickles.
                </p>
              </section>
            </div>
          </div>

          {/* Brands Footer */}
          <section className="pt-20 border-t border-gray-100">
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-6">Kinds of Vinegar at Stalks N Spice</h3>
            <p>
              <Link href="/" className="text-[#8B2323] font-bold underline decoration-2 underline-offset-4">Stalks N Spice</Link> has a wide range of kinds of vinegar that caters to every taste, recipe, and application. We have some of the best kinds of vinegar for cooking from world-renowned brands such as Heinz, <Link href="/shop#!/My-Favourite/c/39635075/offset=0&sort=normal" className="font-bold underline text-gray-900">My Favourite</Link>, Pietro Coricelli, Casa Rinaldi, Blue Elephant, De Nigris, etc.
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
              { n: 2, t: "Everything in 1 Basket", d: "Rather than multiple vendors, get your entire order delivered from a single source." },
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