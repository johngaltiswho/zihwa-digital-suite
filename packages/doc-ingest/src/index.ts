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

  if (
    mismatchRatio > 0.25 ||
    (summaryHint && cleanedItems.length > 3) ||
    (tooManyItems && mismatchRatio > 0.1)
  ) {
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

function enrichPurchaseLineItemsFromText(data: any, text: string): any {
  if (!data || typeof data !== 'object') return data
  if (!('vendorName' in data)) return data
  if (Array.isArray(data.lineItems) && data.lineItems.length > 0) return data

  const parsed = parsePurchaseText(text)
  if (parsed.data.lineItems && parsed.data.lineItems.length > 0) {
    return {
      ...data,
      lineItems: parsed.data.lineItems,
    }
  }

  return data
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
      data = enrichPurchaseLineItemsFromText(data, ocrResult.text)
      data = normalizePurchaseLineItems(data)
      const hasVendor = 'vendorName' in data
      const finalConfidence = Math.min(ocrResult.confidence, parseResult.confidence || 100)

      const result: ExtractedData = {
        type: hasVendor ? 'purchase' : 'expense',
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

        return {
          type: hasVendorVision ? 'purchase' : 'expense',
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

        return {
          type: hasVendorVision ? 'purchase' : 'expense',
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

      return {
        type: hasVendorVision ? 'purchase' : 'expense',
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
    data = enrichPurchaseLineItemsFromText(data, extractedText)
    data = normalizePurchaseLineItems(data)
    const hasVendor = 'vendorName' in data

    return {
      type: hasVendor ? 'purchase' : 'expense',
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
  } else if (documentType === 'purchase' || documentType === 'invoice') {
    const result = parsePurchaseText(extractedText)
    return {
      type: 'purchase',
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
