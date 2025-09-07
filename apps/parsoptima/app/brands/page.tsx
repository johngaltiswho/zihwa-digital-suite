import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Our Brands - Pars Optima Enterprises LLP',
  description: 'Discover the leading FMCG brands distributed by Pars Optima Enterprises across South India including Britannia, GSK, Nivea, Dabur, and more.',
};

export default function Brands() {
  const brands = [
    {
      name: 'Britannia',
      category: 'Biscuits & Bakery',
      description: 'Leading biscuit and bakery products brand trusted by millions across India.'
    },
    {
      name: 'GSK',
      category: 'Healthcare & Nutrition',
      description: 'Global healthcare leader providing trusted nutrition and wellness products.'
    },
    {
      name: 'Nivea',
      category: 'Personal Care',
      description: 'World-renowned skincare and personal care brand offering premium products.'
    },
    {
      name: 'Dabur',
      category: 'FMCG & Healthcare',
      description: 'Trusted Indian brand offering natural healthcare and consumer products.'
    },
    {
      name: 'Adani Wilmar',
      category: 'Edible Oils & Foods',
      description: 'Leading manufacturer of edible oils, wheat flour, and food products.'
    },
    {
      name: 'Sunpure',
      category: 'Edible Oils',
      description: 'Premium quality cooking oils and food products for modern kitchens.'
    },
    {
      name: 'Pillsbury',
      category: 'Flour & Baking',
      description: 'Trusted baking brand offering high-quality flour and baking solutions.'
    }
  ];

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Our Brand Portfolio</h1>
            <p className="tagline">Distributing Leading FMCG Brands Across South India</p>
            <p className="description">
              We proudly distribute trusted brands that consumers love, ensuring consistent 
              availability and market reach through our robust distribution network.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Featured Brands</h2>
          <p className="section-subtitle">
            Our diverse portfolio includes leading brands across multiple FMCG categories, 
            ensuring comprehensive coverage for retailers and end consumers.
          </p>

          <div className="brands-detailed-grid">
            {brands.map((brand, index) => (
              <div key={index} className="brand-detailed-card">
                <div className="brand-header">
                  <h3>{brand.name}</h3>
                  <span className="brand-category">{brand.category}</span>
                </div>
                <p>{brand.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Categories */}
      <section className="section" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <h2 className="section-title">Product Categories</h2>
          <div className="grid-3">
            <div className="card">
              <h3>Food & Beverages</h3>
              <p>
                Biscuits, bakery products, cooking oils, flour, and other food essentials 
                from trusted brands like Britannia, Pillsbury, and Adani Wilmar.
              </p>
            </div>
            <div className="card">
              <h3>Personal Care</h3>
              <p>
                Skincare, haircare, and personal hygiene products from premium brands 
                like Nivea, ensuring quality and consumer satisfaction.
              </p>
            </div>
            <div className="card">
              <h3>Healthcare & Nutrition</h3>
              <p>
                Health supplements, nutrition products, and wellness solutions from 
                trusted brands like GSK and Dabur for better living.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Brands Choose Us</h2>
          <div className="grid-2">
            <div className="card">
              <h3>Market Penetration</h3>
              <p>
                Deep market penetration across General Trade, Modern Trade, and HoReCa 
                channels ensuring maximum brand visibility and availability.
              </p>
              <ul style={{marginTop: '1rem', paddingLeft: '1.5rem'}}>
                <li>200+ daily deliveries</li>
                <li>Thousands of retail touchpoints</li>
                <li>Strategic warehouse locations</li>
              </ul>
            </div>
            <div className="card">
              <h3>Professional Service</h3>
              <p>
                Dedicated account management, timely deliveries, and comprehensive 
                market intelligence to support brand growth and market expansion.
              </p>
              <ul style={{marginTop: '1rem', paddingLeft: '1.5rem'}}>
                <li>Expert distribution management</li>
                <li>Real-time inventory tracking</li>
                <li>Market feedback and insights</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container" style={{textAlign: 'center'}}>
          <h2 className="section-title">Partner With Us</h2>
          <p className="section-subtitle">
            Looking to expand your brand's reach in South India? Let's discuss how our 
            distribution network can help grow your business.
          </p>
          <Link href="/contact" className="cta-button">
            Get In Touch
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}