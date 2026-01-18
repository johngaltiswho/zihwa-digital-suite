import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 w-full bg-black">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <Link
              href="/"
              className="text-xl font-light text-gray-300 hover:text-cyan-400 transition-colors duration-200"
            >
              Fluvium
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Flow. Evolve. Transform.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-300">
                Links
              </span>
              <Link href="/humility-db" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
                Humility DB
              </Link>
              <Link href="/shop-maintenance" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
                Shop
              </Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
                Contact
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-300">
                Legal
              </span>
              <Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Fluvium. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
