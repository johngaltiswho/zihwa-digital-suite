// apps/aacpinfra-site/src/data/homepage.ts

export const homepageData = {
  hero: {
    title: "Building Tomorrow's Infrastructure, Today.",
    subtitle: "Innovative Solutions for a Sustainable Future. Committed to excellence in every project.",
    buttonText: "VIEW ALL SERVICES",
    buttonLink: "/services",
    imageUrl: "https://images.unsplash.com/photo-1541888946141-950c4084534f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  aboutSection: {
    title: "About AACP Infra",
    contentHtml: `
      <p>AACP Infrastructure Systems Pvt. Ltd. is a leading infrastructure development company dedicated to delivering high-quality, sustainable, and innovative solutions across various sectors. With years of experience and a team of seasoned professionals, we specialize in civil construction, road development, urban planning, and environmental projects.</p>
      <p>We blend traditional project management practices with modern technology like Data Analytics, Building Information Modelling (BIM), Lean Construction, and Green Construction. Our company focuses on eliminating cost and budget overruns and ensuring workplace safety. We believe in building not just structures, but lasting relationships and a better future.</p>
    `, 
    buttonText: "READ MORE",
    buttonLink: "/about",
  },
  servicesOverviewTitle: "Our Expertise in Infrastructure",
  recentWorksTitle: "Our Recent Works",
  teamSectionTitle: "Meet Our Experts",
  cta: {
    heading: "Ready to Transform Your Vision into Reality?",
    buttonText: "VISIT US",
    buttonLink: "/contact",
  },
};

export type HomePageContent = typeof homepageData;
