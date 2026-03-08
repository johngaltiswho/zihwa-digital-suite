'use client'

import { useState, useRef } from 'react'
import { Upload, X, File, Check, AlertCircle } from 'lucide-react'
import { storage, fileUtils } from '@/lib/supabase'

interface FileUploadProps {
  onUploadComplete?: (file: UploadedFile) => void
  companyId?: string
  bucket?: string
  allowedTypes?: string[]
  maxSize?: number
  multiple?: boolean
  className?: string
}

interface UploadedFile {
  name: string
  size: number
  type: string
  url: string
  path: string
}

interface FileWithProgress extends File {
  id: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
  url?: string
  path?: string
}

export default function FileUpload({
  onUploadComplete,
  companyId,
  bucket = 'Zihwa-digital-suite',
  allowedTypes,
  maxSize,
  multiple = true,
  className
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateFileId = () => Math.random().toString(36).substring(2, 15)

  const addFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    
    const filesWithProgress: FileWithProgress[] = fileArray.map(file => {
      const fileWithProgress = Object.assign(file, {
        id: generateFileId(),
        progress: 0,
        status: 'uploading' as const
      })
      return fileWithProgress
    })

    setFiles(prev => multiple ? [...prev, ...filesWithProgress] : filesWithProgress)

    filesWithProgress.forEach(file => uploadFile(file))
  }

  const uploadFile = async (file: FileWithProgress) => {
    try {
      console.log('📁 File object details:', file)
      console.log('📁 File name:', file.name)
      console.log('📁 File size:', file.size)
      console.log('📁 File type:', file.type)
      
      // Simple validation - just check size
      fileUtils.validateFile(file, { 
        maxSize: maxSize || 50 * 1024 * 1024
        // No type restrictions - upload anything
      })

      // Generate unique file path
      const fileName = fileUtils.generateFileName(file.name || 'document', companyId)
      
      // Upload to Supabase
      await storage.uploadFile(bucket, fileName, file)
      const publicUrl = storage.getPublicUrl(bucket, fileName)

      // Update file status
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { 
              ...f, 
              progress: 100, 
              status: 'completed' as const, 
              url: publicUrl,
              path: fileName 
            }
          : f
      ))

      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete({
          name: file.name,
          size: file.size,
          type: file.type,
          url: publicUrl,
          path: fileName
        })
      }

    } catch (error) {
      console.error('Upload error:', error)
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { 
              ...f, 
              status: 'error' as const, 
              error: error instanceof Error ? error.message : 'Upload failed'
            }
          : f
      ))
    }
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          multiple={multiple}
          accept={allowedTypes?.join(',')}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {allowedTypes 
                ? `Supports: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`
                : 'All file types supported'
              }
            </p>
            {maxSize && (
              <p className="text-xs text-gray-500">
                Max size: {fileUtils.formatFileSize(maxSize)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div 
              key={file.id}
              className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg"
            >
              <div className="w-8 h-8 bg-gray-50 rounded-md flex items-center justify-center flex-shrink-0">
                {file.status === 'completed' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : file.status === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <File className="w-4 h-4 text-gray-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    {fileUtils.formatFileSize(file.size)}
                  </p>
                  
                  {file.status === 'uploading' && (
                    <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {file.status === 'error' && (
                    <p className="text-xs text-red-500">{file.error}</p>
                  )}
                  
                  {file.status === 'completed' && (
                    <p className="text-xs text-green-500">Uploaded</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
