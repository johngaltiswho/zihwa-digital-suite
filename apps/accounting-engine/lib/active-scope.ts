import { cookies } from 'next/headers'

const ORG_COOKIE = 'zl_active_org_id'
const COMPANY_COOKIE = 'zl_active_company_id'

export async function getActiveScope() {
  const store = await cookies()
  return {
    organizationId: store.get(ORG_COOKIE)?.value ?? null,
    companyId: store.get(COMPANY_COOKIE)?.value ?? null,
  }
}

export async function setActiveScope(scope: {
  organizationId?: string | null
  companyId?: string | null
}) {
  const store = await cookies()
  if (scope.organizationId !== undefined) {
    if (scope.organizationId) {
      store.set(ORG_COOKIE, scope.organizationId, { path: '/', httpOnly: false })
    } else {
      store.delete(ORG_COOKIE)
    }
  }

  if (scope.companyId !== undefined) {
    if (scope.companyId) {
      store.set(COMPANY_COOKIE, scope.companyId, { path: '/', httpOnly: false })
    } else {
      store.delete(COMPANY_COOKIE)
    }
  }
}
