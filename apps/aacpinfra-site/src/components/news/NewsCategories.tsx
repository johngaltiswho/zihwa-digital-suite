"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { label: "All", href: "/news" },
  { label: "Project", href: "/news/category/project" },
  { label: "Presentation", href: "/news/category/presentation" },
  { label: "In the News", href: "/news/category/in-the-news" },
];

export default function NewsCategories() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-4 mb-12">
      {categories.map((cat) => {
        const isActive =
          cat.href === "/news"
            ? pathname === "/news"
            : pathname.startsWith(cat.href);

        return (
          <Link
            key={cat.label}
            href={cat.href}
            className={`px-6 py-2 rounded-full border text-sm font-medium transition
              ${
                isActive
                  ? "bg-black text-white border-black"
                  : "border-gray-300 text-black hover:bg-black hover:text-white"
              }
            `}
          >
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
}
