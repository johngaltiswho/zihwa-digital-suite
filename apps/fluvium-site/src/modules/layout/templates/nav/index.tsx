import Link from "next/link"

export default function Nav() {
  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-black border-gray-800">
        <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between w-full h-full">
          <div className="flex-1 basis-0 h-full flex items-center">
            <Link href="/" className="text-white hover:text-cyan-400 transition-colors duration-200">
              Home
            </Link>
          </div>

          <div className="flex items-center h-full">
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="flex items-center gap-x-6 h-full">
              <Link
                className="text-white hover:text-cyan-400 transition-colors duration-200"
                href="/shop-maintenance"
              >
                Shop
              </Link>
              <Link
                className="text-white hover:text-cyan-400 transition-colors duration-200"
                href="/humility-db"
              >
                Humility DB
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
