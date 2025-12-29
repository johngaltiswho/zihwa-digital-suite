export default function ContactDetails() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Inquiries */}
        <div>
          <h2 className="text-white font-semibold underline underline-offset-4 mb-4">
            Inquiries
          </h2>
          <p className="text-gray-700 text-white leading-relaxed">
            For any inquiries, questions or commendations, please contact us
            using the details below.
          </p>
          <div className="flex items-center gap-2 text-m mb-2">
            <span>✉️</span>
            <a href="mailto:info@aacpinfra.com" className="hover:underline">
              info@aacpinfra.com
            </a>
          </div>

          <div className="flex items-center gap-2 text-m">
            <span className="text-pink-600">📞</span>
            <a href="tel:+919403890723" className="hover:underline">
              +91 94038 90723
            </a>
          </div>
        </div>

        {/* Head Office */}
        <div>
          <h2 className="text-white font-semibold underline underline-offset-4 mb-4">
            Head Office
          </h2>
          <p className="text-gray-700 text-white leading-relaxed">
            #403, 3rd Floor, 22nd Cross,<br />
            Sector 6, HSR Layout,<br />
            Bengaluru – 560102<br />
            Karnataka, India
          </p>
        </div>

      </div>
    </section>
  );
}
