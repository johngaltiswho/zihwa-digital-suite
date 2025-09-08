import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Refund Policy - Pars Optima Enterprises LLP',
  description: 'Refund and return policy for products distributed by Pars Optima Enterprises across South India.',
};

export default function RefundPolicy() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Refund Policy</h1>
            <p className="tagline">Clear Guidelines for Returns and Refunds</p>
            <p className="description">
              Our commitment to quality extends to our refund and return policies, 
              ensuring fair resolution for all parties in our distribution network.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          <div className="content-wrapper">
            <h2 className="section-title">Product Return Policy</h2>
            
            <div className="policy-section">
              <h3>Eligibility for Returns</h3>
              <p>
                As a distributor of FMCG products, we accept returns under the following conditions:
              </p>
              <ul>
                <li>Products must be reported within <strong>24 hours</strong> of delivery</li>
                <li>Items must be in original, unopened condition with intact packaging</li>
                <li>Manufacturing defects or damage during transit</li>
                <li>Incorrect products delivered due to our error</li>
                <li>Products approaching expiry date (within 30 days of delivery)</li>
              </ul>
            </div>

            <div className="policy-section">
              <h3>Non-Returnable Items</h3>
              <p>The following items cannot be returned:</p>
              <ul>
                <li>Products opened or used by the customer</li>
                <li>Items damaged due to mishandling after delivery</li>
                <li>Products without original packaging or labels</li>
                <li>Items ordered specifically at customer's request</li>
                <li>Perishable goods beyond return window</li>
              </ul>
            </div>

            <div className="policy-section">
              <h3>Return Process</h3>
              <p>To initiate a return:</p>
              <ol>
                <li>Contact our customer service within 24 hours of delivery</li>
                <li>Provide order details and reason for return</li>
                <li>Our representative will inspect the products</li>
                <li>Approved returns will be collected from your location</li>
                <li>Refund or replacement will be processed within 3-5 business days</li>
              </ol>
            </div>

            <div className="policy-section">
              <h3>Refund Methods</h3>
              <p>Refunds will be processed through:</p>
              <ul>
                <li><strong>Credit Adjustment:</strong> Applied to your next order (preferred method)</li>
                <li><strong>Bank Transfer:</strong> Direct transfer to your registered account</li>
                <li><strong>Product Replacement:</strong> Like-for-like replacement where applicable</li>
              </ul>
            </div>

            <div className="policy-section">
              <h3>Damaged or Defective Products</h3>
              <p>
                For products damaged during transit or with manufacturing defects:
              </p>
              <ul>
                <li>Immediate replacement at no additional cost</li>
                <li>We will coordinate with the manufacturer for warranty claims</li>
                <li>Transportation costs will be borne by us</li>
                <li>Priority processing for damaged goods</li>
              </ul>
            </div>

            <div className="policy-section">
              <h3>Channel-Specific Policies</h3>
              
              <div className="grid-2">
                <div className="card">
                  <h4>General Trade & Modern Trade</h4>
                  <p>
                    For retail partners, we follow standard trade practices with 
                    credit notes for approved returns and exchanges based on 
                    manufacturer guidelines.
                  </p>
                </div>
                <div className="card">
                  <h4>HoReCa Partners</h4>
                  <p>
                    Bulk orders for hotels, restaurants, and cafes have extended 
                    return windows and flexible exchange policies based on 
                    contractual agreements.
                  </p>
                </div>
              </div>
            </div>

            <div className="policy-section">
              <h3>Contact Information</h3>
              <p>For all return and refund queries:</p>
              <div className="contact-info">
                <p><strong>Email:</strong> parsoptima@yahoo.com</p>
                <p><strong>Phone:</strong> +91-9972508616</p>
                <p><strong>Business Hours:</strong> Monday to Saturday, 9:00 AM to 6:00 PM</p>
              </div>
              <p>
                Our customer service team will respond to all queries within 
                24 hours during business days.
              </p>
            </div>

            <div className="policy-section">
              <h3>Policy Updates</h3>
              <p>
                This refund policy is subject to change based on manufacturer 
                guidelines and business requirements. Updates will be communicated 
                to all partners in advance.
              </p>
              <p><strong>Last updated:</strong> January 2025</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}