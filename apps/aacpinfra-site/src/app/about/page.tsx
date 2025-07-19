// apps/aacpinfra-site/src/app/about/page.tsx
import Image from 'next/image';
import { aboutPageData } from '@/data/aboutPage';
import { teamData } from '@/data/team'; // The About Us page on your site also features the team
import { homepageData } from '@/data/homepage'; // For the reusable CTA section
import HeroBanner from '@/components/HeroBanner';
import CtaSection from '@/components/CtaSection';

export default function AboutUsPage() {
  const about = aboutPageData; // Alias for cleaner code
  const homeCta = homepageData.cta; // Get CTA data from homepage data

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Banner for About Us */}
      <HeroBanner
        title={about.heroTitle}
        imageUrl="https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Placeholder image for About banner
      />

      {/* Who We Are Section */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {about.whoWeAre.title}
          </h2>
          <div
            className="prose lg:prose-xl mx-auto text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: about.whoWeAre.contentHtml }}
          />
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Our Mission */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-blue-700 mb-4">
              {about.ourMission.title}
            </h3>
            <div
              className="prose lg:prose-lg text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: about.ourMission.contentHtml }}
            />
          </div>

          {/* Our Vision */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-blue-700 mb-4">
              {about.ourVision.title}
            </h3>
            <div
              className="prose lg:prose-lg text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: about.ourVision.contentHtml }}
            />
          </div>
        </div>
      </section>

      {/* Meet Our Experts Section (Reusing from homepage) */}
      <section className="py-16 px-6 md:px-12 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
          Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamData.map((member) => (
            <div key={member.id} className="bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col items-center text-center">
              {member.imageUrl && (
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-blue-200">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {member.name}
              </h3>
              <p className="text-blue-600 font-medium mb-4">{member.position}</p>
              <div
                className="prose prose-sm text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: member.bioHtml }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section (using reusable component) */}
      <CtaSection
        heading={homeCta.heading}
        buttonText={homeCta.buttonText}
        buttonLink={homeCta.buttonLink}
      />
    </div>
  );
}