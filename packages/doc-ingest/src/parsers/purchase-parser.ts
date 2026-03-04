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
  if (isTataInvoice(text)) {
    const tataVendor = extractTataVendorName(text)
    if (tataVendor) {
      return tataVendor
    }
  }

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
  if (isTataInvoice(text)) {
    const tataBill = extractTataBillNumber(text)
    if (tataBill) {
      return tataBill
    }
  }

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
  if (isTataInvoice(text)) {
    const tataAmount = extractTataAmount(text)
    if (tataAmount) {
      return tataAmount
    }
  }

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
  if (isTataInvoice(text)) {
    const tataDate = extractTataDate(text)
    if (tataDate) {
      return tataDate
    }
  }

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
  const seen = new Set<string>()
  const lines = text
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

  for (const line of lines) {
    if (
      /^(total|subtotal|grand total|invoice total|taxable|cgst|sgst|igst|round off|amount in words)/i.test(
        line
      )
    ) {
      continue
    }

    // Common OCR table shape:
    // "<serial?> <description> <qty> <uom?> <rate> <amount>"
    const match = line.match(
      /^(?:\d+\s+)?(.+?)\s+(\d+(?:\.\d+)?)\s*(?:[A-Za-z]{2,5})?\s+(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)\s+(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)$/
    )
    if (!match || !match[1] || !match[2] || !match[3] || !match[4]) {
      continue
    }

    const description = match[1].replace(/\s+/g, ' ').trim()
    const quantity = parseFloat(match[2].replace(/,/g, ''))
    const rate = parseFloat(match[3].replace(/,/g, ''))
    const amount = parseFloat(match[4].replace(/,/g, ''))

    if (
      !description ||
      !Number.isFinite(quantity) ||
      !Number.isFinite(rate) ||
      !Number.isFinite(amount)
    ) {
      continue
    }

    // Guard against obvious non-item rows.
    if (
      description.length < 3 ||
      /invoice|bill|date|reference|gstin|hsn code|terms/i.test(description)
    ) {
      continue
    }

    const key = `${description.toLowerCase()}|${quantity}|${rate}|${amount}`
    if (seen.has(key)) {
      continue
    }
    seen.add(key)

    lineItems.push({
      description,
      quantity,
      rate,
      amount,
    })
  }

  if (lineItems.length > 0) {
    return lineItems
  }

  if (isTataInvoice(text)) {
    return extractTataLineItems(text)
  }

  return lineItems
}

function isTataInvoice(text: string): boolean {
  return (
    /Tata\s+Consumer/i.test(text) &&
    /Description of Goods\/HSN Code\/MRP/i.test(text)
  )
}

function extractTataLineItems(text: string): LineItem[] {
  const descriptions = extractTataDescriptions(text)
  const amounts = extractTataTaxableValues(text)

  const items: LineItem[] = []
  const maxCount = Math.max(descriptions.length, amounts.length)

  for (let i = 0; i < maxCount; i += 1) {
    const description = descriptions[i]
    const amount = amounts[i]

    if (!description) {
      continue
    }

    const safeAmount = amount ?? 0
    items.push({
      description,
      quantity: 1,
      rate: safeAmount,
      amount: safeAmount,
    })
  }

  return items
}

function extractTataDescriptions(text: string): string[] {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean)
  const descriptions: string[] = []
  const seen = new Set<string>()

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i] ?? ''
    if (!/^\d{15,}/.test(line)) {
      continue
    }

    let combined = line
    let j = i + 1
    let appended = 0
    while (j < lines.length && !/^\d{15,}/.test(lines[j] ?? '') && appended < 2) {
      const next = lines[j] ?? ''
      if (
        /^(Quantity|UOM|Rate|Discount|Taxable|Invoice|Date|Our Reference|ShipTo|Shipped)/i.test(
          next,
        )
      ) {
        break
      }
      combined += ` ${next}`
      appended += 1
      j += 1
    }
    i = j - 1

    if (!/HSN:\d{4,}/.test(combined)) {
      continue
    }

    const cleaned = combined
      .replace(/\s+/g, ' ')
      .replace(/MRP[:.]?\s*\d+[.,]?\d*/i, '')
      .replace(/Batch[:.]?\s*[A-Z0-9/.-]+/i, '')
      .trim()

    if (cleaned && !seen.has(cleaned)) {
      seen.add(cleaned)
      descriptions.push(cleaned)
    }
  }

  return descriptions
}

function extractTataTaxableValues(text: string): number[] {
  const values: number[] = []
  const anchors = [...text.matchAll(/Discount\s*\(Taxable\s*Value/gi)]
  const invoiceAmount = extractTataAmount(text)

  for (const anchor of anchors) {
    const start = anchor.index ?? 0
    const slice = text.slice(start, start + 1200)
    const stopIndex = findStopIndex(slice)
    const segment = slice.slice(0, stopIndex)

    const matches = segment.match(/\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+\.\d+/g)
    if (matches) {
      for (const raw of matches) {
        const num = parseFloat(raw.replace(/,/g, ''))
        const hasComma = raw.includes(',')
        if (!isNaN(num) && (hasComma || num >= 100)) {
          values.push(num)
        }
      }
    }
  }

  if (invoiceAmount && values.length > 1) {
    return values.filter((value) => Math.abs(value - invoiceAmount) > 0.01)
  }

  return values
}

function findStopIndex(segment: string): number {
  const markers = ['Rate (INR)', 'Rate (NR)', 'Our Reference', 'Value Incl']
  let stop = segment.length

  for (const marker of markers) {
    const idx = segment.indexOf(marker)
    if (idx !== -1 && idx < stop) {
      stop = idx
    }
  }

  return stop
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
  if (isTataInvoice(text)) {
    return 'INR'
  }

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
  if (isTataInvoice(text)) {
    if (/TAX\s+INVOICE/i.test(text)) {
      return 'Tax invoice'
    }
    return undefined
  }

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

function extractTataVendorName(text: string): string | undefined {
  const match = text.match(/Tata\s+Consumer\s+Products\s+LTD/i)
  if (match) {
    return 'Tata Consumer Products Ltd'
  }

  const altMatch = text.match(/Tata\s+Consumer\s+Products\s+Limited/i)
  if (altMatch) {
    return 'Tata Consumer Products Limited'
  }

  return undefined
}

function extractTataBillNumber(text: string): string | undefined {
  const patterns = [
    /Invoice\s*No\.?\s*\(ODN\)\s*[:\s]*([A-Z0-9-]+)/i,
    /Invoice\s*No\.?\s*[:\s]*([A-Z0-9-]+)/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  return undefined
}

function extractTataAmount(text: string): number | undefined {
  const patterns = [
    /Invoice\s*Amount\s*Rs\.?\s*([0-9,]+\.\d{2})/i,
    /Total\s+Invoice\s+Value\s*([0-9,]+\.\d{2})/i,
    /Value\s+Incl\.\s*Tax\s*\(INR\)\s*([0-9,]+\.\d{2})/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const num = parseFloat(match[1].replace(/,/g, ''))
      if (!isNaN(num) && num > 0) {
        return num
      }
    }
  }

  return undefined
}

function extractTataDate(text: string): Date | undefined {
  const invoiceDateMatch = text.match(
    /Invoice\s*No\.\s*\(ODN\):\s*[A-Z0-9-]+\s*Date\s*[:\s]*([0-9./-]+)/i,
  )
  if (invoiceDateMatch && invoiceDateMatch[1]) {
    try {
      const normalized = invoiceDateMatch[1].replace(/\./g, '/')
      const parsedDate = parseDateUtil(normalized)
      if (parsedDate && !isNaN(parsedDate.getTime())) {
        return parsedDate
      }
    } catch {
      // fall through
    }
  }

  const invoiceIndex = text.search(/Invoice\s*No\./i)
  if (invoiceIndex !== -1) {
    const slice = text.slice(invoiceIndex, invoiceIndex + 300)
    const nearMatch = slice.match(/Date\s*[:\s]*([0-9./-]+)/i)
    if (nearMatch && nearMatch[1]) {
      try {
        const normalized = nearMatch[1].replace(/\./g, '/')
        const parsedDate = parseDateUtil(normalized)
        if (parsedDate && !isNaN(parsedDate.getTime())) {
          return parsedDate
        }
      } catch {
        // fall through
      }
    }
  }

  const patterns = [
    /Date\s*[:\s]*([0-9]{1,2}[./-][0-9]{1,2}[./-][0-9]{2,4})/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      try {
        const normalized = match[1].replace(/\./g, '/')
        const parsedDate = parseDateUtil(normalized)
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
