"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Link from "next/link";

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
        className="w-full h-[75vh] md:h-[80vh]"
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
            <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>
                {slide.title}
            </h1>
            <p style={{ fontSize: "20px", marginBottom: "24px" }}>
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
