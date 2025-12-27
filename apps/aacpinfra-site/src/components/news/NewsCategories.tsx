import Link from "next/link";
import { newsData } from "@/data/news";

export default function NewsCategories() {
  const categories = Array.from(
    new Set(newsData.flatMap((item) => item.categories))
  );

  return (
    <div className="border border-gray-200 p-8 bg-white">
      <h3 className="font-serif text-lg mb-6 text-black uppercase tracking-wide">
        Categories
      </h3>

      <ul className="space-y-3 text-black font-medium uppercase tracking-wide">
        <li>
          <Link href="/news">All</Link>
        </li>

        {categories.map((cat) => (
          <li key={cat}>
            <Link href={`/news/category/${cat}`}>
              {cat}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}