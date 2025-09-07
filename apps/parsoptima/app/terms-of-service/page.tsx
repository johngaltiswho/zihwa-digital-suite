import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Terms of Service - Pars Optima Enterprises LLP',
  description: 'Terms of Service for Pars Optima Enterprises LLP - Understanding our business terms and conditions.',
};

export default function TermsOfService() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="hero" style={{paddingTop: '100px', paddingBottom: '60px'}}>
        <div className="container">
          <div className="hero-content">
            <h1>Terms of Service</h1>
            <p className="tagline">Business Terms and Conditions</p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="section">
        <div className="container">
          <div className="legal-content">
            <div className="legal-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using the website of Pars Optima Enterprises LLP ("Company," "we," "our," or "us"), 
                you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </div>

            <div className="legal-section">
              <h2>2. Company Overview</h2>
              <p>
                Pars Optima Enterprises LLP is a Limited Liability Partnership engaged in FMCG distribution services 
                across Bangalore, Hosur, and Hyderabad. We provide distribution solutions for General Trade, 
                Modern Trade, and HoReCa channels.
              </p>
            </div>

            <div className="legal-section">
              <h2>3. Services</h2>
              <p>Our services include but are not limited to:</p>
              <ul>
                <li>FMCG product distribution and logistics</li>
                <li>Supply chain management solutions</li>
                <li>Market penetration and retail network access</li>
                <li>Warehousing and inventory management</li>
                <li>Business partnership opportunities</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>4. Business Partnerships</h2>
              <p>
                Partnership agreements with brands and suppliers are subject to separate terms and conditions. 
                Initial discussions through our website do not constitute a binding agreement. All business 
                partnerships require formal written agreements.
              </p>
            </div>

            <div className="legal-section">
              <h2>5. Website Use</h2>
              <p>You agree to use our website only for lawful purposes and in accordance with these terms. You agree not to:</p>
              <ul>
                <li>Use the site in any way that violates applicable laws or regulations</li>
                <li>Transmit any unauthorized or unsolicited advertising or promotional material</li>
                <li>Attempt to gain unauthorized access to our systems or networks</li>
                <li>Interfere with or disrupt the website's operation</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>6. Intellectual Property</h2>
              <p>
                The content on this website, including text, graphics, logos, images, and software, is the property 
                of Pars Optima Enterprises LLP or its content suppliers and is protected by copyright and other 
                intellectual property laws.
              </p>
            </div>

            <div className="legal-section">
              <h2>7. Disclaimer of Warranties</h2>
              <p>
                The information on this website is provided on an "as is" basis. We make no warranties, expressed or implied, 
                and hereby disclaim all other warranties including implied warranties of merchantability, fitness for a 
                particular purpose, or non-infringement.
              </p>
            </div>

            <div className="legal-section">
              <h2>8. Limitation of Liability</h2>
              <p>
                In no event shall Pars Optima Enterprises LLP be liable for any indirect, special, incidental, or 
                consequential damages arising out of or in connection with your use of this website or our services.
              </p>
            </div>

            <div className="legal-section">
              <h2>9. Business Terms</h2>
              <p>
                Commercial relationships with Pars Optima Enterprises LLP are governed by separate written agreements. 
                These may include:
              </p>
              <ul>
                <li>Distribution agreements with specific terms, pricing, and territories</li>
                <li>Service level agreements for delivery and performance standards</li>
                <li>Payment terms and conditions</li>
                <li>Product quality and compliance requirements</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>10. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of India, and any disputes 
                relating to these terms will be subject to the exclusive jurisdiction of the courts of Bangalore, Karnataka.
              </p>
            </div>

            <div className="legal-section">
              <h2>11. Privacy</h2>
              <p>
                Your privacy is important to us. Please review our <Link href="/privacy-policy">Privacy Policy</Link>, 
                which also governs your use of our website and services.
              </p>
            </div>

            <div className="legal-section">
              <h2>12. Modifications</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective when posted on our website. 
                Your continued use of the website after changes are posted constitutes acceptance of the modified terms.
              </p>
            </div>

            <div className="legal-section">
              <h2>13. Contact Information</h2>
              <p>
                For questions about these Terms of Service or our business practices, please contact us:
              </p>
              <div className="contact-details">
                <p><strong>Pars Optima Enterprises LLP</strong></p>
                <p>Email: <a href="mailto:parsoptima@yahoo.com">parsoptima@yahoo.com</a></p>
                <p>Phone: +91-9972508616</p>
                <p>Address: Bangalore, Karnataka, India</p>
              </div>
            </div>

            <div className="effective-date">
              <p><strong>Effective Date:</strong> January 1, 2024</p>
              <p><strong>Last Updated:</strong> January 1, 2024</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}