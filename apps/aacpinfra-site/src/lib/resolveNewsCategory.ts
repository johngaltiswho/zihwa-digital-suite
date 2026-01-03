import { NewsCategory } from "@/types/news";

const CATEGORY_MAP: Record<string, NewsCategory> = {
  project: "Project",
  "in-the-news": "In The News",
  presentation: "Presentation",
  jobs: "Jobs",
};

export function resolveNewsCategory(
  slug: string
): NewsCategory | "All" | null {
  if (slug === "all") return "All";
  return CATEGORY_MAP[slug] ?? null;
}
