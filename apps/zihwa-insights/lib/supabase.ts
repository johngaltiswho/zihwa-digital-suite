import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role client - only for server-side usage
let supabaseServiceRoleInstance: SupabaseClient | null = null

export const getSupabaseServiceRole = () => {
  if (!supabaseServiceRoleInstance && typeof window === 'undefined') {
    supabaseServiceRoleInstance = createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  }
  return supabaseServiceRoleInstance
}

// Storage utilities
export const storage = {
  /**
   * Upload a file to Supabase storage
   */
  async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options?: { upsert?: boolean }
  ) {
    console.log('🔍 Upload Debug Info:')
    console.log('- Bucket:', bucket)
    console.log('- Path:', path)
    console.log('- File name:', file.name)
    console.log('- File size:', file.size)
    console.log('- File type:', file.type)
    console.log('- Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('- Auth status:', supabase.auth.getUser())

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: options?.upsert || false,
      })

    if (error) {
      console.error('❌ Upload Error Details:')
      console.error('- Error message:', error.message)
      console.error('- Error details:', error)
      console.error('- Full error object:', JSON.stringify(error, null, 2))
      throw new Error(`Upload failed: ${error.message}`)
    }

    console.log('✅ Upload successful:', data)
    return data
  },

  /**
   * Get public URL for a file
   */
  getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  },

  /**
   * Delete a file from storage
   */
  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      throw new Error(`Delete failed: ${error.message}`)
    }
  },

  /**
   * List files in a directory
   */
  async listFiles(bucket: string, path?: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path || '', {
        limit: 100,
        offset: 0,
      })

    if (error) {
      throw new Error(`List failed: ${error.message}`)
    }

    return data
  }
}

// File upload utilities
export const fileUtils = {
  /**
   * Generate a unique file name
   */
  generateFileName(originalName: string, companyId?: string) {
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    
    // Use original filename, fallback to 'document' if undefined
    const fileName = originalName || 'document'
    
    // Namespace with app name for monorepo
    const appPrefix = 'zihwa-insights'
    
    if (companyId) {
      return `${appPrefix}/companies/${companyId}/${timestamp}-${randomStr}-${fileName}`
    }
    
    return `${appPrefix}/general/${timestamp}-${randomStr}-${fileName}`
  },

  /**
   * Validate file type and size
   */
  validateFile(file: File, options?: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
  }) {
    const maxSize = options?.maxSize || 50 * 1024 * 1024 // 50MB default - more generous

    // Simple size check only
    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`)
    }

    // Skip all type validation - just upload whatever the user wants
    return true
  },

  /**
   * Get MIME type from file extension
   */
  getMimeTypeFromExtension(fileName?: string) {
    if (!fileName || typeof fileName !== 'string') {
      return ''
    }

    const extension = fileName.split('.').pop()?.toLowerCase()
    
    const extensionMap: Record<string, string> = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'txt': 'text/plain',
    }

    return extension ? extensionMap[extension] || '' : ''
  },

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  /**
   * Get file icon based on type
   */
  getFileIcon(mimeType: string) {
    if (mimeType.startsWith('image/')) return '🖼️'
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('word')) return '📝'
    if (mimeType.includes('excel') || mimeType.includes('sheet')) return '📊'
    if (mimeType.includes('text')) return '📄'
    return '📎'
  }
}
