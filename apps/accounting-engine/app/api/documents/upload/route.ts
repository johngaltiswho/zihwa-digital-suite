import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { extractFromDocument } from '@repo/doc-ingest'
import { createDocument, updateDocument, listConnectedOrgs } from '@repo/db'
import { getActiveScope } from '@/lib/active-scope'
import { requireCompanyPermission, requireOrgAccess, requireUser } from '@/lib/authz'
import { getCompanyZohoConnection } from '@/lib/zoho/company-connection'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
type UploadDocumentType =
  | 'auto'
  | 'expense'
  | 'purchase'
  | 'invoice'
  | 'credit_note'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser()
    if (!('user' in auth)) return auth.error

    const activeScope = await getActiveScope()
    const formData = await request.formData()
    const file = formData.get('file') as File
    const selectedTypeRaw = ((formData.get('documentType') as string | null) || 'auto').toLowerCase()
    const selectedType: UploadDocumentType =
      selectedTypeRaw === 'expense' ||
      selectedTypeRaw === 'purchase' ||
      selectedTypeRaw === 'invoice' ||
      selectedTypeRaw === 'credit_note' ||
      selectedTypeRaw === 'auto'
        ? (selectedTypeRaw as UploadDocumentType)
        : 'auto'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'File exceeds 10MB limit' }, { status: 413 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Unsupported file type. Allowed: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    const scopedCompanyId =
      (formData.get('companyId') as string | null)?.trim() || activeScope.companyId || null

    const scopedOrgId =
      (formData.get('organizationId') as string | null)?.trim() || activeScope.organizationId || null

    let organizationId: string | null = scopedOrgId
    let companyId: string | null = scopedCompanyId

    if (companyId) {
      const companyAuth = await requireCompanyPermission(companyId, 'draft.create')
      if (!('user' in companyAuth)) return companyAuth.error
      const scopedCompany = companyAuth as { company: { organizationId: string } }
      organizationId = scopedCompany.company.organizationId
    } else if (organizationId) {
      const orgAuth = await requireOrgAccess(organizationId)
      if (!('user' in orgAuth)) return orgAuth.error
    } else {
      return NextResponse.json(
        { success: false, error: 'Select an active organization/company before uploading.' },
        { status: 400 }
      )
    }

    let orgId = (formData.get('orgId') as string | null)?.trim() || null

    if (!orgId && companyId) {
      const companyConnection = await getCompanyZohoConnection(companyId)
      if (companyConnection?.orgId) orgId = companyConnection.orgId
    }

    if (!orgId) {
      const connectedOrgs = await listConnectedOrgs()
      if (connectedOrgs.length > 0) orgId = connectedOrgs[0] ?? null
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`
    const storagePath = `documents/${organizationId || 'unscoped'}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('accounting-documents')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json(
        { success: false, error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('accounting-documents').getPublicUrl(storagePath)

    const documentId = await createDocument({
      fileName: file.name,
      fileUrl: publicUrl,
      fileType: file.type,
      documentType:
        selectedType === 'purchase'
          ? 'PURCHASE'
          : selectedType === 'credit_note'
            ? 'CREDIT_NOTE'
          : selectedType === 'invoice'
            ? 'INVOICE'
            : 'EXPENSE',
      status: 'UPLOADED',
      organizationId: organizationId || undefined,
      companyId: companyId || undefined,
      zohoOrgId: orgId || undefined,
    })

    await updateDocument(documentId, { status: 'PROCESSING' })

    try {
      const documentType = file.type === 'application/pdf' ? 'pdf' : 'image'

      const extractedData = await extractFromDocument(buffer, documentType, {
        expectedType: selectedType === 'auto' ? undefined : selectedType,
        useAI: true,
        aiConfig: {
          provider: 'openai',
          apiKey: process.env.OPENAI_API_KEY!,
        },
        enableVisionFallback: true,
        visionFallbackThreshold: 85,
      })

      await updateDocument(documentId, {
        status: 'EXTRACTED',
        documentType: extractedData.type.toUpperCase() as
          | 'EXPENSE'
          | 'PURCHASE'
          | 'INVOICE'
          | 'CREDIT_NOTE',
        extractedData,
      })

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
