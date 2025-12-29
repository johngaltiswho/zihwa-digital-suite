// apps/aacpinfra-site/src/components/CtaSection.tsx
import Link from 'next/link';

interface CtaSectionProps {
  heading: string;
  buttonText: string;
  buttonLink: string;
}

export default function CtaSection({ heading, buttonText, buttonLink }: CtaSectionProps) {
  return (
    <section className="bg-gray-900 text-white py-16 px-6 md:px-12 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        {heading}
      </h2>
      <Link
        href={buttonLink}
        className="bg-white hover:bg-gray-100 text-blue-700 font-semibold py-3 px-8 rounded-full transition duration-300 inline-block"
      >
        {buttonLink}
      </Link>
    </section>
  );
}