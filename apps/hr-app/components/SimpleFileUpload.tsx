'use client'

import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface SimpleFileUploadProps {
  onUploadComplete?: (fileUrl: string, fileName: string) => void
  companyId?: string
}

export default function SimpleFileUpload({ onUploadComplete, companyId }: SimpleFileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('📁 Uploading file:', file.name, file.size, file.type)
    
    setUploading(true)

    try {
      // Simple file path: just timestamp + filename (remove spaces)
      const timestamp = Date.now()
      const cleanFileName = file.name.replace(/\s+/g, '_') // Replace spaces with underscores
      const fileName = `${timestamp}-${cleanFileName}`
      const folderPath = companyId ? `companies/${companyId}/${fileName}` : `general/${fileName}`

      console.log('📤 Upload path:', folderPath)

      // Direct upload to Supabase
      const { data, error } = await supabase.storage
        .from('Zihwa-digital-suite')
        .upload(folderPath, file)

      if (error) {
        console.error('❌ Upload error:', error)
        alert(`Upload failed: ${error.message}`)
        return
      }

      console.log('✅ Upload success:', data)

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('Zihwa-digital-suite')
        .getPublicUrl(folderPath)

      const fileUrl = urlData.publicUrl
      console.log('🔗 File URL:', fileUrl)

      setUploadedFiles(prev => [...prev, file.name])
      
      if (onUploadComplete) {
        onUploadComplete(fileUrl, file.name)
      }

      alert('✅ File uploaded successfully!')

    } catch (error) {
      console.error('💥 Unexpected error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Simple Upload Button */}
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
          id="simple-file-upload"
        />
        <label 
          htmlFor="simple-file-upload"
          className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Choose File'}
        </label>
        <p className="text-sm text-gray-500 mt-2">
          Any file type, up to 50MB
        </p>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Uploaded Files:</h4>
          {uploadedFiles.map((fileName, index) => (
            <div key={index} className="text-sm text-green-600">
              ✅ {fileName}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}