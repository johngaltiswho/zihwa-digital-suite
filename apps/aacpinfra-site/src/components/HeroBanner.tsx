// apps/aacpinfra-site/src/components/HeroBanner.tsx
import Image from 'next/image';

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export default function HeroBanner({ title, subtitle, imageUrl }: HeroBannerProps) {
  return (
    <section
      className="relative h-[40vh] md:h-[50vh] flex items-center justify-center text-center text-white w-full"
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 p-8 w-full max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          {title}
        </h1>
        {subtitle && <p className="text-xl md:text-2xl">{subtitle}</p>}
      </div>
    </section>
  );
}