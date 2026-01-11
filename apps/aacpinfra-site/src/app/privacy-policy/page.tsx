import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Privacy Policy | AACP Infrastructure",
  description:
    "Privacy Policy of AACP Infrastructure outlining data collection, usage, security, and protection practices.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* ================= LEGAL PAGE HEADER ================= */}
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-32 py-2 flex items-center gap-10">
          {/* Title Block */}
          <div className="mt-4">
            <h1 className="text-4xl font-semibold text-black tracking-wide">
              Privacy Policy
            </h1>
          </div>
        </div>

        {/* Subtle Divider */}
        <div className="h-px bg-gray-300 max-w-7xl mx-auto" />
      </header>

      {/* ================= CONTENT ================= */}
      <main className="bg-white">
        <div className="max-w-5xl mx-auto px-4 py-6 text-gray-800 text-[15px] leading-relaxed space-y-7">
          {/* Introduction */}
          <p>
            AACP Infrastructure (“we”, “our”, “us”, or “the Company”) respects
            your privacy and is committed to protecting the personal information
            that you share with us through our website, business communications,
            and other interactions. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information.
          </p>

          {/* Scope */}
          <section>
            <h2 className="text-xl font-semibold text-black mb-2">
              Scope of This Policy
            </h2>
            <p>
              This Privacy Policy applies to all visitors, users, clients,
              contractors, vendors, job applicants, and business partners who
              access our website or provide information to AACP Infrastructure
              through digital or offline means.
            </p>
          </section>

          {/* Information Collected */}
          <section>
            <h2 className="text-xl font-semibold text-black mb-2">
              Information We Collect
            </h2>
            <p>
              We may collect the following categories of information:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>Personal Information:</strong> Name, email address,
                phone number, company name, designation, and communication
                details submitted through forms or correspondence.
              </li>
              <li>
                <strong>Professional Information:</strong> Business details
                provided for project discussions, tenders, subcontractor
                registrations, recruitment, or partnerships.
              </li>
              <li>
                <strong>Technical Information:</strong> IP address, browser
                type, device information, operating system, and website usage
                data collected automatically.
              </li>
            </ul>
          </section>

          {/* Usage */}
          <section>
            <h2 className="text-xl font-semibold text-black mb-2">
              How We Use Your Information
            </h2>
            <p>
              The information collected may be used for the following purposes:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>To respond to inquiries and communications</li>
              <li>To provide details about our services and projects</li>
              <li>To evaluate business opportunities and tenders</li>
              <li>To improve website performance and user experience</li>
              <li>To comply with legal and regulatory obligations</li>
            </ul>
          </section>

          {/* Legal Basis */}
          <section>
            <h2 className="text-xl font-semibold text-black mb-2">
              Legal Basis for Processing
            </h2>
            <p>
              We process personal information based on legitimate business
              interests, contractual necessity, compliance with legal
              obligations, and where applicable, the consent provided by you.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-black mb-2">
              Cookies and Tracking Technologies
            </h2>
            <p>
              Our website may use cookies and similar technologies to enhance
              functionality, analyze traffic, and improve user experience.
              Cookies do not collect personally identifiable information unless
              voluntarily provided by you. You may manage cookie preferences
              through your browser settings.
            </p>
          </section>

          {/* Sharing */}
          <section>
            <h2 className="text-xl font-semibold text-black mb-2">
              Information Sharing and Disclosure
            </h2>
            <p>
              AACP Infrastructure does not sell, rent, or trade personal
              information. Information may be shared only:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>With authorized internal teams for business operations</li>
              <li>
                With trusted service providers (IT, email, or hosting services)
                strictly for operational purposes
              </li>
              <li>
                When required by law, regulation, or governmental authority
              </li>
            </ul>
          </section>

    <section>
        <h2 className="text-xl font-semibold text-black mb-2">
                Data Security, Retention & Third-Party Links
        </h2>
        <p>
            We implement appropriate technical, administrative, and organizational
            safeguards to protect personal information against unauthorized access,
            disclosure, alteration, or destruction. While we take reasonable measures
            to secure data, no method of electronic transmission or storage is
            completely secure.
        </p>
        <p className="mt-3">
            Personal information is retained only for as long as necessary to fulfill
            the purposes outlined in this policy or as required by applicable laws and
            regulatory obligations.
        </p>
        <p className="mt-3">
            Our website may contain links to third-party websites. AACP Infrastructure
            is not responsible for the privacy practices or content of such external
            sites, and users are encouraged to review the privacy policies of any
            third-party websites they visit.
        </p>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-black mb-2">
        Your Rights & Policy Updates
        </h2>
        <p>
        Subject to applicable laws, you may request access to, correction of, or
        deletion of your personal information by contacting us using the details
        provided below.
        </p>
        <p className="mt-3">
        We reserve the right to update or modify this Privacy Policy at any time.
        Any changes will become effective upon being posted on this page, along
        with an updated effective date.
        </p>
    </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-black mb-2">
              Contact Us
            </h2>
            <p>
              If you have any questions or concerns regarding this Privacy
              Policy, please contact us at{" "}
              <strong>info@aacpinfra.com</strong>.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
