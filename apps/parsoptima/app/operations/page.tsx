import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Our Operations - Pars Optima Enterprises LLP',
  description: 'Learn about our distribution operations, infrastructure, fleet, and logistics network across Bangalore, Hosur, and Hyderabad.',
};

export default function Operations() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Our Operations</h1>
            <p className="tagline">Robust Infrastructure for Efficient Distribution</p>
            <p className="description">
              Discover our comprehensive logistics network, strategic warehouse locations, 
              and efficient delivery systems that ensure reliable FMCG distribution across South India.
            </p>
          </div>
        </div>
      </section>

      {/* Operational Metrics */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Operational Excellence</h2>
          <div className="grid-3">
            <div className="card">
              <h3>Daily Volume</h3>
              <p className="stat-number">200+</p>
              <p>Orders processed and delivered daily across our network, ensuring consistent supply to thousands of retailers.</p>
            </div>
            <div className="card">
              <h3>Fleet Size</h3>
              <p className="stat-number">10+</p>
              <p>Modern vehicles including Bolero and Supro for reliable delivery across urban and rural areas.</p>
            </div>
            <div className="card">
              <h3>Coverage</h3>
              <p className="stat-number">3</p>
              <p>Major cities with strategic warehouse locations ensuring efficient distribution across South India.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="section" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <h2 className="section-title">Infrastructure Network</h2>
          <div className="grid-3">
            <div className="card">
              <h3>🏭 Bangalore Hub</h3>
              <p><strong>Primary Distribution Center</strong></p>
              <ul style={{marginTop: '1rem', paddingLeft: '1.5rem'}}>
                <li>Main warehouse facility</li>
                <li>Advanced inventory management</li>
                <li>Quality control systems</li>
                <li>Temperature-controlled storage</li>
              </ul>
              <p style={{marginTop: '1rem'}}><strong>Coverage:</strong> Bangalore metropolitan area and surrounding districts</p>
            </div>
            
            <div className="card">
              <h3>🏭 Hosur Facility</h3>
              <p><strong>Regional Distribution Center</strong></p>
              <ul style={{marginTop: '1rem', paddingLeft: '1.5rem'}}>
                <li>Strategic border location</li>
                <li>Cross-state distribution hub</li>
                <li>Efficient customs handling</li>
                <li>Multi-brand consolidation</li>
              </ul>
              <p style={{marginTop: '1rem'}}><strong>Coverage:</strong> Tamil Nadu border regions and industrial areas</p>
            </div>
            
            <div className="card">
              <h3>🏭 Hyderabad Center</h3>
              <p><strong>Telangana Distribution Hub</strong></p>
              <ul style={{marginTop: '1rem', paddingLeft: '1.5rem'}}>
                <li>Modern warehouse systems</li>
                <li>Tech-enabled operations</li>
                <li>Fast-moving consumer goods focus</li>
                <li>Regional brand partnerships</li>
              </ul>
              <p style={{marginTop: '1rem'}}><strong>Coverage:</strong> Greater Hyderabad and Telangana state</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet & Logistics */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Fleet & Logistics</h2>
          <div className="grid-2">
            <div className="card">
              <h3>🚛 Vehicle Fleet</h3>
              <div className="fleet-details">
                <div className="vehicle-type">
                  <h4>Bolero Vehicles</h4>
                  <p>Robust utility vehicles perfect for urban deliveries and challenging terrain. Reliable performance for daily operations.</p>
                </div>
                <div className="vehicle-type">
                  <h4>Supro Vehicles</h4>
                  <p>Efficient mini-trucks ideal for bulk deliveries and longer routes. Optimized for fuel efficiency and payload capacity.</p>
                </div>
                <div className="vehicle-type">
                  <h4>Specialized Vehicles</h4>
                  <p>Temperature-controlled and secured transport vehicles for specific product requirements.</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3>📋 Logistics Management</h3>
              <div className="logistics-features">
                <div className="feature">
                  <h4>Route Optimization</h4>
                  <p>Smart routing systems to minimize delivery time and fuel consumption while maximizing coverage.</p>
                </div>
                <div className="feature">
                  <h4>Real-time Tracking</h4>
                  <p>GPS-enabled fleet management for real-time delivery tracking and customer updates.</p>
                </div>
                <div className="feature">
                  <h4>Inventory Integration</h4>
                  <p>Seamless integration between warehouse inventory and delivery schedules for optimal efficiency.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Distribution Channels */}
      <section className="section" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <h2 className="section-title">Distribution Channels</h2>
          <div className="grid-3">
            <div className="card">
              <h3>🏪 General Trade</h3>
              <p>Traditional retail outlets including:</p>
              <ul style={{marginTop: '1rem', paddingLeft: '1.5rem'}}>
                <li>Local grocery stores</li>
                <li>Neighborhood kirana shops</li>
                <li>Independent retailers</li>
                <li>Rural distribution points</li>
              </ul>
              <p style={{marginTop: '1rem', color: 'var(--accent-orange)', fontWeight: '600'}}>
                Extensive network reaching thousands of retailers
              </p>
            </div>
            
            <div className="card">
              <h3>🏬 Modern Trade</h3>
              <p>Organized retail chains including:</p>
              <ul style={{marginTop: '1rem', paddingLeft: '1.5rem'}}>
                <li>Supermarket chains</li>
                <li>Hypermarkets</li>
                <li>Department stores</li>
                <li>Online retail platforms</li>
              </ul>
              <p style={{marginTop: '1rem', color: 'var(--accent-orange)', fontWeight: '600'}}>
                Strategic partnerships with major retail chains
              </p>
            </div>
            
            <div className="card">
              <h3>🍽️ HoReCa</h3>
              <p>Hospitality sector including:</p>
              <ul style={{marginTop: '1rem', paddingLeft: '1.5rem'}}>
                <li>Restaurants and cafes</li>
                <li>Hotels and resorts</li>
                <li>Catering services</li>
                <li>Institutional buyers</li>
              </ul>
              <p style={{marginTop: '1rem', color: 'var(--accent-orange)', fontWeight: '600'}}>
                Specialized service for hospitality needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Systems */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Technology & Systems</h2>
          <div className="grid-2">
            <div className="card">
              <h3>💻 Management Systems</h3>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li><strong>Inventory Management:</strong> Real-time stock tracking and automated reordering</li>
                <li><strong>Order Processing:</strong> Streamlined order-to-delivery workflow systems</li>
                <li><strong>Customer Portal:</strong> Online ordering and account management platforms</li>
                <li><strong>Analytics Dashboard:</strong> Performance metrics and business intelligence</li>
              </ul>
            </div>
            
            <div className="card">
              <h3>📱 Mobile Solutions</h3>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li><strong>Delivery Tracking:</strong> Mobile apps for real-time delivery updates</li>
                <li><strong>Field Sales:</strong> Sales team mobile tools for order management</li>
                <li><strong>Quality Control:</strong> Mobile inspection and reporting systems</li>
                <li><strong>Customer Support:</strong> Multi-channel customer service platforms</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Integration */}
      <section className="section" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <h2 className="section-title">Strategic Partnerships</h2>
          <div className="grid-2">
            <div className="card">
              <h3>🤝 Financial Partnerships</h3>
              <p>
                <strong>NBFC Lending Solutions:</strong> Our partnerships with leading NBFCs 
                enable comprehensive financial support for our customers. This includes:
              </p>
              <ul style={{marginTop: '1rem', paddingLeft: '1.5rem'}}>
                <li>Flexible lending solutions for inventory management</li>
                <li>Insurance coverage for business protection</li>
                <li>Cash flow optimization programs</li>
                <li>Growth financing options</li>
              </ul>
            </div>
            
            <div className="card">
              <h3>🎯 Operational Synergies</h3>
              <p>
                Combined operational strengths deliver superior value to our brand partners:
              </p>
              <ul style={{marginTop: '1rem', paddingLeft: '1.5rem'}}>
                <li>Increased market penetration and coverage</li>
                <li>Optimized logistics and cost efficiency</li>
                <li>Enhanced service levels and reliability</li>
                <li>Scalable growth opportunities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section">
        <div className="container" style={{textAlign: 'center'}}>
          <h2 className="section-title">Experience Our Operational Excellence</h2>
          <p className="section-subtitle">
            Ready to leverage our robust distribution network for your brand's growth? 
            Let's discuss how our operations can support your business objectives.
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