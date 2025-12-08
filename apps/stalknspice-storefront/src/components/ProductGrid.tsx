'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock product data - will be replaced with Vendure API calls
const mockProducts = [
  {
    id: 1,
    name: 'Premium Saffron',
    price: { regular: 2499, wholesale: 1999 },
    unit: '5g',
    image: '🟡',
    category: 'Spices',
    cuisine: 'Indian',
    inStock: true,
    rating: 4.8,
    reviews: 156
  },
  {
    id: 2,
    name: 'Organic Turmeric Powder',
    price: { regular: 299, wholesale: 249 },
    unit: '250g',
    image: '🟨',
    category: 'Spices',
    cuisine: 'Indian',
    inStock: true,
    rating: 4.6,
    reviews: 89
  },
  {
    id: 3,
    name: 'Italian Extra Virgin Olive Oil',
    price: { regular: 1299, wholesale: 1099 },
    unit: '500ml',
    image: '🫒',
    category: 'Oils',
    cuisine: 'Italian',
    inStock: true,
    rating: 4.9,
    reviews: 203
  },
  {
    id: 4,
    name: 'Korean Gochugaru',
    price: { regular: 599, wholesale: 499 },
    unit: '100g',
    image: '🌶️',
    category: 'Spices',
    cuisine: 'Korean',
    inStock: true,
    rating: 4.7,
    reviews: 124
  },
  {
    id: 5,
    name: 'Mexican Chipotle Peppers',
    price: { regular: 399, wholesale: 329 },
    unit: '200g',
    image: '🫑',
    category: 'Spices',
    cuisine: 'Mexican',
    inStock: false,
    rating: 4.5,
    reviews: 67
  },
  {
    id: 6,
    name: 'Thai Basil Seeds',
    price: { regular: 199, wholesale: 169 },
    unit: '50g',
    image: '🌿',
    category: 'Herbs',
    cuisine: 'Thai',
    inStock: true,
    rating: 4.4,
    reviews: 45
  }
];

export default function ProductGrid() {
  const [priceMode, setPriceMode] = useState<'regular' | 'wholesale'>('regular');

  const addToCart = (productId: number) => {
    // TODO: Implement cart functionality
    console.log('Adding product to cart:', productId);
  };

  return (
    <div>
      {/* Price Mode Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-2 flex shadow-lg">
          <button
            onClick={() => setPriceMode('regular')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              priceMode === 'regular'
                ? 'bg-white text-orange-600 shadow-md transform scale-105'
                : 'text-orange-700 hover:text-orange-900 hover:bg-white/50'
            }`}
          >
            🛍️ Retail Prices
          </button>
          <button
            onClick={() => setPriceMode('wholesale')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              priceMode === 'wholesale'
                ? 'bg-white text-orange-600 shadow-md transform scale-105'
                : 'text-orange-700 hover:text-orange-900 hover:bg-white/50'
            }`}
          >
            📦 Wholesale Prices
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockProducts.map((product) => (
          <div key={product.id} className="sns-card-gradient group relative overflow-hidden">
            {/* Product Badge */}
            <div className="absolute top-4 left-4 z-10">
              {!product.inStock ? (
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              ) : (
                priceMode === 'wholesale' && (
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Save ₹{product.price.regular - product.price.wholesale}
                  </span>
                )
              )}
            </div>

            {/* Product Image */}
            <div className="aspect-square bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center text-8xl group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 to-red-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 group-hover:rotate-12 transition-transform duration-500">
                {product.image}
              </span>
            </div>

            {/* Product Info */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold sns-text-primary group-hover:text-orange-600 transition-colors duration-300 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm sns-text-secondary font-medium">{product.unit}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                  <span className="text-yellow-500 text-lg">⭐</span>
                  <span className="text-sm font-bold ml-1 text-yellow-700">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{product.price[priceMode].toLocaleString()}
                  </span>
                  {priceMode === 'wholesale' && (
                    <span className="text-lg text-gray-400 line-through">
                      ₹{product.price.regular.toLocaleString()}
                    </span>
                  )}
                </div>
                {priceMode === 'wholesale' && (
                  <div className="text-sm text-green-600 font-semibold">
                    💰 You save ₹{(product.price.regular - product.price.wholesale).toLocaleString()}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => addToCart(product.id)}
                  disabled={!product.inStock}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                    product.inStock
                      ? 'sns-button-primary hover:scale-105 hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.inStock ? '🛒 Add to Cart' : '❌ Out of Stock'}
                </button>
                <Link
                  href={`/product/${product.id}`}
                  className="block w-full py-3 px-6 border-2 border-orange-200 text-orange-600 font-bold text-center rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all duration-300"
                >
                  👁️ View Details
                </Link>
              </div>

              {/* Quick Info */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-orange-100">
                <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">
                  {product.cuisine}
                </span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {product.category}
                </span>
              </div>
            </div>
          </div>
        ))}
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