// apps/aacpinfra-site/src/app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { homepageData } from '@/data/homepage';
import { servicesData } from '@/data/services';
import { projectsData } from '@/data/projects';
import { teamData } from '@/data/team';
import CtaSection from '@/components/CtaSection';
import HeroBanner from '@/components/HeroBanner'; // Assuming you might use this directly for a hero banner on the home page or a specific section

export default function HomePage() {
  const home = homepageData; // Alias for cleaner code

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: home.hero.imageUrl ? `url(${home.hero.imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 p-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {home.hero.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {home.hero.subtitle}
          </p>
          <Link
            href={home.hero.buttonLink}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 inline-block text-lg"
          >
            {home.hero.buttonText}
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {home.aboutSection.title}
          </h2>
          <div
            className="prose lg:prose-xl mx-auto text-gray-700 leading-relaxed mb-8"
            dangerouslySetInnerHTML={{ __html: home.aboutSection.contentHtml }}
          />
          <Link
            href={home.aboutSection.buttonLink}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 inline-block"
          >
            {home.aboutSection.buttonText}
          </Link>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-100 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
          {home.servicesOverviewTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {servicesData.slice(0, 3).map((service) => ( // Show first 3 services
            <Link key={service.id} href={`/services/${service.slug}`}>
              <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 h-full flex flex-col items-center border border-gray-200">
                {service.icon_url && (
                  <Image
                    src={service.icon_url}
                    alt={service.title}
                    width={80}
                    height={80}
                    className="mb-6 object-contain"
                  />
                )}
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-700 flex-grow text-base leading-relaxed">
                  {service.short_description}
                </p>
                <span className="mt-6 text-blue-600 font-medium hover:underline text-sm">
                  Read More &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12">
          <Link
            href="/services"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 inline-block"
          >
            VIEW ALL SERVICES
          </Link>
        </div>
      </section>

      {/* Our Recent Works Section */}
      <section className="py-16 px-6 md:px-12 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
          {home.recentWorksTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projectsData.slice(0, 3).map((project) => ( // Show first 3 projects
            <Link key={project.id} href={`/projects/${project.slug}`}>
              <div className="bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 overflow-hidden h-full flex flex-col border border-gray-200">
                {project.imageUrls[0] && (
                  <div className="relative w-full h-48">
                    <Image
                      src={project.imageUrls[0]}
                      alt={project.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 text-left flex-grow">
                  <span className="text-sm font-semibold text-blue-600 uppercase mb-2 block">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {/* Placeholder for short description or excerpt */}
                    {project.descriptionHtml.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </p>
                </div>
                <div className="p-6 pt-0 text-left">
                  <span className="text-blue-600 font-medium hover:underline text-sm">
                    View Project &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12">
          <Link
            href="/projects"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 inline-block"
          >
            VIEW ALL PROJECTS
          </Link>
        </div>
      </section>

      {/* Meet Our Experts Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-100 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
          {home.teamSectionTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamData.slice(0, 3).map((member) => ( // Show first 3 team members
            <div key={member.id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col items-center text-center">
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
        heading={home.cta.heading}
        buttonText={home.cta.buttonText}
        buttonLink={home.cta.buttonLink}
      />
    </div>
  );
}