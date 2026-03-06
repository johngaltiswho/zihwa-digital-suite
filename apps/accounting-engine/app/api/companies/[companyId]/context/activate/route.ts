import { NextRequest, NextResponse } from 'next/server'
import { activateAccountingContext, listAccountingContexts } from '@repo/db'
import { requireCompanyPermission } from '@/lib/authz'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ companyId: string }> }
): Promise<Response> {
  const { companyId } = await context.params
  const auth = await requireCompanyPermission(companyId, 'settings.manage')
  if (!('user' in auth)) return auth.error

  const body = await request.json()
  const contextId = String(body.contextId ?? '').trim()

  if (!contextId) {
    return NextResponse.json({ success: false, error: 'contextId is required' }, { status: 400 })
  }

  const contexts = await listAccountingContexts(companyId)
  const target = contexts.find((item) => item.id === contextId)

  if (!target) {
    return NextResponse.json({ success: false, error: 'Context version not found' }, { status: 404 })
  }

  const updated = await activateAccountingContext(contextId)
  return NextResponse.json({
    success: true,
    data: updated
      ? {
          id: updated.id,
          companyId: updated.companyId,
          version: updated.version,
          status: String(updated.status),
          context: updated.context,
          notes: updated.notes,
          createdBy: updated.createdBy,
          createdAt: updated.createdAt,
          activatedAt: updated.activatedAt,
          supersededAt: updated.supersededAt,
        }
      : null,
  })
}
