import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Privacy Policy - Pars Optima Enterprises LLP',
  description: 'Privacy Policy for Pars Optima Enterprises LLP - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="hero" style={{paddingTop: '100px', paddingBottom: '60px'}}>
        <div className="container">
          <div className="hero-content">
            <h1>Privacy Policy</h1>
            <p className="tagline">Your Privacy Matters to Us</p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="section">
        <div className="container">
          <div className="legal-content">
            <div className="legal-section">
              <h2>1. Information We Collect</h2>
              <p>
                Pars Optima Enterprises LLP ("we," "our," or "us") collects information you provide directly to us, such as when you:
              </p>
              <ul>
                <li>Fill out contact forms on our website</li>
                <li>Send us emails or communicate with us</li>
                <li>Request information about our services</li>
                <li>Apply for partnerships or business opportunities</li>
              </ul>
              <p>The types of information we may collect include:</p>
              <ul>
                <li>Name and contact information (email, phone number)</li>
                <li>Company name and business information</li>
                <li>Messages and communications you send to us</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Respond to your inquiries and provide customer service</li>
                <li>Process partnership applications and business requests</li>
                <li>Send you information about our services and business opportunities</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>3. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy:
              </p>
              <ul>
                <li><strong>Service Providers:</strong> We may share information with trusted third parties who assist us in operating our website and conducting business</li>
                <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> Information may be transferred in connection with a merger, sale, or transfer of company assets</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </div>

            <div className="legal-section">
              <h2>5. Website Analytics</h2>
              <p>
                Our website may use analytics tools to collect information about how visitors use our site. This information helps us improve our website and services. Analytics data is typically anonymized and aggregated.
              </p>
            </div>

            <div className="legal-section">
              <h2>6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt out of marketing communications</li>
                <li>Contact us with privacy-related concerns</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>7. Data Retention</h2>
              <p>
                We retain personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.
              </p>
            </div>

            <div className="legal-section">
              <h2>8. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We take steps to ensure appropriate safeguards are in place to protect your information.
              </p>
            </div>

            <div className="legal-section">
              <h2>9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website with an updated effective date.
              </p>
            </div>

            <div className="legal-section">
              <h2>10. Contact Information</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
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