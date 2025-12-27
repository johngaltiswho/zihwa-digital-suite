import Image from "next/image";
import Link from "next/link";
import { NewsItem } from "@/types/news";

export default function NewsList({ items }: { items: NewsItem[] }) {
  return (
    <div className="space-y-24">
      {items.map((item) => (
        <article
          key={item.id}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
        >
          {/* IMAGE */}
          <Link href={`/news/${item.slug}`}>
            <div className="relative w-full h-[260px] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
          </Link>

          {/* CONTENT */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-black tracking-wide uppercase">
              <Link href={`/news/${item.slug}`}>
                {item.title}
              </Link>
            </h2>

            {/* DESCRIPTION */}
            <p className="text-gray-600 leading-relaxed max-w-xl">
              {item.excerpt}
            </p>

            <Link
              href={`/news/${item.slug}`}
              className="inline-block text-sm text-black tracking-wide uppercase border-b border-black pb-1"
            >
              Read More
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
