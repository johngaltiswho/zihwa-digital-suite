// API configuration and service functions for Humility DB
const API_BASE_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_test_development';

// Common headers for API requests
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-publishable-api-key': PUBLISHABLE_KEY,
});

export interface Technique {
  id: string;
  title: string;
  description: string;
  handle: string;
  thumbnail?: string;
  youtube_url?: string;
  youtube_id?: string;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes?: number;
  instructor_notes?: string;
  key_points?: string[];
  prerequisites?: string[];
  next_techniques?: string[];
  categories?: Array<{
    id: string;
    name: string;
    handle: string;
    icon?: string;
    color_gradient?: string;
  }>;
  created_at?: string;
  metadata?: {
    content_type: 'technique';
    youtube_url?: string;
    youtube_id?: string;
    difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
    duration_minutes?: number;
    instructor_notes?: string;
    key_points?: string[];
    prerequisites?: string[];
    next_techniques?: string[];
  };
}

export interface FlowSession {
  id: string;
  title: string;
  description: string;
  handle: string;
  thumbnail?: string;
  session_type?: 'guided' | 'meditation' | 'advanced' | 'restorative';
  duration_minutes?: number;
  difficulty_level?: 'beginner' | 'all_levels' | 'advanced';
  audio_url?: string;
  instructions?: string;
  key_concepts?: string[];
  categories?: Array<{
    id: string;
    name: string;
    handle: string;
    icon?: string;
    color_gradient?: string;
  }>;
  created_at?: string;
  metadata?: {
    content_type: 'flow';
    session_type?: 'guided' | 'meditation' | 'advanced' | 'restorative';
    duration_minutes?: number;
    difficulty_level?: 'beginner' | 'all_levels' | 'advanced';
    audio_url?: string;
    instructions?: string;
    key_concepts?: string[];
  };
}

export interface MindsetModule {
  id: string;
  title: string;
  description: string;
  handle: string;
  thumbnail?: string;
  module_type?: 'philosophy' | 'psychology' | 'leadership';
  duration_minutes?: number;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  content_url?: string;
  key_concepts?: string[];
  learning_objectives?: string[];
  categories?: Array<{
    id: string;
    name: string;
    handle: string;
    icon?: string;
    color_gradient?: string;
  }>;
  created_at?: string;
  metadata?: {
    content_type: 'mindset';
    module_type?: 'philosophy' | 'psychology' | 'leadership';
    duration_minutes?: number;
    difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
    content_url?: string;
    key_concepts?: string[];
    learning_objectives?: string[];
  };
}


// API Service Functions
export const apiService = {
  // Fetch all techniques
  async getTechniques(params?: {
    difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
    category?: 'guard' | 'passing' | 'submissions';
    limit?: number;
    offset?: number;
  }): Promise<{ techniques: Technique[] }> {
    const searchParams = new URLSearchParams();
    if (params?.difficulty_level) searchParams.append('difficulty_level', params.difficulty_level);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const response = await fetch(`${API_BASE_URL}/store/humility-db/techniques?${searchParams}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      console.error('Failed to fetch techniques:', response.status, response.statusText);
      // Return fallback data if API fails
      return {
        techniques: [{
          id: 'fallback-1',
          title: 'Triangle Choke Fundamentals',
          description: 'Master the basic triangle choke setup from closed guard',
          handle: 'triangle-choke-fundamentals',
          difficulty_level: 'intermediate',
          duration_minutes: 15,
          key_points: ['Hip angle', 'Arm positioning', 'Leg placement', 'Finishing mechanics'],
          prerequisites: ['Closed guard basics'],
          next_techniques: ['Triangle variations']
        }]
      };
    }
    
    const data = await response.json();
    return { techniques: data.techniques || [] };
  },

  // Fetch all flow sessions
  async getFlowSessions(params?: {
    session_type?: 'guided' | 'meditation' | 'advanced' | 'restorative';
    difficulty_level?: 'beginner' | 'all_levels' | 'advanced';
    limit?: number;
    offset?: number;
  }): Promise<{ flow_sessions: FlowSession[] }> {
    const searchParams = new URLSearchParams();
    if (params?.session_type) searchParams.append('session_type', params.session_type);
    if (params?.difficulty_level) searchParams.append('difficulty_level', params.difficulty_level);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const response = await fetch(`${API_BASE_URL}/store/humility-db/flow-sessions?${searchParams}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch flow sessions');
    return response.json();
  },

  // Fetch all mindset modules
  async getMindsetModules(params?: {
    module_type?: 'philosophy' | 'psychology' | 'leadership';
    difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
    limit?: number;
    offset?: number;
  }): Promise<{ mindset_modules: MindsetModule[] }> {
    const searchParams = new URLSearchParams();
    if (params?.module_type) searchParams.append('module_type', params.module_type);
    if (params?.difficulty_level) searchParams.append('difficulty_level', params.difficulty_level);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const response = await fetch(`${API_BASE_URL}/store/humility-db/mindset-modules?${searchParams}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch mindset modules');
    return response.json();
  },

  // Fetch all content (techniques, flow sessions, mindset modules)
  async getAllContent(params?: {
    content_type?: 'technique' | 'flow' | 'mindset';
    difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
    limit?: number;
    offset?: number;
  }): Promise<{ content: (Technique | FlowSession | MindsetModule)[] }> {
    const searchParams = new URLSearchParams();
    if (params?.content_type) searchParams.append('content_type', params.content_type);
    if (params?.difficulty_level) searchParams.append('difficulty_level', params.difficulty_level);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const response = await fetch(`${API_BASE_URL}/store/humility-db?${searchParams}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch content');
    return response.json();
  },

};

// Utility functions
export const getDifficultyColor = (level: string) => {
  switch (level) {
    case 'beginner': return 'bg-green-500/20 text-green-400';
    case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
    case 'advanced': return 'bg-red-500/20 text-red-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

export const getYouTubeEmbedUrl = (youtubeId: string) => {
  return `https://www.youtube.com/embed/${youtubeId}`;
};

export const formatDuration = (minutes: number) => {
  return `${minutes} min`;
};