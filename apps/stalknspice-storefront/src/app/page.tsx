"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Newsletter from "../components/NewsLetter";
import RecipeGrid from "../components/RecipeGrid";
import { HeroSliderSNS } from "@repo/ui";
import { X, AlertCircle,Sparkles,ShoppingBag,Star } from "lucide-react";
import ProductGrid from "../components/ProductGrid";
import { vendureClient } from "@/lib/vendure/client";
import { GET_PRODUCTS } from "@/lib/vendure/queries/products";
import { motion, AnimatePresence} from "framer-motion";
import type { Product } from "@/lib/vendure/types";


function ProductCard({ product }: { product: Product }) {
  
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id);
  const currentVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
   // --- SMART STOCK LOGIC ---
  const rawStock = currentVariant?.stockLevel;
  const isOutOfStock = rawStock === 'OUT_OF_STOCK' || rawStock === 0 || rawStock === '0';
  const isLowStock = rawStock === 'LOW_STOCK' || (typeof rawStock === 'number' && rawStock > 0 && rawStock <= 10);
  return (
    <div className="group flex flex-col bg-red-50 border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
      
      {/* 1. IMAGE & TITLE LINK  */}
      <Link href={`/product/${product.slug}?variant=${selectedVariantId}`} className="block">
        <div className="relative aspect-square w-full bg-[#fcfcfc] overflow-hidden">
          <Image
            src={currentVariant?.featuredAsset?.preview || product.featuredAsset?.preview || "/images/placeholder.jpg"}
            alt={currentVariant?.name || product.name}
            fill
            className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
          />
           {/* SOLD OUT OVERLAY ON IMAGE */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white/90 text-red-600 text-[10px] font-black px-3 py-1 rounded shadow-lg border border-red-100 uppercase tracking-tighter">
                Sold Out
              </span>
            </div>
          )}
        </div>

        <div className="p-2 pb-0 text-center">
          <h3 className="text-[9px] md:text-[13px] font-black text-gray-700 line-clamp-3 h-9 md:h-8 leading-[1.2] mb-1 overflow-hidden">
            {product.name}
          </h3>
        </div>
      </Link>

      {/* 2. INTERACTIVE SECTION */}
      <div className="p-2 pt-1 flex flex-col flex-grow text-center">
        
        {/* VARIANT DROPDOWN: Only shows if there are multiple options */}
        {product.variants.length > 1 ? (
          <select
            value={selectedVariantId}
            onChange={(e) => setSelectedVariantId(e.target.value)}
            className="mb-1 text-[11px] p-0.5 border border-gray-400 font-bold rounded bg-gray-50 outline-none cursor-pointer text-gray-500"
          >
            {product.variants.map((v) => (
              <option key={v.id} value={v.id}>
              {v.name.split(' - ').length >= 2 
              ? `${v.name.split(' - ').pop()} - ${v.name.split(' - ').slice(0, -1).join(' - ')}` 
              : v.name}
            </option>
            ))}
          </select>
        ) : (
          /* Invisible spacer to keep alignment consistent across rows */
          <div className="h-3" />
        )}

        <p className="text-red-800 font-bold text-xs md:text-sm mb-2">
          ₹{((currentVariant?.price || 0) / 100).toFixed(0)}
        </p>

        {/* DYNAMIC STOCK TEXT BELOW PRICE */}
          {isOutOfStock ? (
            <span className="text-[8px] md:text-[9px] font-black text-red-500 uppercase flex items-center justify-center gap-0.5">
              <X size={10} strokeWidth={3} /> Sold Out
            </span>
          ) : isLowStock ? (
            <span className="text-[8px] md:text-[9px] font-black text-orange-500 uppercase flex items-center justify-center gap-0.5">
              <AlertCircle size={10} strokeWidth={3} /> Limited Stock
            </span>
          ) : (
             <div className="h-3" /> // Spacer for alignment
          )}
        </div>

        {/* UPDATED BUTTON */}
        <Link 
          href={`/product/${product.slug}?variant=${selectedVariantId}`}
          className={`mt-auto w-full py-1.5 text-[12px] font-black rounded-md border transition-colors uppercase tracking-tight text-center
            ${isOutOfStock 
              ? "bg-gray-100 border-gray-200 text-gray-400" 
              : "bg-gray-50 border-gray-200 text-gray-800 group-hover:bg-red-800 group-hover:text-white group-hover:border-red-800"
            }`}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Link>
      </div>
  );
}
export default function Home() {

  const [heroIndex, setHeroIndex] = useState(0);
  const slides = [
    { id: 1, img: "/images/hero-1.jpg" },
    { id: 2, img: "/images/hero-2.jpg" },
    { id: 3, img: "/images/hero-3.jpg" },
    { id: 4, img: "/images/hero-4.jpg" },
    { id: 5, img: "/images/hero-5.jpg" },
    { id: 6, img: "/images/hero-6.jpg" },
  ];

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Slider State for Reviews
  const [reviewIndex, setReviewIndex] = useState(0);
  const reviews = [
    { text: "The experience was really nice. I ordered one of the product from Amazon. After having an informative chat with Raghunandan from 'Stanks N Spice', I scrolled the other products from their website. The website has a lot of variety and is user friendly. Easy to choose from, easy to checkout and smooth payment options. I ended up ordering more products. All the products I tried, the quality is comparable to other famous brands. In fact, I would rank a bit higher quality at a lower price! Definitely a good place to try a variety of products and replace with the famous brand for which we are paying a lot.", author: "Monali Mhaskar" },
    { text: "Well I have only ordered products online due to the lockdown and the manager Mr. Raghunandan has been very kind in delivering the products on time and ensuring doorstep delivery. They have most of the products that are not easily available around stores in Bangalore. Quantity and quality are great and pricing is pretty reasonable. Also Mr. Raghunandan is always ready to answer any queries you have. Thanks Stalks n Spice.", author: "Priya Rajkumar" },
    { text: "Mr. Raghunandan called me one day and requested to look into the website and several other products that they sell. I ended up ordering a lot of products as they have a little bit of everything! The service I got was fast, prompt and really organised. I have placed multiple orders with him post that and the service is perfect and timely. Thankful that he called me and requested to look up the website!", author: "Puja Singh" },
    { text: "Excellent experience, we are treated not only as a very important but a good friend. Raghunandan was very kind and helpful. We got our orders on time. Found it very helpful especially during the lockdown. Thank you.", author: "Satinee M" }
  ];

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const data = await vendureClient.request(GET_PRODUCTS, {
          options: { take: 7 } 
        });
        setProducts(data.products.items);
        setProductsError(null);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProductsError('Failed to load products. Please try again later.');
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, [reviews.length]);
  
  return (
    <main className="bg-white min-h-screen font-sans">
      
      {/* 1. HERO SLIDER SECTION (Using Common Component) */}
      <section className="bg-white pt-0 pb-1 md:py-1">
        <div className="max-w-[1440px] mx-auto md:px-12">
          {/* This one line replaces all the manual state/timer logic */}
          <HeroSliderSNS slides={slides} height="430px" />
        </div>
      </section>

      <div className="max-w-[1250px] mx-auto px-5">
        
      {/* SHOP BY CUISINES - with links */}
<section className="py-2 text-center">
  <h2 className="text-2xl md:text-4xl font-bold mb-10 text-gray-800">Shop By Cuisines</h2>
  <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-8">
    {[
      { name: "Italian", img: "/images/italian-food.png", slug: "italian" },
              { name: "American", img: "/images/american-food.png", slug: "american" },
              { name: "Indian", img: "/images/indian-food.png", slug: "indian" },
              { name: "Chinese", img: "/images/chinese-food.png", slug: "chinese" },
              { name: "Thai", img: "/images/thai-food.png", slug: "thai" },
              { name: "European", img: "/images/european-food.png", slug: "european" },
              { name: "Japanese", img: "/images/japanese-food.png", slug: "japanese" },
              { name: "Korean", img: "/images/korean-food.jpg", slug: "korean" },
    ].map((item) => (
      <Link href={`/cuisine/${item.slug}`} key={item.name} className="flex flex-col items-center group cursor-pointer max-w-[160px] mx-auto w-full">
        <div className="w-full aspect-square rounded-[40px] overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Image 
            src={item.img} 
            width={160}  
            height={160} 
            alt={item.name} 
            className="object-contain" 
          />
        </div>
        <span className="mt-3 font-bold text-sm md:text-lg">{item.name}</span>
      </Link>
    ))}
  </div>
</section>
      {/* 3. SHOP BY CATEGORY */}
<section className="py-4 text-center">
  <h2 className="text-2xl md:text-4xl font-bold mb-10 text-gray-800">Shop By Category</h2>
  <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-6 gap-6">
    {[
      { name: "Crushes", img: "/images/crushes.png", slug: "crushes" },
      { name: "Syrups", img: "/images/syrup.png", slug: "syrups" },
      { name: "Fruits & Veg", img: "/images/fruits-vegetable.png", slug: "fruits-vegetables" },
      { name: "Pasta & Noodles", img: "/images/noodles-pasta.png", slug: "pastas-noodles" },
      { name: "Milk & Cream", img: "/images/milk.png", slug: "milk-cream" },
      { name: "Sauces", img: "/images/sauce.png", slug: "sauces" },
    ].map((cat) => (
      <Link 
        href={`/category/${cat.slug}`} 
        key={cat.name} 
        className="flex flex-col items-center group cursor-pointer"
      >
        {/* Removed bg-[#FDF5E6] and rounded corners */}
          <div className="w-full aspect-square rounded-[40px] overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Image 
            src={cat.img} 
            width={180}   
            height={180}  
            alt={cat.name} 
            className="object-contain" 
          />
        </div>
        <span className="mt-4 font-bold text-base">{cat.name}</span>
      </Link>
    ))}
  </div>
</section>
         {/* FEATURED PRODUCTS */}
        <section className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-3xl font-bold text-gray-800">Featured Products</h2>
            <Link href="/shop" className="text-red-800 font-bold text-sm hover:underline">View All →</Link>
          </div>

          {productsLoading ? (
            <div className="text-center py-10"><p className="text-gray-400 text-sm">Loading...</p></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 md:gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
          {/* 4. TOP OFFERS */}
<section className="py-6 text-center">
  <h2 className="text-2xl md:text-4xl font-bold mb-12 text-gray-800">Top Offers</h2>
  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      { img: "/images/monin.jpg" },
      { img: "/images/lkk-soy.jpg" },
      { img: "/images/almond-milk-offer.jpg" },
      { img: "/images/nani-ki-barni-offer.jpg" },

    ].map((offer, i) => (
      <div key={i} className="relative aspect-[32/32] w-full overflow-hidden rounded-2xl cursor-pointer hover:shadow-xl transition-all border border-gray-100 shadow-sm">
        <Image 
          src={offer.img} 
          fill 
          alt="Special Offer" 
          className="object-cover hover:scale-105 transition-transform duration-700"
        />
      </div>
    ))}
  </div>
</section>


       {/* 6. BRAND STORE */}
<section className="py-10 text-center">
  <h2 className="text-2xl md:text-4xl font-bold mb-8 text-gray-800">Brand Store</h2>
  <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 hover:opacity-100 transition-opacity px-5">
    {[
      { name: "Tops", img: "/images/topps-logo.jpg" },
      { name: "My Favourite", img: "/images/myfavourite-logo.jpg" },
      { name: "Timios", img: "/images/timios-logo.jpg" },
      { name: "Monin", img: "/images/monin-logo.jpg" },
      { name: "Hersheys", img: "/images/hersheys-logo.jpg" },
      { name: "Pasta Reggia", img: "/images/reggia-logo.jpg" },
    ].map((brand) => (
      <div key={brand.name} className="w-16 md:w-32 h-16 md:h-32 relative opacity-100">
        <Image 
          src={brand.img} 
          fill 
          alt={brand.name} 
          className="object-contain" 
        />
      </div>
    ))}
  </div>
</section>

        {/* 7. WHY STALKS N SPICE? */}
        <section className="py-6 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-10">Why Stalks N Spice?</h2>
          <div className="grid  md:grid-cols-3 gap-12">
            {[
              { n: 1, t: "Delivery Within 45min*", d: "Get your orders delivered within 45min by choosing priority delivery on checkout! Pincodes restriction apply." },
              { n: 2, t: "Your Order Delivered in 1 Basket", d: "Rather than having your order delivered from multiple vendors at multiple times via e-commerce aggregators, get your entire order delivered from a single source at once." },
              { n: 3, t: "Wholesale Prices", d: "Having been associated with the HORECA Industry since 1997, we have access to the best ingredients at the best prices which we are now directly passing on to you." }
            ].map(item => (
              <div key={item.n} className="px-6 flex flex-col items-center">
                <div className="text-3xl md:text-7xl font-black text-red-900 mb-4 opacity-90">{item.n}</div>
                <h3 className="text-xl font-bold mb-4">{item.t}</h3>
                <p className="text-gray-900 text-s md:text-sm font-semibold leading-relaxed max-w-xs">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

       {/* REVIEWS */}
        <section className="py-6 md:py-10">
          <div className="text-center mb-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-6xl font-black text-gray-900 mb-4">
                Customer <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Reviews</span>
              </h2>
              <p className="text-gray-600 text-base md:text-lg font-medium">
                Real stories from our satisfied customers
              </p>
            </motion.div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl border-2 border-red-100 p-10 md:p-8 shadow-xl">
            <h2 className="text-lg md:text-4xl font-black text-center text-gray-900 mb-4">
                Kind Words From Kinder People
              </h2>
            
            <div className="relative min-h-[240px] md:min-h-[180px] flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={reviewIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute w-full px-4 text-center max-w-5xl"
                >
                  <p className="text-gray-800 leading-relaxed text-xs md:text-lg mb-6 italic">
                    "{reviews[reviewIndex].text}"
                  </p>
                  <p className="font-black text-xs md:text-xl text-gray-900">
                    — {reviews[reviewIndex].author}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-3 mt-12">
              {reviews.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setReviewIndex(i)} 
                  className={`h-2 transition-all duration-500 rounded-full ${
                    i === reviewIndex ? "w-12 bg-red-700" : "w-8 bg-gray-300 hover:bg-gray-400"
                  }`} 
                />
              ))}
            </div>
          </div>
        </section>
        {/* ATTRACTIVE DESKTOP SHOP BUTTON */}
<motion.div 
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  className="fixed bottom-8 right-8 z-[100] hidden md:block"
>
  <Link href="/shop" className="relative group flex items-center">
    
    {/* 1. Pulsing Background Glow */}
    <div className="absolute inset-0 bg-red-600 rounded-full blur-xl group-hover:blur-2xl opacity-40 animate-pulse transition-all"></div>

    {/* 2. The Main Button */}
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center bg-gradient-to-br from-[#8B2323] to-[#b92b2b] text-white p-4 rounded-full shadow-2xl border border-white/20 overflow-hidden"
    >
      {/* Icon */}
      <ShoppingBag size={24} className="relative z-10 group-hover:rotate-1 transition-transform duration-300" />

      {/* 3. Slide-out Text Label */}
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 ease-in-out font-black uppercase tracking-widest text-sm">
        Shop Now
      </span>

      {/* 4. Shine Effect Overlay */}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent opacity-20 via-white to-transparent group-hover:animate-shine" />
    </motion.div>

    {/* 5. Tooltip/Badge (Optional) */}
    <div className="absolute -top-2 -right-1 bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
      NEW
    </div>
  </Link>
</motion.div>

{/* Mobile Version: Fixed Bottom Bar Entry */}
<div className="fixed bottom-0 left-0 w-full p-4 z-[100] md:hidden">
  <Link 
    href="/shop"
    className="bg-black text-white w-full py-5 rounded-2xl flex items-center justify-center gap-3 shadow-2xl"
  >
    {/* <Sparkles size={16} className="text-amber-400" />
    <span className="text-xs font-black uppercase tracking-[0.2em]">Explore All Provisions</span> */}
  </Link>
</div>
        <Newsletter />
      </div>
    </main>
  );
}