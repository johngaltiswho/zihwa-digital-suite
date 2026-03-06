import { NextRequest, NextResponse } from 'next/server'
import {
  addOrgMember,
  createOrganization,
  listOrganizationsForUser,
  listCompaniesForUserInOrg,
} from '@repo/db'
import { requireUser } from '@/lib/authz'

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function GET(): Promise<Response> {
  const auth = await requireUser()
  if (!('user' in auth)) return auth.error
  const userId = auth.user?.id
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const orgs = await listOrganizationsForUser(userId)
  const withCounts = await Promise.all(
    orgs.map(async (org) => {
      const companies = await listCompaniesForUserInOrg(org.id, userId)
      return {
        ...org,
        companyCount: companies.length,
      }
    })
  )

  return NextResponse.json({
    success: true,
    data: withCounts,
  })
}

export async function POST(request: NextRequest): Promise<Response> {
  const auth = await requireUser()
  if (!('user' in auth)) return auth.error
  const userId = auth.user?.id
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const name = String(body.name ?? '').trim()

  if (!name) {
    return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 })
  }

  const slug = body.slug ? String(body.slug) : toSlug(name)
  const org = await createOrganization({
    name,
    slug,
    description: body.description,
    defaultCurrency: body.defaultCurrency,
    timezone: body.timezone,
  })

  await addOrgMember({
    organizationId: org.id,
    userId,
    role: 'OWNER',
  })

  return NextResponse.json({ success: true, data: org }, { status: 201 })
}
