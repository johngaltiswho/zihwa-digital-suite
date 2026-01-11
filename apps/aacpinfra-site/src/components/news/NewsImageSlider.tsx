"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image"; // Now used correctly
import { useState } from "react";
import NewsGallery from "./NewsGallery";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./NewsImageSlider.module.css";

interface Props {
  images: string[];
}

export default function NewsImageSlider({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="news-slider-auto-width">
      {/* ================= HERO SLIDER ================= */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop={images.length > 1}
        /* 
           This config lets images dictate their own width.
        */
        slidesPerView={"auto"} 
        centeredSlides={true}
        spaceBetween={20}
        className={`${styles.newsSliderAutoWidth} w-full h-[350px] md:h-[550px] bg-white`}
      >
        {images.map((img, i) => (
          <SwiperSlide 
            key={i} 
            /* This ensures the slide box matches the image's dynamic width */
            style={{ width: 'auto' }} 
          >
            <div
              className="relative h-full cursor-pointer overflow-hidden rounded-lg"
              onClick={() => setActiveIndex(i)}
            >
              {/* 
                 BUILD FIX: Using Next.js <Image /> component.
                 By setting height: 100% and width: auto in style, 
                 we keep the natural aspect ratio without zooming.
              */}
              <Image
                src={img}
                alt={`Project slide ${i + 1}`}
                width={0}
                height={0}
                sizes="100vw"
                priority={i === 0}
                style={{ 
                  height: '100%', 
                  width: 'auto', 
                  display: 'block', 
                  objectFit: 'contain' 
                }}
                className="border border-gray-100 shadow-sm"
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

    </div>
  );
}