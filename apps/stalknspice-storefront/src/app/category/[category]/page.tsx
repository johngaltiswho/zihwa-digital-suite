"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { vendureClient } from "@/lib/vendure/client";
import { GET_PRODUCTS } from "@/lib/vendure/queries/products";
import type { Product } from "@/lib/vendure/types";

// List for the Sidebar
const CATEGORIES = [
  { name: "Crushes", slug: "crushes", img: "/images/crushes.png" },
  { name: "Syrups", slug: "syrups", img: "/images/syrup.png" },
  { name: "Fruits & Vegetables", slug: "fruits-vegetables", img: "/images/fruits-vegetable.png" },
  { name: "Pastas & Noodles", slug: "pastas-noodles", img: "/images/noodles-pasta.png" },
  { name: "Milk & Cream", slug: "milk-cream", img: "/images/milk.png" },
  { name: "Sauces", slug: "sauces", img: "/images/sauce.png" },
];

export default function CategoryPage() {
  const params = useParams();
  const currentCategorySlug = params.category as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
    
        const data = await vendureClient.request(GET_PRODUCTS, {
          options: { take: 20 } 
        });
        setProducts(data.products.items);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentCategorySlug]);

  return (
    <main className="bg-white min-h-screen flex flex-col">
      {/* 1. TOP STICKY HEADER */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={20} className="text-gray-700" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900 capitalize">
              {currentCategorySlug.replace(/-/g, ' ')}
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
             <Clock size={14} className="text-green-600" />
             <span className="text-xs font-bold text-green-700 uppercase">Delivery in 15 Mins</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">
        {/* 2. LEFT SIDEBAR (Zepto Style) */}
        <aside className="w-[100px] md:w-[240px] border-r border-gray-100 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto bg-gray-50/50">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`flex flex-col md:flex-row items-center gap-3 p-3 md:p-4 transition-all border-l-4 ${
                currentCategorySlug === cat.slug 
                ? "bg-white border-red-700" 
                : "border-transparent hover:bg-white text-gray-500"
              }`}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 relative flex-shrink-0 bg-white rounded-lg shadow-sm p-1">
                <Image src={cat.img} alt={cat.name} fill className="object-contain " />
              </div>
              <span className={`text-[10px] md:text-sm font-bold text-center md:text-left leading-tight ${
                currentCategorySlug === cat.slug ? "text-red-800" : "text-gray-600"
              }`}>
                {cat.name}
              </span>
            </Link>
          ))}
        </aside>

        {/* 3. PRODUCT GRID AREA */}
        <section className="flex-1 p-4 md:p-6 bg-white">
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Buy {currentCategorySlug.replace(/-/g, ' ')} Online
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-gray-100 animate-pulse rounded-xl" />
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
    <div className="group flex flex-col bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md transition-shadow">
      <Link href={`/product/${product.slug}?variant=${selectedVariantId}`} className="flex-1">
        <div className="relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden mb-3">
          <Image
            src={currentVariant?.featuredAsset?.preview || product.featuredAsset?.preview || "/images/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <h3 className="text-[13px] font-bold text-gray-800 line-clamp-2 leading-tight h-8 mb-1">
          {product.name}
        </h3>
        
        <p className="text-[11px] text-gray-500 font-medium mb-2">
          {currentVariant?.name.split(' - ').pop() || "1 unit"}
        </p>
      </Link>

      <div className="mt-auto pt-2 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[14px] font-black text-gray-900">
            ₹{((currentVariant?.price || 0) / 100).toFixed(0)}
          </span>
        </div>

        <button className="px-5 py-1.5 border border-red-700 text-red-700 font-bold text-[12px] rounded-lg bg-red-50 hover:bg-red-800 hover:text-white transition-all uppercase">
          Add
        </button>
      </div>
    </div>
  );
}