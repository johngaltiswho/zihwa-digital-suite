"use client";

import Image from "next/image";
import { useState } from "react";
import ImageLightbox from "./ImageLightbox";

export default function NewsGallery({
  images,
}: {
  images: string[];
}) {
  const [activeImage, setActiveImage] =
    useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Open image ${idx + 1}`}
            className="relative h-56 cursor-pointer overflow-hidden rounded-lg focus:outline-none"
            onClick={() => setActiveImage(img)}
          >
            <Image
              src={img}
              alt={`Gallery image ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform hover:scale-105"
            />
          </button>
        ))}
      </div>

      {activeImage && (
        <ImageLightbox
          src={activeImage}
          onClose={() => setActiveImage(null)}
        />
      )}
    </>
  );
}
