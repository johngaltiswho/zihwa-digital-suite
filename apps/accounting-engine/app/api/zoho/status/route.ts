import { NextRequest, NextResponse } from 'next/server'
import { hasTokens, getTokens, listConnectedOrgs } from '@repo/db'

/**
 * GET /api/zoho/status
 * Check OAuth connection status for an organization
 *
 * Query params:
 * - orgId: Zoho organization ID to check (optional, shows all if omitted)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orgId = searchParams.get('orgId')

    // If orgId is provided, check specific org
    if (orgId) {
      const connected = await hasTokens(orgId)

      if (connected) {
        // Get token details
        const tokens = await getTokens(orgId)
        const expiresIn = tokens
          ? Math.floor((tokens.expiresAt.getTime() - Date.now()) / 1000)
          : 0

        return NextResponse.json({
          connected: true,
          orgId,
          expiresAt: tokens?.expiresAt.toISOString(),
          expiresIn,
          needsRefresh: expiresIn < 300, // Less than 5 minutes
        })
      } else {
        return NextResponse.json({
          connected: false,
          orgId,
        })
      }
    }

    // If no orgId, list all connected orgs
    const orgs = await listConnectedOrgs()

    return NextResponse.json({
      connected: orgs.length > 0,
      connectedOrgs: orgs,
      count: orgs.length,
    })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check OAuth status' },
      { status: 500 }
    )
  }
}
