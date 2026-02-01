// Purchase/Bill data parser - extracts bill/invoice information from text

import type { PurchaseData, LineItem } from '@repo/ledger-core'
import { parseDate as parseDateUtil } from '@repo/ledger-core'
import type { ParserResult } from '../types'

/**
 * Parse purchase/bill data from extracted text
 *
 * Looks for common patterns in invoices/bills:
 * - Vendor name
 * - Bill number
 * - Total amount
 * - Date and due date
 * - Line items
 * - Tax amounts
 *
 * @param text - Extracted text from PDF or image
 * @returns Parsed purchase data with confidence score
 */
export function parsePurchaseText(text: string): ParserResult<PurchaseData> {
  const warnings: string[] = []

  // Extract vendor name
  const vendorName = extractVendorName(text)
  if (!vendorName) {
    warnings.push('Could not extract vendor name')
  }

  // Extract bill number
  const billNumber = extractBillNumber(text)

  // Extract amount
  const amount = extractAmount(text)
  if (!amount) {
    warnings.push('Could not extract amount')
  }

  // Extract currency (default to INR if not found)
  const currency = extractCurrency(text) || 'INR'

  // Extract dates
  const date = extractDate(text)
  if (!date) {
    warnings.push('Could not extract date')
  }

  const dueDate = extractDueDate(text)

  // Extract line items
  const lineItems = extractLineItems(text)

  // Extract tax amount
  const taxAmount = extractTaxAmount(text)

  // Extract description
  const description = extractDescription(text)

  // Calculate confidence
  const requiredFields = [vendorName, amount, date, lineItems.length > 0]
    .filter(Boolean).length
  const confidence = (requiredFields / 4) * 100

  const purchaseData: PurchaseData = {
    vendorName: vendorName || 'Unknown Vendor',
    billNumber: billNumber || undefined,
    amount: amount || 0,
    currency,
    date: date || new Date(),
    dueDate: dueDate || undefined,
    lineItems,
    taxAmount: taxAmount || undefined,
    description: description || undefined,
  }

  return {
    data: purchaseData,
    confidence,
    warnings: warnings.length > 0 ? warnings : undefined,
  }
}

/**
 * Extract vendor name from invoice text
 */
function extractVendorName(text: string): string | undefined {
  // Look for "From:", "Vendor:", "Supplier:", etc.
  const patterns = [
    /(?:from|vendor|supplier)[:\s]+([^\n]+)/i,
    /(?:bill\s+from)[:\s]+([^\n]+)/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const name = match[1].trim()
      if (name.length > 0 && name.length < 100) {
        return name
      }
    }
  }

  // If not found, try first few non-empty lines
  const lines = text.split('\n').filter((line) => line.trim().length > 0)
  if (lines.length > 0 && lines[0]) {
    return lines[0].trim()
  }

  return undefined
}

/**
 * Extract bill/invoice number
 */
function extractBillNumber(text: string): string | undefined {
  const patterns = [
    /(?:invoice|bill|receipt)[\s#:]+([A-Z0-9-]+)/i,
    /(?:inv|bill)[\s#:]+([A-Z0-9-]+)/i,
    /#([A-Z0-9-]+)/,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  return undefined
}

/**
 * Extract total amount
 */
function extractAmount(text: string): number | undefined {
  const patterns = [
    /total[:\s]*[₹$€£]?\s*(\d+[,\d]*\.?\d*)/i,
    /amount\s+due[:\s]*[₹$€£]?\s*(\d+[,\d]*\.?\d*)/i,
    /grand\s*total[:\s]*[₹$€£]?\s*(\d+[,\d]*\.?\d*)/i,
    /balance\s+due[:\s]*[₹$€£]?\s*(\d+[,\d]*\.?\d*)/i,
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
 * Extract invoice date
 */
function extractDate(text: string): Date | undefined {
  const patterns = [
    /(?:invoice|bill|date)[:\s]+(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
    /(?:date)[:\s]+(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})/i,
    /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/,
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
        continue
      }
    }
  }

  return undefined
}

/**
 * Extract due date
 */
function extractDueDate(text: string): Date | undefined {
  const patterns = [
    /due\s+date[:\s]+(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
    /payment\s+due[:\s]+(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
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
        continue
      }
    }
  }

  return undefined
}

/**
 * Extract line items from invoice
 */
function extractLineItems(text: string): LineItem[] {
  const lineItems: LineItem[] = []

  // This is a simplified extraction - real-world would be more complex
  // Look for patterns like "Description Qty Rate Amount"
  const lines = text.split('\n')

  for (const line of lines) {
    // Try to match line item pattern: "Item/Description Qty Rate Amount"
    const match = line.match(
      /([^0-9]+)\s+(\d+)\s+[₹$€£]?\s*(\d+[,\d]*\.?\d*)\s+[₹$€£]?\s*(\d+[,\d]*\.?\d*)/
    )

    if (match && match[1] && match[2] && match[3] && match[4]) {
      const description = match[1].trim()
      const quantity = parseInt(match[2], 10)
      const rate = parseFloat(match[3].replace(/,/g, ''))
      const amount = parseFloat(match[4].replace(/,/g, ''))

      if (
        description &&
        !isNaN(quantity) &&
        !isNaN(rate) &&
        !isNaN(amount)
      ) {
        lineItems.push({
          description,
          quantity,
          rate,
          amount,
        })
      }
    }
  }

  return lineItems
}

/**
 * Extract tax amount
 */
function extractTaxAmount(text: string): number | undefined {
  const patterns = [
    /(?:total\s+)?(?:tax|gst|vat)[:\s]*[₹$€£]?\s*(\d+[,\d]*\.?\d*)/i,
    /(?:cgst|sgst|igst)[:\s]*[₹$€£]?\s*(\d+[,\d]*\.?\d*)/i,
  ]

  let totalTax = 0
  let foundTax = false

  for (const pattern of patterns) {
    const matches = text.matchAll(new RegExp(pattern, 'gi'))
    for (const match of matches) {
      if (match[1]) {
        const numStr = match[1].replace(/,/g, '')
        const num = parseFloat(numStr)
        if (!isNaN(num) && num > 0) {
          totalTax += num
          foundTax = true
        }
      }
    }
  }

  return foundTax ? totalTax : undefined
}

/**
 * Extract currency
 */
function extractCurrency(text: string): string | undefined {
  const currencyMap: Record<string, string> = {
    '₹': 'INR',
    '$': 'USD',
    '€': 'EUR',
    '£': 'GBP',
  }

  for (const [symbol, code] of Object.entries(currencyMap)) {
    if (text.includes(symbol)) {
      return code
    }
  }

  const currencyCodes = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD']
  for (const code of currencyCodes) {
    if (new RegExp(`\\b${code}\\b`, 'i').test(text)) {
      return code
    }
  }

  return undefined
}

/**
 * Extract description
 */
function extractDescription(text: string): string | undefined {
  const patterns = [
    /(?:notes?|remarks?|description)[:\s]+([^\n]{10,200})/i,
    /(?:for|purpose)[:\s]+([^\n]{10,200})/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  return undefined
}
