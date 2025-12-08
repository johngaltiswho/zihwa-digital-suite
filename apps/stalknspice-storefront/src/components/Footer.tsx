import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="sns-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                S&S
              </div>
              <div>
                <h3 className="text-xl font-bold">Stalks N Spice</h3>
                <p className="text-sm text-gray-400">Premium International Ingredients</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for premium spices, herbs, and international ingredients. 
              Serving culinary enthusiasts and professional chefs since 2015.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-orange-400 hover:text-orange-300">📘</a>
              <a href="#" className="text-orange-400 hover:text-orange-300">📷</a>
              <a href="#" className="text-orange-400 hover:text-orange-300">🐦</a>
              <a href="#" className="text-orange-400 hover:text-orange-300">📺</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/shop" className="text-gray-400 hover:text-orange-400">Shop All Products</Link></li>
              <li><Link href="/cuisines" className="text-gray-400 hover:text-orange-400">Shop by Cuisines</Link></li>
              <li><Link href="/brands" className="text-gray-400 hover:text-orange-400">Brand Stores</Link></li>
              <li><Link href="/wholesale" className="text-gray-400 hover:text-orange-400">Wholesale</Link></li>
              <li><Link href="/recipes" className="text-gray-400 hover:text-orange-400">Recipes</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-orange-400">Blog</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-400 hover:text-orange-400">Contact Us</Link></li>
              <li><Link href="/track-order" className="text-gray-400 hover:text-orange-400">Track Your Order</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-orange-400">Returns & Refunds</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-orange-400">FAQ</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-orange-400">Shipping Info</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-orange-400">Customer Support</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get In Touch</h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-orange-400">📞</span>
                <span className="text-gray-400">+91-9876543210</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-400">📧</span>
                <span className="text-gray-400">hello@stalknspice.com</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-400">📍</span>
                <span className="text-gray-400">
                  123 Spice Street,<br />
                  Gourmet District,<br />
                  Mumbai, India 400001
                </span>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold mb-2">Newsletter</h5>
              <p className="text-sm text-gray-400 mb-3">Get updates on new products and exclusive offers</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-orange-400"
                />
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-sm rounded transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="sns-container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © 2024 Stalks N Spice. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-orange-400">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-orange-400">Terms of Service</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-orange-400">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Promise Bar */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 py-3">
        <div className="sns-container">
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-white">
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span>45-Minute Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🛒</span>
              <span>Single Basket Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💰</span>
              <span>Wholesale Pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🌟</span>
              <span>Premium Quality</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}