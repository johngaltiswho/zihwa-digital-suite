// OCR for images using Tesseract.js (Node.js mode for Next.js compatibility)

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { createWorker } from 'tesseract.js'

const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const workerOptions = {
  // Point directly to the Node worker script so Next.js doesn't try to load .next/worker-script/*
  workerPath: require.resolve('tesseract.js/src/worker-script/node/index.js'),
  // Reuse the wasm core bundled with the package
  corePath: require.resolve('tesseract.js-core/tesseract-core.wasm.js'),
  // Use the checked-in traineddata files (eng.traineddata lives one level up from this file)
  langPath: path.resolve(__dirname, '..'),
}

async function createConfiguredWorker(language: string) {
  return createWorker(language, undefined, workerOptions)
}

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
  const worker = await createConfiguredWorker(language)

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
  const worker = await createConfiguredWorker(language)

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
