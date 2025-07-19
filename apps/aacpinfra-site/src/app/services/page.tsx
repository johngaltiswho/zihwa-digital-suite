// apps/aacpinfra-site/app/services/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { servicesData, ServiceItem } from '@/data/services'; // Import mock data

export default function ServicesListingPage() {
  const services = servicesData; // Use the mock data directly

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header (same as homepage) */}
      <header className="py-4 px-6 md:px-12 flex justify-between items-center bg-white shadow-md">
        <div className="text-2xl font-bold text-blue-600">AACP Infra</div>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li><Link href="/about" className="hover:text-blue-600">About Us</Link></li>
            <li><Link href="/services" className="hover:text-blue-600">Services</Link></li>
            <li><Link href="/projects" className="hover:text-blue-600">Projects</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
          </ul>
        </nav>
      </header>

      <section className="py-16 px-6 md:px-12 text-center bg-white">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10">
          Our Services
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <Link key={service.id} href={`/services/${service.slug}`}>
              <div className="bg-gray-100 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 h-full flex flex-col items-center">
                {service.icon_url && (
                  <Image
                    src={service.icon_url}
                    alt={service.title}
                    width={80}
                    height={80}
                    className="mb-6"
                  />
                )}
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h2>
                <p className="text-gray-700 flex-grow">
                  {service.short_description}
                </p>
                <span className="mt-6 text-blue-600 font-medium hover:underline">
                  Learn More &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section (same as homepage) */}
      <section className="bg-blue-700 text-white py-16 px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Start Your Project?
        </h2>
        <Link
          href="/contact"
          className="bg-white hover:bg-gray-100 text-blue-700 font-semibold py-3 px-8 rounded-full transition duration-300"
        >
          Contact Us
        </Link>
      </section>

      {/* Footer (same as homepage) */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>&copy; {new Date().getFullYear()} AACP Infra. All rights reserved.</p>
      </footer>
    </div>
  );
}