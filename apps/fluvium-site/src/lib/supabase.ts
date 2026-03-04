/**
 * Supabase Client for Fluvium Site
 * Used for video storage in the humility-db-videos bucket
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = getSupabaseClient();
    const value = client[prop as keyof SupabaseClient];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

/**
 * Upload a video file to Supabase Storage
 * @param file - File buffer or Blob
 * @param fileName - Name of the file
 * @param studentId - Student ID for organizing uploads
 * @returns Public URL of the uploaded file
 */
export async function uploadVideo(
  file: Buffer | Blob,
  fileName: string,
  studentId: string
): Promise<{ url: string; path: string }> {
  const timestamp = Date.now();
  const path = `videos/${studentId}/${timestamp}-${fileName}`;

  const { error } = await supabase.storage
    .from('humility-db-videos')
    .upload(path, file, {
      contentType: 'video/mp4',
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Failed to upload video: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('humility-db-videos')
    .getPublicUrl(path);

  return {
    url: urlData.publicUrl,
    path,
  };
}

/**
 * Upload a video frame (JPEG) to Supabase Storage
 * @param frameBuffer - Frame image buffer
 * @param videoId - Video ID for organizing frames
 * @param frameNumber - Frame number
 * @returns Public URL of the uploaded frame
 */
export async function uploadFrame(
  frameBuffer: Buffer,
  videoId: string,
  frameNumber: number
): Promise<string> {
  const path = `frames/${videoId}/frame-${frameNumber.toString().padStart(3, '0')}.jpg`;

  const { error } = await supabase.storage
    .from('humility-db-videos')
    .upload(path, frameBuffer, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload frame: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('humility-db-videos')
    .getPublicUrl(path);

  return urlData.publicUrl;
}
