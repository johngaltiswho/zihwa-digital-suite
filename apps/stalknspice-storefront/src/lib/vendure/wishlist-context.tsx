"use client";
import { supabase } from "@/lib/vendure/supabase";
import { createContext, useContext, useEffect, useState, useCallback, useRef,ReactNode } from "react";
import type { Product } from "@/lib/vendure/types";
import { useAuth } from "@/lib/vendure/auth-context";

const WISHLIST_KEY = "sns_wishlist";

export interface WishlistItem {
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  variantName: string;
  stockLevel: string | number;
}

interface WishlistContextType {
  items: WishlistItem[];
  count: number;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (product: Product, variantId?: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product, variantId?: string) => void;
  clearWishlist: () => void;
}
const LS_KEY = "sns_wishlist";
const WishlistContext = createContext<WishlistContextType | null>(null);

// localStorage helpers
// ─────────────────────────────────────────────
function readLocal(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeLocal(items: WishlistItem[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch { /* ignore */ }
}

function clearLocal() {
  try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
}

// ─────────────────────────────────────────────
// Supabase row <-> WishlistItem converters
// ─────────────────────────────────────────────
function rowToItem(row: any): WishlistItem {
  return {
    productId:   row.product_id,
    variantId:   row.variant_id,
    name:        row.product_name,
    slug:        row.product_slug,
    price:       row.price,
    image:       row.image ?? "",
    variantName: row.variant_name ?? "",
    stockLevel:  row.stock_level ?? "IN_STOCK",
  };
}

function itemToRow(
  item: WishlistItem,
  customerId: string,
  customerEmail: string
) {
  return {
    customer_id:    customerId,
    customer_email: customerEmail,
    product_id:     item.productId,
    variant_id:     item.variantId,
    product_name:   item.name,
    product_slug:   item.slug,
    price:          item.price,
    image:          item.image,
    variant_name:   item.variantName,
    stock_level:    String(item.stockLevel),
  };
}

// ─────────────────────────────────────────────
// Build WishlistItem from a Product
// ─────────────────────────────────────────────
function buildItem(product: Product, variantId?: string): WishlistItem | null {
  const variant = variantId
    ? product.variants.find((v) => v.id === variantId)
    : product.variants[0];
  if (!variant) return null;

  return {
    productId:   product.id,
    variantId:   variant.id,
    name:        product.name,
    slug:        product.slug,
    price:       (variant.price || 0) / 100,
    image:       variant.featuredAsset?.preview || product.featuredAsset?.preview || "",
    variantName: variant.name,
    stockLevel:  variant.stockLevel ?? "IN_STOCK",
  };
}
export function WishlistProvider({ children }: { children: ReactNode }) {
  const { customer } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const prevCustomerRef           = useRef<typeof customer | undefined>(undefined);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);
   useEffect(() => {
    const prev = prevCustomerRef.current;
    prevCustomerRef.current = customer;

    if (customer) {
      if (!prev) {
        // Just logged in → merge localStorage → Supabase then load
        mergeAndLoad(customer.id, customer.emailAddress);
      } else {
        // Page refresh while already logged in → load from Supabase
        loadFromSupabase(customer.id);
      }
    } else {
      // Logged out → load from localStorage
      setItems(readLocal());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  // ── Load from Supabase ───────────────────────────────────────────
  const loadFromSupabase = useCallback(async (customerId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("wishlists")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems((data ?? []).map(rowToItem));
    } catch (err) {
      console.error("[Wishlist] load error:", JSON.stringify(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Merge localStorage → Supabase on login ───────────────────────
  const mergeAndLoad = useCallback(async (
    customerId: string,
    customerEmail: string
  ) => {
    setIsLoading(true);
    try {
      const localItems = readLocal();

      if (localItems.length > 0) {
        const rows = localItems.map((item) =>
          itemToRow(item, customerId, customerEmail)
        );
        const { error } = await supabase
          .from("wishlists")
          .upsert(rows, {
            onConflict: "customer_id,product_id",
            ignoreDuplicates: true,
          });

        if (error) throw error;
        clearLocal();
      }

      await loadFromSupabase(customerId);
    } catch (err) {
      console.error("[Wishlist] merge error:", err);
      await loadFromSupabase(customerId);
    } finally {
      setIsLoading(false);
    }
  }, [loadFromSupabase]);

  const isInWishlist = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items]
  );

  // ── addToWishlist ────────────────────────────────────────────────
  const addToWishlist = useCallback(async (
    product: Product,
    variantId?: string
  ) => {
    const item = buildItem(product, variantId);
    if (!item || isInWishlist(product.id)) return;

    // Optimistic UI update
    setItems((prev) => [...prev, item]);

    if (customer) {
      const { error } = await supabase
        .from("wishlists")
        .insert(itemToRow(item, customer.id, customer.emailAddress));

      if (error) {
        console.error("[Wishlist] insert error:", error);
        // Rollback on failure
        setItems((prev) => prev.filter((i) => i.productId !== product.id));
      }
    } else {
      writeLocal([...readLocal(), item]);
    }
  }, [customer, isInWishlist]);
  // ── removeFromWishlist ───────────────────────────────────────────
  const removeFromWishlist = useCallback(async (productId: string) => {
    // Optimistic UI update
    setItems((prev) => prev.filter((i) => i.productId !== productId));

    if (customer) {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("customer_id", customer.id)
        .eq("product_id", productId);

      if (error) {
        console.error("[Wishlist] delete error:", error);
        loadFromSupabase(customer.id);
      }
    } else {
      writeLocal(readLocal().filter((i) => i.productId !== productId));
    }
  }, [customer, loadFromSupabase]);

  const toggleWishlist = useCallback(
    (product: Product, variantId?: string) => {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product, variantId);
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  );

  const clearWishlist = useCallback(() => setItems([]), []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        count: items.length,
        isLoading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}