import { useState, useEffect, useCallback, useRef } from 'react';
import { vendureClient } from '@/lib/vendure/client';
import { GET_PRODUCTS_LIGHT, GET_COLLECTION_PAGINATED } from '@/lib/vendure/queries/products';
import type { Product } from '@/lib/vendure/types';

interface UseInfiniteProductsOptions {
  pageSize?: number;
  collectionSlug?: string;
  searchTerm?: string;
  categorySlug?: string;
  cuisineSlug?: string;
  enabled?: boolean;
}

interface UseInfiniteProductsReturn {
  products: Product[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  error: string | null;
  sentinelRef: (node: HTMLDivElement | null) => void;
  totalItems: number;
}

export function useInfiniteProducts(options: UseInfiniteProductsOptions = {}): UseInfiniteProductsReturn {
  const {
    pageSize = 20,
    collectionSlug,
    searchTerm,
    categorySlug,
    cuisineSlug,
    enabled = true,
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef(false);

  // Fetch products
  const fetchProducts = useCallback(
    async (currentOffset: number, append: boolean = false) => {
      if (loadingRef.current || !enabled) return;

      loadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        let newProducts: Product[] = [];
        let total = 0;

        if (searchTerm && searchTerm.trim() !== '') {
          const data = await vendureClient.request(GET_PRODUCTS_LIGHT, {
            options: {
              filter: {
                name: { contains: searchTerm.trim() },
              },
              take: pageSize,
              skip: currentOffset,
            },
          });
          newProducts = data.products.items || [];
          total = data.products.totalItems || 0;
        } else if (collectionSlug) {
          // Fetch products by collection using GET_COLLECTION_PAGINATED
          const data = await vendureClient.request(GET_COLLECTION_PAGINATED, {
            slug: collectionSlug,
            options: {
              take: pageSize,
              skip: currentOffset,
            },
          });

          // Extract unique products from productVariants and preserve all variants per product
          const productMap = new Map<string, Product>();
          (data.collection?.productVariants?.items || []).forEach((pv: any) => {
            if (!pv.product) return;

            const existing = productMap.get(pv.product.id);
            const variant = {
              id: pv.id,
              name: pv.name,
              price: pv.price,
              priceWithTax: pv.priceWithTax,
              stockLevel: pv.stockLevel,
              featuredAsset: pv.featuredAsset,
            };

            if (existing) {
              if (!existing.variants) {
                existing.variants = [];
              }
              const variantExists = existing.variants.some((v: any) => v.id === pv.id);
              if (!variantExists) {
                existing.variants.push(variant as any);
              }
              return;
            }

            const product = {
              ...pv.product,
              variants: [variant],
            } as Product;
            productMap.set(product.id, product);
          });

          newProducts = Array.from(productMap.values());
          total = data.collection?.productVariants?.totalItems || 0;
        } else {
          // Fetch all products using GET_PRODUCTS_LIGHT
          const data = await vendureClient.request(GET_PRODUCTS_LIGHT, {
            options: {
              take: pageSize,
              skip: currentOffset,
            },
          });

          newProducts = data.products.items || [];
          total = data.products.totalItems || 0;
        }

        setProducts(prev => {
          const merged = append ? [...prev, ...newProducts] : newProducts;
          const deduped = new Map<string, Product>();
          for (const product of merged) {
            if (!deduped.has(product.id)) {
              deduped.set(product.id, product);
            }
          }
          return Array.from(deduped.values());
        });
        setTotalItems(total);
        setHasMore(currentOffset + newProducts.length < total);
      } catch (err: any) {
        console.error('Failed to fetch products:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [pageSize, collectionSlug, searchTerm, enabled]
  );

  // Load more products
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    const nextOffset = offset + pageSize;
    setOffset(nextOffset);
    fetchProducts(nextOffset, true);
  }, [loading, hasMore, offset, pageSize, fetchProducts]);

  // IntersectionObserver setup
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Cleanup previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node || !hasMore || loading) return;

      // Create new observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loadingRef.current) {
            loadMore();
          }
        },
        { threshold: 0.1 }
      );

      observerRef.current.observe(node);
    },
    [hasMore, loading, loadMore]
  );

  // Reset and fetch on filter change
  useEffect(() => {
    setOffset(0);
    setProducts([]);
    setHasMore(true);
    fetchProducts(0, false);

    // Scroll to top when filter changes
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Cleanup observer on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [collectionSlug, searchTerm, categorySlug, cuisineSlug]);

  // Initial fetch
  useEffect(() => {
    if (enabled && products.length === 0 && !loading) {
      fetchProducts(0, false);
    }
  }, [enabled]);

  return {
    products,
    loading,
    hasMore,
    loadMore,
    error,
    sentinelRef,
    totalItems,
  };
}
