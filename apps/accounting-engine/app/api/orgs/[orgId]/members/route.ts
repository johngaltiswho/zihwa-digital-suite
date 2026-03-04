import { NextRequest, NextResponse } from 'next/server'
import { addOrgMember, listOrgMembers, upsertCompanyMembership } from '@repo/db'
import { requireOrgAccess } from '@/lib/authz'

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await context.params
  const auth = await requireOrgAccess(orgId)
  if (!('user' in auth)) return auth.error

  const members = await listOrgMembers(orgId)
  return NextResponse.json({ success: true, data: members })
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await context.params
  const auth = await requireOrgAccess(orgId)
  if (!('user' in auth)) return auth.error
  const scoped = auth as {
    orgMembership: { role: 'OWNER' | 'ADMIN' | 'ACCOUNTANT' | 'VIEWER' } | null
  }

  if (!scoped.orgMembership || !['OWNER', 'ADMIN'].includes(scoped.orgMembership.role)) {
    return NextResponse.json({ success: false, error: 'Only org admins can add members' }, { status: 403 })
  }

  const body = await request.json()
  const userId = String(body.userId ?? '').trim()
  const role = (body.role ?? 'ACCOUNTANT') as 'OWNER' | 'ADMIN' | 'ACCOUNTANT' | 'VIEWER'
  const companyId = body.companyId ? String(body.companyId) : null
  const companyRole = (body.companyRole ?? null) as 'VIEWER' | 'PREPARER' | 'APPROVER' | 'ADMIN' | null

  if (!userId) {
    return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 })
  }

  const member = await addOrgMember({ organizationId: orgId, userId, role })

  if (companyId && companyRole) {
    await upsertCompanyMembership({
      companyId,
      userId,
      role: companyRole,
    })
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        member,
        companyMembership: companyId && companyRole ? { companyId, role: companyRole } : null,
      },
    },
    { status: 201 }
  )
}
