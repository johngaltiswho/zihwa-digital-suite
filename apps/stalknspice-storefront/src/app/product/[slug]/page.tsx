"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ShoppingCart, 
  Star, Plus, Minus, 
  PartyPopper, X,
  AlertCircle
} from "lucide-react";
import { vendureClient } from "@/lib/vendure/client";
import { GET_PRODUCT_BY_SLUG, GET_PRODUCTS } from "@/lib/vendure/queries/products";
import { useCart } from "@/lib/vendure/cart-context";
import type { Product, ProductVariant } from "@/lib/vendure/types";
import Newsletter from "../../../components/NewsLetter";

export default function CreativeProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImg, setActiveImg] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pData, rData] = await Promise.all([
          vendureClient.request(GET_PRODUCT_BY_SLUG, { slug }),
          vendureClient.request(GET_PRODUCTS, { options: { take: 10 } })
        ]);
        if (pData.product) {
          setProduct(pData.product);
          setSelectedVariant(pData.product.variants?.[0] || null);
          setActiveImg(pData.product.featuredAsset?.preview || "/images/placeholder.jpg");
        }
        if (rData.products?.items) {
          setRecommendations(rData.products.items.filter((p: any) => p.slug !== slug).slice(0, 6));
        }
      } finally { setLoading(false); }
    };
    if (slug) fetchData();
  }, [slug]);

  useEffect(() => {
    if (selectedVariant?.featuredAsset?.preview) {
      setActiveImg(selectedVariant.featuredAsset.preview);
    } else if (product?.featuredAsset?.preview) {
      setActiveImg(product.featuredAsset.preview);
    }
    setQuantity(1);
  }, [selectedVariant, product]);

  const handleAddToCart = async () => {
    if (selectedVariant) {
      try {
        await addToCart(selectedVariant.id, quantity); 
        setShowAddedMessage(true);
        setTimeout(() => setShowAddedMessage(false), 4000);
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        alert("Could not add to cart. Please check your connection or stock.");
      }
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#fdfcfb] font-serif italic text-[#8B2323]">StalknSpice...</div>;
  if (!product) return <div className="p-20 text-center">Not found.</div>;

  const price = (selectedVariant?.priceWithTax || 0) / 100;
  
  // --- UPDATED SMART STOCK LOGIC ---
  const rawStock = selectedVariant?.stockLevel;
  
  // Detect status
  const isOutOfStock = rawStock === 'OUT_OF_STOCK' || rawStock === 0 || rawStock === '0';
  const isLowStock = rawStock === 'LOW_STOCK' || (typeof rawStock === 'number' && rawStock > 0 && rawStock <= 10);

  // Generate Display Text
  const stockDisplayText = isOutOfStock 
    ? "Sold Out" 
    : isLowStock 
      ? (typeof rawStock === 'number' ? `Only ${rawStock} left!` : "Limited Stock Available")
      : (typeof rawStock === 'number' ? `${rawStock} items available` : "In Stock");

  // Determine progress bar percentage
  const progressPercent = isOutOfStock 
    ? 0 
    : typeof rawStock === 'number' 
      ? Math.min((rawStock / 50) * 100, 100) 
      : isLowStock ? 30 : 100;

  return (
    <main className="bg-[#F8F7F4] min-h-screen py-4 px-4 md:px-10 relative">
      
      {/* --- SUCCESS TOAST --- */}
      <AnimatePresence>
        {showAddedMessage && (
          <motion.div initial={{ opacity: 0, y: -50, x: "-50%", scale: 0.9 }} animate={{ opacity: 1, y: 20, x: "-50%", scale: 1 }} exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.9 }} className="fixed top-10 left-1/2 z-[500] w-[90%] max-w-md bg-white border-2 border-green-100 shadow-2xl rounded-3xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-200"><PartyPopper size={24} /></div>
            <div className="flex-1">
                <h4 className="font-black text-gray-900 text-sm uppercase tracking-tighter">Yay! Successfully Added</h4>
                <p className="text-gray-500 text-[11px] italic font-medium leading-tight">Great choice! {quantity}x {product.name} is now in your basket.</p>
            </div>
            <button onClick={() => setShowAddedMessage(false)} className="p-2 text-gray-300 hover:text-gray-900 transition-colors"><X size={20} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1300px] mx-auto flex justify-between items-center mb-4">
        <Link href="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-gray-400 hover:text-[#8B2323] transition-colors"><ArrowLeft size={18} /> Back to Store</Link>
        <div className="flex gap-2 items-center">
            <span className={`h-2 w-2 rounded-full animate-pulse ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}></span>
            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{isOutOfStock ? 'Out of Stock' : 'In Stock: Bangalore Delivery'}</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto bg-white rounded-[20px] shadow-2xl shadow-gray-200/30 overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
        
        {/* GALLERY */}
        <div className="lg:w-1/2 bg-[#FCFAF7] p-6 md:p-14 relative flex flex-col items-center justify-center border-r border-gray-50">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full aspect-square flex items-center justify-center">
            <Image src={activeImg} alt={product.name} fill className="object-contain p-4" priority />
          </motion.div>
          <div className="flex justify-center gap-3 mt-1">
            {product.assets?.map((a) => (
              <button key={a.id} onClick={() => setActiveImg(a.preview)} className={`w-16 h-16 rounded-2xl border-2 transition-all p-1 bg-white shadow-sm overflow-hidden ${activeImg === a.preview ? "border-[#8B2323] scale-110" : "border-transparent opacity-40"}`}>
                <div className="relative w-full h-full"><Image src={a.preview} alt="thumb" fill className="object-contain" /></div>
              </button>
            ))}
          </div>
        </div>

        {/* INFO PANEL */}
        <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[9px] font-black bg-[#8B2323] text-white px-3 py-1 rounded-full tracking-[0.1em] uppercase">Premium Pick</span>
              <div className="flex text-amber-400"><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/></div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-2 uppercase tracking-tighter">{product.name}</h1>
            <p className="text-gray-400 text-[8px] font-bold mb-10 italic uppercase tracking-[0.3em]">Sourced from Artisanal Growers</p>

            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-4xl font-black text-gray-900">₹{price.toFixed(0)}</span>
              <span className="text-xs text-gray-300 font-bold uppercase tracking-widest">/ Per Unit</span>
            </div>

            {/* --- SMART STOCK INDICATOR --- */}
            <div className="mb-8">
               <div className="flex items-center justify-between mb-2">
                 <p className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-orange-500' : 'text-green-600'}`}>
                    {isOutOfStock ? <X size={12}/> : isLowStock ? <AlertCircle size={12}/> : null}
                    {stockDisplayText}
                 </p>
               </div>
               {!isOutOfStock && (
                 <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${progressPercent}%` }} 
                      className={`h-full transition-colors ${isLowStock ? 'bg-orange-500' : 'bg-green-500'}`}
                    />
                 </div>
               )}
            </div>

            {product.variants.length > 1 && (
              <div className="mb-10">
                <span className="text-[10px] font-black text-gray-400 uppercase block mb-4 tracking-widest italic">Choose Option</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button key={v.id} onClick={() => setSelectedVariant(v)} className={`px-6 py-3 rounded-2xl text-[11px] font-bold transition-all border ${selectedVariant?.id === v.id ? "bg-black border-black text-white shadow-xl scale-105" : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"}`}>
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CART ACTION */}
            <div className="flex gap-4 mb-12">
              <div className="flex items-center bg-gray-50 rounded-2xl px-5 py-2 border border-gray-100">
                <button disabled={isOutOfStock || quantity <= 1} onClick={() => setQuantity(q => q - 1)} className="text-gray-300 hover:text-black transition-colors disabled:opacity-20"><Minus size={16}/></button>
                <span className="px-6 font-black text-lg">{quantity}</span>
                 {/* Capped if rawStock is a number */}
                <button disabled={isOutOfStock || (typeof rawStock === 'number' && quantity >= rawStock)} onClick={() => setQuantity(q => q + 1)} className="text-gray-300 hover:text-black transition-colors disabled:opacity-20"><Plus size={16}/></button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-grow rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 
                  ${isOutOfStock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#8B2323] text-white hover:bg-black"}`}
              >
                <ShoppingCart size={16}/> {isOutOfStock ? "Out of Stock" : "Add to Basket"}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-50 pt-10">
            <div className="flex gap-8 mb-6">
              <button onClick={() => setActiveTab("description")} className={`text-[10px] font-black uppercase tracking-widest pb-3 transition-all ${activeTab === 'description' ? "text-black border-b-2 border-black" : "text-gray-300"}`}>Details</button>
              <button onClick={() => setActiveTab("shipping")} className={`text-[10px] font-black uppercase tracking-widest pb-3 transition-all ${activeTab === 'shipping' ? "text-black border-b-2 border-black" : "text-gray-300"}`}>Delivery</button>
            </div>
            <div className="min-h-[120px] text-sm text-gray-500 leading-relaxed italic font-medium">
                {activeTab === 'description' ? <div dangerouslySetInnerHTML={{ __html: product.description }} /> : <p>Priority 45-90 min delivery in Bangalore. Zero plastic packaging.</p>}
            </div>
          </div>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <div className="max-w-[1300px] mx-auto mt-10 px-6">
          <div className="flex justify-between items-end mb-8">
              <h3 className="text-3xl font-serif italic text-gray-900">Recommended Products</h3>
              <Link href="/products" className="text-xs font-black text-gray-900 border-b-2 border-black pb-1 hover:text-[#8B2323] uppercase tracking-widest">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recommendations.map((item) => (
                  <div key={item.id} className="group bg-white p-6 rounded-[10px] border border-gray-50 hover:shadow-2xl transition-all">
                    <Link href={`/product/${item.slug}`}>
                      <div className="relative aspect-square w-full mb-6"><Image src={item.featuredAsset?.preview || "/placeholder.jpg"} alt={item.name} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" /></div>
                      <h4 className="font-bold text-center text-[11px] uppercase tracking-tight truncate">{item.name}</h4>
                      <p className="text-center text-[#8B2323] font-black text-[10px] mt-2 tracking-widest">₹{(item.variants?.[0]?.price || 0) / 100}</p>
                    </Link>
                    <button onClick={() => addToCart(item.variants?.[0]?.id || '', 1)} className="w-full mt-4 py-2 text-[11px] font-black rounded-[10px] bg-gray-50 text-gray-800 hover:bg-[#8B2323] hover:text-white transition-colors uppercase tracking-tight border border-gray-200">Add to Cart</button>
                  </div>
              ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link href="/" className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-900 rounded-2xl text-xs font-black uppercase tracking-[0.1em] text-gray-900 hover:bg-gray-900 hover:text-white transition-all shadow-lg"><ArrowLeft size={18} /> Back to Home</Link>
          </div>
      </div>

      <div className="max-w-[1300px] mx-auto py-6 px-2"><Newsletter /></div>
    </main>
  );
}