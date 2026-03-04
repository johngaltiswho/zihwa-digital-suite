import { NextRequest, NextResponse } from 'next/server'
import {
  createCompany,
  listCompaniesForUserInOrg,
  upsertCompanyMembership,
} from '@repo/db'
import { requireOrgAccess } from '@/lib/authz'

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await context.params
  const auth = await requireOrgAccess(orgId)
  if (!('user' in auth)) return auth.error
  const scoped = auth as {
    user: { id: string }
    orgMembership: { role: 'OWNER' | 'ADMIN' | 'ACCOUNTANT' | 'VIEWER' } | null
  }
  const userId = scoped.user?.id
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const companies = await listCompaniesForUserInOrg(orgId, userId)
  return NextResponse.json({ success: true, data: companies })
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await context.params
  const auth = await requireOrgAccess(orgId)
  if (!('user' in auth)) return auth.error
  const scoped = auth as {
    user: { id: string }
    orgMembership: { role: 'OWNER' | 'ADMIN' | 'ACCOUNTANT' | 'VIEWER' } | null
  }
  const userId = scoped.user?.id
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  if (!scoped.orgMembership || !['OWNER', 'ADMIN'].includes(scoped.orgMembership.role)) {
    return NextResponse.json({ success: false, error: 'Only org admins can create companies' }, { status: 403 })
  }

  const body = await request.json()
  const name = String(body.name ?? '').trim()

  if (!name) {
    return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 })
  }

  const company = await createCompany({
    organizationId: orgId,
    name,
    slug: body.slug ? String(body.slug) : toSlug(name),
    baseCurrency: body.baseCurrency,
    timezone: body.timezone,
    industry: body.industry,
  })

  await upsertCompanyMembership({
    companyId: company.id,
    userId,
    role: 'ADMIN',
  })

  return NextResponse.json({ success: true, data: company }, { status: 201 })
}
