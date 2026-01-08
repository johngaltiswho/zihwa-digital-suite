

export interface TeamMember {
    id: string;
    name: string;
    position: string;
    imageUrl: string;
    bioHtml: string;
    socialLinks?: { platform: string; url: string; iconClass: string }[];
  }
  
  export const teamData: TeamMember[] = [
    {
      id: '1',
      name: 'Dr. Ananya Sharma',
      position: 'CEO & Founder',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d877341e2b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder image
      bioHtml: `<p>Dr. Sharma leads AACP Infra with a vision for sustainable and innovative infrastructure. Her expertise in civil engineering and business strategy drives the company's growth and commitment to excellence.</p>`,
      socialLinks: [
        { platform: 'linkedin', url: '#', iconClass: 'fab fa-linkedin-in' },
        { platform: 'twitter', url: '#', iconClass: 'fab fa-twitter' },
      ],
    },
    {
      id: '2',
      name: 'Mr. Rohan Kapoor',
      position: 'Chief Operations Officer',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2830&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder image
      bioHtml: `<p>With over 20 years in project management, Mr. Kapoor ensures the seamless execution of all AACP Infra projects. His focus on efficiency and safety is key to delivering projects on time and within budget.</p>`,
      socialLinks: [
        { platform: 'linkedin', url: '#', iconClass: 'fab fa-linkedin-in' },
      ],
    },
    {
      id: '3',
      name: 'Ms. Priya Singh',
      position: 'Head of Engineering',
      imageUrl: 'https://images.unsplash.com/photo-1582218903520-21a4869c9b5f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder image
      bioHtml: `<p>Ms. Singh's innovative engineering solutions and technical acumen are at the core of AACP Infra's complex projects. She leads the design and implementation phases with precision and foresight.</p>`,
      socialLinks: [
        { platform: 'linkedin', url: '#', iconClass: 'fab fa-linkedin-in' },
        { platform: 'instagram', url: '#', iconClass: 'fab fa-instagram' },
      ],
    },
    {
      id: '4',
      name: 'Mr. Vivek Jain',
      position: 'CFO',
      imageUrl: 'https://images.unsplash.com/photo-1599566150163-29194d693247?q=80&w=2894&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder image
      bioHtml: `<p>Mr. Jain manages the financial health of AACP Infra, ensuring fiscal responsibility and strategic investments. His financial leadership supports the company's long-term sustainability and growth.</p>`,
    },
  ];