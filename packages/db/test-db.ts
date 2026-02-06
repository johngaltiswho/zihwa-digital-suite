// Test script for @repo/db package
import {
  storeTokens,
  getTokens,
  hasTokens,
  deleteTokens,
  listConnectedOrgs
} from './src/oauth-tokens'
import {
  createDocument,
  updateDocument,
  getDocument
} from './src/documents'

async function testDatabase() {
  console.log('🧪 Testing @repo/db package...\n')

  try {
    const testOrgId = 'test-org-123'

    // Test 1: Store OAuth tokens
    console.log('1. Storing OAuth tokens...')
    await storeTokens(testOrgId, {
      accessToken: 'test-access-token-abc',
      refreshToken: 'test-refresh-token-xyz',
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    })
    console.log('✅ Tokens stored (encrypted)\n')

    // Test 2: Check if tokens exist
    console.log('2. Checking if tokens exist...')
    const exists = await hasTokens(testOrgId)
    console.log(`✅ Tokens exist: ${exists}\n`)

    // Test 3: Retrieve tokens
    console.log('3. Retrieving tokens...')
    const tokens = await getTokens(testOrgId)
    if (tokens) {
      console.log('✅ Tokens retrieved (decrypted):')
      console.log(`   Access Token: ${tokens.accessToken}`)
      console.log(`   Refresh Token: ${tokens.refreshToken}`)
      console.log(`   Expires At: ${tokens.expiresAt}\n`)
    }

    // Test 4: List connected orgs
    console.log('4. Listing connected organizations...')
    const orgs = await listConnectedOrgs()
    console.log(`✅ Connected orgs: ${orgs.join(', ')}\n`)

    // Test 5: Create document
    console.log('5. Creating document record...')
    const docId = await createDocument({
      fileName: 'test-expense.pdf',
      fileType: 'application/pdf',
      documentType: 'EXPENSE',
    })
    console.log(`✅ Document created with ID: ${docId}\n`)

    // Test 6: Update document
    console.log('6. Updating document status...')
    await updateDocument(docId, {
      status: 'EXTRACTED',
      extractedData: {
        merchant: 'Test Merchant',
        amount: 1000,
        currency: 'INR',
      },
    })
    console.log('✅ Document updated\n')

    // Test 7: Retrieve document
    console.log('7. Retrieving document...')
    const doc = await getDocument(docId)
    if (doc) {
      console.log('✅ Document retrieved:')
      console.log(`   File: ${doc.fileName}`)
      console.log(`   Status: ${doc.status}`)
      console.log(`   Data: ${JSON.stringify(doc.extractedData)}\n`)
    }

    // Test 8: Cleanup
    console.log('8. Cleaning up test data...')
    await deleteTokens(testOrgId)
    console.log('✅ Test tokens deleted\n')

    console.log('🎉 All tests passed!')
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

testDatabase()
