import { NextRequest, NextResponse } from 'next/server'
import { listAccountingDrafts } from '@repo/db'
import { requireCompanyPermission } from '@/lib/authz'

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ companyId: string }> }
): Promise<NextResponse> {
  const { companyId } = await context.params
  const auth = await requireCompanyPermission(companyId, 'company.read')
  if (!('user' in auth)) return auth.error

  const drafts = await listAccountingDrafts(companyId, 'SUBMITTED')
  const safeDrafts = drafts.map((draft) => ({
    id: draft.id,
    organizationId: draft.organizationId,
    companyId: draft.companyId,
    documentId: draft.documentId,
    createdBy: draft.createdBy,
    status: String(draft.status),
    source: String(draft.source),
    payload: draft.payload,
    validation: draft.validation,
    approvalMeta: draft.approvalMeta,
    zohoResult: draft.zohoResult,
    submittedAt: draft.submittedAt,
    approvedAt: draft.approvedAt,
    postedAt: draft.postedAt,
    rejectedAt: draft.rejectedAt,
    createdAt: draft.createdAt,
    updatedAt: draft.updatedAt,
  }))

  return NextResponse.json({ success: true, data: safeDrafts })
}
