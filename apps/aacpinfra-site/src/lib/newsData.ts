import { NewsItem } from "@/types/news";

/**
 * NOTE:
 * - categories is an array
 * - One news can belong to multiple categories
 * - excerpt is shown below title in news listing
 */

export const newsData: NewsItem[] = [
  // ===== PAGE 1 (9 items) =====
  {
    id: 1,
    title: "Walkway Works",
    slug: "walkway-works",
    image: "/news/Walkway-Works.jpg",
    categories: ["Project"],
    excerpt:
      "Construction of safe, durable pedestrian walkways designed to improve accessibility and movement within industrial campuses.",
  },
  {
    id: 2,
    title: "Drain Dismantling & Rectification",
    slug: "drain-dismantling-rectification",
    image: "/news/Drain-Dismantling.jpg",
    categories: ["Project"],
    excerpt:
      "Comprehensive dismantling and rectification works executed to enhance drainage efficiency and prevent waterlogging.",
  },
  {
    id: 3,
    title: "Recycling & Renewables",
    slug: "recycling-renewables",
    image: "/news/Recycling-Renewables.jpg",
    categories: ["Project", "Presentation", "In The News"],
    excerpt:
      "Sustainable initiatives focusing on recycling practices and renewable solutions for eco-friendly infrastructure.",
  },
  {
    id: 4,
    title: "Earth Haulers",
    slug: "earth-haulers",
    image: "/news/Earth-Haulers.jpg",
    categories: ["Project", "Presentation", "In The News"],
    excerpt:
      "Large-scale earth hauling operations supporting efficient excavation and site development activities.",
  },
  {
    id: 5,
    title: "Sustaining Water",
    slug: "sustaining-water",
    image: "/news/Sustaining-Water.jpg",
    categories: ["Project", "Presentation", "In The News"],
    excerpt:
      "Water sustainability initiatives aimed at conservation, reuse, and long-term resource management.",
  },
  {
    id: 6,
    title: "Rain Water Harvesting Pond II",
    slug: "rain-water-harvesting-pond-2",
    image: "/news/Rain-Water-Harvesting-Pond-2.jpg",
    categories: ["Project"],
    excerpt:
      "Development of rainwater harvesting ponds to improve groundwater recharge and storage capacity.",
  },
  {
    id: 7,
    title: "Surface Reconstruction",
    slug: "surface-reconstruction",
    image: "/news/Surface-Reconstruction.jpg",
    categories: ["Project"],
    excerpt:
      "Reconstruction works undertaken to restore surface strength, durability, and safety.",
  },
  {
    id: 8,
    title: "Emission Yard Road",
    slug: "emission-yard-road",
    image: "/news/Emission-Yard-Road.jpg",
    categories: ["Project"],
    excerpt:
      "Construction of emission yard roads designed to withstand heavy industrial traffic.",
  },
  {
    id: 9,
    title: "Walkway Shelter",
    slug: "walkway-shelter",
    image: "/news/Walkway-Shelter.jpg",
    categories: ["Project"],
    excerpt:
      "Installation of covered walkway shelters enhancing pedestrian comfort and protection.",
  },

  // ===== PAGE 2 =====
  {
    id: 10,
    title: "Pothole Creation",
    slug: "pothole-creation",
    image: "/news/Pothole-Creation.jpg",
    categories: ["Project"],
    excerpt:
      "Controlled pothole creation carried out for testing road durability and performance.",
  },
  {
    id: 11,
    title: "Sludge Barrel Store Yard",
    slug: "sludge-barrel-store-yard",
    image: "/news/Sludge-Barrel-store.jpg",
    categories: ["Project"],
    excerpt:
      "Construction of a dedicated sludge barrel storage yard ensuring safety and compliance.",
  },
  {
    id: 12,
    title: "Civil Dismantling Road",
    slug: "civil-dismantling-road",
    image: "/news/Civil-Dismantling-Road.jpg",
    categories: ["Project"],
    excerpt:
      "Civil dismantling works followed by road restoration for improved usability.",
  },
  {
    id: 13,
    title: "NALA Stream",
    slug: "nala-stream",
    image: "/news/NALA-Stream.jpg",
    categories: ["Project"],
    excerpt:
      "Stream rerouting and strengthening works to ensure uninterrupted water flow.",
  },
  {
    id: 14,
    title: "Eco Zone Development",
    slug: "eco-zone-development",
    image: "/news/Eco-Zone-Development.jpg",
    categories: ["Project"],
    excerpt:
      "Development of eco zones promoting greenery and environmental sustainability.",
  },
  {
    id: 15,
    title: "Abbankuppe Lake",
    slug: "abbankuppe-lake",
    image: "/news/Abbankuppe-Lake.jpg",
    categories: ["Project", "In The News"],
    excerpt:
      "Lake rejuvenation initiative aimed at restoring ecological balance and water quality.",
  },
  {
    id: 16,
    title: "Plant#1 Shuttle Yard",
    slug: "plant-1-shuttle-yard",
    image: "/news/Plant-1-Shuttle.jpg",
    categories: ["Project"],
    excerpt:
      "Rectification and development of shuttle yard to streamline internal logistics.",
  },
 {
  id: 17, // use next available ID (or adjust)
  slug: "corporate-presentation-growth",
  title: "Corporate Presentation – AACP Infrastructure (Growth & Capabilities)",
  categories: ["Presentation", "In The News"],
  image: "/news/Corporate-Presentation.jpg",
  excerpt:
    "This corporate presentation provides a comprehensive overview of AACP Infrastructure Systems Pvt. Ltd.",
},
  // ===== PAGE 3 =====
  {
    id: 18,
    title: "Afforestation",
    slug: "afforestation",
    image: "/news/Afforestation.jpg",
    categories: ["Project"],
    excerpt:
      "Afforestation drive undertaken to enhance green cover and biodiversity.",
  },
  {
    id: 19,
    title: "Corporate Presentation",
    slug: "corporate-presentation",
    image: "/news/Corporate-presentation-2.jpg",
    categories: ["Presentation", "In The News"],
    excerpt:
      "Corporate presentation showcasing AACP’s capabilities, projects, and vision.",
  },
  {
    id: 20,
    title: "Foray Into Modular Construction",
    slug: "foray-into-modular",
    image: "/news/Foray-Into-Modular.jpg",
    categories: ["Project", "In The News"],
    excerpt:
      "Exploration into modular construction techniques for faster and efficient builds.",
  },
  {
    id: 21,
    title: "Building Success: Unveiling Advantages Of Precast Construction",
    slug: "Building-Success",
    image: "/news/Building-Success.jpg",
    categories: ["Project"],
    excerpt:
      "Unveiling Advantages of Precast Construction.",
  },
  {
    id: 22,
    title: "Rain Water Harvesting",
    slug: "rain-water-harvesting",
    image: "/news/Rain-Water-Harvesting.jpg",
    categories: ["Project"],
    excerpt:
      "Implementation of rainwater harvesting systems to optimize water usage.",
  },
  {
    id: 23,
    title: "Pond Modification",
    slug: "pond-modification",
    image: "/news/Pond-Modification.jpg",
    categories: ["Project"],
    excerpt:
      "Modification works carried out to improve pond capacity and efficiency.",
  },
  {
    id: 24,
    title: "Phase II Road",
    slug: "phase-ii-road",
    image: "/news/Phase-II-Road.jpg",
    categories: ["Project"],
    excerpt:
      "Phase II road construction enhancing traffic flow and durability.",
  },
  {
    id: 25,
    title: "Road Works for Assetz Group",
    slug: "road-works-assetz-group",
    image: "/news/Road-Works-For-Assetz.jpg",
    categories: ["Project"],
    excerpt:
      "Road development works executed for Assetz Group residential projects.",
  },

  // ===== PAGE 4 =====
  {
    id: 26,
    title: "Solar Plant at BOSCH",
    slug: "solar-plant-bosch",
    image: "/news/Solar-Plant-at-BOSCH.jpg",
    categories: ["Project"],
    excerpt:
      "Installation of solar power infrastructure supporting renewable energy goals.",
  },
  {
    id: 27,
    title: "Earthwork on Hard & Soft Rock",
    slug: "earthwork-hard-soft-rock",
    image: "/news/Earthwork-on-Hard-Soft-Rock.jpg",
    categories: ["Project"],
    excerpt:
      "Specialized earthwork carried out across hard and soft rock terrains.",
  },
  {
    id: 28,
    title: "Toyota Kirloskar Auto",
    slug: "toyota-kirloskar-auto",
    image: "/news/Toyota-Kirloskar-Auto.jpg",
    categories: ["Project"],
    excerpt:
      "Infrastructure development works executed at Toyota Kirloskar facilities.",
  },
  {
    id: 29,
    title: "Land Reclamation",
    slug: "land-reclamation",
    image: "/news/Land-Reclamation.jpg",
    categories: ["Project"],
    excerpt:
      "Land reclamation initiatives converting unused land into functional spaces.",
  },
  {
    id: 30,
    title: "In The News",
    slug: "in-the-news",
    image: "/news/In-The-News.jpg",
    categories: ["In The News"],
    excerpt:
      "Media highlights and coverage featuring AACP’s key achievements.",
  },
  {
    id: 31,
    title: "Scientific Art Work",
    slug: "scientific-art-work",
    image: "/news/Scientific-Art-Work.jpg",
    categories: ["Project"],
    excerpt:
      "Integration of scientific planning with aesthetic infrastructure design.",
  },
  {
    id: 32,
    title: "Concrete Roads",
    slug: "concrete-roads",
    image: "/news/Concrete-Roads.jpg",
    categories: ["Project"],
    excerpt:
      "Construction of durable concrete roads ensuring long-term performance.",
  },
  {
    id: 33,
    title: "Surface Reconstruction",
    slug: "road-rectification",
    image: "/news/Surface-Reconstruction.jpg",
    categories: ["Project"],
    excerpt:
      "Rectification works to improve road quality and safety standards.",
  },

  // ===== PAGE 5 =====
  {
    id: 34,
    title: "Molex Parking Shelter Design",
    slug: "Molex-Parking-Shelter-Design",
    image: "/news/Molex-Parking-Shelter.jpg",
    categories: ["Project"],
    excerpt:
      "Construction of efficient drainage systems supporting water management.",
  },
  {
    id: 35,
    title: "External Development",
    slug: "industrial-site-development",
    image: "/news/External-Development.jpg",
    categories: ["Project"],
    excerpt:
      "Comprehensive industrial site development from groundwork to finishing.",
  },
  {
    id: 36,
    title: "Rain Water Conveyance System",
    slug: "rain-water-conveyance",
    image: "/news/Rain-Water-Conveyance-System.jpg",
    categories: ["Project"],
    excerpt:
      "Conveyance systems designed to channel rainwater efficiently.",
  },
  {
    id: 37,
    title: "Rain Water Storage",
    slug: "rain-water-storage",
    image: "/news/Rain-Water-Storage-Conveyance-System.jpg",
    categories: ["Project"],
    excerpt:
      "Rainwater storage solutions ensuring sustainable water availability.",
  },
  {
    id: 38,
    title: "Sustainable Renjuvenation Of Public Infrastructure | BBMP & MNC",
    slug: "green-belt-development",
    image: "/news/Sustainable-Rejuvenation.jpg",
    categories: ["Project"],
    excerpt:
      "Green belt development initiatives enhancing environmental balance.",
  },
  {
    id: 39,
    title: "Sustainable Rejuvenation | ABB & CSR",
    slug: "sustainable-rejuvenation",
    image: "/news/Sustainable-Rejuvation-of-public-Infrastructure.jpg",
    categories: ["Project"],
    excerpt:
      "Rejuvenation of public infrastructure with sustainable practices.",
  },
  {
    id: 40,
    title: "Sustaining Success",
    slug: "sustaining-success",
    image: "/news/Sustaining-Success.jpg",
    categories: ["Project", "In The News"],
    excerpt:
      "Milestones and success stories showcasing AACP’s growth journey.",
  },
  {
    id: 41,
    title: "Transforming Spaces",
    slug: "transforming-spaces",
    image: "/news/Transforming-Spaces.jpg",
    categories: ["Project"],
    excerpt:
      "Transformation of spaces through innovative engineering solutions.",
  },

  // ===== PAGE 6 =====
  {
    id: 42,
    title: "Veersandra Lake",
    slug: "veersandra-lake",
    image: "/news/Veersandra-Lake.jpg",
    categories: ["Project"],
    excerpt:
      "Lake rejuvenation project improving water quality and ecosystem health.",
  },
  {
    id: 43,
    title: "Walkway Shelter at TKM",
    slug: "walkway-shelter-tkm",
    image: "/news/Walkway-Shelter-at-TKM.jpg",
    categories: ["Project"],
    excerpt:
      "Installation of sheltered walkways at TKM facilities.",
  },
  {
    id: 44,
    title: "Compound Wall",
    slug: "compound-wall",
    image: "/news/Compound-Wall.jpg",
    categories: ["Project"],
    excerpt:
      "Construction of secure compound walls ensuring site safety.",
  },
  {
    id: 45,
    title: "Innovative Solution",
    slug: "innovative-solution",
    image: "/news/Innovative-Solution.jpg",
    categories: ["Presentation", "In The News"],
    excerpt:
      "Innovative engineering solutions addressing complex infrastructure challenges.",
  },
  {
    id: 46,
    title: "Revolutionizing India",
    slug: "revolutionizing-india",
    image: "/news/Revolutionizing-India.jpg",
    categories: ["Project"],
    excerpt:
      "Projects contributing to modern infrastructure and national development.",
  },
  {
    id: 47,
    title: "Rain Water Harvesting Pond",
    slug: "Rain-Water-Harvesting-Pond",
    image: "/news/Rain-Water-Pond.jpg",
    categories: ["Project", "Presentation", "In The News"],
    excerpt:
      "Advanced water sustainability initiatives ensuring long-term conservation.",
  },
  {
    id: 48,
    title: "New Project Fixing",
    slug: "new-project-fixing",
    image: "/news/New-Project-Fixing.jpg",
    categories: ["Project"],
    excerpt:
      "Execution of new project fixing works with precision and efficiency.",
  },
  {
    id: 49,
    title: "Road External Development",
    slug: "road-external-development",
    image: "/news/Roads-External-Development.jpg",
    categories: ["Project"],
    excerpt:
      "External road development improving connectivity and accessibility.",
  },
];

// ================= HELPERS =================

export function getNewsByPage(page: number) {
  if (page === 1) return newsData.slice(0, 9);
  const start = 9 + (page - 2) * 8;
  return newsData.slice(start, start + 8);
}

export function getTotalPages() {
  return 6;
}

export function getAllCategories(): string[] {
  return Array.from(
    new Set(newsData.flatMap((item) => item.categories))
  );
}

export function getNewsByCategory(category: string, page: number) {
  const filtered =
    category === "All"
      ? newsData
      : newsData.filter((item) =>
          item.categories.includes(category)
        );

  if (page === 1) return filtered.slice(0, 9);

  const start = 9 + (page - 2) * 8;
  return filtered.slice(start, start + 8);
}

export function getTotalPagesByCategory(category: string) {
  const total =
    category === "All"
      ? newsData.length
      : newsData.filter((n) =>
          n.categories.includes(category)
        ).length;

  if (total <= 9) return 1;
  return 1 + Math.ceil((total - 9) / 8);
}
