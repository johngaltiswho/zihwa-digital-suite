// OAuth token storage and retrieval helpers

import { prisma } from './client'
import { encrypt, decrypt } from './encryption'

export interface TokenData {
  accessToken: string
  refreshToken: string
  expiresAt: Date
}

/**
 * Store OAuth tokens for a Zoho organization
 * Creates or updates the token record
 *
 * @param orgId - Zoho organization ID
 * @param tokens - Token data to store
 * @param provider - OAuth provider (default: 'zoho_books')
 */
export async function storeTokens(
  orgId: string,
  tokens: TokenData,
  provider: string = 'zoho_books'
): Promise<void> {
  await prisma.oAuthToken.upsert({
    where: {
      provider_orgId: {
        provider,
        orgId,
      },
    },
    create: {
      provider,
      orgId,
      accessToken: encrypt(tokens.accessToken),
      refreshToken: encrypt(tokens.refreshToken),
      expiresAt: tokens.expiresAt,
    },
    update: {
      accessToken: encrypt(tokens.accessToken),
      refreshToken: encrypt(tokens.refreshToken),
      expiresAt: tokens.expiresAt,
    },
  })
}

/**
 * Retrieve OAuth tokens for a Zoho organization
 *
 * @param orgId - Zoho organization ID
 * @param provider - OAuth provider (default: 'zoho_books')
 * @returns Decrypted token data or null if not found
 */
export async function getTokens(
  orgId: string,
  provider: string = 'zoho_books'
): Promise<TokenData | null> {
  const token = await prisma.oAuthToken.findUnique({
    where: {
      provider_orgId: {
        provider,
        orgId,
      },
    },
  })

  if (!token) return null

  return {
    accessToken: decrypt(token.accessToken),
    refreshToken: decrypt(token.refreshToken),
    expiresAt: token.expiresAt,
  }
}

/**
 * Check if tokens exist for an organization
 *
 * @param orgId - Zoho organization ID
 * @param provider - OAuth provider (default: 'zoho_books')
 * @returns True if tokens exist
 */
export async function hasTokens(
  orgId: string,
  provider: string = 'zoho_books'
): Promise<boolean> {
  const token = await prisma.oAuthToken.findUnique({
    where: {
      provider_orgId: {
        provider,
        orgId,
      },
    },
    select: { id: true },
  })

  return !!token
}

/**
 * Delete tokens for an organization (e.g., on disconnect)
 *
 * @param orgId - Zoho organization ID
 * @param provider - OAuth provider (default: 'zoho_books')
 */
export async function deleteTokens(
  orgId: string,
  provider: string = 'zoho_books'
): Promise<void> {
  await prisma.oAuthToken.deleteMany({
    where: {
      provider,
      orgId,
    },
  })
}

/**
 * List all connected organizations
 *
 * @param provider - OAuth provider (default: 'zoho_books')
 * @returns Array of org IDs
 */
export async function listConnectedOrgs(
  provider: string = 'zoho_books'
): Promise<string[]> {
  const tokens = await prisma.oAuthToken.findMany({
    where: { provider },
    select: { orgId: true },
  })

  return tokens.map((t) => t.orgId)
}
