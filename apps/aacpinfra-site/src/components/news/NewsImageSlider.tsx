"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { useState } from "react";
import NewsGallery from "./NewsGallery";

import "swiper/css";
import "swiper/css/navigation";

interface Props {
  images: string[];
}

export default function NewsImageSlider({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      {/* ================= HERO SLIDER ================= */}
      <Swiper
        modules={[Navigation]}
        navigation
        slidesPerView={1}
        className="rounded-xl overflow-hidden"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div
              className="relative h-[450px] cursor-pointer bg-gray-100"
              onClick={() => setActiveIndex(i)}
            >
              <Image
                src={img}
                alt={`Hero image ${i + 1}`}
                fill
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ================= FULLSCREEN GALLERY ================= */}
      {activeIndex !== null && (
        <NewsGallery
          images={images}
          startIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </>
  );
}
