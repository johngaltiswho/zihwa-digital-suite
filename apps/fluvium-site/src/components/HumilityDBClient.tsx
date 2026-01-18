'use client';

import { useState, useEffect } from 'react';
import { apiService, type Technique, type FlowSession, type MindsetModule, getDifficultyColor, formatDuration } from '@/lib/api';
import { TechniqueVideoPreview } from '@/components/YouTubePlayer';
import TechniqueModal from '@/components/TechniqueModal';

interface Tab {
  id: string;
  name: string;
  icon: string;
}

// TODO: Replace with Vendure customer type
interface Customer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface HumilityDBClientProps {
  customer: Customer | null;
  tabs: Tab[];
}

export default function HumilityDBClient({ customer, tabs }: HumilityDBClientProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      {/* Tab Navigation */}
      <div className={`flex flex-wrap justify-center gap-2 mb-12 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-full font-light tracking-wide transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-black'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className={`transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {activeTab === 'dashboard' && <DashboardTab customer={customer} />}
        {activeTab === 'techniques' && <TechniquesTab customer={customer} />}
        {activeTab === 'flow' && <FlowTab customer={customer} />}
        {activeTab === 'reflection' && <ReflectionTab customer={customer} />}
        {activeTab === 'mindset' && <MindsetTab customer={customer} />}
      </div>
    </>
  );
}

// Dashboard Tab Component
function DashboardTab({ customer }: { customer: HttpTypes.StoreCustomer | null }) {
  const [todaysTechniques, setTodaysTechniques] = useState<Technique[]>([]);
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTodaysTechniques = async () => {
      try {
        const data = await apiService.getTechniques({ limit: 3 });
        setTodaysTechniques(data.techniques || []);
      } catch (error) {
        console.error('Error fetching today\'s techniques:', error);
      }
    };

    fetchTodaysTechniques();
  }, []);

  const openTechniqueModal = (technique: Technique) => {
    setSelectedTechnique(technique);
    setIsModalOpen(true);
  };

  const closeTechniqueModal = () => {
    setIsModalOpen(false);
    setSelectedTechnique(null);
  };

  // Get user's display name
  const getUserName = () => {
    if (!customer) return 'Warrior';
    return customer.first_name || customer.email?.split('@')[0] || 'Warrior';
  };

  // Get user's initials for avatar
  const getUserInitials = () => {
    if (!customer) return 'W';
    const firstName = customer.first_name || '';
    const lastName = customer.last_name || '';
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    }
    if (firstName) return firstName[0];
    if (customer.email) return customer.email[0].toUpperCase();
    return 'W';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-light text-white">Welcome Back, {getUserName()}</h2>
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-black text-xl font-bold">
            {getUserInitials()}
          </div>
        </div>
        <p className="text-gray-300 font-light mb-6">
          Continue your journey of self-mastery. Every technique learned, every moment of presence cultivated, 
          every reflection shared brings you closer to your authentic power.
        </p>
        {customer ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-cyan-400 font-light mb-2">Current Streak</h3>
              <p className="text-2xl text-white font-light">7 days</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-cyan-400 font-light mb-2">Techniques Mastered</h3>
              <p className="text-2xl text-white font-light">23</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-cyan-400 font-light mb-2">Flow Sessions</h3>
              <p className="text-2xl text-white font-light">15</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/50 rounded-lg p-6 text-center">
            <p className="text-gray-400 mb-4">Sign in to see your personal progress and unlock advanced features</p>
            <a 
              href="/account" 
              className="inline-block bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-6 py-3 font-medium tracking-wider hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 rounded-lg"
            >
              Sign In to Track Progress
            </a>
          </div>
        )}
      </div>

      {/* Today's Practice */}
      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
        <h2 className="text-3xl font-light text-white mb-6">Today's Practice</h2>
        <div className="space-y-4">
          {todaysTechniques.map((technique, index) => (
            <div 
              key={technique.id}
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors duration-300 cursor-pointer"
              onClick={() => openTechniqueModal(technique)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded flex items-center justify-center text-black text-lg font-bold">
                  ▶
                </div>
                <div>
                  <h3 className="text-white font-light">{technique.title}</h3>
                  <p className="text-gray-400 text-sm">
                    {formatDuration(technique.metadata?.duration_minutes || 0)} technique • {technique.metadata?.difficulty_level}
                  </p>
                </div>
              </div>
              <div className="w-6 h-6 border-2 border-gray-600 rounded-full"></div>
            </div>
          ))}

          {todaysTechniques.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400 font-light">Loading today's practice...</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
          <h3 className="text-2xl font-light text-white mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-black text-sm font-bold">✓</div>
              <span className="text-gray-300 font-light">Completed Triangle Choke series</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-black text-sm font-bold">✓</div>
              <span className="text-gray-300 font-light">7-day reflection streak</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-black text-sm font-bold">✓</div>
              <span className="text-gray-300 font-light">Flow state breakthrough session</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
          <h3 className="text-2xl font-light text-white mb-4">Up Next</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-black text-sm font-bold">→</div>
              <span className="text-gray-300 font-light">Pressure Passing Fundamentals</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-black text-sm font-bold">◯</div>
              <span className="text-gray-300 font-light">Breath & Movement Session</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-black text-sm font-bold">✎</div>
              <span className="text-gray-300 font-light">Leadership & Presence Prompt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technique Modal */}
      {selectedTechnique && (
        <TechniqueModal
          technique={selectedTechnique}
          isOpen={isModalOpen}
          onClose={closeTechniqueModal}
        />
      )}
    </div>
  );
}

// Techniques Tab Component
function TechniquesTab({ customer }: { customer: HttpTypes.StoreCustomer | null }) {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | 'all'>('all');
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openTechniqueModal = (technique: Technique) => {
    setSelectedTechnique(technique);
    setIsModalOpen(true);
  };

  const closeTechniqueModal = () => {
    setIsModalOpen(false);
    setSelectedTechnique(null);
  };

  useEffect(() => {
    const fetchTechniques = async () => {
      try {
        setLoading(true);
        const params = selectedDifficulty !== 'all' ? { difficulty_level: selectedDifficulty as 'beginner' | 'intermediate' | 'advanced' } : {};
        const data = await apiService.getTechniques(params);
        setTechniques(data.techniques || []);
      } catch (error) {
        console.error('Error fetching techniques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechniques();
  }, [selectedDifficulty]);

  const categories = [
    { name: 'Guard', count: techniques.filter(t => t.title.toLowerCase().includes('guard')).length, color: 'from-cyan-400 to-blue-500' },
    { name: 'Passing', count: techniques.filter(t => t.title.toLowerCase().includes('pass')).length, color: 'from-purple-500 to-pink-500' },
    { name: 'Submissions', count: techniques.filter(t => t.title.toLowerCase().includes('choke') || t.title.toLowerCase().includes('triangle')).length, color: 'from-orange-400 to-red-500' },
    { name: 'Escapes', count: techniques.filter(t => t.title.toLowerCase().includes('escape')).length, color: 'from-green-400 to-teal-500' },
    { name: 'Transitions', count: techniques.filter(t => t.title.toLowerCase().includes('transition')).length, color: 'from-yellow-400 to-orange-500' }
  ];

  const recentTechniques = techniques.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Difficulty Filter */}
      <div className="flex flex-wrap gap-4 justify-center">
        {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
          <button
            key={level}
            onClick={() => setSelectedDifficulty(level as typeof selectedDifficulty)}
            className={`px-6 py-2 rounded-full font-light tracking-wider transition-all duration-300 ${
              selectedDifficulty === level
                ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-black'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((category, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-lg p-6 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer group">
            <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center text-black text-xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300`}>
              ▶
            </div>
            <h3 className="text-white font-light text-lg mb-2">{category.name}</h3>
            <p className="text-gray-400 text-sm">{category.count} techniques</p>
          </div>
        ))}
      </div>

      {/* Recent Techniques */}
      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
        <h2 className="text-3xl font-light text-white mb-6">
          {selectedDifficulty === 'all' ? 'All Techniques' : `${selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} Techniques`}
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-400">Loading techniques...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentTechniques.map((technique) => (
              <div 
                key={technique.id} 
                className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-700/50 transition-colors duration-300 cursor-pointer"
                onClick={() => openTechniqueModal(technique)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-white font-light text-lg">{technique.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-light ${getDifficultyColor(technique.metadata?.difficulty_level || 'beginner')}`}>
                    {technique.metadata?.difficulty_level?.charAt(0).toUpperCase() + technique.metadata?.difficulty_level?.slice(1)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{technique.description}</p>
                <div className="flex items-center justify-between text-gray-400 text-sm">
                  <span>BJJ Technique</span>
                  <span>{formatDuration(technique.metadata?.duration_minutes || 0)}</span>
                </div>
                
                {/* Play icon overlay */}
                <div className="mt-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-black text-sm font-bold">
                    ▶
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Technique */}
      {techniques.length > 0 && techniques[0] && (
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
          <h2 className="text-3xl font-light text-white mb-6">Featured: {techniques[0].title}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              {techniques[0].metadata?.youtube_id ? (
                <TechniqueVideoPreview
                  videoId={techniques[0].metadata.youtube_id}
                  title={techniques[0].title}
                  className="w-full aspect-video rounded-lg mb-4"
                />
              ) : (
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg aspect-video flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-black text-2xl font-bold">
                    ▶
                  </div>
                </div>
              )}
            </div>
            <div>
              <p className="text-gray-300 font-light leading-relaxed mb-6">
                {techniques[0].description}
              </p>
              <div className="space-y-3">
                {techniques[0].metadata?.key_points?.map((point, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-cyan-400">•</span>
                    <span className="text-gray-300 font-light">{point}</span>
                  </div>
                )) || []}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white ml-2">{formatDuration(techniques[0].metadata?.duration_minutes || 0)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Level:</span>
                  <span className="text-white ml-2">{techniques[0].metadata?.difficulty_level || 'Unknown'}</span>
                </div>
              </div>
              {techniques[0].metadata?.youtube_url && (
                <a
                  href={techniques[0].metadata.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-6 py-3 font-medium tracking-wider hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 rounded-lg"
                >
                  Watch on YouTube
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Technique Modal */}
      {selectedTechnique && (
        <TechniqueModal
          technique={selectedTechnique}
          isOpen={isModalOpen}
          onClose={closeTechniqueModal}
        />
      )}
    </div>
  );
}

// Flow Tab Component  
function FlowTab({ customer }: { customer: HttpTypes.StoreCustomer | null }) {
  const [flowSessions, setFlowSessions] = useState<FlowSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlowSessions = async () => {
      try {
        setLoading(true);
        const data = await apiService.getFlowSessions();
        setFlowSessions(data.flow_sessions || []);
      } catch (error) {
        console.error('Error fetching flow sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlowSessions();
  }, []);

  return (
    <div className="space-y-8">
      {/* Flow State Introduction */}
      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
        <h2 className="text-3xl font-light text-white mb-6">Flow State Training</h2>
        <p className="text-gray-300 font-light leading-relaxed mb-6">
          Flow state is the warrior's secret weapon—that place where time slows, ego dissolves, and your 
          authentic power emerges. These sessions guide you to access and sustain this state both on and off the mats.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-black text-2xl font-bold mx-auto mb-4">
              ◯
            </div>
            <h3 className="text-white font-light mb-2">Presence</h3>
            <p className="text-gray-400 text-sm">Cultivate unwavering focus and awareness</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-black text-2xl font-bold mx-auto mb-4">
              ∞
            </div>
            <h3 className="text-white font-light mb-2">Flow</h3>
            <p className="text-gray-400 text-sm">Access optimal performance states</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-black text-2xl font-bold mx-auto mb-4">
              ◊
            </div>
            <h3 className="text-white font-light mb-2">Integration</h3>
            <p className="text-gray-400 text-sm">Apply flow principles to daily life</p>
          </div>
        </div>
      </div>

      {/* Session Library */}
      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
        <h2 className="text-3xl font-light text-white mb-6">Session Library</h2>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-400">Loading flow sessions...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {flowSessions.map((session) => (
              <div key={session.id} className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-700/50 transition-colors duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-light text-lg">{session.title}</h3>
                  <span className="text-cyan-400 text-sm">{formatDuration(session.metadata?.duration_minutes || 0)}</span>
                </div>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{session.description}</p>
                <div className="flex items-center justify-between text-gray-400 text-sm">
                  <span>{session.metadata?.session_type}</span>
                  <span>{session.metadata?.difficulty_level}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Session */}
      {flowSessions.length > 0 && flowSessions[0] && (
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
          <h2 className="text-3xl font-light text-white mb-6">Today's Flow Session</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-light text-cyan-400 mb-4">{flowSessions[0].title}</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-6">
                {flowSessions[0].description}
              </p>
              <div className="space-y-3 mb-6">
                {flowSessions[0].metadata?.key_concepts?.map((concept, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-cyan-400">•</span>
                    <span className="text-gray-300 font-light">{concept}</span>
                  </div>
                )) || []}
              </div>
              <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white ml-2">{formatDuration(flowSessions[0].metadata?.duration_minutes || 0)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white ml-2">{flowSessions[0].metadata?.session_type || 'Unknown'}</span>
                </div>
              </div>
              <button className="bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-6 py-3 font-medium tracking-wider hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 rounded-lg">
                Begin Session
              </button>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-black text-3xl font-bold mx-auto mb-4">
                  ◯
                </div>
                <p className="text-gray-400 font-light">{formatDuration(flowSessions[0].metadata?.duration_minutes || 0)} {flowSessions[0].metadata?.session_type || 'session'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reflection Tab Component
function ReflectionTab({ customer }: { customer: HttpTypes.StoreCustomer | null }) {
  const prompts = [
    {
      category: 'Daily Practice',
      question: 'What moment today challenged your ego, and how did you respond?',
      type: 'Self-Awareness'
    },
    {
      category: 'Training Insights',
      question: 'Describe a technique that clicked for you recently. What made it work?',
      type: 'Technical Growth'
    },
    {
      category: 'Leadership',
      question: 'How did your presence on the mats influence your training partners today?',
      type: 'Community Impact'
    },
    {
      category: 'Flow State',
      question: 'When did you feel most connected to the present moment this week?',
      type: 'Mindfulness'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Reflection Philosophy */}
      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
        <h2 className="text-3xl font-light text-white mb-6">The Practice of Reflection</h2>
        <p className="text-gray-300 font-light leading-relaxed mb-6">
          True growth happens not just in the doing, but in the reflecting. These prompts guide you deeper than 
          technique—into the warrior's inner landscape where real transformation occurs.
        </p>
        <blockquote className="border-l-4 border-cyan-400 pl-6 italic text-gray-300 font-light">
          "The unexamined life is not worth living for a human being." — Socrates
        </blockquote>
      </div>

      {/* Today's Prompt */}
      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
        <h2 className="text-3xl font-light text-white mb-6">Today's Reflection</h2>
        <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-cyan-400 text-sm font-light">Self-Awareness • Daily Practice</span>
            <span className="text-gray-400 text-sm">5 min</span>
          </div>
          <h3 className="text-xl font-light text-white mb-4">
            What moment today challenged your ego, and how did you respond?
          </h3>
          <p className="text-gray-400 font-light text-sm mb-4">
            Consider both your immediate reaction and your deeper response. What did this moment teach you about your patterns?
          </p>
        </div>
        {customer ? (
          <>
            <textarea
              className="w-full h-32 bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white font-light focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300 resize-vertical"
              placeholder="Your reflection..."
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-gray-400 text-sm">Last saved: Just now</span>
              <button className="bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-6 py-2 text-sm font-medium tracking-wider hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 rounded-lg">
                Save Reflection
              </button>
            </div>
          </>
        ) : (
          <div className="bg-gray-800/50 rounded-lg p-6 text-center">
            <p className="text-gray-400 mb-4">Sign in to save your personal reflections and track your growth over time</p>
            <a 
              href="/account" 
              className="inline-block bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-6 py-3 font-medium tracking-wider hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 rounded-lg"
            >
              Sign In to Save Reflections
            </a>
          </div>
        )}
      </div>

      {/* Prompt Library */}
      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
        <h2 className="text-3xl font-light text-white mb-6">Reflection Library</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prompts.map((prompt, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-700/50 transition-colors duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-cyan-400 text-sm">{prompt.type}</span>
                <span className="text-gray-400 text-xs">{prompt.category}</span>
              </div>
              <h3 className="text-white font-light mb-2">{prompt.question}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reflections */}
      {customer && (
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
          <h2 className="text-3xl font-light text-white mb-6">Recent Reflections</h2>
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-cyan-400 text-sm">Dec 15, 2024</span>
                <span className="text-gray-400 text-xs">Technical Growth</span>
              </div>
              <p className="text-gray-300 font-light text-sm">
                "Today I finally understood the timing of the triangle choke. It's not about force—it's about creating the space and then filling it..."
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-cyan-400 text-sm">Dec 14, 2024</span>
                <span className="text-gray-400 text-xs">Self-Awareness</span>
              </div>
              <p className="text-gray-300 font-light text-sm">
                "Noticed I was forcing positions today instead of flowing. Reminder: the path of least resistance often leads to the greatest results..."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mindset Tab Component
function MindsetTab({ customer }: { customer: HttpTypes.StoreCustomer | null }) {
  const [mindsetModules, setMindsetModules] = useState<MindsetModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMindsetModules = async () => {
      try {
        setLoading(true);
        const data = await apiService.getMindsetModules();
        setMindsetModules(data.mindset_modules || []);
      } catch (error) {
        console.error('Error fetching mindset modules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMindsetModules();
  }, []);

  // Mock progress data - in a real app, this would come from user progress API
  const getModuleProgress = (moduleId: string) => {
    const progressMap: { [key: string]: number } = {
      'prod_123': 100,
      'prod_456': 60,
      'prod_789': 0,
      'prod_default': 40
    };
    return progressMap[moduleId] || 0;
  };

  return (
    <div className="space-y-8">
      {/* Mindset Philosophy */}
      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
        <h2 className="text-3xl font-light text-white mb-6">The Warrior's Mind</h2>
        <p className="text-gray-300 font-light leading-relaxed mb-6">
          Technical skill is just the beginning. True mastery emerges when ancient wisdom meets modern psychology, 
          creating a mindset that transforms not just your training, but your entire approach to life.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-cyan-400 font-light mb-3">Ancient Wisdom</h3>
            <p className="text-gray-300 font-light text-sm">
              Timeless principles from warrior cultures, distilled for the modern executive and athlete.
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-cyan-400 font-light mb-3">Modern Psychology</h3>
            <p className="text-gray-300 font-light text-sm">
              Science-backed insights into peak performance, resilience, and sustainable growth.
            </p>
          </div>
        </div>
      </div>

      {/* Module Library */}
      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
        <h2 className="text-3xl font-light text-white mb-6">Mindset Modules</h2>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-400">Loading mindset modules...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {mindsetModules.map((module) => {
              const progress = getModuleProgress(module.id);
              return (
                <div key={module.id} className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-700/50 transition-colors duration-300 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-white font-light text-lg mb-2">{module.title}</h3>
                      <p className="text-gray-400 font-light text-sm mb-3">{module.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>{formatDuration(module.metadata?.duration_minutes || 0)}</span>
                        <span>•</span>
                        <span>{module.metadata?.module_type}</span>
                      </div>
                    </div>
                    <div className="ml-6 text-right">
                      <div className="w-16 h-16 relative">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                            fill="none"
                            stroke="#374151"
                            strokeWidth="2"
                          />
                          <path
                            d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="2"
                            strokeDasharray={`${progress}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-xs font-light">{progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-gray-700 rounded-full h-2 mr-4">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="text-cyan-400 text-sm whitespace-nowrap">
                      {progress === 0 ? 'Start' : progress === 100 ? 'Review' : 'Continue'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Featured Quote */}
      {mindsetModules.length > 0 && mindsetModules[0] && (
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
          <h2 className="text-3xl font-light text-white mb-6">Wisdom for Today</h2>
          <blockquote className="text-2xl font-light text-gray-300 leading-relaxed mb-6 italic">
            "The warrior's greatest victory is not over his opponent, but over the chaos within his own mind."
          </blockquote>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full"></div>
            <div>
              <p className="text-white font-light">Ancient Samurai Wisdom</p>
              <p className="text-gray-400 text-sm">From '{mindsetModules[0]?.title || 'Mindset Module'}' module</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}