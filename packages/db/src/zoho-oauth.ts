// Zoho OAuth authorization flow helpers

import { storeTokens } from './oauth-tokens'

export interface ZohoOAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  region: 'in' | 'com' | 'eu' | 'com.au' | 'jp'
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  apiDomain: string
  tokenType: string
}

const REGION_BASE_URLS: Record<string, string> = {
  'in': 'https://accounts.zoho.in',
  'com': 'https://accounts.zoho.com',
  'eu': 'https://accounts.zoho.eu',
  'com.au': 'https://accounts.zoho.com.au',
  'jp': 'https://accounts.zoho.jp',
}

/**
 * Generate the Zoho OAuth authorization URL
 * Redirect users to this URL to start the OAuth flow
 *
 * @param config - OAuth configuration
 * @param scopes - List of scopes to request
 * @returns Authorization URL
 */
export function generateAuthorizationUrl(
  config: ZohoOAuthConfig,
  scopes: string[] = [
    'ZohoBooks.expenses.CREATE',
    'ZohoBooks.bills.CREATE',
    'ZohoBooks.invoices.READ',
  ]
): string {
  const baseUrl = REGION_BASE_URLS[config.region]

  const params = new URLSearchParams({
    client_id: config.clientId,
    response_type: 'code',
    redirect_uri: config.redirectUri,
    scope: scopes.join(','), // Zoho uses comma-separated scopes
    access_type: 'offline',
    prompt: 'consent', // Force consent to get refresh token
  })

  return `${baseUrl}/oauth/v2/auth?${params.toString()}`
}

/**
 * Exchange authorization code for tokens
 * Call this from your callback endpoint after user authorizes
 *
 * @param code - Authorization code from Zoho callback
 * @param config - OAuth configuration
 * @returns Token response from Zoho
 */
export async function exchangeCodeForTokens(
  code: string,
  config: ZohoOAuthConfig
): Promise<TokenResponse> {
  const baseUrl = REGION_BASE_URLS[config.region]

  const params = new URLSearchParams({
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    grant_type: 'authorization_code',
  })

  const response = await fetch(`${baseUrl}/oauth/v2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to exchange code for tokens: ${error}`)
  }

  const data = await response.json()

  console.log('Zoho token response:', JSON.stringify(data, null, 2))

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    apiDomain: data.api_domain,
    tokenType: data.token_type,
  }
}

/**
 * Exchange code and store tokens in database
 * Convenience function that combines exchange + storage
 *
 * @param code - Authorization code
 * @param orgId - Zoho organization ID (get from user or API)
 * @param config - OAuth configuration
 * @returns Token response
 */
export async function exchangeAndStoreTokens(
  code: string,
  orgId: string,
  config: ZohoOAuthConfig
): Promise<TokenResponse> {
  // Exchange code for tokens
  const tokens = await exchangeCodeForTokens(code, config)

  // Store encrypted tokens in database
  await storeTokens(orgId, {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
  })

  return tokens
}

/**
 * Refresh an access token using the refresh token
 *
 * @param refreshToken - The refresh token
 * @param config - OAuth configuration
 * @returns New token response
 */
export async function refreshAccessToken(
  refreshToken: string,
  config: ZohoOAuthConfig
): Promise<TokenResponse> {
  const baseUrl = REGION_BASE_URLS[config.region]

  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'refresh_token',
  })

  const response = await fetch(`${baseUrl}/oauth/v2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to refresh token: ${error}`)
  }

  const data = await response.json()

  return {
    accessToken: data.access_token,
    refreshToken: refreshToken, // Refresh token doesn't change
    expiresIn: data.expires_in,
    apiDomain: data.api_domain,
    tokenType: data.token_type,
  }
}

/**
 * Refresh tokens and update in database
 *
 * @param orgId - Zoho organization ID
 * @param refreshToken - Current refresh token (decrypted)
 * @param config - OAuth configuration
 * @returns New token response
 */
export async function refreshAndStoreTokens(
  orgId: string,
  refreshToken: string,
  config: ZohoOAuthConfig
): Promise<TokenResponse> {
  const tokens = await refreshAccessToken(refreshToken, config)

  await storeTokens(orgId, {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
  })

  return tokens
}
