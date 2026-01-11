"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

interface Props {
  images?: string[];
  index?: number;
  onClose: () => void;
}

export default function ImageLightbox({
  images = [],
  index = 0,
  onClose,
}: Props) {
  /* ================= HOOKS (ALWAYS FIRST) ================= */

  const [current, setCurrent] = useState(index);

  const next = useCallback(() => {
    setCurrent((prev) =>
      images.length === 0 ? prev : (prev + 1) % images.length
    );
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((prev) =>
      images.length === 0
        ? prev
        : prev === 0
        ? images.length - 1
        : prev - 1
    );
  }, [images.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [next, prev, onClose]);

  /* ================= SAFE GUARD ================= */

  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }

  /* ================= RENDER ================= */

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* CLOSE */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-3xl z-50"
      >
        ✕
      </button>

      {/* PREV */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-6 text-white text-4xl z-50"
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
          priority
        />
      </div>

      {/* NEXT */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-6 text-white text-4xl z-50"
        >
          ›
        </button>
      )}
    </div>
  );
}
