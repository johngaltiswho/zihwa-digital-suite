# Test Samples Directory

Place your sample receipts and invoices here for testing the document extraction.

## Supported Formats

- **PDF files**: Text-based PDFs (best results) or scanned PDFs
- **Image files**: JPG, PNG (will use OCR via Tesseract)

## How to Test

1. Place a sample file in this directory
2. Run the test script:

```bash
# From packages/doc-ingest directory
pnpm test:extract test-samples/your-file.pdf

# Or with an image
pnpm test:extract test-samples/your-receipt.jpg
```

## Example Files to Try

- Expense receipts (restaurant, taxi, shopping)
- Purchase invoices (vendor bills)
- Any document with merchant/vendor, amount, and date

## Tips for Best Results

1. **Text-based PDFs work best** - If you have a scanned PDF, try converting it to an image first
2. **Clear text** - Higher quality images give better OCR results
3. **Standard formats** - Receipts with clear labels like "Total:", "Date:", etc. work best
4. **English text** - Current parsers are optimized for English (can be extended)

## What Gets Extracted

### For Expenses (Receipts)
- Merchant name
- Total amount
- Date
- Currency
- Tax amount (if present)
- Description/notes

### For Purchases (Invoices)
- Vendor name
- Bill/Invoice number
- Total amount
- Date and due date
- Line items (description, quantity, rate, amount)
- Tax amount
- Currency

## Sample Output

```
🧪 Testing Document Extraction
================================

📄 Reading file: test-samples/receipt.pdf

✅ Extraction complete!

Document Type: EXPENSE
Confidence Score: 100.0%

💰 Expense Details:
-------------------
Merchant:     Starbucks Coffee
Amount:       USD 15.75
Date:         2026-01-27
Tax Amount:   USD 1.25
```

## Next Steps After Testing

Once extraction works well:
1. Integrate with Zoho connector to automatically post expenses
2. Build an API endpoint to handle file uploads
3. Fine-tune parsers based on your specific document formats
