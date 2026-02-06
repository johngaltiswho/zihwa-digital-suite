# 🚀 Quick Start - Test Zoho Connector in 5 Minutes

This guide will help you test the Zoho Books connector quickly.

## 📋 What You Need

1. **Zoho Books Account** (free trial works!)
2. **5 minutes** to set up credentials

---

## ⚡ Super Quick Setup (If You Have Zoho Books)

### Step 1: Get Your Credentials (2 minutes)

**A. Get Organization ID**
- Log into Zoho Books: https://books.zoho.in (or .com, .eu, etc.)
- Go to Settings (⚙️) → Organization Profile
- Copy your **Organization ID**

**B. Create OAuth App**
- Go to https://api-console.zoho.com/
- Click "Add Client" → "Server-based Applications"
- Fill in:
  - Client Name: `Test App`
  - Homepage: `http://localhost:3000`
  - Redirect URI: `http://localhost:3000/callback`
- Click "Create"
- Copy **Client ID** and **Client Secret**

**C. Generate Test Token**
- In the API Console, click your app → "Generate Code" tab
- Select scopes:
  - `ZohoBooks.expenses.CREATE`
  - `ZohoBooks.bills.CREATE`
- Duration: 3 minutes
- Click "Create" and copy the **Code**
- Run this command (replace YOUR_CODE, YOUR_CLIENT_ID, YOUR_CLIENT_SECRET):

```bash
curl -X POST https://accounts.zoho.in/oauth/v2/token \
  -d "code=YOUR_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=http://localhost:3000/callback" \
  -d "grant_type=authorization_code"
```

**Save the response!** You need `access_token` and `refresh_token`.

**D. Get Expense Account ID**
- In Zoho Books → Accountant → Chart of Accounts
- Find any expense account (e.g., "Travel Expenses")
- Click it and copy the ID from URL
- Example URL: `...#/chartofaccounts/12345678900000001`
- ID is: `12345678900000001`

### Step 2: Configure Test (30 seconds)

```bash
cd packages/connector-zoho-books
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```bash
ZOHO_ORG_ID=your_org_id
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_ACCESS_TOKEN=your_access_token
ZOHO_REFRESH_TOKEN=your_refresh_token
ZOHO_REGION=in
ZOHO_EXPENSE_ACCOUNT_ID=your_account_id
# ZOHO_VENDOR_ID=optional_vendor_id
```

### Step 3: Run Test (10 seconds)

```bash
pnpm test:manual
```

### Step 4: Verify (1 minute)

1. Check the terminal output - should show ✅ success
2. Log into Zoho Books
3. Go to **Expenses → All Expenses**
4. Look for "Test expense from connector - Coffee meeting"

**If you see it → 🎉 SUCCESS! The connector works!**

---

## 🔧 Detailed Setup (If Above Didn't Work)

See [TESTING.md](./TESTING.md) for comprehensive instructions.

---

## ❓ Common Issues

### "Missing required environment variable"
- Make sure `.env.local` exists
- Check all required variables are set
- No typos in variable names

### "Invalid access token"
- Your token expired (they expire in 1 hour)
- Generate a new code and get fresh tokens
- Or wait for auto-refresh to work (if you have refresh_token)

### "Organization not found"
- Check ZOHO_ORG_ID is correct
- Make sure it's the organization ID, not organization name

### "Account ID is required"
- You must set ZOHO_EXPENSE_ACCOUNT_ID
- Get it from Chart of Accounts in Zoho Books

### "Invalid account ID"
- The account doesn't exist in your organization
- Create an expense account in Zoho Books first
- Or use an existing expense account ID

---

## 🎯 What the Test Does

The test script will:

1. ✅ Register your Zoho organization
2. ✅ Load OAuth tokens
3. ✅ Verify token is valid (auto-refresh if needed)
4. ✅ Post a test expense (₹250.50 - Coffee meeting)
5. ✅ Post a test bill if vendor ID is set
6. ✅ Display results

**Expected Output:**
```
🧪 Testing Zoho Books Connector
================================

📝 Step 1: Registering Zoho organization...
✅ Organization registered

🔑 Step 2: Loading OAuth tokens...
✅ Tokens loaded

🔄 Step 3: Getting valid access token...
✅ Access token obtained: 1000.abc123...

💰 Step 4: Testing expense posting...
✅ Expense posted successfully!
   Voucher ID: 12345678900000001
   External Ref: 12345678900000001
   Timestamp: 2026-01-26T...

✅ Testing Complete!
==================

📋 Next Steps:
1. Log into your Zoho Books account
2. Go to Expenses → All Expenses
3. Look for "Test expense from connector"

🎉 If you see the test records, the connector is working!
```

---

## 🚀 Next Steps After Successful Test

1. **Phase 4**: Add database to persist tokens (no more manual token management!)
2. **Phase 3**: Build document parsing (upload PDF → auto-extract → post)
3. **Production**: Deploy and use for real expenses

---

## 💡 Tips

- **Tokens expire in 1 hour** - but refresh_token lasts 1 year
- **Auto-refresh works** - connector automatically refreshes tokens
- **Test in sandbox first** - use a test Zoho Books organization
- **Multiple orgs supported** - can register multiple organizations
- **Idempotency works** - safe to retry failed requests

---

## 📚 Further Reading

- [TESTING.md](./TESTING.md) - Comprehensive testing guide
- [README.md](./README.md) - Full API documentation
- [Zoho Books API Docs](https://www.zoho.com/books/api/v3/) - Official API reference

---

**Ready to test?** Run `pnpm test:manual` and watch the magic! ✨
