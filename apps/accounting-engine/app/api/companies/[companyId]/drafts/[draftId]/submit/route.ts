import { NextRequest, NextResponse } from 'next/server'
import { submitDraftForApproval } from '@/lib/copilot/tool-impl'
import { requireCompanyPermission } from '@/lib/authz'

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ companyId: string; draftId: string }> }
): Promise<NextResponse> { 
  const { companyId, draftId } = await context.params
  const auth = await requireCompanyPermission(companyId, 'draft.submit')
  if (!('user' in auth)) return auth.error
  const userId = auth.user?.id
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const draft = await submitDraftForApproval(companyId, draftId, userId)
  return NextResponse.json({ success: true, data: draft })
}
