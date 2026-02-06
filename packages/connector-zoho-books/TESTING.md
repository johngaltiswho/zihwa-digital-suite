# Testing Guide for @repo/connector-zoho-books

## Prerequisites

Before testing, you need:

1. **Zoho Books Account** (Free trial available)
2. **Zoho OAuth Credentials** (Client ID & Secret)
3. **Access Token** (From OAuth flow)
4. **Test Data** (Organization ID, Account IDs)

---

## Step 1: Create Zoho Books Account

1. Go to https://www.zoho.com/books/
2. Sign up for free trial (if you don't have account)
3. Create a test organization
4. Note your **Organization ID**:
   - Go to Settings → Organization Profile
   - Copy the Organization ID

---

## Step 2: Create OAuth App in Zoho

1. Go to https://api-console.zoho.com/
2. Click "Add Client" → "Server-based Applications"
3. Fill in:
   - **Client Name**: "Zihwa Accounting Engine Test"
   - **Homepage URL**: `http://localhost:3000`
   - **Authorized Redirect URIs**: `http://localhost:3000/api/zoho/callback`
4. Click "Create"
5. Copy your:
   - **Client ID**
   - **Client Secret**

---

## Step 3: Get Access Token (Manual OAuth Flow)

### Option A: Using Zoho API Console (Quickest)

1. Go to https://api-console.zoho.com/
2. Click on your client
3. Click "Generate Code" tab
4. Select scopes:
   - `ZohoBooks.expenses.CREATE`
   - `ZohoBooks.bills.CREATE`
5. Time Duration: 3 minutes
6. Click "Create"
7. Copy the **Code**
8. Use this code to get tokens (see script below)

### Option B: Build OAuth Flow (Production-ready)

We'll implement this in Phase 4 when we add the database.

---

## Step 4: Get Test Account IDs

You need account IDs from your Zoho Books:

1. **Expense Account ID**:
   - Go to Accountant → Chart of Accounts
   - Find an expense account (e.g., "Travel Expenses")
   - Click on it and copy the Account ID from URL
   - Example URL: `https://books.zoho.in/app/...#/chartofaccounts/12345678900000001`
   - Account ID: `12345678900000001`

2. **Vendor ID** (for testing bills):
   - Go to Purchases → Vendors
   - Create a test vendor or select existing
   - Copy Vendor ID from URL

---

## Step 5: Convert Authorization Code to Tokens

Use this curl command (replace placeholders):

```bash
curl -X POST https://accounts.zoho.in/oauth/v2/token \
  -d "code=YOUR_AUTHORIZATION_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=http://localhost:3000/api/zoho/callback" \
  -d "grant_type=authorization_code"
```

**Response:**
```json
{
  "access_token": "1000.abc123...",
  "refresh_token": "1000.def456...",
  "expires_in": 3600,
  "api_domain": "https://www.zohoapis.in",
  "token_type": "Bearer"
}
```

**Save these tokens!** You'll need them for testing.

---

## Step 6: Set Environment Variables

Create a `.env.local` file in the connector package:

```bash
# packages/connector-zoho-books/.env.local
ZOHO_ORG_ID=your_organization_id
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_ACCESS_TOKEN=your_access_token
ZOHO_REFRESH_TOKEN=your_refresh_token
ZOHO_REGION=in
ZOHO_EXPENSE_ACCOUNT_ID=your_expense_account_id
ZOHO_VENDOR_ID=your_vendor_id
```

---

## Step 7: Run Test Script

```bash
# From monorepo root
cd packages/connector-zoho-books
pnpm test:manual
```

This will:
1. Register your Zoho organization
2. Hydrate tokens
3. Post a test expense
4. Post a test bill
5. Display results

---

## Troubleshooting

### "Organization not registered"
- Make sure you called `registerZohoOrg()` first
- Check that `ZOHO_ORG_ID` is set correctly

### "Tokens not found"
- Make sure you called `hydrateTokens()` after registering
- Check that `ZOHO_ACCESS_TOKEN` and `ZOHO_REFRESH_TOKEN` are set

### "Invalid access token"
- Your token may have expired
- Generate a new authorization code
- Convert it to new tokens

### "Account ID is required"
- You must provide `accountId` when posting expenses
- Get it from Zoho Books Chart of Accounts

### "Vendor ID is required"
- You must provide `vendorId` when posting bills
- Get it from Zoho Books Vendors list

### "Invalid account ID"
- The account ID doesn't exist in your organization
- Double-check the ID from Zoho Books

---

## Verifying Results

After running the test:

1. **Check Zoho Books Dashboard**:
   - Go to Expenses → All Expenses
   - You should see "Test Expense from Connector"

2. **Check Bills**:
   - Go to Purchases → Bills
   - You should see "Test Bill from Connector"

3. **Check Response**:
   - Test script prints the `VoucherResult`
   - Should show `success: true` and `voucherId`

---

## Next Steps After Testing

Once testing works:

1. **Phase 4**: Add database to persist tokens
2. **Phase 3**: Build document parsing
3. **Phase 6**: Integration testing with real PDFs

---

## Quick Reference: Zoho API Regions

- **India**: `in` → https://accounts.zoho.in
- **US**: `com` → https://accounts.zoho.com
- **Europe**: `eu` → https://accounts.zoho.eu
- **Australia**: `com.au` → https://accounts.zoho.com.au
- **Japan**: `jp` → https://accounts.zoho.jp
