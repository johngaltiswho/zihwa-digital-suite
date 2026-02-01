# @repo/connector-zoho-books

Zoho Books API integration package for posting expenses and purchases/bills.

## Features

- ✅ **OAuth 2.0 Token Management** - Automatic token refresh with 5-minute buffer
- ✅ **Expense Posting** - Post expenses to Zoho Books
- ✅ **Purchase/Bill Posting** - Post bills with line items
- ✅ **Multi-Region Support** - Works with Zoho Books in all regions (IN, COM, EU, AU, JP)
- ✅ **Automatic Retry Logic** - Exponential backoff with jitter for transient failures
- ✅ **Rate Limit Handling** - Automatic retry on rate limit errors
- ✅ **Type Safety** - Full TypeScript support with @repo/ledger-core types
- ✅ **Idempotency** - Prevent duplicate posts with request IDs
- ✅ **Multi-Tenant** - Support multiple Zoho organizations from single codebase

## Installation

This package is already installed as part of the monorepo workspace.

```bash
# From root of monorepo
pnpm install
```

## Quick Start

### 1. Register Your Zoho Organization

```typescript
import { registerZohoOrg, hydrateTokens } from '@repo/connector-zoho-books'

// Register organization configuration
registerZohoOrg({
  orgId: 'your-zoho-org-id',
  region: 'in', // or 'com', 'eu', 'com.au', 'jp'
  clientId: process.env.ZOHO_CLIENT_ID!,
  clientSecret: process.env.ZOHO_CLIENT_SECRET!,
  redirectUri: 'https://yourapp.com/api/zoho/callback'
})

// Load existing tokens (from database or initial OAuth flow)
hydrateTokens('your-zoho-org-id', {
  accessToken: 'your-access-token',
  refreshToken: 'your-refresh-token',
  expiresAt: new Date('2026-01-27T10:00:00Z')
})
```

### 2. Post an Expense

```typescript
import { postExpense } from '@repo/connector-zoho-books'
import type { ExpenseData } from '@repo/ledger-core'

const expense: ExpenseData = {
  merchant: 'Starbucks',
  amount: 450.50,
  currency: 'INR',
  date: new Date('2026-01-25'),
  description: 'Client meeting coffee'
}

const result = await postExpense(
  expense,
  'your-zoho-org-id',
  'your-access-token', // or use getValidAccessToken()
  'in', // region
  {
    accountId: 'zoho-expense-account-id', // Required
    customerId: 'zoho-customer-id', // Optional
    taxId: 'zoho-tax-id' // Optional
  }
)

console.log(result)
// {
//   success: true,
//   voucherId: '12345',
//   externalRef: '12345',
//   timestamp: Date
// }
```

### 3. Post a Purchase/Bill

```typescript
import { postPurchase } from '@repo/connector-zoho-books'
import type { PurchaseData } from '@repo/ledger-core'

const purchase: PurchaseData = {
  vendorName: 'Office Supplies Inc',
  billNumber: 'INV-2026-001',
  amount: 5000,
  currency: 'INR',
  date: new Date('2026-01-25'),
  dueDate: new Date('2026-02-25'),
  lineItems: [
    {
      description: 'Office chairs',
      quantity: 5,
      rate: 1000,
      amount: 5000
    }
  ]
}

const result = await postPurchase(
  purchase,
  'your-zoho-org-id',
  'your-access-token',
  'in',
  {
    vendorId: 'zoho-vendor-id', // Required
    accountId: 'zoho-purchase-account-id', // Optional
    paymentTerms: 30 // Days
  }
)
```

### 4. Automatic Token Refresh

```typescript
import { getValidAccessToken } from '@repo/connector-zoho-books'

// This automatically refreshes the token if expired or expiring within 5 minutes
const accessToken = await getValidAccessToken('your-zoho-org-id')

// Use the token for API calls
const result = await postExpense(expense, orgId, accessToken, 'in', options)
```

## API Reference

### OAuth Management

#### `registerZohoOrg(config: ZohoOrgConfig): void`

Register a Zoho organization configuration. Must be called before any API operations.

```typescript
registerZohoOrg({
  orgId: 'your-zoho-org-id',
  region: 'in',
  clientId: 'zoho-client-id',
  clientSecret: 'zoho-client-secret',
  redirectUri: 'https://yourapp.com/callback'
})
```

#### `hydrateTokens(orgId: string, tokens: ZohoTokenSet): void`

Load existing OAuth tokens for an organization.

```typescript
hydrateTokens('your-zoho-org-id', {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  expiresAt: new Date('2026-01-27T10:00:00Z')
})
```

#### `getValidAccessToken(orgId: string): Promise<string>`

Get a valid access token, automatically refreshing if expired.

```typescript
const token = await getValidAccessToken('your-zoho-org-id')
```

#### `getStoredTokens(orgId: string): ZohoTokenSet | null`

Retrieve stored tokens for an organization.

```typescript
const tokens = getStoredTokens('your-zoho-org-id')
if (tokens) {
  console.log('Token expires at:', tokens.expiresAt)
}
```

### Posting Functions

#### `postExpense(expenseData, orgId, accessToken, region?, options?): Promise<VoucherResult>`

Post an expense to Zoho Books.

**Parameters:**
- `expenseData: ExpenseData` - Expense data from @repo/ledger-core
- `orgId: string` - Zoho organization ID
- `accessToken: string` - Valid Zoho access token
- `region?: ZohoRegion` - Zoho region (default: 'in')
- `options?: ZohoExpenseRequestOptions` - Additional options

**Required Options:**
- `accountId` - Zoho expense account ID

**Optional Options:**
- `customerId` - Link expense to customer
- `projectId` - Link expense to project
- `taxId` - Apply specific tax
- `currencyCode` - Override currency
- `idempotencyKey` - Prevent duplicates

#### `postPurchase(purchaseData, orgId, accessToken, region?, options?): Promise<VoucherResult>`

Post a bill/purchase to Zoho Books.

**Parameters:**
- `purchaseData: PurchaseData` - Purchase data from @repo/ledger-core
- `orgId: string` - Zoho organization ID
- `accessToken: string` - Valid Zoho access token
- `region?: ZohoRegion` - Zoho region (default: 'in')
- `options?: ZohoPurchaseRequestOptions` - Additional options

**Required Options:**
- `vendorId` - Zoho vendor ID

**Optional Options:**
- `accountId` - Default purchase account
- `taxId` - Apply specific tax
- `currencyCode` - Override currency
- `paymentTerms` - Payment terms in days
- `idempotencyKey` - Prevent duplicates

### Error Handling

```typescript
import { ZohoConnectorError } from '@repo/connector-zoho-books'

try {
  const result = await postExpense(...)
} catch (error) {
  if (ZohoConnectorError.isRateLimitError(error)) {
    // Handle rate limit - retry after delay
    console.log('Rate limited, retry later')
  } else if (ZohoConnectorError.isAuthError(error)) {
    // Handle auth error - may need to re-authenticate
    console.log('Authentication failed')
  } else if (error instanceof ZohoConnectorError) {
    console.log('Zoho error:', error.message)
    console.log('Error code:', error.code)
    console.log('Retryable:', error.retryable)
  }
}
```

### Advanced: Using ZohoBooksClient

For advanced use cases, you can use the `ZohoBooksClient` class directly:

```typescript
import { ZohoBooksClient } from '@repo/connector-zoho-books'

const client = new ZohoBooksClient(
  'your-zoho-org-id',
  'access-token',
  'in' // region
)

// Make custom API calls
const customers = await client.get('/contacts', {
  contact_type: 'customer'
})

// Post with custom payload
const response = await client.post('/expenses', {
  JSONString: JSON.stringify({ /* custom expense data */ })
})
```

## Configuration

### Environment Variables

```bash
# Zoho OAuth credentials
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REDIRECT_URI=https://yourapp.com/api/zoho/callback
```

### Supported Regions

- `in` - India (zohoapis.in)
- `com` - US (zohoapis.com)
- `eu` - Europe (zohoapis.eu)
- `com.au` - Australia (zohoapis.com.au)
- `jp` - Japan (zohoapis.jp)

## Architecture

```
┌─────────────────────────────────────────┐
│  Your App                               │
│  ├── Upload expense PDF                 │
│  ├── Extract data (@repo/doc-ingest)    │
│  └── Validate (@repo/ledger-core)       │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  @repo/connector-zoho-books             │
│  ├── oauth.ts (Token management)        │
│  ├── client.ts (HTTP client + retry)    │
│  ├── expenses.ts (Transform + post)     │
│  └── purchases.ts (Transform + post)    │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Zoho Books API                         │
│  ├── POST /expenses                     │
│  ├── POST /bills                        │
│  └── POST /oauth/v2/token               │
└─────────────────────────────────────────┘
```

## Token Storage (Phase 4)

Currently, tokens are stored **in-memory**. In Phase 4, we'll add database persistence:

```typescript
// Future: Store tokens in database
import { prisma } from '@repo/db'

// After OAuth flow
const tokens = await getOAuthTokens()
await prisma.oAuthToken.create({
  data: {
    orgId: 'zoho-org-id',
    provider: 'zoho_books',
    accessToken: encrypt(tokens.accessToken),
    refreshToken: encrypt(tokens.refreshToken),
    expiresAt: tokens.expiresAt
  }
})

// Load on startup
const dbTokens = await prisma.oAuthToken.findUnique({
  where: { orgId: 'zoho-org-id' }
})
hydrateTokens('zoho-org-id', {
  accessToken: decrypt(dbTokens.accessToken),
  refreshToken: decrypt(dbTokens.refreshToken),
  expiresAt: dbTokens.expiresAt
})
```

## Testing

```bash
# Type checking
pnpm turbo run check-types --filter=@repo/connector-zoho-books

# Linting
pnpm turbo run lint --filter=@repo/connector-zoho-books
```

## Troubleshooting

### "Organization not registered" error

Make sure you call `registerZohoOrg()` before any API operations.

### "Tokens not found" error

Call `hydrateTokens()` after registering the organization.

### "accountId is required" error

When posting expenses, you must provide `accountId` in the options:

```typescript
await postExpense(expense, orgId, token, 'in', {
  accountId: 'your-zoho-account-id' // Required!
})
```

### "vendorId is required" error

When posting bills, you must provide `vendorId` in the options:

```typescript
await postPurchase(purchase, orgId, token, 'in', {
  vendorId: 'your-zoho-vendor-id' // Required!
})
```

## Next Steps

1. **Phase 3**: Implement @repo/doc-ingest for PDF/image parsing
2. **Phase 4**: Add database persistence for OAuth tokens
3. **Phase 6**: Integration testing with real Zoho Books sandbox

## License

Private - Part of zihwa-digital-suite monorepo
