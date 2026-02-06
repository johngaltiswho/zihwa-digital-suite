// Core accounting types for expense and purchase posting

export interface LineItem {
  description: string
  quantity: number
  rate: number
  amount: number
  accountId?: string // Zoho account ledger ID
  taxId?: string // Zoho tax ID
}

export interface ExpenseData {
  merchant: string
  amount: number
  currency: string
  date: Date
  category?: string
  description?: string
  taxAmount?: number
  lineItems?: LineItem[]
}

export interface PurchaseData {
  vendorName: string
  billNumber?: string
  amount: number
  currency: string
  date: Date
  dueDate?: Date
  lineItems: LineItem[]
  taxAmount?: number
  description?: string
}

export interface InvoiceData {
  invoiceNumber: string
  customerName: string
  amount: number
  currency: string
  date: Date
  dueDate?: Date
  lineItems: LineItem[]
  taxAmount?: number
  description?: string
}

export interface VoucherResult {
  success: boolean
  voucherId?: string
  externalRef?: string // Zoho/Tally voucher ID
  error?: string
  timestamp: Date
}

export type ExtractedData =
  | { type: 'expense'; data: ExpenseData }
  | { type: 'purchase'; data: PurchaseData }
  | { type: 'invoice'; data: InvoiceData }

// Enums
export enum DocumentType {
  EXPENSE = 'EXPENSE',
  PURCHASE = 'PURCHASE',
  INVOICE = 'INVOICE',
}

export enum VoucherType {
  RECEIPT = 'RECEIPT',
  PAYMENT = 'PAYMENT',
  PURCHASE = 'PURCHASE',
  EXPENSE = 'EXPENSE',
  JOURNAL = 'JOURNAL',
}

export enum PostingStatus {
  PENDING = 'PENDING',
  POSTING = 'POSTING',
  POSTED = 'POSTED',
  FAILED = 'FAILED',
}
