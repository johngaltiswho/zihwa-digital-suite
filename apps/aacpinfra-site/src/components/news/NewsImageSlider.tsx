"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image"; // Now used correctly
import { useState } from "react";
import NewsGallery from "./NewsGallery";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
        className="w-full h-[350px] md:h-[550px] bg-white"
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

      {/* CUSTOM STYLING FOR AUTO-WIDTH LOOK */}
      <style jsx global>{`
        .news-slider-auto-width .swiper-slide {
          opacity: 0.4;
          transition: opacity 0.3s ease;
        }
        .news-slider-auto-width .swiper-slide-active {
          opacity: 1;
        }
        .news-slider-auto-width .swiper-button-next,
        .news-slider-auto-width .swiper-button-prev {
          color: #000 !important;
          // background: rgba(255, 255, 255, 0.8);
          width: 45px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .news-slider-auto-width .swiper-button-next:after,
        .news-slider-auto-width .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
        .news-slider-auto-width .swiper-pagination-bullet-active {
          background: #000 !important;
        }
      `}</style>
    </div>
  );
}