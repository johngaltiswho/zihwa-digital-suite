// Vision-based parser using OpenAI Vision API
import type { ExpenseData, PurchaseData } from '@repo/ledger-core'
import type { ParserResult } from '../types'

export interface VisionParserConfig {
  provider: 'openai'
  apiKey: string
  model?: string
}

/**
 * Parse expense or purchase document using Vision API (no OCR needed)
 */
export async function parseWithVision(
  imageBuffer: Buffer,
  config: VisionParserConfig
): Promise<ParserResult<ExpenseData | PurchaseData>> {
  if (config.provider === 'openai') {
    return parseWithOpenAIVision(imageBuffer, config)
  }

  throw new Error(`Unsupported vision provider: ${config.provider}`)
}

async function parseWithOpenAIVision(
  imageBuffer: Buffer,
  config: VisionParserConfig
): Promise<ParserResult<ExpenseData | PurchaseData>> {
  const base64Image = imageBuffer.toString('base64')

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
            content: 'You are an expert at parsing invoices and receipts from images. Extract structured data accurately.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: buildVisionPrompt(),
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI Vision API error: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    const parsedData = JSON.parse(data.choices[0].message.content)

    return convertVisionResponseToResult(parsedData)
  } catch (error) {
    throw new Error(
      `Failed to parse with OpenAI Vision: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

function buildVisionPrompt(): string {
  return `Parse this invoice/receipt image and extract structured data.

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

IMPORTANT: Return ONLY the JSON object, no markdown, no explanation.`
}

function convertVisionResponseToResult(
  aiResponse: any
): ParserResult<ExpenseData | PurchaseData> {
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
    confidence: aiResponse.data.confidence || 95,
    warnings: [],
  }
}
