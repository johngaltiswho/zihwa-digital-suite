import type { NewsItem } from "@/types/news";
import { newsData } from "@/data/news";
import { ongoingProjects } from "@/data/ongoingProjects";

import OngoingProjects from "@/components/projects/OngoingProjects";
import FeaturedProjects from "@/components/projects/FeaturedProjects";

export default function ProjectsPage() {
  // Featured projects = items marked as Project category
  const featuredProjects: NewsItem[] = newsData.filter((item) =>
    item.categories.includes("Project")
  );

  return (
    <main className="bg-white">
      {/* ================= CURRENT PROJECTS ================= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl text-black font-light mb-12 border-b-2 inline-block">
            Current Projects
          </h1>

          <h2 className="text-xl text-black font-medium mb-6">
            Ongoing Projects
          </h2>

          <OngoingProjects projects={ongoingProjects} />
        </div>
      </section>

      {/* ================= FEATURED PROJECTS ================= */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl  text-black font-light mb-14 border-b-2 inline-block">
            Featured Projects
          </h2>

          <FeaturedProjects projects={featuredProjects} />
        </div>
      </section>
    </main>
  );
}
