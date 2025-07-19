// apps/aacpinfra-site/data/services.ts

export const servicesData = [
    {
      id: 'service-1',
      title: "Civil Construction",
      slug: "civil-construction",
      short_description: "Foundations, structural works, and building construction with precision.",
      full_description: `
        <p>Our civil construction services encompass the entire lifecycle of building projects, from initial site preparation and foundation laying to the final structural completion. We pride ourselves on using advanced techniques and high-quality materials to ensure durability and safety.</p>
        <p>Key areas include residential, commercial, and industrial building construction, specialized concrete works, and demolition and renovation services. Our experienced engineers and skilled workforce deliver projects that stand the test of time.</p>
      `,
      icon_url: "https://img.icons8.com/ios-filled/100/000000/hammer.png", // Example icon
      featured_image_url: "https://images.unsplash.com/photo-1517036605054-a6fcfc21d84f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Example image
    },
    {
      id: 'service-2',
      title: "Road Development",
      slug: "road-development",
      short_description: "Designing and building robust road networks for seamless connectivity.",
      full_description: `
        <p>We are experts in developing comprehensive road infrastructure, including highways, urban roads, and rural access routes. Our approach integrates sustainable design with efficient construction methodologies.</p>
        <p>Services include road surveying, earthworks, paving (asphalt and concrete), bridge construction, and drainage systems. We ensure that our road projects meet international standards for safety, efficiency, and longevity.</p>
      `,
      icon_url: "https://img.icons8.com/ios-filled/100/000000/road--v1.png",
      featured_image_url: "https://images.unsplash.com/photo-1549488344-e223c7c25a07?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 'service-3',
      title: "Urban Planning & Development",
      slug: "urban-planning-development",
      short_description: "Creating smart, livable, and sustainable urban environments.",
      full_description: `
        <p>Our urban planning and development services focus on creating integrated and sustainable urban spaces. We work closely with local authorities and communities to design infrastructure that supports growth and enhances quality of life.</p>
        <p>This includes master planning, utility infrastructure design, public space development, and smart city solutions. Our aim is to build resilient and future-proof urban ecosystems.</p>
      `,
      icon_url: "https://img.icons8.com/ios-filled/100/000000/city-buildings.png",
      featured_image_url: "https://images.unsplash.com/photo-1519757659-c290132b350e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  
//   // Define types for better type safety in your components
  // export type HomePageContent = typeof homepageData;
  export type ServiceItem = typeof servicesData[0];