'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/vendure/cart-context';
import type { Product } from '@/lib/vendure/types';
import { Plus, ShoppingBasket } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products = [] }: ProductGridProps) {
  const { addToCart, isLoading } = useCart();
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const handleAddToCart = async (productVariantId: string) => {
    setAddingProductId(productVariantId);
    try {
      await addToCart(productVariantId, 1);
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(price / 100);
  };

  const validProducts = products?.filter(p => p && p.variants && p.variants.length > 0) || [];

  if (validProducts.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <ShoppingBasket className="mx-auto w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {validProducts.map((product) => {
        const defaultVariant = product.variants?.[0];
        const selectedVariantId = selectedVariants[product.id] || defaultVariant?.id;
        const variant = product.variants?.find(v => v.id === selectedVariantId) || defaultVariant;
        
        if (!variant) return null;

        const isInStock = variant.stockLevel !== 'OUT_OF_STOCK';
        const imageUrl = product.featuredAsset?.preview || '/images/placeholder-product.png';
        const isAdding = addingProductId === variant.id;
        const hasMultipleVariants = product.variants?.length > 1;

        return (
          <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col hover:shadow-lg transition-all duration-300 group">
            {/* Product Image Area */}
            <Link href={`/product/${product.slug}`} className="relative aspect-square mb-3 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-2">
              <Image
                src={imageUrl}
                alt={product.name || 'Product'}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              
              {!isInStock && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                  <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter">
                    Out of Stock
                  </span>
                </div>
              )}
            </Link>

            {/* Title & Weight Info */}
            <div className="flex-1 px-1">
              <h3 className="text-xs md:text-sm font-bold text-gray-800 leading-snug line-clamp-2 min-h-[2.5rem] mb-1">
                {product.name}
              </h3>
              
              {/* Variant / Size Selector */}
              {hasMultipleVariants ? (
                <select
                  value={variant.id}
                  onChange={(e) => handleVariantChange(product.id, e.target.value)}
                  className="w-full text-[10px] font-medium text-gray-500 bg-gray-50 border-none rounded p-1 mb-3 focus:ring-0 cursor-pointer"
                >
                  {product.variants.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              ) : (
                <p className="text-[10px] font-semibold text-gray-400 mb-3">
                  {variant.name || 'Standard Pack'}
                </p>
              )}
            </div>

            {/* Price & Add Action Row */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
              <div className="flex flex-col">
                <span className="text-sm md:text-base font-black text-gray-900">
                  {formatPrice(variant.priceWithTax, variant.currencyCode)}
                </span>
                {/* Optional discount text */}
                <span className="text-[9px] text-gray-400 line-through">
                   {formatPrice(variant.priceWithTax * 1.15, variant.currencyCode)}
                </span>
              </div>

              <button
                onClick={() => handleAddToCart(variant.id)}
                disabled={!isInStock || isAdding || isLoading}
                className={`flex items-center justify-center min-w-[65px] h-8 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all duration-300 border ${
                  isInStock && !isAdding
                    ? 'border-[#8B2323] text-[#8B2323] hover:bg-[#8B2323] hover:text-white shadow-sm'
                    : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isAdding ? (
                  <div className="w-3 h-3 border-2 border-current border-t-transparent animate-spin rounded-full" />
                ) : (
                  <>ADD</>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}