"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { useState } from "react";
import ImageLightbox from "./ImageLightbox";

import "swiper/css";
import "swiper/css/navigation";

export default function NewsImageSlider({
  images,
}: {
  images: string[];
}) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <Swiper
        modules={[Navigation]}
        navigation
        slidesPerView={1}
        className="rounded-xl overflow-hidden"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div
              className="relative h-[420px] cursor-pointer"
              onClick={() => setActive(img)}
            >
              <Image
                src={img}
                alt={`Hero ${i + 1}`}
                fill
                priority={i === 0}
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {active && (
        <ImageLightbox src={active} onClose={() => setActive(null)} />
      )}
    </>
  );
}
