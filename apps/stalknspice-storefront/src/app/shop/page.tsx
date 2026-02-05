"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; // For navigation to details
import { Zap, ChevronDown, LucideLoader2 } from "lucide-react";
import { vendureClient } from "@/lib/vendure/client";
import { GET_PRODUCTS } from "@/lib/vendure/queries/products";
import type { Product } from "@/lib/vendure/types";

// 1. New Mutation for Cart Functionality
const ADD_ITEM_TO_ORDER = `
  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      ... on Order {
        id
        totalQuantity
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

// Query for Categories
const GET_COLLECTIONS = `query { collections { items { id name slug featuredAsset { preview } } } }`;

function DmartProductCard({ product }: { product: Product }) {
  const [selectedVariantId] = useState(product.variants[0]?.id);
  const [adding, setAdding] = useState(false);
  
  const currentVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const rawStock = currentVariant?.stockLevel;
  const isOutOfStock = rawStock === 'OUT_OF_STOCK' || rawStock === 0 || rawStock === '0';
  
  const price = (currentVariant?.price || 0) / 100;
  const mrp = price * 1.2; 
  const savings = mrp - price;

  // 2. Add to Cart Logic
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to details when clicking ADD
    if (!selectedVariantId || adding) return;

    setAdding(true);
    try {
      const result = await vendureClient.request(ADD_ITEM_TO_ORDER, {
        productVariantId: selectedVariantId,
        quantity: 1,
      });
      
      if (result.addItemToOrder.errorCode) {
        alert(`Error: ${result.addItemToOrder.message}`);
      } else {
        // Success! You might want to update a global cart state here
        console.log("Added to cart:", result.addItemToOrder);
      }
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 p-3 flex flex-col hover:shadow-md transition-shadow relative group">
      {/* 3. Wrap Image & Info in Link for Detail Page Functionality */}
      <Link href={`/product/${product.slug}`} className="flex-grow flex flex-col group/link">
        <div className="relative aspect-square mb-2 bg-white flex items-center justify-center">
          <div className="absolute top-0 right-0 border border-green-600 p-[1px] w-3 h-3 flex items-center justify-center z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
          </div>

          <Image
            src={currentVariant?.featuredAsset?.preview || product.featuredAsset?.preview || "/images/placeholder.jpg"}
            alt={product.name}
            fill
            className={`object-contain p-2 transition-transform group-hover/link:scale-105 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
          />
          
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-20">
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded italic">Out Of Stock</span>
            </div>
          )}
        </div>

        <h3 className="text-[13px] font-medium text-gray-700 leading-tight line-clamp-2 h-8 mb-1 group-hover/link:text-green-600">
          {product.name}
        </h3>
        <p className="text-[12px] text-gray-500 mb-2">
          {currentVariant?.name.includes('-') ? currentVariant.name.split('-').pop() : '1 unit'}
        </p>
      </Link>

      {/* Pricing and Action Button */}
      <div className="mt-auto pt-2 border-t border-gray-50">
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-gray-400">MRP <span className="line-through">₹{mrp.toFixed(0)}</span></span>
          <span className="font-bold text-gray-800">Our Price <span className="text-sm">₹{price.toFixed(0)}</span></span>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="bg-green-50 text-green-700 text-[10px] font-bold px-1.5 py-0.5 border border-green-100">
             ₹{savings.toFixed(0)} OFF
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className={`px-4 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-1
            ${isOutOfStock 
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
              : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
            }`}
          >
            {adding ? <LucideLoader2 size={12} className="animate-spin" /> : null}
            {isOutOfStock ? 'SOLD' : adding ? '...' : 'ADD'}
          </button>
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
      <div className="bg-[#f3f4f6] px-6 py-2 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
           <Link href="/">Home</Link>
           <span>/</span>
           <span className="text-black font-bold">{activeCategoryName}</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border text-[10px] font-bold text-green-600">
           <Zap size={12} fill="currentColor" /> FAST DELIVERY AVAILABLE
        </div>
      </div>

      <div className="flex max-w-[1600px] mx-auto">
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

        <section className="flex-1 bg-white p-4 md:p-6">
          <div className="flex items-end gap-3 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 leading-none">{activeCategoryName}</h1>
            <span className="text-sm text-gray-400 font-medium">{filteredProducts.length} items</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-gray-100 pb-4">
            {['Brand', 'Pack Size', 'Price', 'Discount', 'Type'].map((filter) => (
              <button key={filter} className="px-4 py-1.5 border border-gray-300 rounded-full text-[12px] font-medium text-gray-600 flex items-center gap-2 hover:border-green-600 transition-colors">
                  {filter} <ChevronDown size={14} />
              </button>
            ))}
          </div>

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
        </section>
      </div>
    </main>
  );
}