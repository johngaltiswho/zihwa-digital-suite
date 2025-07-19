'use client';

import { useState } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  className?: string;
  autoplay?: boolean;
  showControls?: boolean;
}

export default function YouTubePlayer({ 
  videoId, 
  title, 
  className = "w-full aspect-video rounded-lg",
  autoplay = false,
  showControls = true 
}: YouTubePlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?${new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    controls: showControls ? '1' : '0',
    modestbranding: '1',
    rel: '0',
    showinfo: '0',
    iv_load_policy: '3',
    color: 'white',
    theme: 'dark'
  }).toString()}`;

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-gray-600/50`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 text-2xl font-bold mx-auto mb-4">
            ⚠
          </div>
          <p className="text-gray-400 font-light text-sm">Video unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-black text-2xl font-bold mx-auto mb-4 animate-pulse">
              ▶
            </div>
            <p className="text-gray-400 font-light text-sm">Loading video...</p>
          </div>
        </div>
      )}
      
      <iframe
        src={embedUrl}
        title={title}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
}

// Alternative component for technique previews with play button overlay
export function TechniqueVideoPreview({ 
  videoId, 
  title, 
  thumbnail, 
  className = "w-full aspect-video rounded-lg" 
}: {
  videoId: string;
  title: string;
  thumbnail?: string;
  className?: string;
}) {
  const [showPlayer, setShowPlayer] = useState(false);

  const thumbnailUrl = thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (showPlayer) {
    return (
      <YouTubePlayer 
        videoId={videoId} 
        title={title} 
        className={className}
        autoplay={true}
      />
    );
  }

  return (
    <div 
      className={`${className} relative cursor-pointer group overflow-hidden`}
      onClick={() => setShowPlayer(true)}
    >
      <img
        src={thumbnailUrl}
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to default YouTube thumbnail if maxres fails
          e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }}
      />
      
      {/* Play button overlay */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors duration-300">
        <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-black text-3xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
          ▶
        </div>
      </div>
      
      {/* Duration badge (if you want to add this later) */}
      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-light">
        {title}
      </div>
    </div>
  );
}