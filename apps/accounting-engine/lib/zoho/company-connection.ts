import { prisma, getTokens } from '@repo/db'

type CompanyZohoConnection = {
  connection: {
    id: string
    companyId: string
    provider: 'ZOHO_BOOKS'
    status: 'CONNECTED'
    externalOrgId: string
  }
  orgId: string
  tokens: {
    accessToken: string
    refreshToken: string
    expiresAt: Date
  }
}

export async function getCompanyZohoConnection(companyId: string): Promise<CompanyZohoConnection | null> {
  const connection = await prisma.integrationConnection.findUnique({
    where: {
      companyId_provider: {
        companyId,
        provider: 'ZOHO_BOOKS',
      },
    },
  })

  if (!connection || !connection.externalOrgId || connection.status !== 'CONNECTED') {
    return null
  }

  const tokens = await getTokens(connection.externalOrgId)
  if (!tokens) return null

  return {
    connection: {
      id: connection.id,
      companyId: connection.companyId,
      provider: 'ZOHO_BOOKS',
      status: 'CONNECTED',
      externalOrgId: connection.externalOrgId,
    },
    orgId: connection.externalOrgId,
    tokens: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
    },
  }
}
