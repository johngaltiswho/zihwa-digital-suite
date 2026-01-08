

import Link from "next/link";

interface CtaSectionProps {
  heading: string;
  buttonText: string;
  buttonLink: string;
}

export default function CtaSection({
  heading,
  buttonText,
  buttonLink,
}: CtaSectionProps) {
  return (
    <section className="bg-gray-900 text-white py-16 px-6 md:px-12 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        {heading}
      </h2>

      <Link
        href={buttonLink}
        className="inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-gray-900 transition duration-300 hover:bg-gray-100"
      >
        {buttonText}
      </Link>
    </section>
  );
}
