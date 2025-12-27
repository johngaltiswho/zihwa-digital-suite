import { PrecastProduct } from "@/types/precast";

export const precastProducts: PrecastProduct[] = [
  {
    id: 1,
    slug: "precast-compound-wall",
    title: "Precast Compound Wall",
    shortDescription:
      "High-strength precast compound wall systems engineered for rapid installation and long-term durability.",
    image: "/precast/compound-wall.jpg",
    category: "Compound Wall",
    highlights: [
      "Factory-controlled quality",
      "Fast on-site installation",
      "Cost-effective boundary solution",
    ],
  },
  {
    id: 2,
    slug: "precast-drain-covers",
    title: "Precast Drain Covers",
    shortDescription:
      "Precision-manufactured drain covers designed for industrial and infrastructure applications.",
    image: "/precast/drain-covers.jpg",
    category: "Drainage",
  },
  {
    id: 3,
    slug: "precast-boundary-elements",
    title: "Precast Boundary Elements",
    shortDescription:
      "Custom precast boundary and fencing elements for large-scale developments.",
    image: "/precast/boundary-elements.jpg",
    category: "Boundary",
  },
];
