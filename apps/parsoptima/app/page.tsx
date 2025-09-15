'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.message) {
        alert('Please fill in all required fields (Name, Email, and Message).');
        setIsSubmitting(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address.');
        setIsSubmitting(false);
        return;
      }

      // For now, we'll log the data and show success message
      // In a real implementation, you would send this to your backend/email service
      console.log('Form submission:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        message: ''
      });
      
      alert('Thank you for your message! We will get back to you within 24 hours.');
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      alert('There was an error sending your message. Please try again or contact us directly at info@parsoptima.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <Link href="/" className="logo">
              <Image 
                src="/Logo_NoBG.png" 
                alt="Pars Optima Enterprises LLP" 
                width={200} 
                height={50}
                priority
                className="logo-image"
              />
            </Link>
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
            <div className="hero-text">
              <h1>Drive Brand Success Across South India</h1>
              <p className="tagline">Strategic FMCG Distribution & Supply Chain Solutions</p>
              <p className="description">
                Pars Optima Enterprises connects leading brands with thousands of retailers through 
                our advanced distribution network. From General Trade to Modern Trade and HoReCa - 
                we ensure maximum market penetration and sustainable growth.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">200+</div>
                  <div className="stat-label">Daily Deliveries</div>
                </div>
                <div className="stat">
                  <div className="stat-number">3</div>
                  <div className="stat-label">Strategic Cities</div>
                </div>
                <div className="stat">
                  <div className="stat-number">7+</div>
                  <div className="stat-label">Partner Brands</div>
                </div>
              </div>
              <div className="cta-buttons">
                <Link href="/contact" className="cta-button primary">
                  Become a Partner
                </Link>
                <Link href="/operations" className="cta-button secondary">
                  Our Capabilities
                </Link>
              </div>
            </div>
            <div className="hero-visual">
              <div className="supply-chain-graphic">
                <div className="distribution-flow">
                  <div className="flow-step manufacturer">
                    <div className="step-icon">🏭</div>
                    <span>Manufacturers</span>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step distributor active">
                    <div className="step-icon">🚚</div>
                    <span>Pars Optima</span>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step retailers">
                    <div className="step-icon">🏪</div>
                    <span>Retailers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="section" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <h2 className="section-title">Why Leading Brands Choose Us</h2>
          <p className="section-subtitle">
            Strategic distribution expertise that drives measurable growth across South Indian markets
          </p>
          <div className="grid-3">
            <div className="capability-card">
              <div className="capability-icon">📈</div>
              <h3>Market Penetration</h3>
              <p>
                Deep reach across General Trade, Modern Trade, and HoReCa channels with 
                thousands of active retail touchpoints in strategic locations.
              </p>
              <div className="capability-stats">
                <span>200+ Daily Orders</span>
                <span>3 Strategic Cities</span>
              </div>
            </div>
            <div className="capability-card">
              <div className="capability-icon">🚚</div>
              <h3>Logistics Excellence</h3>
              <p>
                Advanced fleet management with 10+ modern vehicles ensuring reliable, 
                timely deliveries and optimal inventory management.
              </p>
              <div className="capability-stats">
                <span>10+ Vehicle Fleet</span>
                <span>Same-day Delivery</span>
              </div>
            </div>
            <div className="capability-card">
              <div className="capability-icon">🤝</div>
              <h3>Financial Solutions</h3>
              <p>
                We have partnered with leading NBFCs to offer lending solutions and 
                comprehensive insurance facilities to our customers, enabling better 
                cash flow management and business growth.
              </p>
              <div className="capability-stats">
                <span>NBFC Lending</span>
                <span>Insurance Coverage</span>
              </div>
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
            Get in touch for partnership opportunities, distribution inquiries, or to learn about our NBFC lending and insurance solutions
          </p>
          
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleInputChange}
                required 
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input 
                type="text" 
                id="company" 
                name="company" 
                value={formData.company}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleInputChange}
                required 
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea 
                id="message" 
                name="message" 
                value={formData.message}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                rows={5}
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="cta-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          <div className="contact-info">
            <div className="contact-card">
              <h3>Bangalore Office</h3>
              <p>164, 2nd Main Rd, Sun City Layout</p>
              <p>JP Nagar 7th Phase, Bengaluru</p>
              <p>Kothnur, Karnataka 560078</p>
              <p>Email: info@parsoptima.com</p>
            </div>
            <div className="contact-card">
              <h3>Hosur Office</h3>
              <p>420/1, Hosur - Thally Road</p>
              <p>Kalkondapalli, Krishnagiri</p>
              <p>Tamil Nadu 635114, India</p>
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