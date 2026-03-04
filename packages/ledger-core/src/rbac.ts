export type OrgRole = 'OWNER' | 'ADMIN' | 'ACCOUNTANT' | 'VIEWER'
export type CompanyRole = 'VIEWER' | 'PREPARER' | 'APPROVER' | 'ADMIN'

export type Permission =
  | 'company.read'
  | 'draft.create'
  | 'draft.submit'
  | 'draft.approve'
  | 'settings.manage'
  | 'integration.manage'

const roleOrder: Record<CompanyRole, number> = {
  VIEWER: 1,
  PREPARER: 2,
  APPROVER: 3,
  ADMIN: 4,
}

const requiredRoleByPermission: Record<Permission, CompanyRole> = {
  'company.read': 'VIEWER',
  'draft.create': 'PREPARER',
  'draft.submit': 'PREPARER',
  'draft.approve': 'APPROVER',
  'settings.manage': 'ADMIN',
  'integration.manage': 'ADMIN',
}

export function hasCompanyPermission(role: CompanyRole, permission: Permission): boolean {
  return roleOrder[role] >= roleOrder[requiredRoleByPermission[permission]]
}

export function orgRoleToCompanyPower(role: OrgRole): CompanyRole {
  if (role === 'OWNER' || role === 'ADMIN') return 'ADMIN'
  if (role === 'ACCOUNTANT') return 'PREPARER'
  return 'VIEWER'
}
