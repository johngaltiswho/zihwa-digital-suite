"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { vendureClient } from "@/lib/vendure/client";
import { GET_COLLECTION } from "@/lib/vendure/queries/products";
import { SEARCH_PRODUCTS } from "@/lib/vendure/queries/products";
import type { Collection, SearchResultItem } from "@/lib/vendure/types";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Grid, Loader2 } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch collection details
        const collectionData = await vendureClient.request(GET_COLLECTION, { slug });

        if (!collectionData.collection) {
          setError("Collection not found");
          setLoading(false);
          return;
        }

        setCollection(collectionData.collection);

        // Fetch products in this collection
        const productsData = await vendureClient.request(SEARCH_PRODUCTS, {
          input: {
            collectionSlug: slug,
            take: 50,
            groupByProduct: true,
          },
        });

        setProducts(productsData.search.items);
      } catch (err: any) {
        console.error("Failed to fetch collection:", err);
        setError("Failed to load collection. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#8B2323] mx-auto mb-4" />
          <p className="text-gray-600">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || "Collection not found"}</p>
          <Link
            href="/"
            className="inline-block bg-[#8B2323] text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      {collection.breadcrumbs && collection.breadcrumbs.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-600 hover:text-[#8B2323] transition-colors">
                Home
              </Link>
              {collection.breadcrumbs.map((crumb, index) => (
                <div key={crumb.id} className="flex items-center gap-2">
                  <ChevronRight size={16} className="text-gray-400" />
                  <Link
                    href={`/collection/${crumb.slug}`}
                    className={`hover:text-[#8B2323] transition-colors ${
                      index === collection.breadcrumbs!.length - 1
                        ? "text-[#8B2323] font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {crumb.name}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Collection Hero */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Collection Image */}
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-gray-100">
              {collection.featuredAsset ? (
                <Image
                  src={collection.featuredAsset.source || collection.featuredAsset.preview}
                  alt={collection.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Grid size={64} className="text-gray-300" />
                </div>
              )}
            </div>

            {/* Collection Info */}
            <div>
              <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="text-gray-700 text-lg leading-relaxed">
                  {collection.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Child Collections (if any) */}
      {collection.children && collection.children.length > 0 && (
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-6">
              Browse By Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {collection.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/collection/${child.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-40 bg-gray-100">
                    {child.featuredAsset ? (
                      <Image
                        src={child.featuredAsset.preview}
                        alt={child.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Grid size={32} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 group-hover:text-[#8B2323] transition-colors">
                      {child.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-6">
            Products {products.length > 0 && `(${products.length})`}
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl">
              <p className="text-gray-600 text-lg mb-4">No products found in this collection yet.</p>
              <Link
                href="/"
                className="inline-block bg-[#8B2323] text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </div>
  );
}
