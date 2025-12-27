"use client";

import Image from "next/image";

export default function ImageLightbox({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative w-[90vw] h-[90vh]">
        <Image
          src={src}
          alt="Preview"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
