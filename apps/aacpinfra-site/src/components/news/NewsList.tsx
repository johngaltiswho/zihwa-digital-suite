import Image from "next/image";
import Link from "next/link";
import { NewsListItem } from "@/types/news";

interface Props {
  items: NewsListItem[];
}

export default function NewsList({ items }: Props) {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-8
      "
    >
      {items.map((news) => (
        <article
          key={news.id}
          className="
            group
            rounded-lg
            border
            bg-white
            overflow-hidden
            transition-all
            hover:shadow-xl
            hover:-translate-y-1
          "
        >
          {/* ================= IMAGE ================= */}
          <Link href={`/news/${news.slug}`} className="block overflow-hidden">
            <Image
              src={news.image}

              alt={news.title}
              width={600}
              height={400}
              className="
                h-[220px]
                w-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />
          </Link>
          {/* ================= CONTENT ================= */}
          <div className="p-6">
            {/* CATEGORY */}
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
              {news.categories?.[0] ?? "News"}
            </p>
            {/* DATE */}
            {news.date && (
              <p className="text-xs text-gray-400 mb-3">
                {news.date}
              </p>
            )}

            {/* TITLE */}
            <h2 className="text-lg text-black font-semibold leading-snug mb-3 line-clamp-2">
              <Link href={`/news/${news.slug}`}>
                {news.title}
              </Link>
            </h2>

            {/* EXCERPT */}
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
              {news.excerpt}
            </p>

            {/* READ MORE */}
            <Link
              href={`/news/${news.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-black"
            >
              Read more →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
