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
  metadata: {
    content_type: 'technique';
    youtube_url: string;
    youtube_id: string;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    duration_minutes: number;
    instructor_notes: string;
    key_points: string[];
    prerequisites: string[];
    next_techniques: string[];
  };
}

export interface FlowSession {
  id: string;
  title: string;
  description: string;
  handle: string;
  metadata: {
    content_type: 'flow';
    session_type: 'guided' | 'meditation' | 'advanced' | 'restorative';
    duration_minutes: number;
    difficulty_level: 'beginner' | 'all_levels' | 'advanced';
    audio_url: string;
    instructions: string;
    key_concepts: string[];
  };
}

export interface MindsetModule {
  id: string;
  title: string;
  description: string;
  handle: string;
  metadata: {
    content_type: 'mindset';
    module_type: 'philosophy' | 'psychology' | 'leadership';
    duration_minutes: number;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    content_url: string;
    key_concepts: string[];
    learning_objectives: string[];
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
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const response = await fetch(`${API_BASE_URL}/store/products?${searchParams}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch techniques');
    const data = await response.json();
    
    // Filter to show only digital content (exclude migrated physical products)
    const techniques = data.products
      .filter((product: any) => 
        // Only include products that are NOT migrated from Ecwid (digital content only)
        product.metadata?.migrated_from !== 'ecwid' &&
        // Or include Ecwid products that are specifically digital categories
        (product.metadata?.category === 'Digital Content' || 
         product.metadata?.category === 'Virtual Privates & Seminars' ||
         !product.metadata?.migrated_from)
      )
      .map((product: any) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        handle: product.handle,
        metadata: {
          content_type: 'technique',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          youtube_id: 'dQw4w9WgXcQ',
          difficulty_level: 'intermediate',
          duration_minutes: 15,
          instructor_notes: 'Practice with focus on technique over strength',
          key_points: ['Hip movement', 'Grip control', 'Timing', 'Pressure'],
          prerequisites: ['Basic guard position'],
          next_techniques: ['Advanced variations']
        }
      }));
    
    return { techniques };
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