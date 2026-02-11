"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Timer, Loader2, ChevronDown, ChevronRight, Package, ShieldCheck, LayoutGrid } from "lucide-react";
import { GraphQLClient, gql } from "graphql-request";
import ProductGrid from "@/components/ProductGrid";

const GET_COLLECTION = gql`
  query GetCollection($slug: String!) {
    collection(slug: $slug) {
      id
      name
      slug
      productVariants(options: { take: 100 }) {
        items {
          id
          name
          priceWithTax
          currencyCode
          featuredAsset { preview }
          product {
            id
            name
            slug
            featuredAsset { preview }
          }
        }
      }
    }
  }
`;

const CATEGORY_MAP: any = {
  "BAKERY, SNACKS & DRY FRUITS": {
    slug: "bakery-snacks-dry-fruits",
    products: ["Baking & Custard Powder", "Chocolate & Caramel Sauces", "Dry Yeast & Bread Improver", "Tutti Fruiti & Agar Agar", "Bread Crumbs", "Cocoa Powder & Hot Chocolate", "Essence", "Choco Chips & Compound", "Dry Fruits", "Marmalades & Jams"],
    brands: ["2M COCOA", "BUSH", "BARRY CALLEBAUT", "HERSHEY'S", "BAKERS", "MALA'S"],
  },
  "BREAKFAST, DAIRY & FROZEN FOOD": {
    slug: "breakfast-dairy-frozen-food",
    products: ["Almond, Coconut & Soy Milk", "Caffeine", "Desert Syrups & Sauces", "Frozen Fast Food", "Beans, Corn & Peas", "Cereals", "Ghee & Condensed Milk", "Spreads", "Butter, Cheese & Paneer", "Cooking Cream"],
    brands: ["ABBIE'S", "CHAYAM", "MCCAIN", "SOFIT", "AMERICAN GARDEN", "DAIRY CRAFT", "NUTELLA", "AMUL", "HERSHEY'S", "RICH"],
  },
  "CANNED FOODS": {
    slug: "canned-foods",
    products: ["Artichokes & Asparagus", "Cherry, Litchi & Pears", "Gherkins & Jalapeno", "Olives & Capers", "Paste", "Thai Cooking Paste", "Bamboo Shoots", "Coconut Products", "Mango & Pineapple", "Soups & Stews", "Water Chestnuts"],
    brands: ["FRESHO'S", "LEE KUM KEE", "NAMJAI", "WOH HUP", "GOLDEN CROWN", "NANI KI BARNI", "REAL THAI", "HABIT", "TOPPS", "MY FAVOURITE"],
  },
  "FRUITS & VEGETABLES": {
    slug: "fruits-vegetables",
    products: ["Beans & Brinjals", "Potato, Onion & Tomato", "Cucumber, Capsicum & Okra", "Root Vegetables", "Gourd, Pumpkin & Drumstick", "Herbs & Seasoning", "Kiwi, Melon & Citrus Fruit", "Apples & Pomegranate", "Banana, Sapota & Papaya"],
    brands: ["APPLES & POMEGRANATE", "BANANA, SAPOTA & PAPAYA","KIWI, MELON & CITRUS FRUIT","COCONUT",""],
  },
  "HEALTH STORE": {
    slug: "health-store",
    products: ["Apple Cider Vinegar", "Milk Alternatives", "Tofu", "Cereal", "Organic Foods", "Specialty Tea's", "Juices", "Quinoa"],
    brands: ["CHAYAM", "SOFIT"],
  },
  "HERBS, SPICES & PROVISIONS": {
    slug: "herbs-spices-provisions",
    products: ["Aromatic, Demi Glace & Chicken Powder", "Cooking Paste", "Food Colour", "Herbs & Seasonings", "Sprinklers", "Wasabi", "Blended Masalas", "Dals & Pulses", "Grains & Flour", "Whole Spices", "Marinades", "Salt & Pepper", "Sugar"],
    brands: ["AACHI", "MAGGI", "NAMJAI", "BUSH", "KEYA", "MDH", "KNORR", "TRUST SUGARS"],
  },
  "BEVERAGES": {
    products: ["Aromatic Bitters", "Energy & Soft Drinks", "Syrup", "Water", "Crushes", "Juices", "Tea", "Puree", "Coffee", "Squashes", "Toppings"],
    brands: ["COCA COLA", "MANAMA", "DABUR REAL", "MY FAVOURITE", "MALA'S", "MONIN"],
    promoTitle: "HEALTHY FRUIT JUICES"
  },
  "RICE, PASTA & NOODLES": {
    products: ["Arborio & Carnaroli Rice", "Indian Rice", "Penne & Macaroni", "Rice Paper & Nori", "Spring Roll Pastry", "Cup Noodles", "Jasmine Rice", "Quinoa & Cous Cous", "Soba & Udon", "Sticky Rice", "Glass Noodles", "Lasagne", "Pad Thai", "Linguine", "Whole Wheat Pasta"],
    brands: ["BARILLA", "HABIT", "COLAVITA", "NONGSHIM", "DAAWAT", "REAL THAI"],
    promoTitle: "PREMIUM PASTA & NOODLES"
  },
  "SAUCES & PASTES": {
    products: ["Barbeque & Mustard", "Chilli Garlic", "Ginger & Garlic Paste", "Mayonaise", "Seasoning Sauce", "Tomato Ketchup", "Hoisin & Plum Sauce", "Chilli in Oil", "HP & XO Sauce", "Pizza & Pasta Sauce", "Soy & Worcestershire", "Vinegar", "Lemon Sauce", "Szechuan & Teriyaki"],
    brands: ["AMERICAN GARDEN", "KIKKOMAN", "REAL THAI", "GOLDEN CROWN", "LEE KUM KEE", "TABASCO", "HEINZ", "MY FAVOURITE", "WOH HUP"],
    promoTitle: "SAUCES FOR ALL MOODS"
  },
  "OILS & GHEE": {
    products: ["Apple Cider & Coconut Vinegar", "Honey", "Mirin & Cooking Sake", "Synthetic Vinegar", "Balsamic & Wine Vinegar", "Keora & Rose Water", "Olive & Almond Oil", "Chinese Cooking Vinegar", "Mustard & Sesame Oil", "Salad & Sunflower Oil"],
    brands: ["ABBIES", "DE NIGRIS", "COLAVITA", "DOUBLE PAGODA", "DABUR", "PIETRO CORICELLI"],
    promoTitle: "PURE OILS & VINEGARS"
  }
};

const vendureShopClient = new GraphQLClient(process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL || "http://localhost:3100/shop-api", {
  headers: { "vendure-token": "stalks-n-spice" },
});

export default function CollectionPage() {
  const params = useParams();
  const router = useRouter();
  const currentSlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [currentCollection, setCurrentCollection] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const slugify = useCallback((text: string) => {
    return text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }, []);

  // Matches Vendure brand slugs: "Brand-Mala's" -> "brand-malas"
  const brandSlugify = useCallback((name: string) => {
    return `brand-${name.toLowerCase().replace(/[^a-z0-9]+/g, "")}`;
  }, []);

  // --- AUTO-EXPAND LOGIC ---
  useEffect(() => {
    if (!currentSlug) return;

    let matchFound = false;
    for (const [parentName, data] of Object.entries(CATEGORY_MAP)) {
      const parentData = data as any;
      
      const isParent = parentData.slug === currentSlug;
      const isProduct = parentData.products.some((p: string) => slugify(p) === currentSlug);
      const isBrand = parentData.brands.some((b: string) => brandSlugify(b) === currentSlug);

      if (isParent || isProduct || isBrand) {
        setExpandedId(parentName);
        matchFound = true;
        break;
      }
    }
  }, [currentSlug, slugify, brandSlugify]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data: any = await vendureShopClient.request(GET_COLLECTION, { slug: currentSlug });
        
        if (data?.collection) {
          setCurrentCollection(data.collection);
          const productsMap = new Map();
          data.collection.productVariants.items.forEach((v: any) => {
            const p = v.product || { ...v, id: `v-${v.id}` };
            if (!productsMap.has(p.id)) productsMap.set(p.id, { ...p, variants: [v] });
          });
          setProducts(Array.from(productsMap.values()));
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (currentSlug) fetchData();
  }, [currentSlug]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#8B2323]" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Marketplace Top Bar */}
      <div className="sticky top-0 z-40 bg-white border-b px-4 py-1 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-5">
          <button onClick={() => router.push('/')} className="hover:bg-gray-100 p-2.5 rounded-full border border-gray-200 transition-all">
            <ChevronLeft size={14} className="text-gray-900" />
          </button>
          <div>
            <h1 className="text-medium font-black uppercase text-[#8B2323] tracking-tighter">MARKET PLACE</h1>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em]">{products.length} GOURMET ITEMS</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-[#FEF2F2] px-5 py-2.5 rounded-full border border-red-100">
          <Timer size={16} className="text-[#8B2323]" />
          <span className="text-xs font-black text-[#8B2323] uppercase tracking-tight">EXPRESS DELIVERY</span>
        </div>
      </div>

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside className="w-80 border-r bg-[#fafafa] sticky top-[81px] h-[calc(100vh-81px)] overflow-y-auto scrollbar-hide">
          <div className="p-5 border-b bg-white flex items-center gap-2">
            <LayoutGrid size={18} className="text-gray-900" />
            <h3 className="text-medium font-black uppercase tracking-[0.1em] text-gray-900 leading-none ">CATEGORIES</h3>
          </div>

          {Object.keys(CATEGORY_MAP).map((catName) => {
            const data = CATEGORY_MAP[catName];
            const isExpanded = expandedId === catName;
            const isParentActive = data.slug === currentSlug;

            return (
              <div key={catName} className="border-b border-gray-100 bg-white">
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : catName)}
                  className={`flex items-center justify-between p-4 cursor-pointer relative transition-all ${isExpanded ? "bg-gray-50/50" : "hover:bg-gray-50"}`}
                >
                  {(isExpanded || isParentActive) && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#8B2323] z-10" />
                  )}
                  
                  <span className={`text-[13px] font-black uppercase tracking-tight leading-tight pr-4 flex-1 ${isExpanded || isParentActive ? "text-[#8B2323]" : "text-gray-600"}`}>
                    {catName}
                  </span>
                  <ChevronDown size={18} className={`transition-transform duration-300 flex-shrink-0 ${isExpanded ? "rotate-180 text-[#8B2323]" : "text-gray-300"}`} />
                </div>

                {isExpanded && (
                  <div className="px-3 py-4 space-y-6 bg-white border-t border-gray-50">
                    {/* Products Links */}
                    <div>
                      <div className="flex items-center gap-2 mb-2 border-b border-gray-50 pb-1">
                        <Package size={14} className="text-[#8B2323]" />
                        <span className="text-[12px] font-black uppercase tracking-widest text-gray-900">Products</span>
                      </div>
                      <div className="space-y-1">
                        {data.products.map((p: string) => {
                          const pSlug = slugify(p);
                          const isActive = currentSlug === pSlug;
                          return (
                            <Link 
                              key={p} 
                              href={`/collection/${pSlug}`} 
                              className={`block text-[13px] font-bold py-2 px-3 rounded-md transition-all ${isActive ? "text-[#8B2323] bg-red-50 border-l-2 border-[#8B2323]" : "text-gray-500 hover:text-[#8B2323] hover:bg-gray-50"}`}
                            >
                              {p}
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Functional Brand Links */}
                    <div>
                      <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-2">
                        <ShieldCheck size={14} className="text-amber-600" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">FEATURED BRANDS</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {data.brands.map((b: string) => {
                          const bSlug = brandSlugify(b);
                          const isActive = currentSlug === bSlug;
                          return (
                            <Link 
                              key={b} 
                              href={`/collection/${bSlug}`} 
                              className={`text-[10px] font-black px-3 py-1.5 rounded transition-all shadow-sm border ${
                                isActive 
                                ? "bg-[#8B2323] text-white border-[#8B2323]" 
                                : "bg-white text-gray-700 border-gray-200 hover:border-[#8B2323] hover:text-[#8B2323]"
                              }`}
                            >
                              {b}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 bg-white">
          <div className="mb-6">
            <h2 className="text-3xl font-black text-gray-900 uppercase leading-[0.9] tracking-tighter mb-4">
              {currentCollection?.name || "OUR CATALOG"}
            </h2>

            <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
              <Link href="/" className="hover:text-[#8B2323]">Home</Link>
              <ChevronRight size={14} />
              <span className="text-[#8B2323] uppercase text-xs">{currentCollection?.name || "Catalog"}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="mt-10 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-50 rounded-3xl p-24">
                <Package size={64} className="mb-4 opacity-10" />
                <p className="text-xl font-bold uppercase tracking-widest text-gray-300">No products found here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}