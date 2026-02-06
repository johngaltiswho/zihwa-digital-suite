/**
 * Debug script to see raw OCR text from images
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { extractTextFromImage } from './src/ocr'

async function debugImageText() {
  const filePath = process.argv[2] || 'test-samples/steel.jpg'
  const absolutePath = resolve(process.cwd(), filePath)

  console.log('📄 Reading:', absolutePath)

  const fileBuffer = readFileSync(absolutePath)

  console.log('\n🔍 Running OCR...')
  const text = await extractTextFromImage(fileBuffer, 'eng')

  console.log('\n📝 Raw OCR Text:')
  console.log('='.repeat(80))
  console.log(text)
  console.log('='.repeat(80))
  console.log(`\nTotal characters: ${text.length}`)
  console.log(`Total lines: ${text.split('\n').length}`)
}

debugImageText()
