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

// Organizations & companies
export {
  createOrganization,
  getOrganizationById,
  getOrganizationBySlug,
  listOrganizations,
  addOrgMember,
  listOrgMembers,
} from './organizations'
export type { CreateOrganizationInput, AddOrgMemberInput } from './organizations'

export {
  createCompany,
  getCompanyById,
  getCompanyBySlug,
  listCompanies,
  archiveCompany,
} from './companies'
export type { CreateCompanyInput } from './companies'

// Policies & contexts
export {
  createOrgPolicy,
  getActiveOrgPolicy,
  listOrgPolicies,
  deactivateOrgPolicy,
} from './org-policies'
export type { UpsertOrgPolicyInput } from './org-policies'

export {
  createAccountingContext,
  listAccountingContexts,
  getActiveAccountingContext,
  activateAccountingContext,
} from './accounting-contexts'
export type { CreateAccountingContextInput } from './accounting-contexts'

// Zoho OAuth flow
export {
  generateAuthorizationUrl,
  exchangeCodeForTokens,
  exchangeAndStoreTokens,
  refreshAccessToken,
  refreshAndStoreTokens,
} from './zoho-oauth'
export type { ZohoOAuthConfig, TokenResponse } from './zoho-oauth'
