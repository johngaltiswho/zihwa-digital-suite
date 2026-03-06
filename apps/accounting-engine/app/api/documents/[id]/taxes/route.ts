import { NextRequest, NextResponse } from 'next/server'
import { getTokens, refreshAndStoreTokens } from '@repo/db'
import { ZohoBooksClient } from '@repo/connector-zoho-books'
import { requireDocumentPermission } from '@/lib/authz'
import { getCompanyZohoConnection } from '@/lib/zoho/company-connection'

type TaxRouteContext = {
  params: Promise<{
    id: string
  }>
}

type ZohoTax = {
  tax_id?: string
  tax_name?: string
  tax_percentage?: number
  tax_type?: string
}

export async function GET(_request: NextRequest, context: TaxRouteContext): Promise<Response> {
  const { id } = await context.params

  try {
    const auth = await requireDocumentPermission(id, 'company.read')
    if (!('user' in auth)) return auth.error

    const scoped = auth as {
      document: {
        companyId: string | null
        zohoOrgId: string | null
      }
    }

    let orgId = scoped.document.zohoOrgId || ''
    let accessToken = ''

    if (scoped.document.companyId) {
      const connection = await getCompanyZohoConnection(scoped.document.companyId)
      if (connection?.orgId) {
        orgId = connection.orgId
        accessToken = connection.tokens.accessToken
      }
    }

    if (!orgId) {
      return NextResponse.json(
        { success: false, error: 'Zoho org is not connected for this document/company.' },
        { status: 400 }
      )
    }

    if (!accessToken) {
      const stored = await getTokens(orgId)
      if (!stored) {
        return NextResponse.json(
          { success: false, error: 'Zoho OAuth token not found for this org.' },
          { status: 401 }
        )
      }

      const expiresIn = (stored.expiresAt.getTime() - Date.now()) / 1000
      accessToken = stored.accessToken

      if (expiresIn < 300) {
        const config = {
          clientId: process.env.ZOHO_CLIENT_ID!,
          clientSecret: process.env.ZOHO_CLIENT_SECRET!,
          redirectUri: process.env.ZOHO_REDIRECT_URI!,
          region: (process.env.ZOHO_REGION || 'in') as 'in' | 'com' | 'eu' | 'com.au' | 'jp',
        }

        const refreshed = await refreshAndStoreTokens(orgId, stored.refreshToken, config)
        accessToken = refreshed.accessToken
      }
    }

    const client = new ZohoBooksClient(
      orgId,
      accessToken,
      (process.env.ZOHO_REGION || 'in') as 'in' | 'com' | 'eu' | 'com.au' | 'jp'
    )

    const response = await client.get<{ taxes?: ZohoTax[] }>('/settings/taxes')
    const taxes = (response.taxes || [])
      .map((tax) => ({
        id: String(tax.tax_id || ''),
        name: String(tax.tax_name || ''),
        percentage: typeof tax.tax_percentage === 'number' ? tax.tax_percentage : null,
        type: tax.tax_type ? String(tax.tax_type) : null,
      }))
      .filter((tax) => tax.id && tax.name)

    return NextResponse.json({
      success: true,
      data: {
        orgId,
        taxes,
      },
    })
  } catch (error: unknown) {
    const raw = error instanceof Error ? error.message : 'Failed to fetch Zoho taxes.'
    const friendly = /not authorized|forbidden|permission|scope/i.test(raw)
      ? 'Tax list unavailable for this Zoho connection. You can continue and choose tax mapping later.'
      : raw
    return NextResponse.json(
      { success: false, error: friendly },
      { status: 500 }
    )
  }
}
