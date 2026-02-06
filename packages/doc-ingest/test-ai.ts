/**
 * Test script for AI-powered document extraction
 *
 * Usage: pnpm test:ai path/to/file.jpg
 */

import { config } from 'dotenv'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { extractFromDocument } from './src/index'

// Load environment variables
config()

async function testAIExtraction() {
  console.log('🤖 Testing AI-Powered Document Extraction')
  console.log('==========================================\n')

  // Get file path from command line argument
  const filePath = process.argv[2] || 'test-samples/steel.jpg'

  // Validate API key
  const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.error('❌ Error: No API key found')
    console.error('Please set OPENAI_API_KEY or GEMINI_API_KEY in .env file')
    process.exit(1)
  }

  const provider = process.env.OPENAI_API_KEY ? 'openai' : 'gemini'
  console.log(`🤖 Using AI Provider: ${provider.toUpperCase()}\n`)

  // Resolve file path
  const absolutePath = resolve(process.cwd(), filePath)

  try {
    console.log(`📄 Reading file: ${absolutePath}\n`)

    // Read file
    const fileBuffer = readFileSync(absolutePath)

    // Determine file type from extension
    const fileType = filePath.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'

    console.log(`📝 File type: ${fileType}`)
    console.log(`📏 File size: ${(fileBuffer.length / 1024).toFixed(2)} KB\n`)

    // Extract data with AI parsing
    console.log('🔍 Extracting text with OCR...')
    console.log('🤖 Parsing with AI...\n')

    const startTime = Date.now()
    const result = await extractFromDocument(fileBuffer, fileType, {
      useAI: true,
      aiConfig: {
        provider: provider as 'openai' | 'gemini',
        apiKey: apiKey,
        model: provider === 'openai' ? 'gpt-4o-mini' : 'gemini-pro',
      },
    })
    const duration = Date.now() - startTime

    console.log('✅ Extraction complete!')
    console.log(`⏱️  Duration: ${duration}ms\n`)

    // Display results
    console.log('📊 AI Extraction Results')
    console.log('========================\n')

    console.log(`Document Type: ${result.type.toUpperCase()}`)
    console.log(`Confidence Score: ${result.confidence?.toFixed(1)}%\n`)

    if (result.type === 'expense') {
      console.log('💰 Expense Details:')
      console.log('-------------------')
      console.log(`Merchant:     ${result.data.merchant}`)
      console.log(`Amount:       ${result.data.currency} ${result.data.amount.toFixed(2)}`)
      console.log(`Date:         ${result.data.date.toISOString().split('T')[0]}`)
      console.log(`Description:  ${result.data.description || 'N/A'}`)
      console.log(`Tax Amount:   ${result.data.taxAmount ? `${result.data.currency} ${result.data.taxAmount.toFixed(2)}` : 'N/A'}`)
      console.log(`Category:     ${result.data.category || 'N/A'}`)

      if (result.data.lineItems && result.data.lineItems.length > 0) {
        console.log('\n📋 Line Items:')
        result.data.lineItems.forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.description}`)
          console.log(`     Qty: ${item.quantity}, Rate: ${item.rate}, Amount: ${item.amount}`)
        })
      }
    } else if (result.type === 'purchase') {
      console.log('🧾 Purchase/Invoice Details:')
      console.log('-----------------------------')
      console.log(`Vendor:       ${result.data.vendorName}`)
      console.log(`Bill Number:  ${result.data.billNumber || 'N/A'}`)
      console.log(`Amount:       ${result.data.currency} ${result.data.amount.toFixed(2)}`)
      console.log(`Date:         ${result.data.date.toISOString().split('T')[0]}`)
      console.log(`Due Date:     ${result.data.dueDate ? result.data.dueDate.toISOString().split('T')[0] : 'N/A'}`)
      console.log(`Description:  ${result.data.description || 'N/A'}`)
      console.log(`Tax Amount:   ${result.data.taxAmount ? `${result.data.currency} ${result.data.taxAmount.toFixed(2)}` : 'N/A'}`)

      if (result.data.lineItems && result.data.lineItems.length > 0) {
        console.log('\n📋 Line Items:')
        result.data.lineItems.forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.description}`)
          console.log(`     Qty: ${item.quantity}, Rate: ${item.rate}, Amount: ${item.amount}`)
        })
      }
    }

    console.log('\n')
    console.log('✅ AI Parsing Complete!')
    console.log('=======================\n')

    console.log('💡 Comparison:')
    console.log('- Regex Parser: Limited accuracy, needs format-specific patterns')
    console.log('- AI Parser: High accuracy, works with ANY invoice format\n')

    console.log('📚 Next Step: Post to Zoho Books')
    console.log(`
import { extractFromDocument } from '@repo/doc-ingest'
import { postPurchase } from '@repo/connector-zoho-books'

const extracted = await extractFromDocument(fileBuffer, 'image', {
  useAI: true,
  aiConfig: { provider: 'openai', apiKey: process.env.OPENAI_API_KEY }
})

if (extracted.type === 'purchase') {
  const result = await postPurchase(
    extracted.data,
    orgId,
    accessToken,
    'in',
    { vendorId: 'your_vendor_id' }
  )
}
`)

  } catch (error) {
    console.error('❌ AI extraction failed:')
    console.error(error)
    process.exit(1)
  }
}

// Run the test
testAIExtraction()
  .then(() => {
    console.log('✅ Test completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  })
