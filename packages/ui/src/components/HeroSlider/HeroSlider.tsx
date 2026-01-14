"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// ==========================================
// 1. AACP HERO SLIDER 
// ==========================================
type Slide = {
    image: string;
    title: string;
    subtitle: string;
    cta?: {
        label: string;
        href: string;
    };
};

type HeroSliderProps = {
    slides: Slide[];
};

export default function HeroSlider({ slides }: HeroSliderProps) {
    return (
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            loop
            className="w-full h-[75vh] md:h-[75vh]"
        >
            {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${slide.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            position: "relative",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                backgroundColor: "rgba(0,0,0,0.45)",
                            }}
                        />

                        <div
                            style={{
                                position: "relative",
                                zIndex: 2,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                paddingLeft: "80px",
                                maxWidth: "900px",
                                color: "#fff",
                            }}
                        >
                            <h1 style={{ fontSize: "43px", marginBottom: "12px" }}>
                                {slide.title}
                            </h1>
                            <p style={{ fontSize: "20px", marginBottom: "12px" }}>
                                {slide.subtitle}
                            </p>

                            {slide.cta && (
                                <Link
                                    href={slide.cta.href}
                                    style={{
                                        width: "fit-content",
                                        padding: "12px 28px",
                                        border: "2px solid #fff",
                                        color: "#fff",
                                        textDecoration: "none",
                                    }}
                                >
                                    {slide.cta.label}
                                </Link>
                            )}
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

// ==========================================
// 2. SNS HERO SLIDER (UPDATED FOR MOBILE LAYOUT)
// ==========================================
type SNSSlide = {
    id: number | string;
    img: string;
    title?: string;
    subtitle?: string;
};

type HeroSliderSNSProps = {
    slides: SNSSlide[];
    height?: string; // Standard default height
};

export function HeroSliderSNS({ slides }: HeroSliderSNSProps) {
    const [current, setCurrent] = useState(0);

    // Auto-fading timer
    useEffect(() => {
        if (!slides || slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    if (!slides || slides.length === 0) return null;

     return (
        <section className="px-1 py-0 bg-white lg:px-2">
           
            <div className="relative aspect-[16/9] md:aspect-[16/9] lg:aspect-[3/1] xl:aspect-[3.8/2]  rounded-[30px] md:rounded-[30px] shadow-sm bg-white">
                
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                    >
                        <Image
                            src={slide.img}
                            alt={slide.title || "Promotional Banner"}
                            fill
                            priority={index === 0}
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                        />

                        {/* Text Overlay - Renders only if content exists */}
                        {(slide.title || slide.subtitle) && (
                            <div className="absolute inset-0 flex items-center px-6 md:px-16 bg-black/5">
                                <div className="max-w-[65%] md:max-w-xl animate-in fade-in slide-in-from-left-5 duration-700">
                                    {slide.subtitle && (
                                        <p className="text-red-800 font-bold uppercase tracking-[0.2em] text-[8px] md:text-sm mb-1 md:mb-2">
                                            {slide.subtitle}
                                        </p>
                                    )}
                                    <h2 className="text-xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight italic uppercase tracking-tighter">
                                        {slide.title}
                                    </h2>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* --- SNS Horizontal Bar Pagination --- */}
                <div className="absolute bottom-3 md:bottom-6 left-0 w-full flex justify-center items-center gap-2 z-20">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`h-1 md:h-1.5 rounded-full transition-all duration-500 ease-in-out ${
                                i === current 
                                    ? "w-8 md:w-20 bg-[#8B2323]" 
                                    : "w-4 md:w-10 bg-black/20 hover:bg-black/40"
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}