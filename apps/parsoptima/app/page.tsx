'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <Link href="/" className="logo">Pars Optima Enterprises LLP</Link>
            <ul className="nav-links">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/brands">Our Brands</Link></li>
              <li><Link href="/operations">Operations</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </nav>
          {mobileMenuOpen && (
            <div className="mobile-menu">
              <ul className="mobile-nav-links">
                <li><Link href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link></li>
                <li><Link href="/brands" onClick={() => setMobileMenuOpen(false)}>Our Brands</Link></li>
                <li><Link href="/operations" onClick={() => setMobileMenuOpen(false)}>Operations</Link></li>
                <li><Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Pars Optima Enterprises LLP</h1>
            <p className="tagline">Efficient FMCG Distribution Across South India</p>
            <p className="description">
              Pars Optima Enterprises LLP is a trusted FMCG distributor, serving General Trade, 
              Modern Trade, and HoReCa across Bangalore, Hosur, and Hyderabad.
            </p>
            <Link href="/contact" className="cta-button">Get In Touch</Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="section" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <h2 className="section-title">About Us</h2>
          <p className="section-subtitle">
            We specialize in FMCG distribution, delivering leading brands with reliability and scale. 
            Our network handles ~200 deliveries daily through a fleet of 10+ vehicles, reaching 
            thousands of retailers and businesses.
          </p>
          <div className="grid-2">
            <div className="card">
              <h3>Scale & Reliability</h3>
              <p>
                With over 200 daily deliveries and a growing network of retailers, we ensure 
                consistent supply chain management across our operational regions.
              </p>
            </div>
            <div className="card">
              <h3>Extended Reach</h3>
              <p>
                Through our integration with sister company Stalks N Spice, we provide extended 
                reach and comprehensive distribution solutions across South India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Brands Section */}
      <section id="brands" className="section">
        <div className="container">
          <h2 className="section-title">Our Brands</h2>
          <p className="section-subtitle">
            We distribute leading FMCG brands trusted by consumers across South India
          </p>
          <div className="brands-grid">
            <div className="brand-card">Britannia</div>
            <div className="brand-card">GSK</div>
            <div className="brand-card">Nivea</div>
            <div className="brand-card">Dabur</div>
            <div className="brand-card">Adani Wilmar</div>
            <div className="brand-card">Sunpure</div>
            <div className="brand-card">Pillsbury</div>
            <div className="brand-card">And Many More</div>
          </div>
        </div>
      </section>

      {/* Operations Section */}
      <section id="operations" className="section" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <h2 className="section-title">Our Operations</h2>
          <p className="section-subtitle">
            Robust infrastructure and logistics network ensuring efficient distribution
          </p>
          <div className="grid-3">
            <div className="card">
              <h3>Infrastructure</h3>
              <p>Strategic warehouses located in:</p>
              <ul style={{marginTop: '1rem', paddingLeft: '1.5rem'}}>
                <li>Bangalore</li>
                <li>Hosur</li>
                <li>Hyderabad</li>
              </ul>
            </div>
            <div className="card">
              <h3>Fleet</h3>
              <p>Modern vehicle fleet including:</p>
              <ul style={{marginTop: '1rem', paddingLeft: '1.5rem'}}>
                <li>Bolero vehicles</li>
                <li>Supro vehicles</li>
                <li>10+ delivery vehicles</li>
              </ul>
            </div>
            <div className="card">
              <h3>Daily Volume</h3>
              <p>Consistent delivery performance:</p>
              <ul style={{marginTop: '1rem', paddingLeft: '1.5rem'}}>
                <li>~200 orders per day</li>
                <li>Thousands of retailers served</li>
                <li>Multi-channel coverage</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="container">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">
            Get in touch for partnership opportunities or distribution inquiries
          </p>
          
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input type="text" id="company" name="company" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input type="tel" id="phone" name="phone" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required></textarea>
            </div>
            <button type="submit" className="cta-button">Send Message</button>
          </form>

          <div className="contact-info">
            <div className="contact-card">
              <h3>Head Office</h3>
              <p>Bangalore, Karnataka</p>
              <p>Email: info@parsoptima.com</p>
              <p>Phone: +91-XXXX-XXXXXX</p>
            </div>
            <div className="contact-card">
              <h3>Warehouse Locations</h3>
              <p>Bangalore • Hosur • Hyderabad</p>
              <p>Strategic locations for efficient distribution across South India</p>
            </div>
            <div className="contact-card">
              <h3>Business Hours</h3>
              <p>Monday - Saturday</p>
              <p>9:00 AM - 6:00 PM</p>
              <p>Closed on Sundays</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2024 Pars Optima Enterprises LLP. All rights reserved.</p>
            <div className="footer-links">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-of-service">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}