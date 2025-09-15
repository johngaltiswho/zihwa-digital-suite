import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'About Us - Pars Optima Enterprises LLP',
  description: 'Learn about Pars Optima Enterprises LLP, a trusted FMCG distributor serving General Trade, Modern Trade, and HoReCa across South India.',
};

export default function About() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>About Pars Optima Enterprises</h1>
            <p className="tagline">Your Trusted FMCG Distribution Partner</p>
            <p className="description">
              Building reliable supply chains across South India with expertise, 
              scale, and unwavering commitment to excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Who We Are</h2>
          <p className="section-subtitle">
            Pars Optima Enterprises LLP is a leading FMCG distributor specializing in 
            efficient distribution solutions across Bangalore, Hosur, and Hyderabad. 
            We serve General Trade, Modern Trade, and HoReCa channels with reliability and scale.
          </p>

          <div className="grid-2">
            <div className="card">
              <h3>Our Mission</h3>
              <p>
                To provide seamless distribution solutions that connect leading FMCG brands 
                with retailers and businesses across South India, ensuring product availability 
                and market reach through our robust logistics network.
              </p>
            </div>
            <div className="card">
              <h3>Our Vision</h3>
              <p>
                To be the most trusted and efficient FMCG distribution partner in South India, 
                known for reliability, innovation, and exceptional service quality that drives 
                mutual growth for brands and retail partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="section" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <h2 className="section-title">Our Scale</h2>
          <div className="grid-3">
            <div className="card">
              <h3>Daily Operations</h3>
              <p className="stat-number">200+</p>
              <p>Orders processed and delivered daily across our network</p>
            </div>
            <div className="card">
              <h3>Fleet Size</h3>
              <p className="stat-number">10+</p>
              <p>Modern vehicles including Bolero and Supro for reliable delivery</p>
            </div>
            <div className="card">
              <h3>Coverage Area</h3>
              <p className="stat-number">3</p>
              <p>Major cities with strategic warehouse locations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Extended Reach */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Extended Network</h2>
          <div className="grid-2">
            <div className="card">
              <h3>Financial Solutions</h3>
              <p>
                We have partnered with leading NBFCs to offer lending solutions and 
                comprehensive insurance facilities to our customers. This enables better 
                cash flow management and supports business growth across our network.
              </p>
            </div>
            <div className="card">
              <h3>Market Coverage</h3>
              <p>
                Our distribution network spans across multiple channels:
              </p>
              <ul style={{marginTop: '1rem', paddingLeft: '1.5rem'}}>
                <li><strong>General Trade:</strong> Traditional retail outlets</li>
                <li><strong>Modern Trade:</strong> Organized retail chains</li>
                <li><strong>HoReCa:</strong> Hotels, Restaurants, and Cafes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <h2 className="section-title">Why Choose Pars Optima?</h2>
          <div className="grid-3">
            <div className="card">
              <h3>Reliability</h3>
              <p>
                Consistent delivery performance with 200+ daily orders ensures 
                your products reach the market on time, every time.
              </p>
            </div>
            <div className="card">
              <h3>Scale</h3>
              <p>
                Extensive network reaching thousands of retailers across 
                Bangalore, Hosur, and Hyderabad with strategic warehouse locations.
              </p>
            </div>
            <div className="card">
              <h3>Expertise</h3>
              <p>
                Deep understanding of South Indian markets with specialized 
                knowledge in FMCG distribution and supply chain management.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}