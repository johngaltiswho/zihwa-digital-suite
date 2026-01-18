"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Package, CheckCircle } from "lucide-react";
import { vendureClient } from "@/lib/vendure/client";
import { GET_PRODUCT_BY_SLUG } from "@/lib/vendure/queries/products";
import { useCart } from "@/lib/vendure/cart-context";
import type { Product, ProductVariant } from "@/lib/vendure/types";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addToCart, isLoading: cartLoading } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await vendureClient.request(GET_PRODUCT_BY_SLUG, { slug });

        if (!data.product) {
          setError("Product not found");
          return;
        }

        setProduct(data.product);
        // Set first variant as default
        if (data.product.variants && data.product.variants.length > 0) {
          setSelectedVariant(data.product.variants[0]);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    setAddingToCart(true);
    try {
      await addToCart(selectedVariant.id, 1);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(price / 100);
  };

  // Loading state
  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <p className="text-gray-600 text-xl">Loading product details...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <section className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <p className="text-red-600 text-xl mb-6">{error || "Product not found"}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#8B2323] text-white font-bold px-6 py-3 rounded-full hover:bg-black transition-all"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const isInStock = selectedVariant?.stockLevel !== "OUT_OF_STOCK";
  const imageUrl = product.featuredAsset?.preview || "/images/placeholder-product.png";

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#8B2323] transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gradient-to-br from-orange-50 to-red-50 rounded-[20px] overflow-hidden relative">
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Additional Images */}
              {product.assets && product.assets.length > 1 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {product.assets.slice(1, 5).map((asset) => (
                    <div
                      key={asset.id}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={asset.preview}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
                {product.name}
              </h1>

              {/* Price */}
              {selectedVariant && (
                <div className="mb-6">
                  <p className="text-4xl font-black text-[#8B2323]">
                    {formatPrice(selectedVariant.priceWithTax, selectedVariant.currencyCode)}
                  </p>
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  {isInStock ? (
                    <>
                      <CheckCircle className="text-green-600" size={20} />
                      <span className="text-green-600 font-bold">In Stock</span>
                    </>
                  ) : (
                    <>
                      <Package className="text-red-600" size={20} />
                      <span className="text-red-600 font-bold">Out of Stock</span>
                    </>
                  )}
                </div>
              </div>

              {/* Variant Selection */}
              {product.variants && product.variants.length > 1 && (
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Select Variant
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 rounded-full font-bold border-2 transition-all ${
                          selectedVariant?.id === variant.id
                            ? "border-[#8B2323] bg-[#8B2323] text-white"
                            : "border-gray-300 text-gray-700 hover:border-[#8B2323]"
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SKU */}
              {selectedVariant && (
                <p className="text-sm text-gray-500 mb-6">SKU: {selectedVariant.sku}</p>
              )}

              {/* Add to Cart Button */}
              <div className="mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock || addingToCart || cartLoading}
                  className={`w-full py-4 px-8 rounded-full font-bold uppercase tracking-wider text-lg flex items-center justify-center gap-3 transition-all ${
                    isInStock && !addingToCart
                      ? "bg-[#8B2323] text-white hover:bg-black shadow-xl shadow-[#8B2323]/20"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart size={20} />
                  {addingToCart ? "Adding to Cart..." : isInStock ? "Add to Cart" : "Out of Stock"}
                </button>

                {/* Success Message */}
                {showSuccessMessage && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-bold text-center flex items-center justify-center gap-2">
                      <CheckCircle size={20} />
                      Added to cart successfully!
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">
                    Description
                  </h2>
                  <div
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}

              {/* Collections/Categories */}
              {product.collections && product.collections.length > 0 && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.collections.map((collection) => (
                      <Link
                        key={collection.id}
                        href={`/collection/${collection.slug}`}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-[#8B2323] hover:text-white transition-colors"
                      >
                        {collection.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
