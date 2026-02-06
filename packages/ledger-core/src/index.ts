// @repo/ledger-core - Shared Accounting Types

// Export types
export type {
  LineItem,
  ExpenseData,
  PurchaseData,
  InvoiceData,
  VoucherResult,
  ExtractedData,
} from './types'

export type {
  AccountingContext,
  VendorRule,
  LedgerRule,
  AllocationRule,
  RiskSettings,
  GstSettings,
  PostingPreferences,
} from './accounting-context'

export { DocumentType, VoucherType, PostingStatus } from './types'

// Export schemas
export {
  LineItemSchema,
  ExpenseDataSchema,
  PurchaseDataSchema,
  InvoiceDataSchema,
  VoucherResultSchema,
  ExtractedDataSchema,
} from './schemas'

export {
  AccountingContextSchema,
  VendorRuleSchema,
  LedgerRuleSchema,
  AllocationRuleSchema,
  AllocationMatchSchema,
  GstSettingsSchema,
  RiskSettingsSchema,
  PostingPreferencesSchema,
  AllocationSettingsSchema,
} from './accounting-context'

// Export utilities
export {
  formatAmount,
  parseDate,
  formatDate,
  validateExpenseData,
  validatePurchaseData,
  validateInvoiceData,
  calculateLineItemsTotal,
  parseAmount,
  normalizeCurrency,
} from './utils'
