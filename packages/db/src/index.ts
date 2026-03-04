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
  listOrganizationsForUser,
  getOrgMembership,
  addOrgMember,
  listOrgMembers,
} from './organizations'
export type { CreateOrganizationInput, AddOrgMemberInput } from './organizations'

export {
  createCompany,
  getCompanyById,
  getCompanyBySlug,
  listCompanies,
  listCompaniesForUserInOrg,
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

// Company memberships
export {
  upsertCompanyMembership,
  getCompanyMembership,
  listCompanyMemberships,
  listUserCompanyMemberships,
} from './company-memberships'
export type { UpsertCompanyMembershipInput } from './company-memberships'

// Drafts & Copilot
export {
  createAccountingDraft,
  getAccountingDraftById,
  listAccountingDrafts,
  updateAccountingDraft,
} from './accounting-drafts'
export type { CreateAccountingDraftInput } from './accounting-drafts'

export {
  createCopilotThread,
  listCopilotThreads,
  createCopilotMessage,
  listCopilotMessages,
  createCopilotToolCall,
} from './copilot-threads'

// Learning signals
export {
  createLearningSignal,
  listLearningSignalsByCompany,
  getCompanyLearningInsights,
} from './learning-signals'

// Zoho OAuth flow
export {
  generateAuthorizationUrl,
  exchangeCodeForTokens,
  exchangeAndStoreTokens,
  refreshAccessToken,
  refreshAndStoreTokens,
} from './zoho-oauth'
export type { ZohoOAuthConfig, TokenResponse } from './zoho-oauth'

// ==========================================
// HUMILITY DB - BJJ Learning Platform
// ==========================================

// Students
export {
  createStudent,
  getStudentById,
  getStudentByVendureCustomerId,
  getStudentByEmail,
  updateStudent,
  listStudents,
} from './students'
export type { CreateStudentInput } from './students'

// Subscriptions
export {
  createSubscription,
  getSubscriptionById,
  getActiveSubscription,
  listSubscriptionsByStudent,
  updateSubscriptionStatus,
  extendSubscription,
} from './subscriptions'
export type { CreateSubscriptionInput } from './subscriptions'

// Techniques
export {
  createTechnique,
  getTechniqueById,
  getTechniqueBySlug,
  listTechniques,
  updateTechnique,
  publishTechnique,
  unpublishTechnique,
} from './techniques'
export type { CreateTechniqueInput } from './techniques'

// Video Uploads
export {
  createVideoUpload,
  getVideoUploadById,
  listVideoUploadsByStudent,
  updateVideoUploadStatus,
  countVideoUploadsInMonth,
} from './video-uploads'
export type { CreateVideoUploadInput } from './video-uploads'

// Video Analysis
export {
  createVideoAnalysis,
  getVideoAnalysisById,
  listVideoAnalyses,
  getAverageScores,
} from './video-analysis'
export type { CreateVideoAnalysisInput } from './video-analysis'

// BJJ Copilot
export {
  createBJJCopilotThread,
  getBJJCopilotThreadById,
  listBJJCopilotThreadsByStudent,
  createBJJCopilotMessage,
  listBJJCopilotMessages,
  createBJJCopilotToolCall,
  countBJJCopilotMessagesInDay,
} from './bjj-copilot'
export type {
  CreateBJJCopilotThreadInput,
  CreateBJJCopilotMessageInput,
  CreateBJJCopilotToolCallInput,
} from './bjj-copilot'

// Training Plans
export {
  createTrainingPlan,
  getTrainingPlanById,
  listTrainingPlansByStudent,
  createTrainingPlanItem,
  markTrainingPlanItemComplete,
  updateTrainingPlanStatus,
  getTrainingPlanProgress,
} from './training-plans'
export type { CreateTrainingPlanInput, CreateTrainingPlanItemInput } from './training-plans'

// Progress Tracking
export {
  createTechniqueProgress,
  getTechniqueProgress,
  listTechniqueProgress,
  incrementPracticeCount,
  updateTechniqueProgress,
  getProgressSummary,
} from './progress'
export type { CreateTechniqueProgressInput } from './progress'
