'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/vendure/cart-context';
import type { Product } from '@/lib/vendure/types';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { addToCart, isLoading } = useCart();
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  // Track selected variant for each product
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const handleAddToCart = async (productVariantId: string) => {
    setAddingProductId(productVariantId);
    try {
      await addToCart(productVariantId, 1);
      // Show success feedback (you can add a toast notification here)
      console.log('Added to cart successfully!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingProductId(null);
    }
  };

  const handleVariantChange = (productId: string, variantId: string) => {
    setSelectedVariants(prev => ({ ...prev, [productId]: variantId }));
  };

  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price / 100);
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => {
          // Get selected variant or default to first variant
          const selectedVariantId = selectedVariants[product.id] || product.variants[0]?.id;
          const variant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];
          if (!variant) return null;

          const isInStock = variant.stockLevel !== 'OUT_OF_STOCK';
          const imageUrl = product.featuredAsset?.preview || '/images/placeholder-product.png';
          const isAdding = addingProductId === variant.id;
          const hasMultipleVariants = product.variants.length > 1;

          return (
            <div key={product.id} className="sns-card-gradient group relative overflow-hidden">
              {/* Product Badge */}
              {!isInStock && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 to-red-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold sns-text-primary group-hover:text-orange-600 transition-colors duration-300 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm sns-text-secondary font-medium">{variant.name}</p>
                  </div>
                </div>

                {/* Variant Selector - Only show if multiple variants */}
                {hasMultipleVariants && (
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Select Size/Variant:
                    </label>
                    <select
                      value={variant.id}
                      onChange={(e) => handleVariantChange(product.id, e.target.value)}
                      className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg text-sm font-medium focus:outline-none focus:border-orange-500 transition-colors"
                    >
                      {product.variants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} - {formatPrice(v.priceWithTax, v.currencyCode)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* SKU */}
                <p className="text-xs text-gray-500 mb-4">SKU: {variant.sku}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(variant.priceWithTax, variant.currencyCode)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleAddToCart(variant.id)}
                    disabled={!isInStock || isAdding || isLoading}
                    className={`w-full py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                      isInStock && !isAdding
                        ? 'sns-button-primary hover:scale-105 hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isAdding ? '⏳ Adding...' : isInStock ? '🛒 Add to Cart' : '❌ Out of Stock'}
                  </button>
                  <Link
                    href={`/product/${product.slug}`}
                    className="block w-full py-3 px-6 border-2 border-orange-200 text-orange-600 font-bold text-center rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all duration-300"
                  >
                    👁️ View Details
                  </Link>
                </div>

                {/* Stock Status */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-orange-100">
                  <span className={`text-xs font-medium uppercase tracking-wide ${
                    isInStock ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isInStock ? '✓ In Stock' : '✗ Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Products */}
      <div className="text-center mt-16">
        <Link
          href="/shop"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
        >
          <span className="text-xl">🌶️</span>
          Discover All Products
          <span className="text-xl">→</span>
        </Link>
      </div>
    </div>
  );
}