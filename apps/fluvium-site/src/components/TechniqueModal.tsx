'use client';

import { useState } from 'react';
import { type Technique, formatDuration, getDifficultyColor } from '@/lib/api';
import YouTubePlayer from './YouTubePlayer';

interface TechniqueModalProps {
  technique: Technique;
  isOpen: boolean;
  onClose: () => void;
}

export default function TechniqueModal({ technique, isOpen, onClose }: TechniqueModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700/50 overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          {/* Video Section */}
          <div className="relative">
            {technique.metadata?.youtube_id ? (
              <YouTubePlayer
                videoId={technique.metadata.youtube_id}
                title={technique.title}
                className="w-full h-[50vh] rounded-t-2xl"
                showControls={true}
              />
            ) : (
              <div className="w-full h-[50vh] bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-black text-3xl font-bold mx-auto mb-4">
                    ▶
                  </div>
                  <p className="text-gray-400 font-light">Video not available</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-light text-white mb-4">{technique.title}</h1>
                <div className="flex items-center space-x-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-light ${getDifficultyColor(technique.metadata?.difficulty_level || 'beginner')}`}>
                    {technique.metadata?.difficulty_level?.charAt(0).toUpperCase() + technique.metadata?.difficulty_level?.slice(1)}
                  </span>
                  <span className="text-gray-400">{formatDuration(technique.metadata?.duration_minutes || 0)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-300 font-light leading-relaxed">
                {technique.description}
              </p>
            </div>

            {/* Instructor Notes */}
            {technique.metadata?.instructor_notes && (
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-6">
                <h3 className="text-xl font-light text-cyan-400 mb-3">Instructor Notes</h3>
                <p className="text-gray-300 font-light leading-relaxed">
                  {technique.metadata.instructor_notes}
                </p>
              </div>
            )}

            {/* Key Points */}
            {technique.metadata?.key_points && technique.metadata.key_points.length > 0 && (
              <div>
                <h3 className="text-xl font-light text-white mb-4">Key Points</h3>
                <div className="space-y-3">
                  {technique.metadata.key_points.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span className="text-gray-300 font-light">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {technique.metadata?.prerequisites && technique.metadata.prerequisites.length > 0 && (
              <div>
                <h3 className="text-xl font-light text-white mb-4">Prerequisites</h3>
                <div className="flex flex-wrap gap-2">
                  {technique.metadata.prerequisites.map((prereq, index) => (
                    <span key={index} className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-light">
                      {prereq}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Next Techniques */}
            {technique.metadata?.next_techniques && technique.metadata.next_techniques.length > 0 && (
              <div>
                <h3 className="text-xl font-light text-white mb-4">What's Next</h3>
                <div className="flex flex-wrap gap-2">
                  {technique.metadata.next_techniques.map((next, index) => (
                    <span key={index} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-light">
                      {next}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-4 pt-4">
              {technique.metadata?.youtube_url && (
                <a
                  href={technique.metadata.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-6 py-3 font-medium tracking-wider hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 rounded-lg"
                >
                  Watch on YouTube
                </a>
              )}
              <button className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-6 py-3 font-light tracking-wider transition-colors duration-300 rounded-lg border border-gray-700/50">
                Add to Favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}