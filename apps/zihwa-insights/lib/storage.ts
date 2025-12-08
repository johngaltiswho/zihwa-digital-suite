import { supabase } from './supabase'

export interface UploadResult {
  url: string
  path: string
  error?: string
}

export async function uploadFile(
  file: File,
  bucket: string,
  path: string
): Promise<UploadResult> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw error
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      url: urlData.publicUrl,
      path: data.path
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return {
      url: '',
      path: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
}

export function getFileUrl(bucket: string, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

// Predefined buckets for different document types
export const STORAGE_BUCKETS = {
  DOCUMENTS: 'company-documents',
  AVATARS: 'user-avatars'
} as const