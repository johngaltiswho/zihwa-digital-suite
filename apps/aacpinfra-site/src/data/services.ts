

export const servicesData = [
  {
    id: "service-1",
    title: "Civil Construction",
    slug: "civil-construction",
    short_description:
      "Foundations, structural works, and building construction with precision.",
    full_description: `
      <p>Our civil construction services encompass the entire lifecycle of building projects, from initial site preparation and foundation laying to the final structural completion.</p>
      <p>We deliver residential, commercial, and industrial projects using modern engineering practices and strict quality controls.</p>
    `,
    icon_url: "https://img.icons8.com/ios-filled/100/000000/hammer.png",
    featured_image_url:
      "https://images.unsplash.com/photo-1517036605054-a6fcfc21d84f",
  },

  {
    id: "service-2",
    title: "Road Development",
    slug: "road-development",
    short_description:
      "Designing and building robust road networks for seamless connectivity.",
    full_description: `
      <p>We specialize in highways, urban roads, and industrial access roads built for durability and safety.</p>
      <p>Our road projects meet national and international standards for long-term performance.</p>
    `,
    icon_url: "https://img.icons8.com/ios-filled/100/000000/road--v1.png",
    featured_image_url:
      "https://images.unsplash.com/photo-1549488344-e223c7c25a07",
  },

  {
    id: "service-3",
    title: "Urban Planning & Development",
    slug: "urban-planning-development",
    short_description:
      "Creating smart, livable, and sustainable urban environments.",
    full_description: `
      <p>We design integrated urban infrastructure supporting sustainable growth.</p>
      <p>Our planning solutions enhance livability, connectivity, and environmental balance.</p>
    `,
    icon_url: "https://img.icons8.com/ios-filled/100/000000/city-buildings.png",
    featured_image_url:
      "https://images.unsplash.com/photo-1519757659-c290132b350e",
  },

  {
    id: "service-4",
    title: "Drains & Pipelines",
    slug: "drains-pipelines",
    short_description:
      "Efficient drainage and pipeline systems for urban and industrial needs.",
    full_description: `
      <p>We execute stormwater drains, sewer networks, and underground pipeline systems.</p>
      <p>Our solutions ensure efficient water management and flood prevention.</p>
    `,
    icon_url: "https://img.icons8.com/ios-filled/100/000000/water-pipe.png",
    featured_image_url:
      "https://images.unsplash.com/photo-1603796846097-bee99e4a601f",
  },

  {
    id: "service-5",
    title: "Environment",
    slug: "environment",
    short_description:
      "Sustainable environmental infrastructure and conservation projects.",
    full_description: `
      <p>We undertake lake rejuvenation, eco-restoration, and green infrastructure projects.</p>
      <p>Our work promotes environmental sustainability and long-term ecological balance.</p>
    `,
    icon_url: "https://img.icons8.com/ios-filled/100/000000/leaf.png",
    featured_image_url:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },

  {
    id: "service-6",
    title: "Earthworks",
    slug: "earthworks",
    short_description:
      "Bulk excavation, grading, and site preparation services.",
    full_description: `
      <p>We handle large-scale earthworks for industrial, commercial, and infrastructure projects.</p>
      <p>Precision equipment and experienced operators ensure efficiency and safety.</p>
    `,
    icon_url: "https://img.icons8.com/ios-filled/100/000000/bulldozer.png",
    featured_image_url:
      "https://images.unsplash.com/photo-1581091215367-59ab6c3c1c94",
  },

  {
    id: "service-7",
    title: "Renewable Energy",
    slug: "renewable-energy",
    short_description:
      "Infrastructure support for solar and renewable energy projects.",
    full_description: `
      <p>We provide civil and infrastructure works for solar power plants and renewable facilities.</p>
      <p>Our focus is on sustainable energy development with minimal environmental impact.</p>
    `,
    icon_url: "https://img.icons8.com/ios-filled/100/000000/solar-panel.png",
    featured_image_url:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276",
  },

  {
    id: "service-8",
    title: "External Development",
    slug: "external-development",
    short_description:
      "Comprehensive external development works for industries and townships.",
    full_description: `
      <p>We execute roads, utilities, landscaping, and supporting infrastructure.</p>
      <p>Our external development projects enhance functionality and aesthetics.</p>
    `,
    icon_url: "https://img.icons8.com/ios-filled/100/000000/road-closure.png",
    featured_image_url:
      "https://images.unsplash.com/photo-1590650153855-d9e808231d41",
  },
];

// Type for components
export type ServiceItem = (typeof servicesData)[0];
