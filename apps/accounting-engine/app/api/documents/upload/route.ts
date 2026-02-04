import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { extractFromDocument } from '@repo/doc-ingest'
import { createDocument, updateDocument, listConnectedOrgs } from '@repo/db'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']

export async function POST(request: NextRequest) {
  try {
    // 1. Parse FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    let orgId = formData.get('orgId') as string | null

    // 2. Validate file
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File exceeds 10MB limit' },
        { status: 413 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type. Allowed: ${ALLOWED_TYPES.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // 3. Auto-detect orgId if not provided
    if (!orgId) {
      const connectedOrgs = await listConnectedOrgs()
      if (connectedOrgs.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'No Zoho accounts connected. Please connect via /api/zoho/authorize',
          },
          { status: 401 }
        )
      }
      orgId = connectedOrgs[0]
      console.log(`Auto-detected orgId: ${orgId}`)
    }

    // 4. Upload to Supabase Storage
    const buffer = Buffer.from(await file.arrayBuffer())
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`
    const storagePath = `documents/${orgId}/${fileName}`

    console.log(`Uploading file to Supabase: ${storagePath}`)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('accounting-documents')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json(
        { success: false, error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('accounting-documents').getPublicUrl(storagePath)

    console.log(`File uploaded successfully: ${publicUrl}`)

    // 5. Create database record
    const documentId = await createDocument({
      fileName: file.name,
      fileUrl: publicUrl,
      fileType: file.type,
      documentType: 'EXPENSE', // Will be updated after extraction
      status: 'UPLOADED',
    })

    console.log(`Document created with ID: ${documentId}`)

    // 6. Update status to PROCESSING
    await updateDocument(documentId, { status: 'PROCESSING' })

    // 7. Extract and parse document
    try {
      console.log('Starting document extraction...')

      const documentType = file.type === 'application/pdf' ? 'pdf' : 'image'

      const extractedData = await extractFromDocument(buffer, documentType, {
        useAI: true,
        aiConfig: {
          provider: 'openai',
          apiKey: process.env.OPENAI_API_KEY!,
        },
        // Enable Vision API fallback for low confidence results
        enableVisionFallback: true,
        visionFallbackThreshold: 85, // Fallback to Vision if confidence < 85%
      })

      console.log('Extraction completed:', JSON.stringify(extractedData, null, 2))

      // 8. Update with extracted data
      await updateDocument(documentId, {
        status: 'EXTRACTED',
        documentType: extractedData.type.toUpperCase() as 'EXPENSE' | 'PURCHASE',
        extractedData,
      })

      // 9. Return success response
      return NextResponse.json({
        success: true,
        data: {
          documentId,
          fileName: file.name,
          fileUrl: publicUrl,
          extractedData,
          status: 'EXTRACTED',
        },
      })
    } catch (error: any) {
      console.error('Extraction error:', error)

      // Update document with error status
      await updateDocument(documentId, {
        status: 'FAILED',
        error: error.message || 'Failed to extract document data',
      })

      return NextResponse.json(
        {
          success: false,
          error: `Extraction failed: ${error.message}`,
          documentId,
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Upload endpoint error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
