export default function ContactDetails() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Inquiries */}
        <div>
          <h2 className="text-xl font-semibold underline underline-offset-4 mb-4">
            Inquiries
          </h2>
          <p className="text-gray-700 leading-relaxed">
            For any inquiries, questions or commendations, please contact us
            using the details below.
          </p>
        </div>

        {/* Head Office */}
        <div>
          <h2 className="text-xl font-semibold underline underline-offset-4 mb-4">
            Head Office
          </h2>
          <p className="text-gray-700 leading-relaxed">
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
