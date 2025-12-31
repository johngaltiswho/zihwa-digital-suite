"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { label: "All", href: "/news" },
  { label: "Projects", href: "/news/category/project" },
  { label: "Presentations", href: "/news/category/presentation" },
  { label: "In the News", href: "/news/category/in-the-news" },
];

export default function NewsCategories() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/news") {
      return pathname === "/news" || pathname.startsWith("/news/p");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="mb-12">
      {/* Rounded container */}
      <div className="inline-flex flex-wrap gap-3 rounded-full border border-gray-200 bg-gray-50 p-2">
        {categories.map((cat) => {
          const active = isActive(cat.href);

          return (
            <Link
              key={cat.label}
              href={cat.href}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition
                ${
                  active
                    ? "bg-black text-white text-sm shadow-sm"
                    : "bg-white text-gray-700 hover:bg-black hover:text-white"
                }
              `}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
