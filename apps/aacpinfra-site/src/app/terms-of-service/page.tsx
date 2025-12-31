import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | AACP Infrastructure",
  description:
    "Terms of Service governing the use of AACP Infrastructure website and services.",
};

export default function TermsOfServicePage() {
  return (
    <>
      {/* ================= LEGAL PAGE HEADER ================= */}
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-32 py-4 flex items-center gap-10">
          <div className="mt-1">
            <h1 className="text-4xl font-semibold text-black tracking-wide">
              Terms of Service
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Conditions governing the use of our website and services.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-300 max-w-7xl mx-auto" />
      </header>

      {/* ================= CONTENT ================= */}
      <main className="bg-white">
        <div className="max-w-5xl mx-auto px-4 py-6 text-gray-800 text-[15px] leading-relaxed space-y-6">
          {/* <p className="text-sm text-gray-600">
            <strong>Effective Date:</strong> 31/12/2025
          </p> */}

          <p>
            These Terms of Service (“Terms”) govern your access to and use of the
            website operated by AACP Infrastructure (“we”, “our”, “us”, or “the
            Company”). By accessing or using this website, you agree to be bound
            by these Terms.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-black mb-2">
              Use of the Website
            </h2>
            <p>
              This website is intended to provide general information about AACP
              Infrastructure, our services, projects, and capabilities. You
              agree to use the website only for lawful purposes and in a manner
              that does not infringe the rights of others or restrict their use
              of the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-2">
                Intellectual Property & Information Accuracy
            </h2>
        <p>
            All content on this website, including text, graphics, logos, images,
            designs, and layout, is the property of AACP Infrastructure or its licensors
            and is protected by applicable intellectual property laws. Unauthorized
            use, reproduction, or distribution of any content is strictly prohibited.
        </p>
        <p className="mt-3">
            While we strive to ensure that the information on this website is accurate
            and up to date, AACP Infrastructure makes no warranties or representations
            regarding the completeness, accuracy, or reliability of any content.
            Information is provided for general reference purposes only.
        </p>
        </section>


          <section>
            <h2 className="text-xl font-semibold text-black mb-2">
              Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, AACP Infrastructure shall
              not be liable for any direct, indirect, incidental, consequential,
              or special damages arising out of or in connection with the use of
              this website or reliance on its content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-2">
              Third-Party Links
            </h2>
            <p>
              This website may contain links to third-party websites for
              convenience. AACP Infrastructure does not endorse or assume
              responsibility for the content, policies, or practices of any
              third-party sites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-2">
              User Submissions
            </h2>
            <p>
              Any information submitted through contact forms or inquiries must
              be accurate and lawful. You agree not to submit any content that
              is misleading, harmful, or violates applicable laws or
              regulations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-2">
              Termination
            </h2>
            <p>
              AACP Infrastructure reserves the right to restrict or terminate
              access to this website at its discretion, without prior notice,
              for any violation of these Terms or applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-2">
              Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of India. Any disputes arising in relation to these Terms
              shall be subject to the jurisdiction of the competent courts in
              India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-2">
              Changes to These Terms
            </h2>
            <p>
              AACP Infrastructure reserves the right to modify these Terms at
              any time. Updated Terms will be posted on this page with an
              updated effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black mb-2">
              Contact Information
            </h2>
            <p>
              For any questions regarding these Terms of Service, please contact
              us at <strong>info@aacpinfra.com</strong>.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
