// OCR for images using Tesseract.js (Node.js mode for Next.js compatibility)

import { createWorker } from 'tesseract.js'

/**
 * Extract text from an image using OCR
 *
 * @param buffer - Image file as Buffer
 * @param language - Tesseract language code (default: 'eng' for English)
 * @returns Extracted text content
 * @throws Error if OCR fails
 */
export async function extractTextFromImage(
  buffer: Buffer,
  language: string = 'eng'
): Promise<string> {
  const worker = await createWorker(language)

  try {
    const { data } = await worker.recognize(buffer)
    await worker.terminate()
    return data.text
  } catch (error) {
    await worker.terminate()
    if (error instanceof Error) {
      throw new Error(`Failed to extract text from image: ${error.message}`)
    }
    throw new Error('Failed to extract text from image: Unknown error')
  }
}

/**
 * Extract text with confidence scores
 *
 * @param buffer - Image file as Buffer
 * @param language - Tesseract language code
 * @returns Extracted text and confidence score (0-100)
 */
export async function extractTextWithConfidence(
  buffer: Buffer,
  language: string = 'eng'
): Promise<{
  text: string
  confidence: number
}> {
  const worker = await createWorker(language)

  try {
    const { data } = await worker.recognize(buffer)
    await worker.terminate()

    return {
      text: data.text,
      confidence: data.confidence,
    }
  } catch (error) {
    await worker.terminate()
    if (error instanceof Error) {
      throw new Error(
        `Failed to extract text with confidence: ${error.message}`
      )
    }
    throw new Error('Failed to extract text with confidence: Unknown error')
  }
}
