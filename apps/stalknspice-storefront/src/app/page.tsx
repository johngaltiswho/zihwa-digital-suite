"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Newsletter from "../components/NewsLetter";
import RecipeGrid from "../components/RecipeGrid";
import { HeroSliderSNS } from "@repo/ui";
import VerticalCategoryMenu from "../components/VerticalCategoryMenu";
import ProductGrid from "../components/ProductGrid";
import { vendureClient } from "@/lib/vendure/client";
import { GET_PRODUCTS } from "@/lib/vendure/queries/products";
import type { Product } from "@/lib/vendure/types";

function ProductCard({ product }: { product: Product }) {
  
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id);

  // Find the details of the selected variant
  const currentVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  return (
    <div className="group flex flex-col bg-white border border-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
      
      {/* 1. IMAGE & TITLE LINK  */}
      <Link href={`/product/${product.slug}?variant=${selectedVariantId}`} className="block">
        <div className="relative aspect-square w-full bg-[#fcfcfc] overflow-hidden">
          <Image
            src={product.featuredAsset?.preview || "/images/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
          />
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
            className="mb-1.5 text-[12px] p-0.5 border border-gray-300 font-bold rounded bg-gray-50 outline-none cursor-pointer text-gray-500"
          >
            {product.variants.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        ) : (
          /* Invisible spacer to keep alignment consistent across rows */
          <div className="h-3" />
        )}

        <p className="text-red-800 font-bold text-xs md:text-sm mb-2">
          ₹{((currentVariant?.price || 0) / 100).toFixed(0)}
        </p>

        {/* REDIRECT BUTTON: Links to detail page instead of adding directly */}
        <Link 
          href={`/product/${product.slug}?variant=${selectedVariantId}`}
          className="mt-auto w-full py-1.5 text-[12px] font-black rounded-md border border-gray-200 bg-gray-50 text-gray-800 group-hover:bg-red-800 group-hover:text-white group-hover:border-red-800 transition-colors uppercase tracking-tight text-center"
        >
          Add to Cart
        </Link>
      </div>
    </div>
  );
}
export default function Home() {
  // Slider State for Hero (6 slides)
  const [heroIndex, setHeroIndex] = useState(0);
  // const heroSlides = [1, 2, 3, 4, 5, 6];
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
          options: { take: 9 } // Fetch 6 featured products for homepage
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

  
  return (
    <main className="bg-white min-h-screen font-sans">
      
      {/* 1. HERO SLIDER SECTION (Using Common Component) */}
      <section className="bg-white py-4 md:py-2">
        <div className="max-w-[1440px] mx-auto px-12">
          {/* This one line replaces all the manual state/timer logic */}
          <HeroSliderSNS slides={slides} height="430px" />
        </div>
      </section>

      <div className="max-w-[1250px] mx-auto px-5">
        
       {/* 2. SHOP BY CUISINES */}
<section className="py-4 text-center">
  <h2 className="text-3xl md:text-4xl font-bold mb-10 text-gray-800">Shop By Cuisines</h2>
  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
    {[
      { name: "Italian", img: "/images/italian-food.png" },
      { name: "American", img: "/images/american-food.png" },
      { name: "Indian", img: "/images/indian-food.png" },
      { name: "Chinese", img: "/images/chinese-food.png" },
      { name: "Thai", img: "/images/thai-food.png" },
      { name: "European", img: "/images/european-food.png" },
      { name: "Japanese", img: "/images/japanese-food.png" },
      { name: "Korean", img: "/images/korean-food.jpg" },
    ].map((item) => (
      <div key={item.name} className="flex flex-col items-center group cursor-pointer max-w-[160px] mx-auto w-full">
        {/* Removed backgroundColor style and rounded box. Reduced padding to 0 to let image be bigger. */}
         <div className="w-full aspect-square rounded-[40px] overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
           <Image 
             src={item.img} 
             width={160}  // Increased from 100
             height={160} // Increased from 100
             alt={item.name} 
             className="object-contain" 
           />
        </div>
        <span className="mt-3 font-bold text-sm md:text-lg">{item.name}</span>
      </div>
    ))}
  </div>
</section>
       {/* 3. SHOP BY CATEGORY */}
<section className="py-4 text-center">
  <h2 className="text-3xl md:text-4xl font-bold mb-10 text-gray-800">Shop By Category</h2>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
    {[
      { name: "Crushes", img: "/images/crushes.png" },
      { name: "Syrups", img: "/images/syrup.png" },
      { name: "Fruits & Vegetables", img: "/images/fruits-vegetable.png" },
      { name: "Pastas & Noodles", img: "/images/noodles-pasta.png" },
      { name: "Milk & Cream", img: "/images/milk.png" },
      { name: "Sauces", img: "/images/sauce.png" },
    ].map((cat) => (
      <div key={cat.name} className="flex flex-col items-center cursor-pointer group max-w-[130px] mx-auto w-full">
        {/* Removed bg-[#FDF5E6] and rounded corners */}
         <div className="w-full aspect-square rounded-[40px] overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Image 
            src={cat.img} 
            width={180}   // Increased from 140
            height={180}  // Increased from 140
            alt={cat.name} 
            className="object-contain" 
          />
        </div>
        <span className="mt-4 font-bold text-base">{cat.name}</span>
      </div>
    ))}
  </div>
</section>
        {/* 4. FEATURED PRODUCTS */}
        <section className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-3xl font-bold text-gray-800">Featured Products</h2>
            <Link href="/products" className="text-red-800 font-bold text-sm hover:underline">View All →</Link>
          </div>

          {productsLoading ? (
            <div className="text-center py-10"><p className="text-gray-400 text-sm">Loading...</p></div>
          ) : productsError ? (
            <div className="text-center py-10"><p className="text-red-600 text-sm">{productsError}</p></div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-8 gap-3 md:gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
          {/* 4. TOP OFFERS */}
<section className="py-6 text-center">
  <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">Top Offers</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
  <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">Brand Store</h2>
  <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 hover:opacity-100 transition-opacity px-5">
    {[
      { name: "Tops", img: "/images/topps-logo.jpg" },
      { name: "My Favourite", img: "/images/myfavourite-logo.jpg" },
      { name: "Timios", img: "/images/timios-logo.jpg" },
      { name: "Monin", img: "/images/monin-logo.jpg" },
      { name: "Hersheys", img: "/images/hersheys-logo.jpg" },
      { name: "Pasta Reggia", img: "/images/reggia-logo.jpg" },
    ].map((brand) => (
      <div key={brand.name} className="w-12 md:w-32 h-32 relative">
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
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Why Stalks N Spice?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { n: 1, t: "Delivery Within 45min*", d: "Get your orders delivered within 45min by choosing priority delivery on checkout! Pincodes restriction apply." },
              { n: 2, t: "Your Order Delivered in 1 Basket", d: "Rather than having your order delivered from multiple vendors at multiple times via e-commerce aggregators, get your entire order delivered from a single source at once." },
              { n: 3, t: "Wholesale Prices", d: "Having been associated with the HORECA Industry since 1997, we have access to the best ingredients at the best prices which we are now directly passing on to you." }
            ].map(item => (
              <div key={item.n} className="px-6 flex flex-col items-center">
                <div className="text-7xl md:text-7xl font-black text-red-900 mb-4 opacity-90">{item.n}</div>
                <h3 className="text-xl font-bold mb-4">{item.t}</h3>
                <p className="text-gray-900 text-sm font-semibold leading-relaxed max-w-xs">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. REVIEWS */}
        <section className="py-6">
          {/* Container: Thin gold border, high rounded corners, wide layout */}
  
    
          <h2 className="text-3xl font-bold text-center mb-6 uppercase tracking-[0.2em] text-gray-800">Reviews</h2>
          <div className="max-w-1100px] mx-auto border-[1px] border-[#D4B679] rounded-[25px] p-12 md:p-10 text-center bg-white shadow-sm">
          {/* <div className="max-w-4xl mx-auto border-[1.5px] border-[#D4B679] rounded-[35px] p-4 md:p-10 text-center relative bg-white shadow-sm"> */}
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Kind Words From Kinder People</h3>
            <div className="min-h-[30px] flex items-center justify-center px-4">
              <p className="text-[#8B2323] leading-relaxed italic text-lg md:text-xl transition-all duration-500">
                "{reviews[reviewIndex].text}"
              </p>
            </div>
            <p className="font-bold text-xl mt-8 text-gray-900">-{reviews[reviewIndex].author}</p>
            <div className="flex justify-center gap-3 mt-8">
              {reviews.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setReviewIndex(i)} 
                  className={`h-1.5 transition-all duration-300 rounded-full ${i === reviewIndex ? "w-12 bg-red-800" : "w-8 bg-gray-300"}`} 
                />
              ))}
            </div>
          </div>
        </section>

        {/* 9. NEWSLETTER
        <section className="py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-12 tracking-tight text-gray-900">NEWSLETTER</h2>
          <div className="flex flex-col md:flex-row max-w-2xl mx-auto border-black border-[1.5px] rounded-sm overflow-hidden shadow-lg">
            <input 
              type="email" 
              placeholder="ENTER YOUR EMAIL HERE"
              className="flex-1 p-5 outline-none text-center md:text-left text-sm font-medium placeholder-gray-400"
            />
            <button className="bg-black text-white px-16 py-5 font-bold hover:bg-gray-800 transition-colors uppercase text-sm tracking-wider">
              Submit
            </button>
          </div>
        </section> */}
        <Newsletter />
      </div>
    </main>
  );
}