

export const siteConfig = {
    siteName: "AACP Infrastructure Systems Pvt. Ltd.",
    tagline: "Building Tomorrow's Infrastructure, Today.", 
    logoUrl: "/images/logo.png",
  
    navLinks: [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/about" },
      { name: "Services", href: "/services" },
      { name: "Projects", href: "/projects" },
      { name: "Contact", href: "/contact" },
    ],
  
    contactInfo: {
      address: "Bangalore, Karnataka, India",
      phone: "+919403890723",
      email: "info@aacpinfra.com",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.026135311494!2d77.6080536!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae167909c0f997%3A0x6a0a0b2d4f5b2b2b!2sBengaluru%2C%20Karnataka%2C%20India!5e0!3m2!1sen!2sin!4v1678901234567!5m2!1sen!2sin", // Placeholder
    },
  
    socialLinks: [
      { platform: "facebook", url: "https://facebook.com/aacpinfra", iconClass: "fab fa-facebook-f" },
      { platform: "twitter", url: "https://twitter.com/aacpinfra", iconClass: "fab fa-twitter" },
      { platform: "linkedin", url: "https://linkedin.com/company/aacpinfra", iconClass: "fab fa-linkedin-in" },
      { platform: "instagram", url: "https://instagram.com/aacpinfra", iconClass: "fab fa-instagram" },
    ],
  
    footerDescription: "AACP Infra is committed to building a sustainable future through innovative infrastructure solutions.", // Keep existing
  };
  
  export type NavLink = typeof siteConfig.navLinks[0];
  export type SocialLink = typeof siteConfig.socialLinks[0];