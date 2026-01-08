import Image from "next/image";
import Link from "next/link";
import { servicesData } from "@/data/services";
import { notFound } from "next/navigation";


export async function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="py-4 px-6 md:px-12 flex justify-between items-center bg-white shadow-md">
        <div className="text-2xl font-bold text-blue-600">AACP Infra</div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-600">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-blue-600">
                Services
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-blue-600">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-600">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center text-center text-white">
        {service.featured_image_url && (
          <Image
            src={service.featured_image_url}
            alt={service.title}
            fill
            priority
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {service.title}
          </h1>
          <p className="text-xl md:text-2xl">
            {service.short_description}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Detailed Overview
          </h2>
          <div
            className="prose lg:prose-xl mx-auto text-gray-700"
            dangerouslySetInnerHTML={{
              __html: service.full_description,
            }}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white py-16 px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Start Your Project?
        </h2>
        <Link
          href="/contact"
          className="bg-white hover:bg-gray-100 text-blue-700 font-semibold py-3 px-8 rounded-full transition"
        >
          Contact Us
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>
          &copy; {new Date().getFullYear()} AACP Infra. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
