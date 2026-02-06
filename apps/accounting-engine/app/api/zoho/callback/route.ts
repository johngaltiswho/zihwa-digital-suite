import { NextRequest, NextResponse } from 'next/server'
import { exchangeAndStoreTokens } from '@repo/db'

/**
 * GET /api/zoho/callback
 * Handles OAuth callback from Zoho
 * Exchanges authorization code for access/refresh tokens and stores them
 *
 * Query params:
 * - code: Authorization code from Zoho
 * - accounts-server: Zoho accounts server domain
 * - location: Data center location
 * - state: Optional orgId for reconnection
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const accountsServer = searchParams.get('accounts-server')
    const location = searchParams.get('location')
    const state = searchParams.get('state') // orgId if reconnecting

    // Validate required parameters
    if (!code) {
      return NextResponse.json(
        { error: 'Missing authorization code' },
        { status: 400 }
      )
    }

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

    // Exchange code for tokens
    console.log('Exchanging authorization code for tokens...')
    const tokenResponse = await exchangeAndStoreTokens(
      code,
      state || 'default-org', // Use state as orgId, or 'default-org' if not provided
      config
    )

    console.log('Tokens stored successfully:', {
      orgId: state || 'default-org',
      apiDomain: tokenResponse.apiDomain,
      expiresIn: tokenResponse.expiresIn,
    })

    // Return success page
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Zoho Books Connected</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: #f3f4f6;
            }
            .container {
              background: white;
              padding: 2rem;
              border-radius: 0.5rem;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 500px;
            }
            h1 { color: #10b981; margin-bottom: 1rem; }
            p { color: #6b7280; margin-bottom: 1.5rem; }
            a {
              display: inline-block;
              padding: 0.75rem 1.5rem;
              background: #3b82f6;
              color: white;
              text-decoration: none;
              border-radius: 0.375rem;
            }
            a:hover { background: #2563eb; }
            .details {
              margin-top: 1.5rem;
              padding: 1rem;
              background: #f9fafb;
              border-radius: 0.375rem;
              text-align: left;
            }
            .details dt {
              font-weight: 600;
              color: #374151;
            }
            .details dd {
              color: #6b7280;
              margin-left: 0;
              margin-bottom: 0.5rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✓ Successfully Connected!</h1>
            <p>Your Zoho Books account has been connected to the Accounting Engine.</p>
            <dl class="details">
              <dt>Organization ID:</dt>
              <dd>${state || 'default-org'}</dd>
              <dt>API Domain:</dt>
              <dd>${tokenResponse.apiDomain}</dd>
              <dt>Token Expires:</dt>
              <dd>${tokenResponse.expiresIn} seconds</dd>
            </dl>
            <a href="/">Back to Dashboard</a>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    )
  } catch (error) {
    console.error('OAuth callback error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Connection Failed</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: #f3f4f6;
            }
            .container {
              background: white;
              padding: 2rem;
              border-radius: 0.5rem;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 500px;
            }
            h1 { color: #ef4444; margin-bottom: 1rem; }
            p { color: #6b7280; margin-bottom: 1.5rem; }
            .error {
              margin-top: 1rem;
              padding: 1rem;
              background: #fef2f2;
              border: 1px solid #fecaca;
              border-radius: 0.375rem;
              color: #991b1b;
              font-family: monospace;
              font-size: 0.875rem;
              text-align: left;
            }
            a {
              display: inline-block;
              padding: 0.75rem 1.5rem;
              background: #3b82f6;
              color: white;
              text-decoration: none;
              border-radius: 0.375rem;
            }
            a:hover { background: #2563eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✗ Connection Failed</h1>
            <p>Failed to connect your Zoho Books account.</p>
            <div class="error">${errorMessage}</div>
            <p style="margin-top: 1.5rem;"><a href="/api/zoho/authorize">Try Again</a></p>
          </div>
        </body>
      </html>
      `,
      {
        status: 500,
        headers: { 'Content-Type': 'text/html' },
      }
    )
  }
}
