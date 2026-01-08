
import Link from 'next/link';
import { siteConfig } from '@/data/siteConfig';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-blue-400">About {siteConfig.siteName}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {siteConfig.footerDescription}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            {siteConfig.navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-white transition-colors duration-200">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services ) */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Our Services</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link href="/services/civil-construction" className="hover:text-white transition-colors duration-200">Civil Construction</Link></li>
            <li><Link href="/services/road-development" className="hover:text-white transition-colors duration-200">Road Development</Link></li>
            <li><Link href="/services/urban-planning-development" className="hover:text-white transition-colors duration-200">Urban Planning</Link></li>
            <li><Link href="/services/environmental-solutions" className="hover:text-white transition-colors duration-200">Environmental Solutions</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Contact Info</h3>
          <p className="text-gray-400 text-sm space-y-2">
            <span className="block"><i className="fas fa-map-marker-alt mr-2"></i> {siteConfig.contactInfo.address}</span>
            <span className="block"><i className="fas fa-phone mr-2"></i> {siteConfig.contactInfo.phone}</span>
            <span className="block"><i className="fas fa-envelope mr-2"></i> {siteConfig.contactInfo.email}</span>
          </p>
          <div className="flex space-x-4 mt-6">
            {siteConfig.socialLinks.map((link) => (
              <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200 text-xl">
                <i className={link.iconClass}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        © {currentYear} {siteConfig.siteName}. All rights reserved.
      </div>
    </footer>
  );
}