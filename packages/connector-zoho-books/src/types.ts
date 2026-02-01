// Type definitions for Zoho Books API integration

export type ZohoRegion = 'com' | 'in' | 'eu' | 'com.au' | 'jp'

/**
 * Configuration for a Zoho organization
 */
export interface ZohoOrgConfig {
  orgId: string
  region: ZohoRegion
  clientId: string
  clientSecret: string
  redirectUri?: string
}

/**
 * OAuth token set for Zoho Books
 */
export interface ZohoTokenSet {
  accessToken: string
  refreshToken: string
  expiresAt: Date
  scope?: string
}

/**
 * Options for posting expenses to Zoho Books
 */
export interface ZohoExpenseOptions {
  /** Default expense account ID in Zoho Books */
  accountId?: string
  /** Customer ID if expense is customer-related */
  customerId?: string
  /** Project ID if expense is project-related */
  projectId?: string
  /** Tax ID to apply */
  taxId?: string
  /** Currency code (defaults to organization currency) */
  currencyCode?: string
}

/**
 * Extended options for expense posting requests
 */
export interface ZohoExpenseRequestOptions extends ZohoExpenseOptions {
  /** Idempotency key to prevent duplicate posts */
  idempotencyKey?: string
}

/**
 * Options for posting purchases/bills to Zoho Books
 */
export interface ZohoPurchaseOptions {
  /** Zoho vendor ID (required for bills) */
  vendorId?: string
  /** Default purchase account ID */
  accountId?: string
  /** Tax ID to apply */
  taxId?: string
  /** Currency code (defaults to organization currency) */
  currencyCode?: string
  /** Payment terms in days */
  paymentTerms?: number
}

/**
 * Extended options for purchase posting requests
 */
export interface ZohoPurchaseRequestOptions extends ZohoPurchaseOptions {
  /** Idempotency key to prevent duplicate posts */
  idempotencyKey?: string
}

/**
 * Internal: Zoho API token refresh response
 */
export interface ZohoTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  api_domain: string
  token_type: string
  scope?: string
}

/**
 * Internal: Zoho API error response
 */
export interface ZohoApiErrorResponse {
  code: number
  message: string
  errors?: Array<{
    field?: string
    message: string
  }>
}

/**
 * Internal: Zoho expense create request payload
 */
export interface ZohoExpenseRequest {
  account_id: string
  amount: number
  date: string
  paid_through_account_id?: string
  vendor_id?: string
  currency_code?: string
  exchange_rate?: number
  tax_id?: string
  customer_id?: string
  project_id?: string
  description?: string
  reference_number?: string
  is_billable?: boolean
  is_inclusive_tax?: boolean
}

/**
 * Internal: Zoho bill/purchase create request payload
 */
export interface ZohoBillRequest {
  vendor_id: string
  bill_number?: string
  date: string
  due_date?: string
  currency_code?: string
  exchange_rate?: number
  line_items: Array<{
    account_id?: string
    name: string
    description?: string
    rate: number
    quantity: number
    tax_id?: string
    tax_percentage?: number
  }>
  notes?: string
  terms?: string
  payment_terms?: number
}

/**
 * Internal: Zoho API success response
 */
export interface ZohoApiResponse<T> {
  code: number
  message: string
  [key: string]: T | number | string
}
