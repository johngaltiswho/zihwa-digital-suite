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

type OrgRole = 'OWNER' | 'ADMIN' | 'ACCOUNTANT' | 'VIEWER'
type CompanyRole = 'VIEWER' | 'PREPARER' | 'APPROVER' | 'ADMIN'
type AuthError = { error: Response }

type UserAuthResult = AuthError | { user: { id: string } }
type OrgAccessResult =
  | AuthError
  | {
      user: { id: string }
      organization: { id: string }
      orgMembership: { role: OrgRole }
    }
type CompanyPermissionResult =
  | AuthError
  | {
      user: { id: string }
      company: { id: string; organizationId: string }
      orgMembership: { role: OrgRole } | null
      companyMembership: { role: CompanyRole } | null
      effectiveRole: CompanyRole
    }

type ScopedDocument = {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  documentType: 'EXPENSE' | 'PURCHASE' | 'INVOICE' | 'CREDIT_NOTE'
  status: 'UPLOADED' | 'PROCESSING' | 'EXTRACTED' | 'POSTED' | 'FAILED'
  extractedData: unknown
  postingResult: unknown
  zohoVoucherId: string | null
  zohoOrgId: string | null
  organizationId: string | null
  companyId: string | null
  error: string | null
  createdAt: Date
  processedAt: Date | null
}

type DocumentPermissionResult =
  | AuthError
  | ({ user: { id: string }; organization: { id: string }; orgMembership: { role: OrgRole } } & {
      document: ScopedDocument
    })
  | ({
      user: { id: string }
      company: { id: string; organizationId: string }
      orgMembership: { role: OrgRole } | null
      companyMembership: { role: CompanyRole } | null
      effectiveRole: CompanyRole
    } & { document: ScopedDocument })

export async function requireUser(): Promise<UserAuthResult> {
  const { user } = await getServerSession()
  const userId = user?.id
  if (!userId) {
    return { error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) }
  }

  return { user: { id: userId } }
}

export async function requireOrgAccess(organizationId: string): Promise<OrgAccessResult> {
  const auth = await requireUser()
  if (!('user' in auth)) return auth
  const userId = auth.user.id

  const org = await getOrganizationById(organizationId)
  if (!org) {
    return { error: NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 }) }
  }

  const membership = await getOrgMembership(organizationId, userId)
  if (!membership) {
    return { error: NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 }) }
  }

  return {
    user: auth.user,
    organization: { id: org.id },
    orgMembership: { role: membership.role as OrgRole },
  }
}

export async function requireCompanyPermission(
  companyId: string,
  permission: Permission
): Promise<CompanyPermissionResult> {
  const auth = await requireUser()
  if (!('user' in auth)) return auth
  const userId = auth.user.id

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
    company: { id: company.id, organizationId: company.organizationId },
    orgMembership: orgMembership ? { role: orgMembership.role as OrgRole } : null,
    companyMembership: companyMembership ? { role: companyMembership.role as CompanyRole } : null,
    effectiveRole: effectiveRole as CompanyRole,
  }
}

export async function requireDocumentPermission(
  documentId: string,
  permission: Permission
): Promise<DocumentPermissionResult> {
  const auth = await requireUser()
  if (!('user' in auth)) return auth

  const document = await getDocument(documentId)
  if (!document) {
    return { error: NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 }) }
  }
  const scopedDocument: ScopedDocument = {
    id: document.id,
    fileName: document.fileName,
    fileUrl: document.fileUrl,
    fileType: document.fileType,
    documentType: document.documentType,
    status: document.status,
    extractedData: document.extractedData,
    postingResult: document.postingResult,
    zohoVoucherId: document.zohoVoucherId,
    zohoOrgId: document.zohoOrgId,
    organizationId: document.organizationId,
    companyId: document.companyId,
    error: document.error,
    createdAt: document.createdAt,
    processedAt: document.processedAt,
  }

  if (document.companyId) {
    const companyAuth = await requireCompanyPermission(document.companyId, permission)
    if (!('user' in companyAuth)) return companyAuth

    return {
      ...companyAuth,
      document: scopedDocument,
    }
  }

  if (document.organizationId) {
    const orgAuth = await requireOrgAccess(document.organizationId)
    if (!('user' in orgAuth)) return orgAuth

    return {
      ...orgAuth,
      document: scopedDocument,
    }
  }

  return { error: NextResponse.json({ success: false, error: 'Document is not scoped to a tenant' }, { status: 400 }) }
}
