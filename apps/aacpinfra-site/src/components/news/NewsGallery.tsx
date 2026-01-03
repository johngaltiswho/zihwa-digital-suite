"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface NewsGalleryProps {
  images: string[];
  startIndex?: number;
  onClose: () => void;
}

export default function NewsGallery({
  images,
  startIndex = 0,
  onClose,
}: NewsGalleryProps) {
  const [current, setCurrent] = useState(startIndex);

  /* ================= KEYBOARD ================= */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const next = () => {
    setCurrent((c) => (c + 1) % images.length);
  };

  const prev = () => {
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  };

  if (!images.length) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* CLOSE */}
      <button
        className="absolute top-6 right-6 text-white text-4xl z-50"
        onClick={onClose}
      >
        ×
      </button>

      {/* PREV */}
      {images.length > 1 && (
        <button
          className="absolute left-6 text-white text-5xl z-50"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
        >
          ‹
        </button>
      )}

      {/* IMAGE */}
      <div
        className="relative w-[90vw] h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[current]}
          alt={`Image ${current + 1}`}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>

      {/* NEXT */}
      {images.length > 1 && (
        <button
          className="absolute right-6 text-white text-5xl z-50"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
        >
          ›
        </button>
      )}
    </div>
  );
}
