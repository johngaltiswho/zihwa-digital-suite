// Main entry point for document ingestion package

import { extractTextFromPDF } from './pdf-parser'
import { extractTextFromImage, extractTextWithConfidence } from './ocr'
import { parseExpenseText } from './parsers/expense-parser'
import { parsePurchaseText } from './parsers/purchase-parser'
import { parseWithAI } from './parsers/ai-parser'
import { parseWithVision } from './parsers/vision-parser'
import { convertFirstPagePdfToPng } from './pdf-to-image'
import { mergeUsage } from './pricing'
import type {
  ExtractedData,
  FileType,
  DocumentType,
  ExtractionOptions,
} from './types'

function resolveExpectedType(
  expectedType: DocumentType | undefined,
  inferredType: 'expense' | 'purchase'
): 'expense' | 'purchase' | 'credit_note' {
  if (!expectedType) return inferredType
  if (expectedType === 'invoice') return 'purchase'
  if (expectedType === 'credit_note') return 'credit_note'
  return expectedType
}

function asNumber(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(num) ? num : 0
}

function isLikelySummaryInvoiceDescription(value: unknown): boolean {
  if (typeof value !== 'string') return false
  const text = value.trim().toLowerCase()
  if (!text) return false

  return /(summary|consolidated|statement|monthly|period|dsr|ttl|je|opening|closing)/.test(
    text
  )
}

function buildSummaryLineItem(data: any, amount: number) {
  const description =
    (typeof data.description === 'string' && data.description.trim()) ||
    (typeof data.billNumber === 'string' && data.billNumber.trim()
      ? `Invoice ${data.billNumber.trim()}`
      : '') ||
    'Invoice item'

  return {
    description,
    quantity: 1,
    rate: amount,
    amount,
  }
}

function normalizePurchaseLineItems(data: any): any {
  if (!data || typeof data !== 'object' || !('vendorName' in data)) return data
  if (!Array.isArray(data.lineItems) || data.lineItems.length === 0) return data

  const amount = asNumber(data.amount)
  const taxAmount = asNumber(data.taxAmount)
  const taxableSubtotal = amount > 0 ? Math.max(amount - taxAmount, 0) : 0
  const expectedBase = taxableSubtotal > 0 ? taxableSubtotal : amount
  if (expectedBase <= 0) return data

  const cleanedItems = data.lineItems
    .filter((item: any) => item && typeof item === 'object')
    .map((item: any) => ({
      ...item,
      description:
        typeof item.description === 'string' ? item.description.trim() : 'Invoice item',
      quantity: asNumber(item.quantity) || 1,
      rate: asNumber(item.rate),
      amount: asNumber(item.amount),
    }))
    .filter((item: any) => item.amount > 0)

  if (cleanedItems.length === 0) return data

  const lineItemsSum = cleanedItems.reduce((sum: number, item: any) => sum + asNumber(item.amount), 0)
  const mismatchRatio = expectedBase > 0 ? Math.abs(lineItemsSum - expectedBase) / expectedBase : 0
  const summaryHint = isLikelySummaryInvoiceDescription(data.description)
  const tooManyItems = cleanedItems.length > 8
  const hsnHeavyItems = cleanedItems.filter((item: any) =>
    /hsn[:\s]?\d{4,}/i.test(String(item.description || ''))
  ).length
  const delta = Number((expectedBase - lineItemsSum).toFixed(2))

  // For clearly summary-style invoices, keep single consolidated line.
  if (summaryHint && cleanedItems.length > 1) {
    return {
      ...data,
      lineItems: [buildSummaryLineItem(data, expectedBase)],
    }
  }

  // For itemized invoices (often with HSN codes), retain extracted rows and
  // add one balancing row when parser missed some rows.
  if (mismatchRatio > 0.08 && hsnHeavyItems >= 3 && Math.abs(delta) >= 1) {
    const balanceDirection = delta > 0 ? 'Balance adjustment' : 'Discount/rounding adjustment'
    return {
      ...data,
      lineItems: [
        ...cleanedItems,
        {
          description: `${balanceDirection} (${data.billNumber || 'invoice'})`,
          quantity: 1,
          rate: delta,
          amount: delta,
        },
      ],
    }
  }

  // If rows look noisy and mismatch is very high, consolidate to one row.
  if (mismatchRatio > 0.35 || (tooManyItems && mismatchRatio > 0.2)) {
    return {
      ...data,
      lineItems: [buildSummaryLineItem(data, expectedBase)],
    }
  }

  return {
    ...data,
    lineItems: cleanedItems,
  }
}

function enrichPurchaseLineItemsFromText(
  data: any,
  text: string,
  expectedType?: DocumentType
): any {
  if (!data || typeof data !== 'object') return data
  if (!('vendorName' in data)) return data

  const parsed = parsePurchaseText(text, {
    expectedType: expectedType === 'credit_note' ? 'credit_note' : undefined,
  })
  const next: any = { ...data }

  if (
    (expectedType === 'credit_note' && parsed.data.billNumber) ||
    (!next.billNumber && parsed.data.billNumber)
  ) {
    next.billNumber = parsed.data.billNumber
  }
  if (!next.referenceInvoiceNo && parsed.data.referenceInvoiceNo) {
    next.referenceInvoiceNo = parsed.data.referenceInvoiceNo
  }

  if (!Array.isArray(next.lineItems) || next.lineItems.length === 0) {
    if (parsed.data.lineItems && parsed.data.lineItems.length > 0) {
      next.lineItems = parsed.data.lineItems
    }
    return next
  }

  next.lineItems = next.lineItems.map((item: any) => {
    if (!item || typeof item !== 'object') return item
    if (item.hsnCode) return item
    const desc = String(item.description || '')
    const hsnMatch = desc.match(/HSN[:\s]?(\d{4,8})/i)
    if (!hsnMatch?.[1]) return item
    return {
      ...item,
      hsnCode: hsnMatch[1],
    }
  })

  return next
}

/**
 * Main function to extract data from a document (PDF or image)
 *
 * @param buffer - Document file as Buffer
 * @param fileType - Type of file ('pdf' or 'image')
 * @param options - Extraction options
 * @returns Extracted and parsed data with type discrimination
 *
 * @example
 * ```typescript
 * const pdfBuffer = fs.readFileSync('receipt.pdf')
 * const result = await extractFromDocument(pdfBuffer, 'pdf', {
 *   expectedType: 'expense'
 * })
 *
 * if (result.type === 'expense') {
 *   console.log('Merchant:', result.data.merchant)
 *   console.log('Amount:', result.data.amount)
 * }
 * ```
 */
export async function extractFromDocument(
  buffer: Buffer,
  fileType: FileType,
  options: ExtractionOptions = {}
): Promise<ExtractedData> {
  const enableVisionFallback = options.enableVisionFallback !== false // Default: true
  const fallbackThreshold = options.visionFallbackThreshold || 85

  // Step 1: Try OCR + Text AI first (for images with AI enabled)
  if (fileType === 'image' && options.useAI && options.aiConfig) {
    try {
      console.log('🔍 Attempting OCR + Text AI extraction...')

      // Extract text via OCR
      const ocrResult = await extractTextWithConfidence(
        buffer,
        options.language || 'eng'
      )

      console.log(`📝 OCR confidence: ${ocrResult.confidence.toFixed(1)}%`)

      // Parse with AI
      const parseResult = await parseWithAI(ocrResult.text, options.aiConfig)
      let data = parseResult.data as any
      data = enrichPurchaseLineItemsFromText(data, ocrResult.text, options.expectedType)
      data = normalizePurchaseLineItems(data)
      const hasVendor = 'vendorName' in data
      const finalConfidence = Math.min(ocrResult.confidence, parseResult.confidence || 100)

      const inferredType = hasVendor ? 'purchase' : 'expense'
      const finalType = resolveExpectedType(options.expectedType, inferredType)

      const result: ExtractedData = {
        type: finalType,
        data: data,
        confidence: finalConfidence,
        usage: parseResult.usage,
      }

      console.log(`✅ OCR + Text AI result: ${finalConfidence.toFixed(1)}% confidence`)

      // Check if we need to fallback to Vision API
      if (
        enableVisionFallback &&
        options.aiConfig.provider === 'openai' &&
        finalConfidence < fallbackThreshold
      ) {
        console.log(
          `⚠️  Low confidence (${finalConfidence.toFixed(1)}% < ${fallbackThreshold}%), retrying with Vision API...`
        )

        const visionResult = await parseWithVision(buffer, {
          provider: 'openai',
          apiKey: options.aiConfig.apiKey,
          model: options.aiConfig.model,
        })

        let visionData = visionResult.data as any
        visionData = normalizePurchaseLineItems(visionData)
        const hasVendorVision = 'vendorName' in visionData

        console.log(
          `🎯 Vision API result: ${visionResult.confidence?.toFixed(1)}% confidence (fallback used)`
        )

        const inferredVisionType = hasVendorVision ? 'purchase' : 'expense'
        const finalVisionType = resolveExpectedType(
          options.expectedType,
          inferredVisionType
        )

        return {
          type: finalVisionType,
          data: visionData,
          confidence: visionResult.confidence,
          usage: mergeUsage(parseResult.usage, visionResult.usage),
        }
      }

      return result
    } catch (error) {
      // If OCR fails completely and Vision fallback is enabled, try Vision API
      if (enableVisionFallback && options.aiConfig.provider === 'openai') {
        console.log('❌ OCR failed, falling back to Vision API...')

        const visionResult = await parseWithVision(buffer, {
          provider: 'openai',
          apiKey: options.aiConfig.apiKey,
          model: options.aiConfig.model,
        })

        let visionData = visionResult.data as any
        visionData = normalizePurchaseLineItems(visionData)
        const hasVendorVision = 'vendorName' in visionData

        console.log(`🎯 Vision API result: ${visionResult.confidence?.toFixed(1)}% confidence (error fallback)`)

        const inferredVisionType = hasVendorVision ? 'purchase' : 'expense'
        const finalVisionType = resolveExpectedType(
          options.expectedType,
          inferredVisionType
        )

        return {
          type: finalVisionType,
          data: visionData,
          confidence: visionResult.confidence,
          usage: visionResult.usage,
        }
      }

      throw error
    }
  }

  // Step 2: For PDFs or non-AI extraction, use original flow
  let extractedText: string
  let confidence: number | undefined

  if (fileType === 'pdf') {
    extractedText = await extractTextFromPDF(buffer)
    // Scanned/image-only PDFs often return near-empty text.
    // Fall back to Vision by converting page 1 to PNG when enabled.
    if (
      options.useAI &&
      options.aiConfig &&
      options.aiConfig.provider === 'openai' &&
      options.enableVisionFallback !== false &&
      extractedText.trim().length < 80
    ) {
      console.log('📄 Low PDF text detected, attempting scanned-PDF Vision fallback...')

      const pageImage = await convertFirstPagePdfToPng(buffer)
      const visionResult = await parseWithVision(pageImage, {
        provider: 'openai',
        apiKey: options.aiConfig.apiKey,
        model: options.aiConfig.model,
      })

      let visionData = visionResult.data as any
      visionData = normalizePurchaseLineItems(visionData)
      const hasVendorVision = 'vendorName' in visionData

      console.log(
        `🎯 Scanned PDF Vision result: ${visionResult.confidence?.toFixed(1)}% confidence`
      )

      const inferredVisionType = hasVendorVision ? 'purchase' : 'expense'
      const finalVisionType = resolveExpectedType(
        options.expectedType,
        inferredVisionType
      )

      return {
        type: finalVisionType,
        data: visionData,
        confidence: visionResult.confidence,
        usage: visionResult.usage,
      }
    }
  } else if (fileType === 'image') {
    const result = await extractTextWithConfidence(
      buffer,
      options.language || 'eng'
    )
    extractedText = result.text
    confidence = result.confidence
  } else {
    throw new Error(`Unsupported file type: ${fileType}`)
  }

  // Use AI parsing if configured
  if (options.useAI && options.aiConfig) {
    const result = await parseWithAI(extractedText, options.aiConfig)
    let data = result.data as any
    data = enrichPurchaseLineItemsFromText(data, extractedText, options.expectedType)
    data = normalizePurchaseLineItems(data)
    const hasVendor = 'vendorName' in data

    const inferredType = hasVendor ? 'purchase' : 'expense'
    const finalType = resolveExpectedType(options.expectedType, inferredType)

    return {
      type: finalType,
      data: data,
      confidence: confidence || result.confidence,
      usage: result.usage,
    }
  }

  // Fallback to regex-based parsing
  const documentType = options.expectedType || detectDocumentType(extractedText)

  if (documentType === 'expense') {
    const result = parseExpenseText(extractedText)
    return {
      type: 'expense',
      data: result.data,
      confidence: confidence || result.confidence,
    }
  } else if (
    documentType === 'purchase' ||
    documentType === 'invoice' ||
    documentType === 'credit_note'
  ) {
    const result = parsePurchaseText(extractedText)
    return {
      type: documentType === 'credit_note' ? 'credit_note' : 'purchase',
      data: result.data,
      confidence: confidence || result.confidence,
    }
  }

  // Default to expense if cannot determine
  const result = parseExpenseText(extractedText)
  return {
    type: 'expense',
    data: result.data,
    confidence: confidence || result.confidence,
  }
}

/**
 * Detect document type from text content
 * Uses heuristics to determine if it's an expense, purchase, or invoice
 */
function detectDocumentType(text: string): DocumentType {
  const lowerText = text.toLowerCase()

  // Keywords that suggest it's a bill/invoice (purchase)
  const purchaseKeywords = [
    'invoice',
    'bill number',
    'vendor',
    'supplier',
    'purchase order',
    'po number',
    'due date',
    'payment terms',
    'line items',
    'quantity',
    'bill to',
    'ship to',
  ]

  const creditNoteKeywords = ['credit note', 'credit memo', 'vendor credit', 'cn no', 'cr note']

  // Keywords that suggest it's an expense receipt
  const expenseKeywords = [
    'receipt',
    'thank you',
    'cashier',
    'card number',
    'transaction',
    'merchant',
    'store',
  ]

  // Count keyword matches
  const purchaseScore = purchaseKeywords.filter((keyword) =>
    lowerText.includes(keyword)
  ).length

  const expenseScore = expenseKeywords.filter((keyword) =>
    lowerText.includes(keyword)
  ).length

  const creditNoteScore = creditNoteKeywords.filter((keyword) =>
    lowerText.includes(keyword)
  ).length

  if (creditNoteScore >= 1) {
    return 'credit_note'
  }

  // Determine type based on higher score
  if (purchaseScore > expenseScore && purchaseScore >= 2) {
    return 'purchase'
  }

  // Default to expense
  return 'expense'
}

// Export individual functions for direct use
export { extractTextFromPDF, extractPDFMetadata } from './pdf-parser'
export { extractTextFromImage, extractTextWithConfidence } from './ocr'
export { parseExpenseText } from './parsers/expense-parser'
export { parsePurchaseText } from './parsers/purchase-parser'
export { parseWithAI } from './parsers/ai-parser'
export { parseWithVision } from './parsers/vision-parser'

// Export types
export type {
  ExtractedData,
  FileType,
  DocumentType,
  ExtractionOptions,
  ParserResult,
  AIParserConfig,
} from './types'
