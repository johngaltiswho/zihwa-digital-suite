"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

import { newsData } from "@/data/news";
import { NewsItem } from "@/types/news";

import NewsImageSlider from "@/components/news/NewsImageSlider";
import ImageLightbox from "@/components/news/ImageLightbox";
import NewsComments from "@/components/news/NewsComments";

export default function NewsDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const news: NewsItem | undefined = newsData.find(
    (item) => item.slug === slug
  );

  
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  if (!news) {
    return notFound();
  }

  return (
    <section className="max-w-6xl mx-auto bg-white px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-16">
      {/* ================= MAIN CONTENT ================= */}
      <article className="lg:col-span-2 space-y-6">
        {/* ================= TITLE ================= */}
        <h1 className="text-4xl font-serif text-black leading-tight">
          {news.title}
        </h1>

        {/* ================= HERO IMAGE SLIDER ================= */}
        {Array.isArray(news.heroImages) && news.heroImages.length > 0 && (
          <NewsImageSlider images={news.heroImages} />
        )}

        {/* ================= PROJECT DETAILS ================= */}
        {(news.date ||
          news.client ||
          news.location ||
          news.facility ||
          news.project_type ||
          news.natureOfWork ||
          news.structuralDesigner ||
          news.projectManagementConsultant ||
          news.consultant ||
          news.PMC ||
          news.scope ||
          news.status ||
          news.MonitoringAgency) && (
          <div className="border border-gray-200 p-4 space-y-3 text-sm text-gray-700">
            <h3 className="font-serif text-xl text-black mb-4 underline">
              Project Details :
            </h3>

            {news.date && (
              <p>
                <strong className="text-black">Project Year:</strong>{" "}
                {news.date}
              </p>
            )}

            {news.client && (
              <p>
                <strong className="text-black">Client:</strong>{" "}
                {news.client}
              </p>
            )}

            {news.natureOfWork && (
              <p>
                <strong className="text-black">Nature of Work:</strong>{" "}
                {news.natureOfWork}
              </p>
            )}

            {news.structuralDesigner && (
              <p>
                <strong className="text-black">Structural Designer:</strong>{" "}
                {news.structuralDesigner}
              </p>
            )}

            {news.projectManagementConsultant && (
              <p>
                <strong className="text-black">
                  Project Management Consultant:
                </strong>{" "}
                {news.projectManagementConsultant}
              </p>
            )}

            {news.consultant && (
              <p>
                <strong className="text-black">Consultant:</strong>{" "}
                {news.consultant}
              </p>
            )}

            {news.PMC && (
              <p>
                <strong className="text-black">PMC:</strong>{" "}
                {news.PMC}
              </p>
            )}

            {news.MonitoringAgency && (
              <p>
                <strong className="text-black">Monitoring Agency:</strong>{" "}
                {news.MonitoringAgency}
              </p>
            )}

            {news.location && (
              <p>
                <strong className="text-black">Location:</strong>{" "}
                {news.location}
              </p>
            )}

            {news.facility && (
              <p>
                <strong className="text-black">Facility:</strong>{" "}
                {news.facility}
              </p>
            )}

            {news.project_type && (
              <p>
                <strong className="text-black">Project Type:</strong>{" "}
                {news.project_type}
              </p>
            )}

            {news.scope && (
              <p>
                <strong className="text-black">Scope:</strong>{" "}
                {news.scope}
              </p>
            )}

            {news.status && (
              <p>
                <strong className="text-black">Status:</strong>{" "}
                {news.status}
              </p>
            )}
          </div>
        )}

        {/* ================= INTRODUCTION ================= */}
        {news.introduction && (
          <p className="text-lg text-gray-700 leading-relaxed">
            {news.introduction}
          </p>
        )}

        {/* ================= SMART CONTENT RENDERER ================= */}
        {Array.isArray(news.content) &&
          news.content.map((item, index) => {
            const text = item.trim();

            const isHeading =
              text.endsWith(":") && !/^\d+\./.test(text);

            const isNumbered =
              /^\d+\.\s/.test(text);

            const isDashBullet =
              text.startsWith("- ");

            const isTagline =
              text.includes("(COST") ||
              text.includes("QUALITY + SAFETY");

            if (isHeading) {
              return (
                <h3
                  key={index}
                  className="mt-2 mb-1 text-lg font-semibold text-black"
                >
                  {text}
                </h3>
              );
            }

            if (isNumbered) {
              return (
                <li
                  key={index}
                  className="ml-6 list-decimal text-gray-700 mb-2"
                >
                  {text.replace(/^\d+\.\s/, "")}
                </li>
              );
            }

            if (isDashBullet) {
              return (
                <li
                  key={index}
                  className="ml-6 list-disc text-gray-700 mb-2"
                >
                  {text.replace("- ", "")}
                </li>
              );
            }

            if (isTagline) {
              return (
                <p
                  key={index}
                  className="text-center font-semibold text-gray-800 my-6"
                >
                  {text}
                </p>
              );
            }

            return (
              <p
                key={index}
                className="text-gray-700 leading-relaxed mb-4"
              >
                {text}
              </p>
            );
          })}

        {/* ================= DOCUMENTS ================= */}
        {news.documents && news.documents.length > 0 && (
          <div className="pt-6 space-y-3">
            {news.documents.map((doc, i) => (
              <a
                key={i}
                href={doc.file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-bold text-black border-b border-black uppercase text-sm tracking-wide"
              >
                {doc.label}
              </a>
            ))}
          </div>
        )}

        {/* ================= CONCLUSION ================= */}
        {news.conclusion && (
          <p className="pt-6 text-gray-700 leading-relaxed">
            {news.conclusion}
          </p>
        )}

        {/* ================= IMAGE GALLERY ================= */}
        {Array.isArray(news.gallery) && news.gallery.length > 0 && (
          <div className="pt-14">
            <h2 className="text-2xl font-serif text-black mb-6">
              Project Gallery
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {news.gallery.map((img, i) => (
                <div
                  key={i}
                  className="relative h-56 cursor-pointer overflow-hidden bg-gray-100 rounded"
                  onClick={() => setActiveImageIndex(i)}
                >
                  <Image
                    src={img}
                    alt={`${news.title} image ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= COMMENTS ================= */}
        <NewsComments />
      </article>

      {/* ================= SIDEBAR ================= */}
      <aside className="border border-gray-200 p-8 h-fit bg-white">
        <h3 className="font-semibold text-lg mb-6 text-black uppercase tracking-wide">
          Categories
        </h3>

        <ul className="space-y-3 text-black font-medium uppercase tracking-wide">
          {news.categories.map((cat) => (
            <li key={cat}>{cat}</li>
          ))}
        </ul>
      </aside>

      {/* ================= IMAGE LIGHTBOX ================= */}
      {activeImageIndex !== null && Array.isArray(news.gallery) && (
        <ImageLightbox
          images={news.gallery}
          index={activeImageIndex}
          onClose={() => setActiveImageIndex(null)}
        />
      )}
    </section>
  );
}
