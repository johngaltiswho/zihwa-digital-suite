import { NextRequest, NextResponse } from 'next/server'
import { generateAuthorizationUrl } from '@repo/db'

/**
 * GET /api/zoho/authorize
 * Redirects user to Zoho OAuth authorization page
 *
 * Query params:
 * - orgId (optional): Zoho organization ID to reconnect
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orgId = searchParams.get('orgId')

    // Get Zoho OAuth config from environment
    const config = {
      clientId: process.env.ZOHO_CLIENT_ID!,
      clientSecret: process.env.ZOHO_CLIENT_SECRET!,
      redirectUri: process.env.ZOHO_REDIRECT_URI!,
      region: (process.env.ZOHO_REGION || 'in') as 'in' | 'com' | 'eu' | 'com.au' | 'jp',
    }

    if (!config.clientId || !config.clientSecret || !config.redirectUri) {
      return NextResponse.json(
        { error: 'Zoho OAuth credentials not configured' },
        { status: 500 }
      )
    }

    // Generate authorization URL with full access scope
    // Try broad scope first - if this doesn't work, scopes must be configured in API Console
    const authUrl = generateAuthorizationUrl(config, [
      'ZohoBooks.fullaccess.all',
    ])

    // Store orgId in state parameter if provided (for reconnecting)
    const urlWithState = orgId
      ? `${authUrl}&state=${encodeURIComponent(orgId)}`
      : authUrl

    // Redirect to Zoho authorization page
    return NextResponse.redirect(urlWithState)
  } catch (error) {
    console.error('Authorization error:', error)
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    )
  }
}
