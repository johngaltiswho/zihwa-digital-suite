import { notFound } from "next/navigation";
import Link from "next/link";
import NewsList from "@/components/news/NewsList";
import NewsLayout from "@/components/news/NewsLayout";
import { getNewsByCategory } from "@/lib/newsData";

/* ---------------------------------------------
   Helper: normalize URL category → data category
---------------------------------------------- */
function normalizeCategory(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function CategoryNewsPage({
  params,
}: {
  params: { category: string };
}) {
  if (!params?.category) return null;

  const categorySlug = decodeURIComponent(params.category);
  const category = normalizeCategory(categorySlug);

  const items = getNewsByCategory(category, 1);

  if (!items || items.length === 0) {
    notFound();
  }

  return (
    <NewsLayout>
      {/* CATEGORY HEADER */}
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-serif text-black mb-3 capitalize">
          {category}
        </h1>

        <p className="text-gray-600 leading-relaxed">
          Explore updates, project highlights, and insights related to{" "}
          <span className="font-medium text-black capitalize">
            {category}
          </span>.
        </p>
      </header>

      {/* BLOG GRID */}
      <NewsList items={items} />

    
      <div className="mt-20 flex justify-center">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-lg font-semibold text-gray-600 hover:text-black transition"
        >
          ← Back to News
        </Link>
      </div>
    </NewsLayout>
  );
}
