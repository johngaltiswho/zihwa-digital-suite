"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { NewsItem } from "@/types/news";
import { ProjectGridSkeleton } from "./ProjectSkeleton";

interface Props {
  projects: NewsItem[];
}

const TOTAL_PAGES = 5;

export default function FeaturedProjects({ projects }: Props) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Calculate items per page
  const itemsPerPage = Math.ceil(projects.length / TOTAL_PAGES);

  const totalPages = Math.min(
    TOTAL_PAGES,
    Math.ceil(projects.length / itemsPerPage)
  );

  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return projects.slice(start, start + itemsPerPage);
  }, [page, projects, itemsPerPage]);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;

    setLoading(true);
    setTimeout(() => {
      setPage(p);
      setLoading(false);
    }, 300);
  };

  return (
    <>
      {/* ================= GRID ================= */}
      {loading ? (
        <ProjectGridSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {paginatedProjects.map((project) => {
            const imageSrc =
              project.heroImages?.[0] || "/news/placeholder.jpg";

            return (
              <Link
                key={project.slug}
                href={`/news/${project.slug}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl shadow-md bg-white">
                  <img
                    src={imageSrc}
                    alt={project.title}
                    loading="lazy"
                    className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/news/placeholder.jpg";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 flex items-end">
                    <h3 className="text-white text-lg font-semibold leading-snug">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-4">
          {/* LEFT ARROW */}
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className={`h-10 w-10 flex items-center justify-center rounded-full text-2xl transition ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            ‹
          </button>

          {/* PAGE NUMBERS */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`h-10 w-10 rounded-full text-sm font-medium transition ${
                    p === page
                      ? "bg-gray-900 text-white"
                      : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* RIGHT ARROW */}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className={`h-10 w-10 flex items-center justify-center rounded-full text-2xl transition ${
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
