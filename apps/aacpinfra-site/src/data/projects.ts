// apps/aacpinfra-site/src/data/projects.ts

export interface ProjectItem {
    id: string;
    title: string;
    slug: string; // Used for unique URLs like /projects/project-title-slug
    category: string; // e.g., "Roads", "Bridges", "Urban Development"
    location: string;
    client: string;
    date: string; // e.g., "Completed: 2023"
    descriptionHtml: string; // Detailed description for the project's own page
    imageUrls: string[]; // Array of image URLs for the project gallery
  }
  
  export const projectsData: ProjectItem[] = [
    {
      id: '1',
      title: 'Metropolitan Expressway Expansion',
      slug: 'metropolitan-expressway-expansion',
      category: 'Road Development',
      location: 'Major City, India',
      client: 'National Highways Authority',
      date: 'Completed: 2023',
      descriptionHtml: `<p>Expansion of a 50 km stretch of the metropolitan expressway, incorporating advanced traffic management systems and sustainable materials. This project significantly reduced commute times and improved urban connectivity.</p>
      <p>Key features included a new flyover, multiple underpasses, and dedicated cycling lanes. Our team overcame significant logistical challenges to deliver the project ahead of schedule, showcasing our robust planning and execution capabilities.</p>`,
      imageUrls: [
        'https://images.unsplash.com/photo-1620950346083-d5867ec4c33f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder
        'https://images.unsplash.com/photo-1543886574-d02f5a898a83?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder
      ],
    },
    {
      id: '2',
      title: 'Smart Urban Water Management System',
      slug: 'smart-urban-water-management',
      category: 'Environmental Solutions',
      location: 'Green Valley City, India',
      client: 'Municipal Corporation',
      date: 'Completed: 2022',
      descriptionHtml: `<p>Development and implementation of an integrated smart water management system for urban areas, focusing on efficient water distribution, leakage detection, and wastewater treatment. This project utilized IoT sensors and AI-driven analytics.</p>
      <p>The system is designed to provide real-time data on water consumption and supply, enabling proactive maintenance and reducing water loss by up to 30%. It serves as a model for sustainable urban infrastructure.</p>`,
      imageUrls: [
        'https://images.unsplash.com/photo-1582210874019-33516599b5ed?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder
        'https://images.unsplash.com/photo-1601007817088-292a831e5f01?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder
      ],
    },
    {
      id: '3',
      title: 'High-Rise Residential Complex',
      slug: 'high-rise-residential-complex',
      category: 'Civil Construction',
      location: 'Central District, India',
      client: 'Private Developer',
      date: 'Completed: 2024 (Ongoing)',
      descriptionHtml: `<p>Construction of a 30-story residential complex featuring earthquake-resistant design, green building certifications, and smart home integration. The project includes extensive landscaping and community amenities.</p>
      <p>Our role involved comprehensive civil works, structural design, and adherence to stringent safety protocols. This complex aims to set new standards for modern urban living, combining luxury with sustainability.</p>`,
      imageUrls: [
        'https://images.unsplash.com/photo-1577498408429-ca7b6531f28b?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder
        'https://images.unsplash.com/photo-1557426172-a7209798782d?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder
      ],
    },
    {
      id: '4',
      title: 'Rural Road Connectivity Project',
      slug: 'rural-road-connectivity-project',
      category: 'Road Development',
      location: 'Northern Region, India',
      client: 'Government Rural Development Dept.',
      date: 'Completed: 2021',
      descriptionHtml: `<p>Development of a robust network of rural roads spanning 150 km, connecting remote villages to main highways. This initiative significantly boosted local economies by facilitating easier access to markets and services.</p>
      <p>The project involved extensive earthworks, culvert construction, and innovative use of local materials to ensure durability in diverse weather conditions. It has been lauded for its positive social and economic impact.</p>`,
      imageUrls: [
        'https://images.unsplash.com/photo-1549488349-f47285a850b6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder
        'https://images.unsplash.com/photo-1543886574-d02f5a898a83?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder
      ],
    },
  ];