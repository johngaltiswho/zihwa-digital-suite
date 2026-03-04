/**
 * Humility DB TypeScript types
 * Local definitions to avoid @prisma/client import issues in Next.js builds
 */

// Enums
export type BeltRank = 'WHITE' | 'BLUE' | 'PURPLE' | 'BROWN' | 'BLACK'
export type SubscriptionTier = 'FREE' | 'BASIC' | 'PREMIUM'
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
export type ProgressStatus = 'NOT_STARTED' | 'LEARNING' | 'PRACTICING' | 'PROFICIENT' | 'MASTERED'
export type VideoProcessingStatus = 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
export type AnalysisType = 'FORM' | 'POSITIONING' | 'TECHNIQUE_RECOGNITION'
export type PlanStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'

// These types are intentionally minimal to avoid coupling with generated Prisma types
// Full types are available from Prisma client, but we only need subsets for exports
