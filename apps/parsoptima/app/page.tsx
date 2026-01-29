"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ArrowRight, Pill, 
   ShoppingBag, 
  ShieldCheck, ChevronRight, ChevronLeft,
  Star,
  Timer, Zap
} from "lucide-react";
import { HeroSliderParsOptima } from "@repo/ui"; 

// import { ParsOptimaHeader, ParsOptimaFooter } from "@repo/ui";

export default function PharmaEcommercePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [articleIndex, setArticleIndex] = useState(0);

  // const navLinks = [
  //   { label: "Medicines", href: "/medicines" },
  //   { label: "Beauty & Cosmetics", href: "/beauty" },
  //   { label: "Wellness & Nutrition", href: "/wellness" },
  //   { label: "Fitness & Health", href: "/fitness" },
  //   { label: "Lab Tests", href: "/labs" },
    
  // ];

  const heroSlides = [
    { 
      title: "Your Health, Our Global Priority", 
      subtitle: "Authentic Medicines & Wellness Essentials Delivered in 24 Hours.", 
      image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2079", 
      color: "from-green-600/20",
       href: "/medicines"
    },
    { 
  title: "Quick Prescription Upload", 
  subtitle: "Ordering medicine is now as simple as taking a photo. Try it now.", 
  image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=2000", 
  color: "from-blue-600/20",
   href: "/medicines"
},
    { 
  title: "Premium Skincare & Beauty Hub", 
  subtitle: "Curating world-class dermatological brands and luxury cosmetics for your daily radiance.", 
  image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2000&auto=format&fit=crop", 
  color: "from-fuchsia-600/20",
   href: "/beauty"
}
  ];
  const dealsOfDay = [
    { name: "Accu-Chek Active Strips", price: 945, oldPrice: 1350, discount: "30% OFF" },
    { name: "Omron BP Monitor M2", price: 2100, oldPrice: 2800, discount: "25% OFF" },
    { name: "Volini Pain Relief Gel", price: 120, oldPrice: 160, discount: "25% OFF" },
    { name: "Dettol Antiseptic 500ml", price: 185, oldPrice: 210, discount: "12% OFF" },
  ];

  const featuredProducts = [
    { name: "Digital Blood Pressure Monitor", brand: "Omron", price: 2450, oldPrice: 3100, tag: "Device", rating: 5 },
    { name: "Multivitamin Gold Plus - 60 Tabs", brand: "HealthVit", price: 899, oldPrice: 1200, tag: "Wellness", rating: 4 },
    { name: "Infrared Thermometer", brand: "Dr. Trust", price: 1599, oldPrice: 2200, tag: "Essential", rating: 5 },
    { name: "Omega-3 Triple Strength", brand: "WOW", price: 749, oldPrice: 999, tag: "Best Seller", rating: 4 },
  ];

  const fitnessProducts = [
    { name: "Raw Whey Protein Isolate - 1kg", brand: "MuscleBlaze", price: 2899, oldPrice: 3400, tag: "Top Rated", img: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800" },
    { name: "BCAA Recovery Fuel - Watermelon", brand: "Scitron", price: 1549, oldPrice: 1999, tag: "Recovery", img: "https://images.unsplash.com/photo-1579722820308-d74e57198c7b?q=80&w=800" },
    { name: "Creatine Monohydrate Powder", brand: "Optimum Nutrition", price: 999, oldPrice: 1200, tag: "Performance", img: "https://images.unsplash.com/photo-1546411531-8466aeead47b?q=80&w=800" },
    { name: "Multi-Vitamin for Performance", brand: "MuscleTech", price: 749, oldPrice: 950, tag: "Daily Essential", img: "https://images.unsplash.com/photo-1550573105-13352613d94b?q=80&w=800" },
  ];

  const healthArticles = [
  { 
    tag: "Wellness", 
    title: "15 Powerful Foods That Boost the Immune System", 
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
    url: "https://www.healthline.com/health/food-nutrition/foods-that-boost-the-immune-system" 
  },
 { 
  tag: "Pharmacy", 
  title: "High Blood Pressure: 10 Ways to Control It Without Medication", 
  img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800",
  url: "https://www.mayoclinic.org/diseases-conditions/high-blood-pressure/in-depth/high-blood-pressure/art-20046974" 
},
  { 
    tag: "Skincare", 
    title: "Retinol Guide: Benefits, Side Effects, and How to Use It", 
    img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800",
    url: "https://www.healthline.com/health/beauty-skin-care/is-retinol-safe"
  },
  { 
    tag: "Mental Health", 
    title: "The Science-Backed Ways to Manage Daily Work Stress", 
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800",
    url: "https://www.medicalnewstoday.com/articles/145855"
  },
  { 
    tag: "Beauty", 
    title: "Sun Protection: Understanding SPF and Skin Cancer Prevention", 
    img: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=800",
    url: "https://www.skincancer.org/skin-cancer-prevention/sun-protection/sunscreen/"
  },
  { 
    tag: "Nutrition", 
    title: "Gut Health: 10 Science-Backed Ways to Improve Your Microbiome", 
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800",
    url: "https://www.healthline.com/nutrition/improve-gut-bacteria"
  },
  { 
    tag: "Sleep", 
    title: "Sleep Hygiene: Tips for Better Quality Rest and Recovery", 
    img: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800",
    url: "https://www.sleepfoundation.org/sleep-hygiene"
  },
 { 
  tag: "Heart", 
  title: "Lifestyle Changes for Heart Failure and Cardiovascular Health", 
  img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
  url: "https://www.heart.org/en/health-topics/heart-failure/treatment-options-for-heart-failure/lifestyle-changes-for-heart-failure" 
},
  { 
    tag: "Anti-Aging", 
    title: "The Best Anti-Aging Ingredients for Every Decade of Life", 
    img: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=800",
    url: "https://www.byrdie.com/best-anti-aging-ingredients-4693433"
  },
  { 
  tag: "Safety", 
  title: "Medication Safety: Avoiding Side Effects and Dangerous Drug Interactions", 
  img: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=800",
  url: "https://my.clevelandclinic.org/health/articles/12061-medication-safety-tips" 
},
];

  const nextArticle = () => setArticleIndex((prev) => (prev + 1) % (healthArticles.length - 3));
  const prevArticle = () => setArticleIndex((prev) => (prev === 0 ? healthArticles.length - 4 : prev - 1));

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <main className="min-h-screen bg-[#fcfdfe] font-sans text-slate-800 selection:bg-green-100 overflow-x-hidden">
      
      {/* <ParsOptimaHeader logoSrc="/Logo_NoBG.png" navItems={navLinks} /> */}

     {/* 1. HERO SLIDER (In Package) */}
      <HeroSliderParsOptima slides={heroSlides} />


      {/* 2. DEALS OF THE DAY */}
      <section className="py-2 max-w-[1440px] mx-auto px-6 lg:px-2">
        <div className="bg-white p-8 shadow-sm">
           <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
              <div className="flex items-center gap-4">
                 <div className="bg-red-500 text-white p-3 rounded-2xl animate-pulse"><Timer size={28}/></div>
                 <div>
                    <h2 className="text-2xl font-bold text-[#1a3a5a] uppercase">Deals of the Day</h2>
                    <p className="text-xs font-bold text-slate-400">Ends in <span className="text-red-500">12h : 45m : 30s</span></p>
                 </div>
              </div>
              <Link href="#" className="text-xs font-bold text-[#00a651] uppercase tracking-[0.1em] flex items-center gap-2">View All <ChevronRight size={14}/></Link>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {dealsOfDay.map((deal, i) => (
                <div key={i} className="group cursor-pointer">
                   <div className="aspect-square bg-slate-50 rounded-3xl mb-2 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{deal.discount}</div>
                      <Pill size={60} className="text-slate-200 group-hover:scale-110 transition-transform"/>
                   </div>
                   <h4 className="font-bold text-slate-800 text-sm mb-1">{deal.name}</h4>
                   <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#1a3a5a]">₹{deal.price}</span>
                      <span className="text-xs text-slate-300 line-through">₹{deal.oldPrice}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="py-6 max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-[#1a3a5a] uppercase tracking-tighter">Featured Medicines</h2>
          <Link href="#" className="text-xs font-bold text-[#00a651] uppercase tracking-[0.1em] flex items-center gap-2">Explore All <ChevronRight size={14}/></Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, i) => (
            <div key={i} className="bg-white border border-slate-100 p-6 rounded-[32px] hover:shadow-2xl transition-all group relative">
              <div className="aspect-square bg-slate-50 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                 <Pill size={80} className="text-slate-100 group-hover:scale-110 transition-all" />
                 <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white p-3 rounded-full shadow-xl text-[#00a651]"><ShoppingBag size={24}/></button>
                 </div>
              </div>
              <h4 className="font-bold text-[#1a3a5a] text-sm h-10 line-clamp-2 leading-tight">{product.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{product.brand}</p>
              <div className="flex items-center justify-between mt-4">
                 <span className="text-xl font-bold text-[#1a3a5a]">₹{product.price}</span>
                 <div className="flex gap-0.5"><Star size={10} className="fill-yellow-400 text-yellow-400"/><Star size={10} className="fill-yellow-400 text-yellow-400"/><Star size={10} className="fill-yellow-400 text-yellow-400"/></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FITNESS & PERFORMANCE */}
      <section className="py-6 max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-[#1a3a5a] text-white p-3 rounded-2xl"><Zap size={28} /></div>
            <div>
              <h2 className="text-2xl font-bold text-[#1a3a5a] uppercase tracking-tighter">Fitness</h2>
              <p className="text-xs font-semibold text-slate-400 uppercase ">Premium Supplements</p>
            </div>
          </div>
          <Link href="/fitness" className="bg-white border-2 border-slate-100 text-[#1a3a5a] px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-[0.1em]">Explore Hub</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {fitnessProducts.map((product, i) => (
            <div key={i} className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <Image src={product.img} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-[#1a3a5a] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{product.tag}</div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{product.brand}</p>
                  <h4 className="font-bold text-[#1a3a5a] text-sm leading-snug mb-3 line-clamp-2">{product.name}</h4>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-[#1a3a5a]">₹{product.price}</span>
                  </div>
                </div>
                <button className="w-full bg-gray-200 text-[#1a3a5a] py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* 5. OUR TRUSTED BRANDS SECTION */}
      <section className="py-10 bg-white border-y border-slate-100">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center">
          
          {/* Section Header */}
          <div className="mb-16 space-y-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[15px] font-bold uppercase tracking-[0.2em]">
                <ShieldCheck size={14} /> Certified Partners
             </div>
             <h2 className="text-2xl lg:text-4xl font-bold text-[#1a3a5a] uppercase tracking-tighter">
                Trusted Global <span className="text-[#00a651]">Partners</span>
             </h2>
             <div className="w-12 h-1 bg-[#00a651] mx-auto rounded-full" />
          </div>

          {/* Logo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 items-center">
            {[
              { name: "PFIZER", color: "hover:text-blue-600" },
              { name: "ABBOTT", color: "hover:text-red-600" },
              { name: "GSK", color: "hover:text-orange-500" },
              { name: "CIPLA", color: "hover:text-blue-500" },
              { name: "SUN PHARMA", color: "hover:text-amber-600" },
              { name: "DABUR", color: "hover:text-green-700" }
            ].map((brand, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05 }}
                className={`group cursor-pointer transition-all duration-500`}
              >
                {/* logo files */}
                <div className={`text-2xl lg:text-3xl font-black text-slate-200 ${brand.color} transition-colors tracking-tighter opacity-60 group-hover:opacity-100`}>
                  {brand.name}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cosmetic Brands Sub-Grid */}
          <div className="mt-6 pt-16 border-t border-slate-50">
             <p className="text-[20px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-10">Premium Cosmetics & Beauty</p>
             <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-30 hover:opacity-100 transition-opacity duration-700 grayscale">
                <div className="text-xl font-black tracking-widest">LOREAL</div>
                <div className="text-xl font-black tracking-widest">MAC</div>
                <div className="text-xl font-black tracking-widest">ESTÉE LAUDER</div>
                <div className="text-xl font-black tracking-widest">NYKAA</div>
                <div className="text-xl font-black tracking-widest">LAKMÉ</div>
             </div>
          </div>

        </div>
      </section>

      {/* 6. HEALTH ARTICLES SLIDER */}
      <section className="py-8 bg-slate-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-3"><BookOpen size={14} /> Health Hub</div> */}
              <h2 className="text-4xl font-bold text-[#1a3a5a] tracking-tight uppercase">Health Insights</h2>
            </div>
            <div className="flex gap-3">
              <button onClick={prevArticle} className="p-4 bg-white border border-slate-200 rounded-full hover:bg-slate-100 shadow-sm transition-all"><ChevronLeft size={15}/></button>
              <button onClick={nextArticle} className="p-4 bg-white border border-slate-200 rounded-full hover:bg-slate-100 shadow-sm transition-all"><ChevronRight size={15}/></button>
            </div>
          </div>
          <div className="relative overflow-hidden">
            <motion.div className="flex gap-6" animate={{ x: `-${articleIndex * 25}%` }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
              {healthArticles.map((article, i) => (
                <div key={i} className="min-w-[calc(25%-18px)] bg-white rounded-[32px] overflow-hidden border border-slate-100 group shadow-sm hover:shadow-2xl transition-all">
                  <div className="relative h-52 overflow-hidden">
                    <Image src={article.img} alt="Article" fill className="object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[9px] font-bold text-blue-600 uppercase tracking-widest">{article.tag}</div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-[#1a3a5a] text-[15px] mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">{article.title}</h4>
                   {/* LOGIC */}
                    <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[11px] font-black text-blue-600 uppercase flex items-center gap-1 group/btn tracking-[0.1em]"
                    >
                    Read Story <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>



      {/* <ParsOptimaFooter /> */}
    </main>
  );
}