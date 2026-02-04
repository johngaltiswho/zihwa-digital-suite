"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { vendureClient } from "@/lib/vendure/client";
import { GET_PRODUCTS } from "@/lib/vendure/queries/products";
import type { Product } from "@/lib/vendure/types";

// Sidebar Data for Cuisines
const CUISINES = [
  { name: "Italian", slug: "italian", img: "/images/italian-food.png" },
  { name: "American", slug: "american", img: "/images/american-food.png" },
  { name: "Indian", slug: "indian", img: "/images/indian-food.png" },
  { name: "Chinese", slug: "chinese", img: "/images/chinese-food.png" },
  { name: "Thai", slug: "thai", img: "/images/thai-food.png" },
  { name: "European", slug: "european", img: "/images/european-food.png" },
  { name: "Japanese", slug: "japanese", img: "/images/japanese-food.png" },
  { name: "Korean", slug: "korean", img: "/images/korean-food.jpg" },
];

export default function CuisinePage() {
  const params = useParams();
  const currentCuisineSlug = params.cuisine as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await vendureClient.request(GET_PRODUCTS, {
          options: { take: 30 } 
        });
        setProducts(data.products.items);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentCuisineSlug]);

  return (
    <main className="bg-white min-h-screen flex flex-col">
      {/* 1. STICKY TOP HEADER */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={20} className="text-gray-700" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900 capitalize">
              {currentCuisineSlug} Cuisine
            </h1>
          </div>
          {/* Delivery Badge */}
          <div className="hidden md:flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full border border-red-100">
             <Clock size={14} className="text-red-700" />
             <span className="text-[10px] font-bold text-red-800 uppercase tracking-tight">Delivery in 45 Mins</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 max-w-[1440px] mx-auto w-full">
        {/* 2. LEFT SIDEBAR NAVIGATION */}
        <aside className="w-[85px] md:w-[215px] border-r border-gray-100 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto bg-gray-50/30">
          {CUISINES.map((item) => (
            <Link 
              key={item.slug}
              href={`/cuisine/${item.slug}`}
              className={`flex flex-col md:flex-row items-center gap-3 p-3 md:p-4 transition-all border-l-4 ${
                currentCuisineSlug === item.slug 
                ? "bg-white border-red-800" 
                : "border-transparent hover:bg-white text-gray-500"
              }`}
            >
              <div className={`w-10 h-12 md:w-12 md:h-12 relative flex-shrink-0 bg-white rounded-lg shadow-sm p-1 border ${
                 currentCuisineSlug === item.slug ? "border-red-100" : "border-gray-50"
              }`}>
                <Image src={item.img} alt={item.name} fill className="object-contain" />
              </div>
              <span className={`text-[10px] md:text-sm font-bold text-center md:text-left leading-tight ${
                currentCuisineSlug === item.slug ? "text-red-800" : "text-gray-600"
              }`}>
                {item.name}
              </span>
            </Link>
          ))}
        </aside>

        {/* 3. PRODUCT GRID CONTENT */}
        <section className="flex-1 p-4 md:p-6 bg-white">
          <div className="mb-6 flex justify-between items-end">
            <div>
               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cuisine Store</p>
               <h2 className="text-xl font-black text-gray-900 capitalize">
                Best of {currentCuisineSlug}
              </h2>
            </div>
            <p className="text-xs font-bold text-gray-400">{products.length} Products</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-50 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id);
  const currentVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  return (
    <div className="group flex flex-col bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md transition-all duration-300 h-full">
      <Link href={`/product/${product.slug}?variant=${selectedVariantId}`} className="flex-1">
        <div className="relative aspect-square w-full bg-[#fcfcfc] rounded-lg overflow-hidden mb-3">
          <Image
            src={currentVariant?.featuredAsset?.preview || product.featuredAsset?.preview || "/images/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <h3 className="text-[12px] md:text-[13px] font-bold text-gray-800 line-clamp-2 leading-tight h-8 mb-1">
          {product.name}
        </h3>
        
        {/* Variant Dropdown styled for density */}
        {product.variants.length > 1 ? (
          <select
            value={selectedVariantId}
            onChange={(e) => {
              e.preventDefault();
              setSelectedVariantId(e.target.value);
            }}
            className="w-full mb-2 text-[10px] p-1 border border-gray-200 font-bold rounded bg-gray-50 outline-none cursor-pointer text-gray-500"
          >
            {product.variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name.split(' - ').pop()}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-[11px] text-gray-400 font-medium mb-2">1 unit</p>
        )}
      </Link>

      <div className="mt-auto pt-2 flex items-center justify-between">
        <span className="text-[14px] md:text-[15px] font-black text-gray-900">
          ₹{((currentVariant?.price || 0) / 100).toFixed(0)}
        </span>

        <button className="px-4 py-1.5 border border-red-700 text-red-700 font-bold text-[11px] rounded-lg bg-red-50 hover:bg-red-800 hover:text-white transition-all uppercase tracking-tighter">
          Add
        </button>
      </div>
    </div>
  );
}