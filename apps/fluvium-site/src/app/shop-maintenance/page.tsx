import { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "Shop Maintenance - Fluvium",
  description: "Our shop is currently under maintenance. For urgent requirements, please contact info@fluvium.co",
}

export default function ShopMaintenance() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <Header />
      {/* Hero Section */}
      <section className="shop-hero">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="shop-title">
            Fluvium <span className="neon-glow">Shop</span>
          </h1>
          <p className="shop-subtitle">
            Premium martial arts gear for the modern warrior. Quality equipment that matches your commitment to excellence.
          </p>
        </div>
      </section>

      {/* Maintenance Message */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Maintenance Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border border-cyan-400/30 bg-gray-900/50 backdrop-blur-sm mb-6">
              <div className="text-4xl animate-pulse-glow">⚙️</div>
            </div>
          </div>

          {/* Main Message */}
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
            Store Under <span className="neon-glow">Maintenance</span>
          </h2>
          
          <p className="text-xl text-gray-400 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
            We're currently upgrading our store to serve you better. Our premium martial arts gear will be back online soon.
          </p>

          {/* Contact Information */}
          <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-8 mb-8 backdrop-blur-sm">
            <h3 className="text-xl font-light text-white mb-4">
              Need Something <span className="text-cyan-400">Urgent?</span>
            </h3>
            <p className="text-gray-300 font-light mb-6">
              For emergency requirements or immediate assistance, please reach out to us directly.
            </p>
            
            <a 
              href="mailto:info@fluvium.co"
              className="inline-flex items-center gap-3 shop-button-outline hover:bg-cyan-400/10 transition-all duration-300"
            >
              <span className="text-lg">✉️</span>
              info@fluvium.co
            </a>
          </div>

          {/* Additional Info */}
          <div className="text-sm text-gray-500 font-light">
            <p>Thank you for your patience as we enhance your shopping experience.</p>
            <p className="mt-2">Expected to be back online soon.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}