import { NextRequest, NextResponse } from 'next/server'
import { approveAndPostDraft } from '@/lib/copilot/tool-impl'
import { requireCompanyPermission } from '@/lib/authz'

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ companyId: string; draftId: string }> }
): Promise<Response> {
  const { companyId, draftId } = await context.params
  const auth = await requireCompanyPermission(companyId, 'draft.approve')
  if (!('user' in auth)) return auth.error
  const userId = auth.user?.id
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const draft = await approveAndPostDraft(companyId, draftId, userId)
    return NextResponse.json({ success: true, data: draft })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to approve and post draft'
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    )
  }
}
