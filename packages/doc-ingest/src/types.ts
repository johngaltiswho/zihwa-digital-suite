// Internal types for document ingestion

import type { ExpenseData, PurchaseData } from '@repo/ledger-core'

/**
 * Document types supported by the ingestion engine
 */
export type DocumentType = 'expense' | 'purchase' | 'invoice'

/**
 * File types supported for extraction
 */
export type FileType = 'pdf' | 'image'

/**
 * Extracted data result with type discrimination
 */
export type ExtractedData =
  | {
      type: 'expense'
      data: ExpenseData
      confidence?: number
    }
  | {
      type: 'purchase'
      data: PurchaseData
      confidence?: number
    }

/**
 * Parser result with optional confidence score
 */
export interface ParserResult<T> {
  data: T
  confidence?: number
  warnings?: string[]
}

/**
 * AI Parser configuration
 */
export interface AIParserConfig {
  provider: 'openai' | 'gemini'
  apiKey: string
  model?: string
}

/**
 * Extraction options
 */
export interface ExtractionOptions {
  /** Language for OCR (default: 'eng') */
  language?: string
  /** Expected document type (helps with parsing) */
  expectedType?: DocumentType
  /** Strict mode - throw error if required fields missing */
  strict?: boolean
  /** Use AI for parsing (recommended for best accuracy) */
  useAI?: boolean
  /** AI parser configuration (required if useAI is true) */
  aiConfig?: AIParserConfig
  /** Enable Vision API fallback for low confidence results (default: true) */
  enableVisionFallback?: boolean
  /** Confidence threshold for triggering Vision API fallback (default: 85) */
  visionFallbackThreshold?: number
}
