// Zod validation schemas for accounting data

import { z } from 'zod'

export const LineItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be positive'),
  rate: z.number().nonnegative('Rate must be non-negative'),
  amount: z.number().nonnegative('Amount must be non-negative'),
  accountId: z.string().optional(),
  taxId: z.string().optional(),
})

export const ExpenseDataSchema = z.object({
  merchant: z.string().min(1, 'Merchant name is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code (e.g., USD, INR)'),
  date: z.date(),
  category: z.string().optional(),
  description: z.string().optional(),
  taxAmount: z.number().nonnegative().optional(),
  lineItems: z.array(LineItemSchema).optional(),
})

export const PurchaseDataSchema = z.object({
  vendorName: z.string().min(1, 'Vendor name is required'),
  billNumber: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code (e.g., USD, INR)'),
  date: z.date(),
  dueDate: z.date().optional(),
  lineItems: z.array(LineItemSchema).min(1, 'At least one line item is required'),
  taxAmount: z.number().nonnegative().optional(),
  description: z.string().optional(),
})

export const InvoiceDataSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code (e.g., USD, INR)'),
  date: z.date(),
  dueDate: z.date().optional(),
  lineItems: z.array(LineItemSchema).min(1, 'At least one line item is required'),
  taxAmount: z.number().nonnegative().optional(),
  description: z.string().optional(),
})

export const VoucherResultSchema = z.object({
  success: z.boolean(),
  voucherId: z.string().optional(),
  externalRef: z.string().optional(),
  error: z.string().optional(),
  timestamp: z.date(),
})

export const ExtractedDataSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('expense'),
    data: ExpenseDataSchema,
  }),
  z.object({
    type: z.literal('purchase'),
    data: PurchaseDataSchema,
  }),
  z.object({
    type: z.literal('invoice'),
    data: InvoiceDataSchema,
  }),
])
