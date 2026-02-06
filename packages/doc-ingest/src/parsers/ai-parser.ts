// AI-powered parser using OpenAI or Gemini

import type { ExpenseData, PurchaseData } from '@repo/ledger-core'
import type { ParserResult } from '../types'

/**
 * AI Parser configuration
 */
export interface AIParserConfig {
  provider: 'openai' | 'gemini'
  apiKey: string
  model?: string // e.g., 'gpt-4' or 'gemini-pro'
}

/**
 * Parse expense or purchase data using AI
 *
 * @param text - Extracted text from OCR or PDF
 * @param config - AI provider configuration
 * @returns Parsed data with high accuracy
 */
export async function parseWithAI(
  text: string,
  config: AIParserConfig
): Promise<ParserResult<ExpenseData | PurchaseData>> {
  if (config.provider === 'openai') {
    return parseWithOpenAI(text, config)
  } else if (config.provider === 'gemini') {
    return parseWithGemini(text, config)
  }

  throw new Error(`Unsupported AI provider: ${config.provider}`)
}

/**
 * Parse using OpenAI GPT
 */
async function parseWithOpenAI(
  text: string,
  config: AIParserConfig
): Promise<ParserResult<ExpenseData | PurchaseData>> {
  const prompt = buildParsingPrompt(text)

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at parsing invoices and receipts. Extract structured data from text.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const parsedData = JSON.parse(data.choices[0].message.content)

    return convertAIResponseToResult(parsedData)
  } catch (error) {
    throw new Error(
      `Failed to parse with OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Parse using Google Gemini
 */
async function parseWithGemini(
  text: string,
  config: AIParserConfig
): Promise<ParserResult<ExpenseData | PurchaseData>> {
  const prompt = buildParsingPrompt(text)

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-pro'}:generateContent?key=${config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            response_mime_type: 'application/json',
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const textContent = data.candidates[0].content.parts[0].text
    const parsedData = JSON.parse(textContent)

    return convertAIResponseToResult(parsedData)
  } catch (error) {
    throw new Error(
      `Failed to parse with Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Build parsing prompt for AI
 */
function buildParsingPrompt(text: string): string {
  return `Parse the following invoice/receipt text and extract structured data.

Determine if this is an EXPENSE (receipt) or PURCHASE (invoice/bill), then extract the relevant fields.

For EXPENSE (receipts):
- merchant: string (store/restaurant name)
- amount: number (total amount)
- currency: string (3-letter code like INR, USD)
- date: string (ISO format YYYY-MM-DD)
- description: string (optional)
- taxAmount: number (optional)

For PURCHASE (invoices/bills):
- vendorName: string (supplier/vendor name)
- billNumber: string (invoice number - look for "Invoice No", "Bill No", NOT "e-Way Bill", optional)
- amount: number (GRAND TOTAL including all taxes - the final amount to be paid)
- currency: string (3-letter code like INR, USD)
- date: string (ISO format YYYY-MM-DD)
- dueDate: string (ISO format, optional)
- lineItems: array of {description, quantity, rate, amount} (optional)
- taxAmount: number (total tax amount - CGST + SGST + IGST, optional)
- description: string (optional)

Return ONLY valid JSON in this format:
{
  "type": "expense" | "purchase",
  "data": { ... extracted fields ... },
  "confidence": 0-100
}

Text to parse:
${text}

IMPORTANT: Return ONLY the JSON object, no markdown, no explanation.`
}

/**
 * Convert AI response to ParserResult
 */
function convertAIResponseToResult(
  aiResponse: any
): ParserResult<ExpenseData | PurchaseData> {
  // Validate the response has required fields
  if (!aiResponse.type || !aiResponse.data) {
    throw new Error('Invalid AI response format')
  }

  // Convert date strings to Date objects
  if (aiResponse.data.date) {
    aiResponse.data.date = new Date(aiResponse.data.date)
  }
  if (aiResponse.data.dueDate) {
    aiResponse.data.dueDate = new Date(aiResponse.data.dueDate)
  }

  return {
    data: aiResponse.data,
    confidence: aiResponse.confidence || 95,
    warnings: [],
  }
}
