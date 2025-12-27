"use client";

export default function ContactMap() {
  return (
    <section className="w-full px-4 md:px-10">
      <div className="w-full h-[450px] border">
        <iframe
          title="AACP Infrastructure Location"
          src="https://www.google.com/maps?q=AACP%20Infrastructure%20Systems%20Pvt.%20Ltd.&output=embed"
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
