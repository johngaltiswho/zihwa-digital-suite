// apps/aacpinfra-site/src/components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/data/siteConfig';

export default function Header() {
  return (
    <>
      {/* Top Bar */}
      <div className="bg-blue-800 text-white py-2 px-6 md:px-12 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          {/* Left: Contact Info */}
          <div className="flex flex-wrap justify-center md:justify-start items-center space-x-4 md:space-x-6">
            <span className="flex items-center">
              <i className="fas fa-map-marker-alt mr-1"></i> {siteConfig.contactInfo.address.split(',')[0]}
            </span>
            <span className="flex items-center">
              <i className="fas fa-phone mr-1"></i> {siteConfig.contactInfo.phone}
            </span>
            <span className="flex items-center">
              <i className="fas fa-envelope mr-1"></i> {siteConfig.contactInfo.email}
            </span>
          </div>

          {/* Right: Social Icons & Get a Quote Button */}
          <div className="flex items-center space-x-4">
            {siteConfig.socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-200 transition-colors duration-200"
                aria-label={link.platform}
              >
                <i className={link.iconClass}></i>
              </a>
            ))}
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ml-4"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="py-4 px-6 md:px-12 flex justify-between items-center bg-white shadow-md">
        <Link href="/">
          <div className="flex items-center space-x-2">
            {/* You'll need to place a logo.png in public/images/ if you uncomment this */}
            {/* <Image src={siteConfig.logoUrl} alt={siteConfig.siteName} width={40} height={40} className="rounded-full" /> */}
            <span className="text-2xl font-bold text-blue-600">{siteConfig.siteName}</span>
          </div>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            {siteConfig.navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-blue-600 font-medium">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}