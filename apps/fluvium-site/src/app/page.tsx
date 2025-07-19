'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.section-animate');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-gray-800/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Image
              src="/fluvium-logo-glow-teal.png"
              alt="Fluvium Logo"
              width={120}
              height={48}
              className="cursor-pointer neon-glow animate-pulse-glow"
              priority
            />
          </div>

          {/* Navigation */}
          <nav className={`hidden md:flex items-center space-x-8 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">About</a>
            <a href="#offerings" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">Offerings</a>
            <Link href="/humility-db" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">Humility DB</Link>
            <Link href="/shop" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">Shop</Link>
            <a href="#founder" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">Founder</a>
            <button className="neon-border bg-transparent text-white px-6 py-2 text-sm font-light tracking-wider hover:bg-cyan-400/10 transition-all duration-300">
              Join the Tribe
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Background Video Overlay */}
      <div className=""></div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 z-20 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className={`text-6xl md:text-8xl font-light tracking-wide mb-6 leading-tight transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Find Your
            <br />
            <span className="neon-glow font-extralight animate-pulse-glow">Flow</span>
          </h1>
          
          {/* Subheadline */}
          <p className={`text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Where discipline meets flow and ancient wisdom meets modern life.
            <br />
            Discover the warrior mindset that transforms everything you touch.
          </p>
          
          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button className="neon-border bg-transparent text-white px-8 py-4 text-lg font-light tracking-wider hover:bg-cyan-400/10 transition-all duration-300 min-w-[200px] hover-lift">
              Begin Your Journey
            </button>
            
            <button className="text-gray-300 hover:text-white px-8 py-4 text-lg font-light tracking-wider transition-all duration-300 flex items-center gap-2 hover-lift">
              Explore Below
              <span className="text-2xl animate-bounce">↓</span>
            </button>
          </div>
        </div>
        
        {/* Subtle scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 animate-float">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full p-1">
            <div className="w-1 h-3 bg-gray-400 rounded-full mx-auto animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* About Fluvium Section */}
      <section id="about" className="py-12 px-6 bg-gradient-to-b from-black to-gray-900 section-animate">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-6">
              About <span className="neon-glow animate-pulse-glow">Fluvium</span>
            </h2>
            <p className="text-lg text-gray-400 font-light tracking-wide uppercase">
              Dream to Live Free
            </p>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed mb-8">
              Fluvium is where the warrior's code meets the executive's world. We believe that true strength emerges not from force, but from the ability to flow with life's currents while maintaining unshakeable presence.
            </p>
            
            <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
              Through Brazilian Jiu-Jitsu, mindful presence, and the pursuit of self-mastery, we cultivate warriors who understand that the greatest battles are fought within. This is your sanctuary for transformation—where discipline becomes freedom, and community becomes family.
            </p>
          </div>

          {/* Four Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Presence */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-black text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                ◯
              </div>
              <h3 className="text-2xl font-light mb-4 text-white">Presence</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                The art of being fully here, fully now. Every breath, every movement, every moment of stillness becomes a meditation.
              </p>
            </div>

            {/* Flow */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-black text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                ∞
              </div>
              <h3 className="text-2xl font-light mb-4 text-white">Flow</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                The skater's adaptability, the surfer's rhythm, the fighter's timing—all flowing into how you navigate life's challenges with maximum effectiveness.
              </p>
            </div>

            {/* Resilience */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-black text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                ◊
              </div>
              <h3 className="text-2xl font-light mb-4 text-white">Resilience</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                The capacity to bend without breaking. Like bamboo in the wind, like water around stone—strength that adapts and endures.
              </p>
            </div>

            {/* Tribe */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-black text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                ⬢
              </div>
              <h3 className="text-2xl font-light mb-4 text-white">Tribe</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                We rise together. A community bound not by convenience but by shared commitment to growth, truth, and authentic connection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Offerings Overview Section */}
      <section id="offerings" className="py-24 px-6 bg-gradient-to-b from-gray-900 to-black section-animate">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-6">
              Your <span className="neon-glow">Path</span> Forward
            </h2>
            <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto">
              Three pathways to integrate the warrior mindset into your daily practice. 
              For white collar athletes who refuse to settle for ordinary.
            </p>
          </div>

          {/* Three Offerings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tribe Training */}
            <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-500 hover:transform hover:scale-105 hover-lift">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient"></div>
              
              <div className="relative p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black text-xl font-bold animate-float">
                    ⚡
                  </div>
                  <h3 className="text-2xl font-light mb-4 text-white">Tribe Training</h3>
                </div>
                
                <p className="text-gray-300 font-light leading-relaxed mb-8 text-center">
                  Group classes that blend BJJ fundamentals with flow states and presence training. Where warriors sharpen each other in community.
                </p>
                
                <div className="text-center">
                  <button className="neon-border bg-transparent text-white px-6 py-3 text-sm font-light tracking-wider hover:bg-cyan-400/10 transition-all duration-300 w-full">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Inner Circle */}
            <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-black text-xl font-bold">
                    ◈
                  </div>
                  <h3 className="text-2xl font-light mb-4 text-white">Inner Circle</h3>
                </div>
                
                <p className="text-gray-300 font-light leading-relaxed mb-8 text-center">
                  Private coaching and curated membership for executives who demand excellence. Personalized training that fits your lifestyle.
                </p>
                
                <div className="text-center">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 text-sm font-light tracking-wider hover:from-purple-600 hover:to-pink-600 transition-all duration-300 w-full">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>

            {/* Immersions */}
            <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-orange-400/50 transition-all duration-500 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-red-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-black text-xl font-bold">
                    ◉
                  </div>
                  <h3 className="text-2xl font-light mb-4 text-white">Immersions</h3>
                </div>
                
                <p className="text-gray-300 font-light leading-relaxed mb-8 text-center">
                  Intensive retreats and workshops that break through limitations. Deep transformation through immersive experiences.
                </p>
                
                <div className="text-center">
                  <button className="neon-border bg-transparent text-white px-6 py-3 text-sm font-light tracking-wider hover:bg-orange-400/10 transition-all duration-300 w-full">
                    Explore Events
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <p className="text-gray-400 font-light mb-6">
              Ready to integrate movement, mindfulness, and mastery into your daily life?
            </p>
            <button className="bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-8 py-4 text-lg font-medium tracking-wider hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
              Start Your Journey
            </button>
          </div>
        </div>
      </section>

      {/* Humility DB Preview Section */}
      <section id="humility-db" className="py-24 px-6 bg-gradient-to-b from-black to-gray-900 section-animate">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-6">
              The <span className="neon-glow">Humility</span> Database
            </h2>
            <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto">
              Your personal digital dojo. Where technique meets philosophy, and practice becomes transformation.
            </p>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Description and Features */}
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-xl text-gray-300 font-light leading-relaxed">
                  More than just a learning platform—Humility DB is your companion for the journey inward. 
                  Every technique, every insight, every reflection designed to strip away the ego and reveal the warrior within.
                </p>
                
                <p className="text-lg text-gray-400 font-light leading-relaxed">
                  Available exclusively to Fluvium members, this curated collection of knowledge grows with you, 
                  adapting to your level while challenging you to go deeper.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black text-lg font-bold flex-shrink-0">
                    ▶
                  </div>
                  <div>
                    <h4 className="text-white font-light mb-2">Technique Library</h4>
                    <p className="text-gray-400 text-sm font-light">High-quality video breakdowns of essential BJJ techniques and flow sequences</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-black text-lg font-bold flex-shrink-0">
                    ◯
                  </div>
                  <div>
                    <h4 className="text-white font-light mb-2">Presence Training</h4>
                    <p className="text-gray-400 text-sm font-light">Guided sessions to master your energy, focus, and unshakeable presence</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-black text-lg font-bold flex-shrink-0">
                    ✎
                  </div>
                  <div>
                    <h4 className="text-white font-light mb-2">Reflection Prompts</h4>
                    <p className="text-gray-400 text-sm font-light">Journaling exercises that transform training into self-discovery</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-black text-lg font-bold flex-shrink-0">
                    ⚡
                  </div>
                  <div>
                    <h4 className="text-white font-light mb-2">Mindset Modules</h4>
                    <p className="text-gray-400 text-sm font-light">Timeless wisdom and modern psychology for the executive warrior's journey</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Mock Interface Preview */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-purple-500/5 rounded-2xl"></div>
                
                <div className="relative space-y-6">
                  {/* Mock Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-700/50">
                    <h3 className="text-lg font-light text-white">Today's Practice</h3>
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full"></div>
                  </div>

                  {/* Mock Content Items */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg">
                      <div className="w-12 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-light">Guard Retention Flow</p>
                        <p className="text-gray-400 text-xs">15 min technique breakdown</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg">
                      <div className="w-12 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-light">Flow State Session</p>
                        <p className="text-gray-400 text-xs">10 min guided practice</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg">
                      <div className="w-12 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-light">Ego & Flow Reflection</p>
                        <p className="text-gray-400 text-xs">5 min journal prompt</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Founder Quote */}
          <div className="mt-20 text-center">
            <div className="max-w-4xl mx-auto">
              <blockquote className="text-2xl md:text-3xl font-light text-gray-300 leading-relaxed mb-8 italic">
                "The path to mastery isn't about accumulating techniques—it's about cultivating the humility to see what you don't know, and the courage to integrate that wisdom into every aspect of your life."
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full"></div>
                <div className="text-left">
                  <p className="text-white font-light">Fluvium Founder</p>
                  <p className="text-gray-400 text-sm font-light">Black Belt, Flow State Coach</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link href="/humility-db" className="inline-block neon-border bg-transparent text-white px-8 py-4 text-lg font-light tracking-wider hover:bg-cyan-400/10 transition-all duration-300">
              Access Humility DB
            </Link>
          </div>
        </div>
      </section>

      {/* Founder Section / Ethos Letter */}
      <section id="founder" className="py-24 px-6 bg-gradient-to-b from-gray-900 to-black section-animate">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8 md:p-12">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:space-x-8 mb-8">
              {/* Photo Placeholder */}
              <div className="flex-shrink-0 mx-auto md:mx-0 mb-6 md:mb-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center border-2 border-gray-600/50">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-black text-2xl md:text-3xl font-bold">
                    F
                  </div>
                </div>
              </div>

              {/* Title and Intro */}
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4 text-white">
                  A Letter From the Founder
                </h2>
                <p className="text-lg text-gray-400 font-light">
                  On why Fluvium exists, and who it serves
                </p>
              </div>
            </div>

            {/* Letter Content */}
            <div className="space-y-6 text-lg md:text-xl font-light leading-relaxed text-gray-300">
              <p>
                I didn't set out to build another fitness brand. The world has enough of those.
              </p>
              
              <p>
                Fluvium emerged from a simple observation: the most successful people I knew—the executives, the entrepreneurs, the leaders—were also the most disconnected from their core, their presence, their authentic power. They had mastered the external game but remained strangers to the internal one.
              </p>
              
              <p>
                Brazilian Jiu-Jitsu taught me that true strength isn't about force. It's about flow. It's about finding the path of least resistance while maintaining maximum effectiveness. The warrior's path showed me that the quality of your presence determines the quality of your life. And in the quiet moments between technique and sparring, I discovered that the real opponent was never the person across from me—it was my own ego, my own limitations, my own fear of going deeper.
              </p>
              
              <p>
                This is for the ones who have achieved success by conventional metrics but know there's something more. For those who understand that the warrior's code isn't confined to the dojo—it's a way of moving through the world with intention, integrity, and unshakeable presence.
              </p>
              
              <p>
                Fluvium isn't about becoming someone else. It's about integrating the timeless principles of warrior culture into your modern reality—with all the discomfort, all the growth, and all the quiet revolution that comes with it.
              </p>
              
              <p className="text-gray-400 font-light">
                The mats are waiting. The path is calling. The journey inward begins whenever you're ready.
              </p>
            </div>

            {/* Signature */}
            <div className="mt-12 pt-8 border-t border-gray-700/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-6 md:mb-0">
                  <div className="text-2xl md:text-3xl font-light text-cyan-400 mb-2" style={{fontFamily: 'cursive'}}>
                    — Founder
                  </div>
                  <p className="text-gray-400 text-sm font-light">
                    Fluvium Founder & Head Coach
                  </p>
                </div>
                
                <div className="flex flex-col md:items-end text-center md:text-right">
                  <p className="text-gray-400 text-sm font-light mb-2">
                    Ready to begin your journey?
                  </p>
                  <button className="neon-border bg-transparent text-white px-6 py-3 text-sm font-light tracking-wider hover:bg-cyan-400/10 transition-all duration-300">
                    Join the Tribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action / Start Your Journey */}
      <section className="py-16 px-6 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden section-animate">
        {/* Background Texture/Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-400/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(0,255,255,0.03) 2px,
                rgba(0,255,255,0.03) 4px
              )
            `
          }}></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Section Header */}
          <div className="mb-16">
            <h2 className="text-5xl md:text-7xl font-light tracking-wide mb-6 text-white">
              Start Your
              <br />
              <span className="neon-glow font-extralight">Journey</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
              Three pathways to transformation. Choose the one that calls to you.
            </p>
          </div>

          {/* Three Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Join a Class */}
            <div className="group">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-500 hover:transform hover:scale-105">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black text-2xl font-bold">
                    ⚡
                  </div>
                  <h3 className="text-2xl font-light mb-3 text-white">Join a Class</h3>
                  <p className="text-gray-400 font-light mb-6">
                    Experience the warrior's code in community with like-minded leaders
                  </p>
                </div>
                <button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-8 py-4 text-lg font-medium tracking-wider hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105">
                  Join a Class
                </button>
              </div>
            </div>

            {/* Apply to Inner Circle */}
            <div className="group">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-black text-2xl font-bold">
                    ◈
                  </div>
                  <h3 className="text-2xl font-light mb-3 text-white">Apply to Inner Circle</h3>
                  <p className="text-gray-400 font-light mb-6">
                    Private mentorship for leaders ready to embody the warrior's path
                  </p>
                </div>
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 text-lg font-medium tracking-wider hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                  Apply Now
                </button>
              </div>
            </div>

            {/* Explore the Path */}
            <div className="group">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl p-8 hover:border-orange-400/50 transition-all duration-500 hover:transform hover:scale-105">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-black text-2xl font-bold">
                    ◉
                  </div>
                  <h3 className="text-2xl font-light mb-3 text-white">Explore the Path</h3>
                  <p className="text-gray-400 font-light mb-6">
                    Intensive experiences that integrate warrior principles into your leadership style
                  </p>
                </div>
                <button className="w-full neon-border bg-transparent text-white px-8 py-4 text-lg font-medium tracking-wider hover:bg-orange-400/10 transition-all duration-300">
                  Explore the Path
                </button>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-gray-700/50 pt-12">
            <p className="text-gray-400 font-light mb-6">
              Questions about your journey? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href="mailto:hello@fluvium.com" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2">
                <span className="text-lg">✉</span>
                hello@fluvium.com
              </a>
              <span className="hidden sm:block text-gray-600">•</span>
              <a href="tel:+1234567890" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2">
                <span className="text-lg">📞</span>
                (123) 456-7890
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gradient-to-t from-black to-gray-900 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Logo & Brand */}
            <div className="md:col-span-1">
              <div className="mb-6">
                <div className="mb-4">
                  <Image
                    src="/logo-light.png"
                    alt="Fluvium Logo"
                    width={60}
                    height={60}
                    className="mb-2"
                  />
                </div>
                <h3 className="text-2xl font-light tracking-wide text-white mb-2">
                  <span className="neon-glow">Fluvium</span>
                </h3>
                <p className="text-gray-400 text-sm font-light">
                  Dream to Live Free
                </p>
              </div>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Where ancient warrior wisdom meets modern leadership. 
                Your journey to flow begins here.
              </p>
            </div>

            {/* City/Location Availability */}
            <div className="md:col-span-1">
              <h4 className="text-white font-light mb-4">Locations</h4>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm font-light">New York, NY</p>
                <p className="text-gray-400 text-sm font-light">Los Angeles, CA</p>
                <p className="text-gray-400 text-sm font-light">Austin, TX</p>
                <p className="text-gray-400 text-sm font-light">Miami, FL</p>
                <p className="text-cyan-400 text-sm font-light mt-3">
                  + Virtual Sessions Available
                </p>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="md:col-span-1">
              <h4 className="text-white font-light mb-4">Stay Connected</h4>
              <p className="text-gray-400 text-sm font-light mb-4">
                Get insights, class updates, and exclusive content.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white text-sm font-light focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                />
                <button className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-4 py-3 text-sm font-medium tracking-wider hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 rounded-lg">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Social Links & Terms */}
            <div className="md:col-span-1">
              <h4 className="text-white font-light mb-4">Connect</h4>
              
              {/* Social Links */}
              <div className="flex space-x-4 mb-6">
                <a href="#" className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 transition-all duration-300">
                  <span className="text-lg">📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 transition-all duration-300">
                  <span className="text-lg">📷</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 transition-all duration-300">
                  <span className="text-lg">🐦</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 transition-all duration-300">
                  <span className="text-lg">💼</span>
                </a>
              </div>

              {/* Terms & Links */}
              <div className="space-y-2">
                <Link href="/privacy-policy" className="block text-gray-400 hover:text-cyan-400 text-sm font-light transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="block text-gray-400 hover:text-cyan-400 text-sm font-light transition-colors duration-300">
                  Terms of Service
                </Link>
                <Link href="/membership-agreement" className="block text-gray-400 hover:text-cyan-400 text-sm font-light transition-colors duration-300">
                  Membership Agreement
                </Link>
                <Link href="/contact" className="block text-gray-400 hover:text-cyan-400 text-sm font-light transition-colors duration-300">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800/50 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm font-light mb-4 md:mb-0">
              © 2024 Fluvium. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <p className="text-gray-500 text-sm font-light">
                Made with intention
              </p>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}