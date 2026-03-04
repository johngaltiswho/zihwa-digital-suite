import { NextResponse } from 'next/server'
import {
  getOrgMembership,
  getCompanyMembership,
  getCompanyById,
  getOrganizationById,
  getDocument,
} from '@repo/db'
import { hasCompanyPermission, orgRoleToCompanyPower, type Permission } from '@repo/ledger-core'
import { getServerSession } from './supabase-server'

export async function requireUser() {
  const { session } = await getServerSession()
  const user = session?.user
  if (!user) {
    return { error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) }
  }

  return { user }
}

export async function requireOrgAccess(organizationId: string) {
  const auth = await requireUser()
  if (!('user' in auth)) return auth
  const userId = auth.user?.id
  if (!userId) {
    return { error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) }
  }

  const org = await getOrganizationById(organizationId)
  if (!org) {
    return { error: NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 }) }
  }

  const membership = await getOrgMembership(organizationId, userId)
  if (!membership) {
    return { error: NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 }) }
  }

  return { user: auth.user, organization: org, orgMembership: membership }
}

export async function requireCompanyPermission(companyId: string, permission: Permission) {
  const auth = await requireUser()
  if (!('user' in auth)) return auth
  const userId = auth.user?.id
  if (!userId) {
    return { error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) }
  }

  const company = await getCompanyById(companyId)
  if (!company) {
    return { error: NextResponse.json({ success: false, error: 'Company not found' }, { status: 404 }) }
  }

  const orgMembership = await getOrgMembership(company.organizationId, userId)
  const companyMembership = await getCompanyMembership(companyId, userId)

  if (!orgMembership && !companyMembership) {
    return { error: NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 }) }
  }

  const effectiveRole = companyMembership?.role ?? (orgMembership ? orgRoleToCompanyPower(orgMembership.role) : 'VIEWER')

  if (!hasCompanyPermission(effectiveRole, permission)) {
    return { error: NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 }) }
  }

  return {
    user: auth.user,
    company,
    orgMembership,
    companyMembership,
    effectiveRole,
  }
}

export async function requireDocumentPermission(documentId: string, permission: Permission) {
  const auth = await requireUser()
  if (!('user' in auth)) return auth

  const document = await getDocument(documentId)
  if (!document) {
    return { error: NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 }) }
  }

  if (document.companyId) {
    const companyAuth = await requireCompanyPermission(document.companyId, permission)
    if (!('user' in companyAuth)) return companyAuth

    return {
      ...companyAuth,
      document,
    }
  }

  if (document.organizationId) {
    const orgAuth = await requireOrgAccess(document.organizationId)
    if (!('user' in orgAuth)) return orgAuth

    return {
      ...orgAuth,
      document,
    }
  }

  return { error: NextResponse.json({ success: false, error: 'Document is not scoped to a tenant' }, { status: 400 }) }
}
