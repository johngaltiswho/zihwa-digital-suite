"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import type { NewsItem } from "@/types/news";
import Image from "next/image";

import { ProjectGridSkeleton } from "./ProjectSkeleton";

interface Props {
  projects: NewsItem[];
}

/* ================= CONFIG ================= */
const ITEMS_PER_PAGE = 12;

export default function FeaturedProjects({ projects }: Props) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  /* Reset page when data changes */
  useEffect(() => {
    setPage(1);
  }, [projects]);

  /* SORT PROJECTS BY YEAR (DESCENDING) */
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const yearA = Number(a.date ?? 0);
      const yearB = Number(b.date ?? 0);
      return yearB - yearA;
    });
  }, [projects]);

  const totalPages = Math.ceil(sortedProjects.length / ITEMS_PER_PAGE);

  /*  PAGINATE SORTED PROJECTS */
  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return sortedProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [page, sortedProjects]);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;

    setLoading(true);
    setTimeout(() => {
      setPage(p);
      setLoading(false);
    }, 250);
  };

  return (
    <>
      {/* ================= GRID ================= */}
      {loading ? (
        <ProjectGridSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paginatedProjects.map((project) => {
            const imageSrc =
              project.heroImages?.[0] || "/news/placeholder.jpg";

            return (
              <Link
                key={project.slug}
                href={`/news/${project.slug}`}
                className="group"
              >
                <article className="relative overflow-hidden rounded bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  
                  {/* IMAGE */}
                  <Image
                    src={imageSrc}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="h-[240px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = "/news/placeholder.jpg";
                    }}
                  />

                  {/*  YEAR  */}
                  {project.date && (
                    <span className="absolute top-3 left-3 bg-black/40 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                      {project.date}
                    </span>
                  )}

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  {/* TITLE */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white text-lg font-semibold leading-snug">
                      {project.title}
                    </h3>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-3">
          {/* PREV */}
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className={`h-10 w-10 rounded-full text-xl transition ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            ‹
          </button>

          {/* PAGE NUMBERS */}
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`h-10 w-10 rounded-full text-sm text-black font-medium transition ${
                  p === page
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {p}
              </button>
            );
          })}

          {/* NEXT */}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className={`h-10 w-10 rounded-full text-xl transition ${
              page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
