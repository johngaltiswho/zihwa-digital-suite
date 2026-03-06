import { NextRequest, NextResponse } from 'next/server'
import { getTokens, refreshAndStoreTokens } from '@repo/db'
import { ZohoBooksClient } from '@repo/connector-zoho-books'
import { requireDocumentPermission } from '@/lib/authz'
import { getCompanyZohoConnection } from '@/lib/zoho/company-connection'

type VendorRouteContext = {
  params: Promise<{
    id: string
  }>
}

type ZohoContact = {
  contact_id?: string
  contact_name?: string
  gst_no?: string
}

function normalizeName(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function scoreVendorMatch(parsedName: string, candidateName: string): number {
  const parsed = normalizeName(parsedName)
  const candidate = normalizeName(candidateName)
  if (!parsed || !candidate) return 0
  if (parsed === candidate) return 1
  if (candidate.includes(parsed) || parsed.includes(candidate)) return 0.92

  const parsedTokens = new Set(parsed.split(' ').filter(Boolean))
  const candidateTokens = new Set(candidate.split(' ').filter(Boolean))
  if (parsedTokens.size === 0 || candidateTokens.size === 0) return 0

  let overlap = 0
  for (const token of parsedTokens) {
    if (candidateTokens.has(token)) overlap += 1
  }

  const union = new Set([...parsedTokens, ...candidateTokens]).size
  return union > 0 ? overlap / union : 0
}

export async function GET(request: NextRequest, context: VendorRouteContext): Promise<Response> {
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

    const query = request.nextUrl.searchParams
    const parsedVendorName = (query.get('vendorName') || '').trim()
    const queryOrgId = (query.get('orgId') || '').trim()

    let orgId = scoped.document.zohoOrgId || queryOrgId || ''
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

    const response = await client.get<{ contacts?: ZohoContact[] }>('/contacts', {
      contact_type: 'vendor',
      sort_column: 'contact_name',
      per_page: 200,
      page: 1,
    })

    const vendors = (response.contacts || [])
      .map((contact) => ({
        id: String(contact.contact_id || ''),
        name: String(contact.contact_name || ''),
        gstin: contact.gst_no ? String(contact.gst_no) : null,
      }))
      .filter((vendor) => vendor.id && vendor.name)

    let suggestedVendorId: string | null = null
    let suggestedVendorName: string | null = null
    let suggestedScore = 0

    if (parsedVendorName) {
      for (const vendor of vendors) {
        const score = scoreVendorMatch(parsedVendorName, vendor.name)
        if (score > suggestedScore) {
          suggestedScore = score
          suggestedVendorId = vendor.id
          suggestedVendorName = vendor.name
        }
      }

      if (suggestedScore < 0.55) {
        suggestedVendorId = null
        suggestedVendorName = null
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        orgId,
        parsedVendorName: parsedVendorName || null,
        suggestedVendorId,
        suggestedVendorName,
        suggestedScore: Number((suggestedScore * 100).toFixed(1)),
        vendors,
      },
    })
  } catch (error: unknown) {
    const rawMessage = error instanceof Error ? error.message : 'Failed to fetch vendors from Zoho.'
    const message =
      typeof rawMessage === 'string' &&
      rawMessage.toLowerCase().includes('not authorized')
        ? `${rawMessage}. Re-authorize Zoho and ensure contacts/vendor read scope is granted.`
        : rawMessage
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
