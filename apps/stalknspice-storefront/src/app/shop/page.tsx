"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Zap, ChevronDown, Filter, Search } from "lucide-react";
import { vendureClient } from "@/lib/vendure/client";
import { GET_PRODUCTS } from "@/lib/vendure/queries/products";
import type { Product } from "@/lib/vendure/types";

// Query for Categories
const GET_COLLECTIONS = `query { collections { items { id name slug featuredAsset { preview } } } }`;

function DmartProductCard({ product }: { product: Product }) {
  const [selectedVariantId] = useState(product.variants[0]?.id);
  const currentVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  const rawStock = currentVariant?.stockLevel;
  const isOutOfStock = rawStock === 'OUT_OF_STOCK' || rawStock === 0 || rawStock === '0';
  
  // Simulated Pricing (DMart style shows MRP vs Our Price)
  const price = (currentVariant?.price || 0) / 100;
  const mrp = price * 1.2; // Simulating a 20% higher MRP
  const savings = mrp - price;

  return (
    <div className="bg-white border border-gray-100 p-3 flex flex-col hover:shadow-md transition-shadow relative group">
      {/* Image Section */}
      <div className="relative aspect-square mb-2 bg-white flex items-center justify-center">
         {/* Veg Icon (Green Square/Dot) */}
         <div className="absolute top-0 right-0 border border-green-600 p-[1px] w-3 h-3 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
         </div>

        <Image
          src={currentVariant?.featuredAsset?.preview || product.featuredAsset?.preview || "/images/placeholder.jpg"}
          alt={product.name}
          fill
          className={`object-contain p-2 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded italic">Out Of Stock</span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-grow flex flex-col">
        <h3 className="text-[13px] font-medium text-gray-700 leading-tight line-clamp-2 h-8 mb-1">
          {product.name}
        </h3>
        <p className="text-[12px] text-gray-500 mb-2">
            {currentVariant?.name.includes('-') ? currentVariant.name.split('-').pop() : '1 unit'}
        </p>

        <div className="mt-auto">
          <div className="flex items-center gap-2 text-[11px]">
             <span className="text-gray-400">MRP <span className="line-through">₹{mrp.toFixed(0)}</span></span>
             <span className="font-bold text-gray-800">Shop Price <span className="text-sm">₹{price.toFixed(0)}</span></span>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="bg-green-50 text-green-700 text-[10px] font-bold px-1.5 py-0.5 border border-green-100">
               ₹{savings.toFixed(0)} OFF
            </div>
            
            <button 
              disabled={isOutOfStock}
              className={`px-4 py-1 rounded text-xs font-bold border transition-colors
              ${isOutOfStock 
                ? 'bg-gray-100 text-gray-400 border-gray-200' 
                : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
              }`}
            >
              {isOutOfStock ? 'SOLD' : 'ADD'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCol, setSelectedCol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pData, cData] = await Promise.all([
          vendureClient.request(GET_PRODUCTS, { options: { take: 100 } }),
          vendureClient.request(GET_COLLECTIONS)
        ]);
        setProducts(pData.products.items);
        setCollections(cData.collections.items);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredProducts = selectedCol 
    ? products.filter(p => p.collections?.some(c => c.id === selectedCol))
    : products;

  const activeCategoryName = selectedCol ? collections.find(c => c.id === selectedCol)?.name : 'All Products';

  return (
    <main className="bg-white min-h-screen">
      
      {/* 1. TOP HEADER (Location & Breadcrumb style) */}
      <div className="bg-[#f3f4f6] px-6 py-2 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
           <span>Home</span>
           <span>/</span>
           <span className="text-black font-bold">{activeCategoryName}</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border text-[10px] font-bold text-green-600">
           <Zap size={12} fill="currentColor" /> FAST DELIVERY AVAILABLE
        </div>
      </div>

      <div className="flex max-w-[1600px] mx-auto">
        
        {/* 2. LEFT SIDEBAR CATEGORIES */}
        <aside className="w-[260px] border-r border-gray-200 min-h-screen sticky top-0 bg-white hidden md:block">
           <div className="p-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Categories</h2>
           </div>
           <nav className="p-2 space-y-0.5">
              <button 
                onClick={() => setSelectedCol(null)}
                className={`w-full text-left px-3 py-2.5 text-[13px] rounded-md transition-all
                ${!selectedCol ? 'bg-green-50 text-green-700 font-bold border-l-4 border-green-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                All Provisions
              </button>
              {collections.map(col => (
                <button 
                  key={col.id}
                  onClick={() => setSelectedCol(col.id)}
                  className={`w-full text-left px-3 py-2.5 text-[13px] rounded-md transition-all flex justify-between items-center
                  ${selectedCol === col.id ? 'bg-green-50 text-green-700 font-bold border-l-4 border-green-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {col.name}
                  <span className="text-[10px] text-gray-400">({products.filter(p => p.collections?.some(c => c.id === col.id)).length})</span>
                </button>
              ))}
           </nav>
        </aside>

        {/* 3. MAIN CONTENT AREA */}
        <section className="flex-1 bg-white p-4 md:p-6">
          
          {/* Page Title & Count */}
          <div className="flex items-end gap-3 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 leading-none">{activeCategoryName}</h1>
            <span className="text-sm text-gray-400 font-medium">{filteredProducts.length} items</span>
          </div>

          {/* Filter Dropdowns (DMart Style) */}
          <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-gray-100 pb-4">
             {['Brand', 'Pack Size', 'Price', 'Discount', 'Type'].map((filter) => (
               <button key={filter} className="px-4 py-1.5 border border-gray-300 rounded-full text-[12px] font-medium text-gray-600 flex items-center gap-2 hover:border-green-600 transition-colors">
                  {filter} <ChevronDown size={14} />
               </button>
             ))}
             <div className="ml-auto flex items-center gap-2 text-[12px] text-gray-500">
                <span>Sort by:</span>
                <select className="border-none font-bold text-gray-800 focus:ring-0">
                   <option>Relevance</option>
                   <option>Price: Low to High</option>
                   <option>Popularity</option>
                </select>
             </div>
          </div>

          {/* Product Grid (5-column layout as requested) */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-gray-100 border border-gray-100">
               {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-white aspect-[4/6] animate-pulse" />
               ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-gray-100 border border-gray-100">
              {filteredProducts.map((p) => (
                <DmartProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-40">
               <p className="text-gray-400 font-bold uppercase tracking-widest italic">No products found in this category.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}