import { z } from 'zod'

export const VendorRuleSchema = z.object({
  vendorId: z.string().optional(),
  vendorName: z.string().min(1, 'Vendor name is required'),
  defaultLedgerId: z.string().min(1, 'Ledger ID is required'),
  defaultTaxId: z.string().optional(),
  notes: z.string().optional(),
  confidenceBoost: z.number().min(0).max(1).optional(),
})

export const LedgerRuleSchema = z.object({
  keywords: z.array(z.string().min(1)).min(1, 'At least one keyword is required'),
  ledgerId: z.string().min(1),
  taxId: z.string().optional(),
  memo: z.string().optional(),
})

export const AllocationMatchSchema = z.object({
  vendorId: z.string().optional(),
  vendorName: z.string().optional(),
  expenseCategory: z.string().optional(),
  minAmount: z.number().nonnegative().optional(),
  maxAmount: z.number().nonnegative().optional(),
  keywords: z.array(z.string()).optional(),
})

export const AllocationRuleSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  costCenterId: z.string().optional(),
  match: AllocationMatchSchema,
})

export const GstSettingsSchema = z.object({
  registered: z.boolean().default(true),
  requireGstin: z.boolean().default(true),
  defaultTreatment: z.enum(['INTRA', 'INTER', 'IMPORT', 'EXEMPT']).default('INTRA'),
  exemptVendorIds: z.array(z.string()).default([]),
  manualRateVendors: z.array(z.string()).default([]),
})

export const RiskSettingsSchema = z.object({
  highValueAmount: z.number().nonnegative().optional(),
  manualReviewAmount: z.number().nonnegative().optional(),
  blockedVendors: z.array(z.string()).default([]),
  holdKeywords: z.array(z.string()).default([]),
})

export const PostingPreferencesSchema = z.object({
  allowAutoPost: z.boolean().default(false),
  autoPostConfidence: z.number().min(0).max(100).default(90),
  manualReviewConfidence: z.number().min(0).max(100).default(70),
  maxAutoPostAmount: z.number().nonnegative().optional(),
})

export const AllocationSettingsSchema = z.object({
  useProjects: z.boolean().default(false),
  defaultProjectId: z.string().optional(),
  rules: z.array(AllocationRuleSchema).default([]),
})

export const AccountingContextSchema = z.object({
  version: z.number().int().positive().default(1),
  baseCurrency: z.string().length(3, 'Currency must be a 3-letter code'),
  timezone: z.string().min(2),
  posting: PostingPreferencesSchema,
  vendorRules: z.array(VendorRuleSchema).default([]),
  ledgerRules: z.array(LedgerRuleSchema).default([]),
  allocation: AllocationSettingsSchema,
  gst: GstSettingsSchema,
  risk: RiskSettingsSchema,
  notes: z.string().optional(),
})

export type AccountingContext = z.infer<typeof AccountingContextSchema>
export type VendorRule = z.infer<typeof VendorRuleSchema>
export type LedgerRule = z.infer<typeof LedgerRuleSchema>
export type AllocationRule = z.infer<typeof AllocationRuleSchema>
export type RiskSettings = z.infer<typeof RiskSettingsSchema>
export type GstSettings = z.infer<typeof GstSettingsSchema>
export type PostingPreferences = z.infer<typeof PostingPreferencesSchema>
