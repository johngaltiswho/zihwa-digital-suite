/**
 * Debug script to see raw extracted text from PDF
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { extractTextFromPDF } from './src/pdf-parser'

async function debugText() {
  const filePath = process.argv[2] || 'test-samples/steel.pdf'
  const absolutePath = resolve(process.cwd(), filePath)

  console.log('📄 Reading:', absolutePath)

  const fileBuffer = readFileSync(absolutePath)
  const text = await extractTextFromPDF(fileBuffer)

  console.log('\n📝 Raw Extracted Text:')
  console.log('='.repeat(80))
  console.log(text)
  console.log('='.repeat(80))
  console.log(`\nTotal characters: ${text.length}`)
  console.log(`Total lines: ${text.split('\n').length}`)
}

debugText()
