// OAuth token management for Zoho Books

import axios, { AxiosError } from 'axios'
import type { ZohoOrgConfig, ZohoTokenSet, ZohoTokenResponse } from './types'
import { ZohoConnectorError } from './errors'

/**
 * In-memory storage for organization configurations
 * In Phase 4, this will be replaced with database storage
 */
const orgConfigStore = new Map<string, ZohoOrgConfig>()

/**
 * In-memory storage for OAuth tokens
 * In Phase 4, this will be replaced with database storage (encrypted)
 */
const tokenStore = new Map<string, ZohoTokenSet>()

/**
 * Token refresh buffer (5 minutes)
 * Tokens are considered expired if they expire within this window
 */
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000

/**
 * Register a Zoho organization configuration
 * This must be called before any API operations
 */
export function registerZohoOrg(config: ZohoOrgConfig): void {
  orgConfigStore.set(config.orgId, config)
}

/**
 * Load existing tokens for an organization
 * Call this after fetching tokens from database
 */
export function hydrateTokens(orgId: string, tokens: ZohoTokenSet): void {
  tokenStore.set(orgId, tokens)
}

/**
 * Get stored tokens for an organization
 * Returns null if tokens don't exist
 */
export function getStoredTokens(orgId: string): ZohoTokenSet | null {
  return tokenStore.get(orgId) ?? null
}

/**
 * Check if organization is registered
 */
export function isOrgRegistered(orgId: string): boolean {
  return orgConfigStore.has(orgId)
}

/**
 * Get organization configuration
 * Throws if organization is not registered
 */
function getOrgConfig(orgId: string): ZohoOrgConfig {
  const config = orgConfigStore.get(orgId)
  if (!config) {
    throw ZohoConnectorError.orgNotRegistered(orgId)
  }
  return config
}

/**
 * Check if token is expired or will expire soon
 */
function isTokenExpired(tokens: ZohoTokenSet): boolean {
  const expiryTime = tokens.expiresAt.getTime()
  const now = Date.now()
  const bufferTime = now + TOKEN_REFRESH_BUFFER_MS

  return expiryTime <= bufferTime
}

/**
 * Get Zoho token endpoint URL based on region
 */
function getTokenEndpoint(region: string): string {
  // Zoho uses accounts.zoho.* for OAuth
  return `https://accounts.zoho.${region}/oauth/v2/token`
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(orgId: string): Promise<ZohoTokenSet> {
  const config = getOrgConfig(orgId)
  const currentTokens = tokenStore.get(orgId)

  if (!currentTokens || !currentTokens.refreshToken) {
    throw ZohoConnectorError.tokensNotFound(orgId)
  }

  const tokenEndpoint = getTokenEndpoint(config.region)

  try {
    const response = await axios.post<ZohoTokenResponse>(
      tokenEndpoint,
      null,
      {
        params: {
          refresh_token: currentTokens.refreshToken,
          client_id: config.clientId,
          client_secret: config.clientSecret,
          grant_type: 'refresh_token',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    const data = response.data

    // Create new token set
    const newTokens: ZohoTokenSet = {
      accessToken: data.access_token,
      // Zoho may or may not return a new refresh token
      refreshToken: data.refresh_token || currentTokens.refreshToken,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      scope: data.scope,
    }

    // Update token store
    tokenStore.set(orgId, newTokens)

    return newTokens
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      const errorMessage = axiosError.response?.data
        ? JSON.stringify(axiosError.response.data)
        : axiosError.message

      throw ZohoConnectorError.tokenRefreshFailed(orgId, errorMessage)
    }

    throw ZohoConnectorError.tokenRefreshFailed(
      orgId,
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

/**
 * Get valid access token for an organization
 * Automatically refreshes token if expired or expiring soon
 *
 * @param orgId - Organization ID
 * @returns Valid access token
 * @throws ZohoConnectorError if organization not registered or tokens not found
 */
export async function getValidAccessToken(orgId: string): Promise<string> {
  // Check if org is registered
  if (!isOrgRegistered(orgId)) {
    throw ZohoConnectorError.orgNotRegistered(orgId)
  }

  // Get current tokens
  const tokens = tokenStore.get(orgId)
  if (!tokens) {
    throw ZohoConnectorError.tokensNotFound(orgId)
  }

  // Check if token is expired or will expire soon
  if (isTokenExpired(tokens)) {
    // Refresh token
    const newTokens = await refreshAccessToken(orgId)
    return newTokens.accessToken
  }

  // Token is still valid
  return tokens.accessToken
}

/**
 * Clear tokens for an organization
 * Useful for logout or token revocation
 */
export function clearTokens(orgId: string): void {
  tokenStore.delete(orgId)
}

/**
 * Clear all stored data (useful for testing)
 */
export function clearAll(): void {
  orgConfigStore.clear()
  tokenStore.clear()
}
