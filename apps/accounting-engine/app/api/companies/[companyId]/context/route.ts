import { NextRequest, NextResponse } from 'next/server'
import {
  createAccountingContext,
  listAccountingContexts,
  getActiveAccountingContext,
} from '@repo/db'
import { AccountingContextSchema } from '@repo/ledger-core'
import { requireCompanyPermission } from '@/lib/authz'

function getCompleteness(context: Record<string, unknown>) {
  const parsed = AccountingContextSchema.safeParse(context)
  return {
    complete: parsed.success,
    errors: parsed.success ? [] : parsed.error.issues.map((i) => i.message),
  }
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ companyId: string }> }
): Promise<Response> {
  const { companyId } = await context.params
  const auth = await requireCompanyPermission(companyId, 'company.read')
  if (!('user' in auth)) return auth.error

  const [active, versions] = await Promise.all([
    getActiveAccountingContext(companyId),
    listAccountingContexts(companyId),
  ])

  return NextResponse.json({
    success: true,
    data: {
      active,
      versions,
    },
  })
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ companyId: string }> }
): Promise<Response> {
  const { companyId } = await context.params
  const auth = await requireCompanyPermission(companyId, 'settings.manage')
  if (!('user' in auth)) return auth.error
  const userId = auth.user?.id
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const contextPayload = body.context as Record<string, unknown>

  const completeness = getCompleteness(contextPayload)

  const record = await createAccountingContext({
    companyId,
    context: contextPayload,
    createdBy: userId,
    notes: body.notes ?? null,
    status: body.activate ? 'ACTIVE' : 'DRAFT',
  })

  return NextResponse.json({
    success: true,
    data: {
      context: record,
      completeness,
    },
  })
}
