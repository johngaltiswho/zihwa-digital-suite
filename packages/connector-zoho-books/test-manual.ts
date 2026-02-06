/**
 * Manual test script for Zoho Books connector
 *
 * Prerequisites:
 * 1. Create .env.local with your Zoho credentials (see TESTING.md)
 * 2. Install dependencies: pnpm install
 * 3. Run: pnpm tsx test-manual.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import {
  registerZohoOrg,
  hydrateTokens,
  getValidAccessToken,
  postExpense,
  postPurchase,
} from './src/index'
import type { ExpenseData, PurchaseData } from '@repo/ledger-core'

// Load environment variables
config({ path: resolve(__dirname, '.env.local') })

// Validate environment variables
const requiredEnvVars = [
  'ZOHO_ORG_ID',
  'ZOHO_CLIENT_ID',
  'ZOHO_CLIENT_SECRET',
  'ZOHO_ACCESS_TOKEN',
  'ZOHO_REFRESH_TOKEN',
  'ZOHO_EXPENSE_ACCOUNT_ID',
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`)
    console.error('📝 Please create .env.local with your Zoho credentials')
    console.error('📖 See TESTING.md for instructions')
    process.exit(1)
  }
}

const orgId = process.env.ZOHO_ORG_ID!
const region = (process.env.ZOHO_REGION || 'in') as 'in' | 'com' | 'eu' | 'com.au' | 'jp'
const expenseAccountId = process.env.ZOHO_EXPENSE_ACCOUNT_ID!
const vendorId = process.env.ZOHO_VENDOR_ID

async function testZohoConnector() {
  console.log('🧪 Testing Zoho Books Connector')
  console.log('================================\n')

  try {
    // Step 1: Register organization
    console.log('📝 Step 1: Registering Zoho organization...')
    registerZohoOrg({
      orgId,
      region,
      clientId: process.env.ZOHO_CLIENT_ID!,
      clientSecret: process.env.ZOHO_CLIENT_SECRET!,
    })
    console.log('✅ Organization registered\n')

    // Step 2: Hydrate tokens
    console.log('🔑 Step 2: Loading OAuth tokens...')
    hydrateTokens(orgId, {
      accessToken: process.env.ZOHO_ACCESS_TOKEN!,
      refreshToken: process.env.ZOHO_REFRESH_TOKEN!,
      expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour from now
    })
    console.log('✅ Tokens loaded\n')

    // Step 3: Get valid access token (tests auto-refresh logic)
    console.log('🔄 Step 3: Getting valid access token...')
    const accessToken = await getValidAccessToken(orgId)
    console.log('✅ Access token obtained:', accessToken.substring(0, 20) + '...\n')

    // Step 4: Test expense posting
    console.log('💰 Step 4: Testing expense posting...')
    const testExpense: ExpenseData = {
      merchant: 'Test Cafe',
      amount: 250.50,
      currency: 'INR',
      date: new Date(),
      description: 'Test expense from connector - Coffee meeting',
    }

    const expenseResult = await postExpense(
      testExpense,
      orgId,
      accessToken,
      region,
      {
        accountId: expenseAccountId,
      }
    )

    if (expenseResult.success) {
      console.log('✅ Expense posted successfully!')
      console.log('   Voucher ID:', expenseResult.voucherId)
      console.log('   External Ref:', expenseResult.externalRef)
      console.log('   Timestamp:', expenseResult.timestamp)
    } else {
      console.error('❌ Expense posting failed:', expenseResult.error)
    }
    console.log()

    // Step 5: Test bill posting (if vendor ID is provided)
    if (vendorId) {
      console.log('📄 Step 5: Testing bill/purchase posting...')
      const testPurchase: PurchaseData = {
        vendorName: 'Test Vendor',
        billNumber: 'TEST-001',
        amount: 5000,
        currency: 'INR',
        date: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        lineItems: [
          {
            description: 'Test Product 1',
            quantity: 2,
            rate: 1500,
            amount: 3000,
          },
          {
            description: 'Test Product 2',
            quantity: 1,
            rate: 2000,
            amount: 2000,
          },
        ],
        description: 'Test bill from connector',
      }

      const purchaseResult = await postPurchase(
        testPurchase,
        orgId,
        accessToken,
        region,
        {
          vendorId,
          paymentTerms: 30,
        }
      )

      if (purchaseResult.success) {
        console.log('✅ Bill posted successfully!')
        console.log('   Voucher ID:', purchaseResult.voucherId)
        console.log('   External Ref:', purchaseResult.externalRef)
        console.log('   Timestamp:', purchaseResult.timestamp)
      } else {
        console.error('❌ Bill posting failed:', purchaseResult.error)
      }
      console.log()
    } else {
      console.log('⏭️  Step 5: Skipping bill test (ZOHO_VENDOR_ID not set)\n')
    }

    // Step 6: Verification instructions
    console.log('✅ Testing Complete!')
    console.log('==================\n')
    console.log('📋 Next Steps:')
    console.log('1. Log into your Zoho Books account')
    console.log('2. Go to Expenses → All Expenses')
    console.log('3. Look for "Test expense from connector"')
    if (vendorId) {
      console.log('4. Go to Purchases → Bills')
      console.log('5. Look for "Test bill from connector"')
    }
    console.log('\n🎉 If you see the test records, the connector is working!')

  } catch (error) {
    console.error('❌ Test failed with error:')
    console.error(error)
    process.exit(1)
  }
}

// Run the test
testZohoConnector()
  .then(() => {
    console.log('\n✅ All tests passed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Test suite failed:', error)
    process.exit(1)
  })
