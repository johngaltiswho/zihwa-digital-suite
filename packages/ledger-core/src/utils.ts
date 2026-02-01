// Utility functions for accounting data processing

import { parse, format, isValid } from 'date-fns'
import type { ExpenseData, PurchaseData, InvoiceData } from './types'
import { ExpenseDataSchema, PurchaseDataSchema, InvoiceDataSchema } from './schemas'

/**
 * Format amount with currency
 * @example formatAmount(1234.56, 'USD') => '$1,234.56'
 * @example formatAmount(1000, 'INR') => '₹1,000.00'
 */
export function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    // Fallback if currency is invalid
    return `${currency} ${amount.toFixed(2)}`
  }
}

/**
 * Parse date string to Date object
 * Supports multiple formats: YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY
 */
export function parseDate(dateString: string): Date {
  const formats = ['yyyy-MM-dd', 'dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy/MM/dd']

  for (const formatString of formats) {
    const parsed = parse(dateString, formatString, new Date())
    if (isValid(parsed)) {
      return parsed
    }
  }

  // Try native Date parsing as fallback
  const nativeDate = new Date(dateString)
  if (isValid(nativeDate)) {
    return nativeDate
  }

  throw new Error(`Unable to parse date: ${dateString}`)
}

/**
 * Format date to standard format (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Validate expense data using Zod schema
 * Throws detailed validation error if invalid
 */
export function validateExpenseData(data: unknown): ExpenseData {
  return ExpenseDataSchema.parse(data)
}

/**
 * Validate purchase data using Zod schema
 * Throws detailed validation error if invalid
 */
export function validatePurchaseData(data: unknown): PurchaseData {
  return PurchaseDataSchema.parse(data)
}

/**
 * Validate invoice data using Zod schema
 * Throws detailed validation error if invalid
 */
export function validateInvoiceData(data: unknown): InvoiceData {
  return InvoiceDataSchema.parse(data)
}

/**
 * Calculate total from line items
 */
export function calculateLineItemsTotal(lineItems: Array<{ amount: number }>): number {
  return lineItems.reduce((sum, item) => sum + item.amount, 0)
}

/**
 * Parse amount string to number
 * Handles formats like: "$1,234.56", "INR 1,234.56", "1234.56"
 */
export function parseAmount(amountString: string): number {
  // Remove currency symbols, commas, and spaces
  const cleaned = amountString.replace(/[$₹€£¥,\s]/g, '')
  const parsed = parseFloat(cleaned)

  if (isNaN(parsed)) {
    throw new Error(`Unable to parse amount: ${amountString}`)
  }

  return parsed
}

/**
 * Normalize currency code to uppercase 3-letter format
 */
export function normalizeCurrency(currency: string): string {
  const normalized = currency.trim().toUpperCase()

  // Common currency mappings
  const currencyMap: Record<string, string> = {
    RS: 'INR',
    RUPEES: 'INR',
    RUPEE: 'INR',
    DOLLARS: 'USD',
    DOLLAR: 'USD',
  }

  return currencyMap[normalized] || normalized
}
