// PDF text extraction using pdf-parse

import pdfParse from 'pdf-parse'

/**
 * Extract text content from a PDF buffer
 *
 * @param buffer - PDF file as Buffer
 * @returns Extracted text content
 * @throws Error if PDF parsing fails
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer)
    return data.text
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to extract text from PDF: ${error.message}`)
    }
    throw new Error('Failed to extract text from PDF: Unknown error')
  }
}

/**
 * Extract metadata from PDF
 *
 * @param buffer - PDF file as Buffer
 * @returns PDF metadata (pages, info, etc.)
 */
export async function extractPDFMetadata(buffer: Buffer): Promise<{
  pages: number
  info: Record<string, unknown>
}> {
  try {
    const data = await pdfParse(buffer)
    return {
      pages: data.numpages,
      info: data.info || {},
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to extract PDF metadata: ${error.message}`)
    }
    throw new Error('Failed to extract PDF metadata: Unknown error')
  }
}
