import { NextRequest, NextResponse } from 'next/server'
import { getActiveScope, setActiveScope } from '@/lib/active-scope'
import { requireUser } from '@/lib/authz'

export async function GET() {
  const auth = await requireUser()
  if (!('user' in auth)) return auth.error

  const scope = await getActiveScope()
  return NextResponse.json({ success: true, data: scope })
}

export async function POST(request: NextRequest) {
  const auth = await requireUser()
  if (!('user' in auth)) return auth.error

  const body = (await request.json()) as {
    organizationId?: string | null
    companyId?: string | null
  }

  const nextScope: { organizationId?: string | null; companyId?: string | null } = {}

  if (Object.prototype.hasOwnProperty.call(body, 'organizationId')) {
    nextScope.organizationId = body.organizationId ?? null
  }

  if (Object.prototype.hasOwnProperty.call(body, 'companyId')) {
    nextScope.companyId = body.companyId ?? null
  }

  await setActiveScope(nextScope)

  return NextResponse.json({ success: true })
}
