import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';

export const metadata = {
  title: 'Contact Us - Pars Optima Enterprises LLP',
  description: 'Get in touch with Pars Optima Enterprises LLP for partnership opportunities, distribution inquiries, and business collaboration.',
};

export default function Contact() {

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Contact Us</h1>
            <p className="tagline">Let's Discuss Your Distribution Needs</p>
            <p className="description">
              Get in touch with our team for partnership opportunities, distribution inquiries, 
              NBFC lending solutions, insurance facilities, or any questions about our services.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section">
        <div className="container">
          <div className="contact-layout">
            <div className="contact-form-section">
              <h2 className="section-title">Send Us a Message</h2>
              <ContactForm />
            </div>

            <div className="contact-info-section">
              <h2 className="section-title">Get In Touch</h2>
              <div className="contact-methods">
                <div className="contact-method">
                  <h3>📧 Email</h3>
                  <p><a href="mailto:info@parsoptima.com">info@parsoptima.com</a></p>
                </div>
                
                <div className="contact-method">
                  <h3>📞 Phone</h3>
                  <p><a href="tel:+91-9972508616">+91-9972508616</a></p>
                  <p>Monday - Saturday: 9:00 AM - 6:00 PM</p>
                </div>

                <div className="contact-method">
                  <h3>🏢 Bangalore Office</h3>
                  <p>164, 2nd Main Rd, Sun City Layout</p>
                  <p>JP Nagar 7th Phase, Bengaluru</p>
                  <p>Kothnur, Karnataka 560078</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="section" style={{backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <h2 className="section-title">Our Locations</h2>
          <div className="grid-3">
            <div className="card">
              <h3>🏭 Bangalore Office</h3>
              <p><strong>Address:</strong> 164, 2nd Main Rd, Sun City Layout, JP Nagar 7th Phase, Bengaluru, Kothnur, Karnataka 560078</p>
              <p><strong>Services:</strong> Main distribution hub, NBFC lending, Insurance</p>
              <p><strong>Coverage:</strong> Bangalore & surrounding areas</p>
            </div>
            <div className="card">
              <h3>🏭 Hosur Office</h3>
              <p><strong>Address:</strong> 420/1, Hosur - Thally Road, Kalkondapalli, Krishnagiri, Tamil Nadu 635114</p>
              <p><strong>Services:</strong> Regional distribution center, Financial services</p>
              <p><strong>Coverage:</strong> Tamil Nadu border regions</p>
            </div>
            <div className="card">
              <h3>🏭 Hyderabad Center</h3>
              <p><strong>Address:</strong> Commercial District, Hyderabad</p>
              <p><strong>Services:</strong> Telangana distribution hub</p>
              <p><strong>Coverage:</strong> Hyderabad & Telangana</p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours & FAQ */}
      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div className="card">
              <h3>⏰ Business Hours</h3>
              <div className="business-hours">
                <div className="hours-row">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-row">
                  <span>Saturday</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <div className="hours-row">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
              <p style={{marginTop: '1rem', fontSize: '0.9rem', color: 'var(--gray-dark)'}}>
                For urgent matters outside business hours, please email us and we'll respond as soon as possible.
              </p>
            </div>
            
            <div className="card">
              <h3>❓ Quick Questions</h3>
              <div className="faq-item">
                <p><strong>Minimum order quantities?</strong></p>
                <p>Varies by product and brand. Contact us for specific details.</p>
              </div>
              <div className="faq-item">
                <p><strong>New brand partnerships?</strong></p>
                <p>We're always open to discussing new opportunities.</p>
              </div>
              <div className="faq-item">
                <p><strong>Delivery areas?</strong></p>
                <p>Bangalore, Hosur, Hyderabad and surrounding regions.</p>
              </div>
              <div className="faq-item">
                <p><strong>NBFC lending services?</strong></p>
                <p>We offer flexible lending solutions through partner NBFCs for inventory and growth financing.</p>
              </div>
              <div className="faq-item">
                <p><strong>Insurance coverage?</strong></p>
                <p>Comprehensive insurance facilities available for business protection and risk management.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}