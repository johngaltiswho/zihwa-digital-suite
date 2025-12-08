import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import CuisineCategories from "@/components/CuisineCategories";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 spice-gradient"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/20 rounded-full animate-float"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white/15 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 sns-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <span className="animate-pulse-glow w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Now Delivering in 45 Minutes
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Premium
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Spices &
                </span>
                <span className="block">Ingredients</span>
              </h1>
              
              <p className="text-xl lg:text-2xl mb-8 text-orange-100 leading-relaxed">
                Discover authentic flavors from around the world. From aromatic Indian masalas to fresh Mediterranean herbs—we bring global cuisine to your kitchen.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/shop" className="sns-button-primary bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl">
                  <span className="mr-2">🛒</span>
                  Start Shopping
                </Link>
                <Link href="/wholesale" className="sns-button-outline border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg font-bold">
                  <span className="mr-2">📦</span>
                  Wholesale Pricing
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 text-sm text-orange-100">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                  <span>4.8/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>10,000+ Happy Customers</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                {/* Featured product showcase */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <div className="text-center text-white mb-6">
                    <h3 className="text-2xl font-bold mb-2">Featured Today</h3>
                    <p className="text-orange-200">Premium Saffron Collection</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/20 rounded-2xl p-4 text-center">
                      <div className="text-4xl mb-2">🟡</div>
                      <div className="text-white text-sm font-medium">Kashmir Saffron</div>
                    </div>
                    <div className="bg-white/20 rounded-2xl p-4 text-center">
                      <div className="text-4xl mb-2">🌿</div>
                      <div className="text-white text-sm font-medium">Organic Herbs</div>
                    </div>
                    <div className="bg-white/20 rounded-2xl p-4 text-center">
                      <div className="text-4xl mb-2">🌶️</div>
                      <div className="text-white text-sm font-medium">Exotic Spices</div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-white text-orange-600 font-bold py-3 rounded-xl hover:bg-orange-50 transition-colors duration-200">
                    View Collection
                  </button>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-yellow-400/20 rounded-full animate-float"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-400/20 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
            </div>
          </div>
        </div>
        
        {/* Delivery Promise Banner */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-black/40 to-black/60 backdrop-blur-sm py-6">
          <div className="sns-container">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-white">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-xl animate-pulse-glow">⚡</div>
                <div>
                  <div className="font-bold">45-Minute Delivery</div>
                  <div className="text-sm text-orange-200">Lightning fast service</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-xl">🛒</div>
                <div>
                  <div className="font-bold">Single Basket</div>
                  <div className="text-sm text-green-200">Everything in one order</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-xl">💰</div>
                <div>
                  <div className="font-bold">Wholesale Prices</div>
                  <div className="text-sm text-yellow-200">Best rates guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Cuisines */}
      <section className="sns-section bg-gradient-to-b from-orange-50 to-white">
        <div className="sns-container">
          <div className="sns-section-header">
            <h2 className="sns-section-title">
              Explore Global <span className="text-gradient">Cuisines</span>
            </h2>
            <p className="sns-section-subtitle">
              Journey through authentic flavors from every corner of the world. Each cuisine tells a story through its spices and ingredients.
            </p>
          </div>
          <CuisineCategories />
        </div>
      </section>

      {/* Featured Products */}
      <section className="sns-section bg-white">
        <div className="sns-container">
          <div className="sns-section-header">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
              Bestsellers
            </div>
            <h2 className="sns-section-title">
              Premium <span className="text-gradient">Ingredients</span>
            </h2>
            <p className="sns-section-subtitle">
              Hand-picked, quality-tested ingredients that transform ordinary meals into extraordinary culinary experiences.
            </p>
          </div>
          <ProductGrid />
        </div>
      </section>

      {/* Brand Stores Section */}
      <section className="sns-section spice-gradient-subtle">
        <div className="sns-container">
          <div className="sns-section-header">
            <h2 className="sns-section-title">
              Trusted <span className="text-gradient">Brands</span>
            </h2>
            <p className="sns-section-subtitle">
              Partner with renowned brands that share our commitment to quality and authenticity.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Organic India', emoji: '🌿', desc: 'Organic & Natural' },
              { name: 'Tata Sampann', emoji: '🏆', desc: 'Traditional Quality' },
              { name: 'Everest', emoji: '⭐', desc: 'Spice Masters' },
              { name: 'MDH', emoji: '🌶️', desc: 'Authentic Taste' }
            ].map((brand) => (
              <div key={brand.name} className="sns-card-gradient p-8 text-center hover-lift group">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  {brand.emoji}
                </div>
                <h3 className="text-lg font-bold sns-text-primary mb-2">{brand.name}</h3>
                <p className="text-sm sns-text-secondary">{brand.desc}</p>
                <button className="mt-4 text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors duration-200">
                  Explore Products →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="sns-section relative overflow-hidden">
        <div className="absolute inset-0 spice-gradient opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10 sns-container text-center text-white">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
              Join 50,000+ Food Enthusiasts
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Never Miss a <span className="text-yellow-300">Flavor</span>
            </h2>
            <p className="text-xl lg:text-2xl mb-8 text-orange-100">
              Get exclusive recipes, new product launches, and special offers delivered straight to your inbox.
            </p>
            
            <div className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-2">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-1 px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl">
                  Subscribe Now
                </button>
              </div>
              <p className="text-sm text-orange-200 mt-4">
                ✓ No spam, ever. ✓ Unsubscribe anytime. ✓ Exclusive member benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}