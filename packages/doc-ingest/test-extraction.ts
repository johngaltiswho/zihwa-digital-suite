/**
 * Test script for document extraction
 *
 * Usage:
 * 1. Place a sample receipt/invoice PDF or image in the 'test-samples' folder
 * 2. Run: pnpm test:extract path/to/file.pdf
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { extractFromDocument } from './src/index'

async function testExtraction() {
  console.log('🧪 Testing Document Extraction')
  console.log('================================\n')

  // Get file path from command line argument
  const filePath = process.argv[2]

  if (!filePath) {
    console.error('❌ Error: Please provide a file path')
    console.error('Usage: pnpm test:extract path/to/file.pdf')
    console.error('\nExample:')
    console.error('  pnpm test:extract test-samples/receipt.pdf')
    console.error('  pnpm test:extract test-samples/invoice.jpg')
    process.exit(1)
  }

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

    // Extract data
    console.log('🔍 Extracting data from document...\n')

    const startTime = Date.now()
    const result = await extractFromDocument(fileBuffer, fileType)
    const duration = Date.now() - startTime

    console.log('✅ Extraction complete!')
    console.log(`⏱️  Duration: ${duration}ms\n`)

    // Display results
    console.log('📊 Extraction Results')
    console.log('=====================\n')

    console.log(`Document Type: ${result.type.toUpperCase()}`)
    console.log(`Confidence Score: ${result.confidence?.toFixed(1)}%\n`)

    if (result.type === 'expense') {
      console.log('💰 Expense Details:')
      console.log('-------------------')
      console.log(`Merchant:     ${result.data.merchant}`)
      console.log(`Amount:       ${result.data.currency} ${result.data.amount}`)
      console.log(`Date:         ${result.data.date.toISOString().split('T')[0]}`)
      console.log(`Description:  ${result.data.description || 'N/A'}`)
      console.log(`Tax Amount:   ${result.data.taxAmount ? `${result.data.currency} ${result.data.taxAmount}` : 'N/A'}`)
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
      console.log(`Amount:       ${result.data.currency} ${result.data.amount}`)
      console.log(`Date:         ${result.data.date.toISOString().split('T')[0]}`)
      console.log(`Due Date:     ${result.data.dueDate ? result.data.dueDate.toISOString().split('T')[0] : 'N/A'}`)
      console.log(`Description:  ${result.data.description || 'N/A'}`)
      console.log(`Tax Amount:   ${result.data.taxAmount ? `${result.data.currency} ${result.data.taxAmount}` : 'N/A'}`)

      if (result.data.lineItems && result.data.lineItems.length > 0) {
        console.log('\n📋 Line Items:')
        result.data.lineItems.forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.description}`)
          console.log(`     Qty: ${item.quantity}, Rate: ${item.rate}, Amount: ${item.amount}`)
        })
      }
    }

    console.log('\n')
    console.log('✅ Test Complete!')
    console.log('=================\n')

    console.log('💡 Next Steps:')
    console.log('1. Review the extracted data above')
    console.log('2. If accuracy is low, try another document')
    console.log('3. To post to Zoho Books, use the connector package')
    console.log('\n📚 Integration example:')
    console.log(`
import { extractFromDocument } from '@repo/doc-ingest'
import { postExpense } from '@repo/connector-zoho-books'

const extracted = await extractFromDocument(fileBuffer, 'pdf')
if (extracted.type === 'expense') {
  const result = await postExpense(
    extracted.data,
    orgId,
    accessToken,
    'in',
    { accountId: 'your_account_id' }
  )
}
`)

  } catch (error) {
    console.error('❌ Extraction failed:')
    console.error(error)
    process.exit(1)
  }
}

// Run the test
testExtraction()
  .then(() => {
    console.log('✅ Test script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test script failed:', error)
    process.exit(1)
  })
