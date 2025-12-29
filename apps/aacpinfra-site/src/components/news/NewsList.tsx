import Image from "next/image";
import Link from "next/link";

export default function NewsList({ items }: { items: any[] }) {
  return (
    <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((news) => (
        <article
          key={news.id}
          className="group rounded-2xl border bg-white overflow-hidden transition-shadow hover:shadow-xl"
        >
          {/* IMAGE */}
          <Link href={`/news/${news.slug}`} className="block overflow-hidden">
            <Image
              src={news.image}
              alt={news.title}
              width={600}
              height={400}
              className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* CONTENT */}
          <div className="p-8">
            {/* CATEGORY */}
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
              {news.categories?.[0] ?? "News"}
            </p>

            {/* TITLE */}
            <h2 className="text-2xl text-black font-semibold leading-snug mb-4 group-hover:underline">
              <Link href={`/news/${news.slug}`}>
                {news.title}
              </Link>
            </h2>

            {/* EXCERPT */}
            <p className="text-gray-600 leading-relaxed line-clamp-3 mb-6">
              {news.excerpt}
            </p>

            {/* READ MORE */}
            <Link
              href={`/news/${news.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-black group-hover:gap-3 transition-all"
            >
              Read more
              <span aria-hidden>→</span>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
