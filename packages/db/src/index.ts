// @repo/db - Database Layer

// Prisma client
export { prisma } from './client'

// Encryption utilities
export { encrypt, decrypt, generateEncryptionKey } from './encryption'

// OAuth token storage
export {
  storeTokens,
  getTokens,
  hasTokens,
  deleteTokens,
  listConnectedOrgs,
} from './oauth-tokens'
export type { TokenData } from './oauth-tokens'

// Document tracking
export {
  createDocument,
  updateDocument,
  getDocument,
  listDocuments,
  getDocumentsByStatus,
} from './documents'
export type { CreateDocumentInput, UpdateDocumentInput } from './documents'

// Zoho OAuth flow
export {
  generateAuthorizationUrl,
  exchangeCodeForTokens,
  exchangeAndStoreTokens,
  refreshAccessToken,
  refreshAndStoreTokens,
} from './zoho-oauth'
export type { ZohoOAuthConfig, TokenResponse } from './zoho-oauth'