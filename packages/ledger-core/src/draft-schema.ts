import { z } from 'zod'

export const DraftLineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive().default(1),
  rate: z.number().nonnegative(),
  amount: z.number().nonnegative(),
  ledgerId: z.string().optional(),
  taxId: z.string().optional(),
})

export const DraftPayloadSchema = z.object({
  type: z.enum(['expense', 'purchase']),
  vendorName: z.string().optional(),
  merchant: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().length(3).default('INR'),
  date: z.string(),
  billNumber: z.string().optional(),
  narration: z.string().optional(),
  taxAmount: z.number().nonnegative().optional(),
  lineItems: z.array(DraftLineItemSchema).default([]),
})

export const DraftValidationSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
})

export type DraftPayload = z.infer<typeof DraftPayloadSchema>
export type DraftValidation = z.infer<typeof DraftValidationSchema>
