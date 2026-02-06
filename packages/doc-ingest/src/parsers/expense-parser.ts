// Expense data parser - extracts expense information from text

import type { ExpenseData } from '@repo/ledger-core'
import { parseDate as parseDateUtil } from '@repo/ledger-core'
import type { ParserResult } from '../types'

/**
 * Parse expense data from extracted text
 *
 * Looks for common patterns in expense receipts:
 * - Merchant/vendor name
 * - Total amount
 * - Date
 * - Tax amount
 * - Line items
 *
 * @param text - Extracted text from PDF or image
 * @returns Parsed expense data with confidence score
 */
export function parseExpenseText(text: string): ParserResult<ExpenseData> {
  const warnings: string[] = []

  // Extract merchant name (usually at the top of receipt)
  const merchant = extractMerchant(text)
  if (!merchant) {
    warnings.push('Could not extract merchant name')
  }

  // Extract amount
  const amount = extractAmount(text)
  if (!amount) {
    warnings.push('Could not extract amount')
  }

  // Extract date
  const date = extractDate(text)
  if (!date) {
    warnings.push('Could not extract date')
  }

  // Extract currency (default to INR if not found)
  const currency = extractCurrency(text) || 'INR'

  // Extract tax amount if present
  const taxAmount = extractTaxAmount(text)

  // Extract description/notes
  const description = extractDescription(text)

  // Calculate confidence based on required fields found
  const requiredFields = [merchant, amount, date].filter(Boolean).length
  const confidence = (requiredFields / 3) * 100

  const expenseData: ExpenseData = {
    merchant: merchant || 'Unknown Merchant',
    amount: amount || 0,
    currency,
    date: date || new Date(),
    description: description || undefined,
    taxAmount: taxAmount || undefined,
  }

  return {
    data: expenseData,
    confidence,
    warnings: warnings.length > 0 ? warnings : undefined,
  }
}

/**
 * Extract merchant name from receipt text
 * Looks for patterns like store names at the top
 */
function extractMerchant(text: string): string | undefined {
  // Get first few lines (merchant name is usually at top)
  const lines = text.split('\n').filter((line) => line.trim().length > 0)

  if (lines.length === 0) return undefined

  // First non-empty line is often the merchant name
  const firstLine = lines[0]?.trim()
  if (!firstLine) return undefined

  // Clean up common artifacts
  const cleaned = firstLine
    .replace(/[*#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  return cleaned.length > 0 && cleaned.length < 100 ? cleaned : undefined
}

/**
 * Extract total amount from receipt text
 * Looks for patterns like "Total: $XX.XX", "Amount: XX.XX", etc.
 */
function extractAmount(text: string): number | undefined {
  // Common patterns for total amount
  const patterns = [
    /total[:\s]*[₹$€£]?\s*(\d+[,\d]*\.?\d*)/i,
    /amount[:\s]*[₹$€£]?\s*(\d+[,\d]*\.?\d*)/i,
    /grand\s*total[:\s]*[₹$€£]?\s*(\d+[,\d]*\.?\d*)/i,
    /[₹$€£]\s*(\d+[,\d]*\.?\d*)/,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      // Remove commas and parse
      const numStr = match[1].replace(/,/g, '')
      const num = parseFloat(numStr)
      if (!isNaN(num) && num > 0) {
        return num
      }
    }
  }

  return undefined
}

/**
 * Extract date from receipt text
 * Looks for date patterns in various formats
 */
function extractDate(text: string): Date | undefined {
  // Common date patterns
  const patterns = [
    /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/,
    /(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})/,
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}/i,
    /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      try {
        const parsedDate = parseDateUtil(match[1])
        if (parsedDate && !isNaN(parsedDate.getTime())) {
          return parsedDate
        }
      } catch {
        // Continue to next pattern
      }
    }
  }

  return undefined
}

/**
 * Extract currency from text
 * Looks for currency symbols or codes
 */
function extractCurrency(text: string): string | undefined {
  // Currency symbols to codes
  const currencyMap: Record<string, string> = {
    '₹': 'INR',
    '$': 'USD',
    '€': 'EUR',
    '£': 'GBP',
  }

  // Check for currency symbols
  for (const [symbol, code] of Object.entries(currencyMap)) {
    if (text.includes(symbol)) {
      return code
    }
  }

  // Check for currency codes
  const currencyCodes = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD']
  for (const code of currencyCodes) {
    if (new RegExp(`\\b${code}\\b`, 'i').test(text)) {
      return code
    }
  }

  return undefined
}

/**
 * Extract tax amount from text
 * Looks for patterns like "Tax: XX.XX", "GST: XX.XX", "VAT: XX.XX"
 */
function extractTaxAmount(text: string): number | undefined {
  const patterns = [
    /(?:tax|gst|vat)[:\s]*[₹$€£]?\s*(\d+[,\d]*\.?\d*)/i,
    /(?:cgst|sgst|igst)[:\s]*[₹$€£]?\s*(\d+[,\d]*\.?\d*)/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const numStr = match[1].replace(/,/g, '')
      const num = parseFloat(numStr)
      if (!isNaN(num) && num > 0) {
        return num
      }
    }
  }

  return undefined
}

/**
 * Extract description/notes from text
 * Looks for common description patterns
 */
function extractDescription(text: string): string | undefined {
  // Look for lines that might contain descriptions
  const lines = text.split('\n').map((line) => line.trim())

  // Find lines with "description", "notes", "for", etc.
  const descriptionPatterns = [
    /description[:\s]+(.*)/i,
    /notes?[:\s]+(.*)/i,
    /purpose[:\s]+(.*)/i,
  ]

  for (const pattern of descriptionPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const desc = match[1].trim()
      if (desc.length > 0 && desc.length < 200) {
        return desc
      }
    }
  }

  return undefined
}
