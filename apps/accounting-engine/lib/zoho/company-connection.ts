import { prisma, getTokens } from '@repo/db'

export async function getCompanyZohoConnection(companyId: string) {
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
    connection,
    orgId: connection.externalOrgId,
    tokens,
  }
}
