import {
  createAccountingDraft,
  getAccountingDraftById,
  listAccountingDrafts,
  updateAccountingDraft,
  createLearningSignal,
  getDocument,
  getActiveAccountingContext,
  prisma,
} from '@repo/db'
import {
  AccountingContextSchema,
  DraftPayloadSchema,
  type DraftPayload,
  type ExpenseData,
  type PurchaseData,
  type VoucherResult,
} from '@repo/ledger-core'
import { ZohoBooksClient, postExpense, postPurchase } from '@repo/connector-zoho-books'
import type { ZohoRegion } from '@repo/connector-zoho-books'
import { getCompanyZohoConnection } from '../zoho/company-connection'

type ExtractedDocumentData = {
  data?: {
    vendorName?: unknown
    merchant?: unknown
  }
}

type ParsedExpenseRow = {
  date: string
  vendorName: string
  amount: number
  description: string
  billNumber?: string
  taxAmount?: number
}

type ZohoVendor = {
  id: string
  name: string
}

function toExpenseData(payload: DraftPayload): ExpenseData {
  return {
    merchant: payload.merchant || payload.vendorName || 'Unknown merchant',
    amount: payload.amount,
    currency: payload.currency,
    date: new Date(payload.date),
    description: payload.narration,
    taxAmount: payload.taxAmount,
    lineItems: payload.lineItems.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount,
      accountId: item.ledgerId,
      taxId: item.taxId,
    })),
  }
}

function toPurchaseData(payload: DraftPayload): PurchaseData {
  return {
    vendorName: payload.vendorName || payload.merchant || 'Unknown vendor',
    billNumber: payload.billNumber,
    amount: payload.amount,
    currency: payload.currency,
    date: new Date(payload.date),
    description: payload.narration,
    taxAmount: payload.taxAmount,
    lineItems: payload.lineItems.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount,
      accountId: item.ledgerId,
      taxId: item.taxId,
    })),
  }
}

function normalizeName(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function scoreNameMatch(inputName: string, candidate: string): number {
  const a = normalizeName(inputName)
  const b = normalizeName(candidate)
  if (!a || !b) return 0
  if (a === b) return 1
  if (a.includes(b) || b.includes(a)) return 0.92

  const aTokens = new Set(a.split(' ').filter(Boolean))
  const bTokens = new Set(b.split(' ').filter(Boolean))
  if (aTokens.size === 0 || bTokens.size === 0) return 0

  let overlap = 0
  for (const token of aTokens) {
    if (bTokens.has(token)) overlap += 1
  }

  const union = new Set([...aTokens, ...bTokens]).size
  return union > 0 ? overlap / union : 0
}

function parseNumber(raw: string): number | null {
  const cleaned = raw.replace(/[^0-9.-]/g, '')
  if (!cleaned) return null
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

function normalizeDate(raw: string): string {
  const value = raw.trim()
  if (!value) return new Date().toISOString().slice(0, 10)

  const ddMmm = value.match(/^(\d{1,2})-([a-zA-Z]{3})$/)
  if (ddMmm && ddMmm[1] && ddMmm[2]) {
    const monthMap: Record<string, string> = {
      jan: '01',
      feb: '02',
      mar: '03',
      apr: '04',
      may: '05',
      jun: '06',
      jul: '07',
      aug: '08',
      sep: '09',
      oct: '10',
      nov: '11',
      dec: '12',
    }
    const month = monthMap[ddMmm[2].toLowerCase()]
    if (month) {
      const year = String(new Date().getFullYear())
      const day = ddMmm[1].padStart(2, '0')
      return `${year}-${month}-${day}`
    }
  }

  const ddmmyyyy = value.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (ddmmyyyy && ddmmyyyy[1] && ddmmyyyy[2] && ddmmyyyy[3]) {
    const dd = ddmmyyyy[1]
    const mm = ddmmyyyy[2]
    const yyyy = ddmmyyyy[3]
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
  }

  const yyyymmdd = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (yyyymmdd) return value

  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10)
  }

  return new Date().toISOString().slice(0, 10)
}

function detectDelimiter(sample: string): string {
  const candidates = [',', '\t', '|', ';']
  let best = ','
  let bestCount = 0
  for (const candidate of candidates) {
    const count = sample.split(candidate).length - 1
    if (count > bestCount) {
      best = candidate
      bestCount = count
    }
  }
  return best
}

function splitByFixedColumns(line: string): string[] {
  return line
    .split(/\t+|\s{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function splitByDelimiter(line: string, delimiter: string): string[] {
  return line
    .split(delimiter)
    .map((part) => part.trim())
    .map((part) => part.replace(/^"|"$/g, ''))
}

function parseExpenseList(text: string): ParsedExpenseRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    throw new Error('Expense list is empty')
  }

  const firstLine = lines[0] ?? ''
  const delimiter = detectDelimiter(firstLine)
  const headerCols = splitByDelimiter(firstLine, delimiter).map((col) => col.toLowerCase())

  const getIndex = (keys: string[]) =>
    headerCols.findIndex((col) => keys.some((key) => col.includes(key)))

  const headerMap = {
    date: getIndex(['date']),
    vendor: getIndex(['vendor', 'merchant', 'party', 'name', 'particular']),
    amount: getIndex(['amount', 'amt', 'value', 'total']),
    description: getIndex(['description', 'narration', 'details', 'note']),
    billNumber: getIndex(['bill', 'invoice', 'reference', 'ref']),
    tax: getIndex(['tax', 'gst']),
  }

  const hasHeader = headerMap.amount >= 0 && (headerMap.vendor >= 0 || headerMap.description >= 0)
  const startIndex = hasHeader ? 1 : 0

  const rows: ParsedExpenseRow[] = []
  let lastDate = new Date().toISOString().slice(0, 10)

  for (let i = startIndex; i < lines.length; i += 1) {
    const line = lines[i] ?? ''
    let cols = splitByDelimiter(line, delimiter)
    if (cols.length <= 1) {
      cols = splitByFixedColumns(line)
    }
    if (cols.length < 2) continue

    const vendorName =
      (headerMap.vendor >= 0
        ? cols[headerMap.vendor]
        : headerMap.description >= 0
          ? cols[headerMap.description]
          : cols[0])?.trim() ?? ''
    const amountRaw =
      (headerMap.amount >= 0
        ? cols[headerMap.amount]
        : cols.length >= 3
          ? cols[2]
          : cols[1]) ?? ''
    const amount = parseNumber(amountRaw)

    if (!vendorName || amount === null || amount <= 0) {
      continue
    }

    const dateRaw = (headerMap.date >= 0 ? cols[headerMap.date] : cols[1]) ?? ''

    const description =
      (headerMap.description >= 0 ? cols[headerMap.description] : cols[3])?.trim() ||
      `Expense for ${vendorName}`

    const billNumber =
      (headerMap.billNumber >= 0 ? cols[headerMap.billNumber] : '')?.trim() || undefined

    const taxRaw =
      (headerMap.tax >= 0 ? cols[headerMap.tax] : '')?.trim() || ''
    const tax = parseNumber(taxRaw)

    const normalizedDate = dateRaw?.trim() ? normalizeDate(dateRaw) : lastDate
    lastDate = normalizedDate

    rows.push({
      date: normalizedDate,
      vendorName,
      amount,
      description,
      billNumber,
      taxAmount: tax !== null && tax >= 0 ? tax : undefined,
    })
  }

  if (rows.length === 0) {
    throw new Error(
      'No valid rows found. Expected columns like: date, vendor, amount, description.'
    )
  }

  return rows
}

async function fetchZohoVendors(companyId: string): Promise<ZohoVendor[]> {
  const connection = await getCompanyZohoConnection(companyId)
  if (!connection) return []

  const region = (process.env.ZOHO_REGION || 'in') as ZohoRegion
  const client = new ZohoBooksClient(connection.orgId, connection.tokens.accessToken, region)

  const response = await client.get<{ contacts?: Array<{ contact_id?: string; contact_name?: string }> }>(
    '/contacts',
    {
      contact_type: 'vendor',
      sort_column: 'contact_name',
      per_page: 200,
      page: 1,
    }
  )

  return (response.contacts || [])
    .map((contact) => ({
      id: String(contact.contact_id || ''),
      name: String(contact.contact_name || ''),
    }))
    .filter((vendor) => vendor.id && vendor.name)
}

function resolveVendorId(vendors: ZohoVendor[], vendorName: string): string | null {
  let bestScore = 0
  let bestId: string | null = null

  for (const vendor of vendors) {
    const score = scoreNameMatch(vendorName, vendor.name)
    if (score > bestScore) {
      bestScore = score
      bestId = vendor.id
    }
  }

  return bestScore >= 0.55 ? bestId : null
}

export async function searchVendors(companyId: string, query: string): Promise<string[]> {
  const docs = await prisma.processedDocument.findMany({
    where: {
      companyId,
      extractedData: { not: undefined },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: { extractedData: true },
  })

  const hits = new Set<string>()
  for (const doc of docs) {
    const payload = (doc.extractedData ?? {}) as ExtractedDocumentData
    const vendor = payload?.data?.vendorName || payload?.data?.merchant
    if (typeof vendor === 'string' && vendor.toLowerCase().includes(query.toLowerCase())) {
      hits.add(vendor)
    }
  }

  return Array.from(hits).slice(0, 10)
}

export async function createExpenseDraft(input: {
  organizationId: string
  companyId: string
  userId: string
  payload: Record<string, unknown>
}): Promise<{ id: string }> {
  const parsed = DraftPayloadSchema.parse(input.payload)

  const draft = await createAccountingDraft({
    organizationId: input.organizationId,
    companyId: input.companyId,
    createdBy: input.userId,
    payload: parsed as unknown as Record<string, unknown>,
    source: 'COPILOT',
  })
  return { id: draft.id }
}

export async function ingestExpenseList(input: {
  organizationId: string
  companyId: string
  userId: string
  text: string
  postToZohoDraft?: boolean
  currency?: string
}): Promise<{
  parsedRows: number
  draftsCreated: number
  zohoDraftsPosted: number
  failures: Array<{ row: number; reason: string }>
  draftIds: string[]
}> {
  const rows = parseExpenseList(input.text)
  const failures: Array<{ row: number; reason: string }> = []
  const draftIds: string[] = []

  const currency = (input.currency || 'INR').toUpperCase()
  const postToZohoDraft = Boolean(input.postToZohoDraft)

  const connection = postToZohoDraft ? await getCompanyZohoConnection(input.companyId) : null
  let vendors: ZohoVendor[] = []
  let vendorFetchError: string | null = null
  if (postToZohoDraft && connection) {
    try {
      vendors = await fetchZohoVendors(input.companyId)
    } catch (error) {
      vendorFetchError = error instanceof Error ? error.message : 'Unable to fetch vendors from Zoho'
    }
  }
  const region = (process.env.ZOHO_REGION || 'in') as ZohoRegion

  let zohoDraftsPosted = 0

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index]
    if (!row) continue

    const payload: DraftPayload = {
      type: 'purchase',
      vendorName: row.vendorName,
      amount: row.amount,
      currency,
      date: row.date,
      billNumber: row.billNumber,
      narration: row.description,
      taxAmount: row.taxAmount,
      lineItems: [
        {
          description: row.description,
          quantity: 1,
          rate: row.amount,
          amount: row.amount,
        },
      ],
    }

    const draft = await createAccountingDraft({
      organizationId: input.organizationId,
      companyId: input.companyId,
      createdBy: input.userId,
      payload: payload as unknown as Record<string, unknown>,
      source: 'COPILOT',
    })
    draftIds.push(draft.id)

    if (!postToZohoDraft) {
      continue
    }

    if (!connection) {
      failures.push({ row: index + 1, reason: 'Zoho is not connected for this company' })
      continue
    }

    if (vendorFetchError) {
      failures.push({ row: index + 1, reason: vendorFetchError })
      await updateAccountingDraft(draft.id, {
        status: 'FAILED',
        zohoResult: { error: vendorFetchError },
      })
      continue
    }

    const vendorId = resolveVendorId(vendors, row.vendorName)
    if (!vendorId) {
      failures.push({ row: index + 1, reason: `Vendor not found in Zoho: ${row.vendorName}` })
      await updateAccountingDraft(draft.id, {
        status: 'FAILED',
        zohoResult: { error: `Vendor not found in Zoho: ${row.vendorName}` },
      })
      continue
    }

    const result = await postPurchase(
      toPurchaseData(payload),
      connection.orgId,
      connection.tokens.accessToken,
      region,
      {
        vendorId,
        asDraft: true,
        idempotencyKey: `copilot-expense-${draft.id}`,
      }
    )

    if (result.success) {
      zohoDraftsPosted += 1
      await updateAccountingDraft(draft.id, {
        status: 'POSTED',
        postedAt: new Date(),
        approvedAt: new Date(),
        zohoResult: {
          ...((result as unknown as Record<string, unknown>) ?? {}),
          postMode: 'ZOHO_DRAFT',
        },
      })
    } else {
      failures.push({ row: index + 1, reason: result.error || 'Zoho post failed' })
      await updateAccountingDraft(draft.id, {
        status: 'FAILED',
        zohoResult: result as unknown as Record<string, unknown>,
      })
    }
  }

  return {
    parsedRows: rows.length,
    draftsCreated: draftIds.length,
    zohoDraftsPosted,
    failures,
    draftIds,
  }
}

export async function postDraftsAsZohoDrafts(input: {
  companyId: string
  draftIds: string[]
  userId: string
}): Promise<{
  total: number
  posted: number
  failures: Array<{ draftId: string; reason: string }>
}> {
  const connection = await getCompanyZohoConnection(input.companyId)
  if (!connection) {
    return {
      total: input.draftIds.length,
      posted: 0,
      failures: input.draftIds.map((draftId) => ({
        draftId,
        reason: 'Zoho is not connected for this company',
      })),
    }
  }

  let vendors: ZohoVendor[] = []
  try {
    vendors = await fetchZohoVendors(input.companyId)
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : 'Unable to fetch vendors from Zoho'
    return {
      total: input.draftIds.length,
      posted: 0,
      failures: input.draftIds.map((draftId) => ({
        draftId,
        reason,
      })),
    }
  }

  const region = (process.env.ZOHO_REGION || 'in') as ZohoRegion
  let posted = 0
  const failures: Array<{ draftId: string; reason: string }> = []

  for (const draftId of input.draftIds) {
    const draft = await getAccountingDraftById(draftId)
    if (!draft || draft.companyId !== input.companyId) {
      failures.push({ draftId, reason: 'Draft not found in active company' })
      continue
    }

    const parsed = DraftPayloadSchema.safeParse(draft.payload)
    if (!parsed.success) {
      const reason = parsed.error.issues.map((i) => i.message).join('; ')
      failures.push({ draftId, reason: reason || 'Invalid draft payload' })
      await updateAccountingDraft(draftId, {
        status: 'FAILED',
        zohoResult: { error: reason || 'Invalid draft payload' },
      })
      continue
    }

    const payload = parsed.data
    const vendorName = payload.vendorName || payload.merchant || ''
    const vendorId = resolveVendorId(vendors, vendorName)
    if (!vendorId) {
      const reason = `Vendor not found in Zoho: ${vendorName || 'Unknown vendor'}`
      failures.push({ draftId, reason })
      await updateAccountingDraft(draftId, {
        status: 'FAILED',
        zohoResult: { error: reason },
      })
      continue
    }

    const result = await postPurchase(
      toPurchaseData(payload),
      connection.orgId,
      connection.tokens.accessToken,
      region,
      {
        vendorId,
        asDraft: true,
        idempotencyKey: `copilot-chat-batch-${draft.id}`,
      }
    )

    if (result.success) {
      posted += 1
      await updateAccountingDraft(draftId, {
        status: 'POSTED',
        approvedAt: new Date(),
        postedAt: new Date(),
        zohoResult: {
          ...((result as unknown as Record<string, unknown>) ?? {}),
          postMode: 'ZOHO_DRAFT',
        },
      })
      continue
    }

    const reason = result.error || 'Zoho post failed'
    failures.push({ draftId, reason })
    await updateAccountingDraft(draftId, {
      status: 'FAILED',
      zohoResult: result as unknown as Record<string, unknown>,
    })
  }

  return {
    total: input.draftIds.length,
    posted,
    failures,
  }
}

export async function attachDocumentToDraft(
  companyId: string,
  draftId: string,
  documentId: string
): Promise<{ id: string }> {
  const draft = await getAccountingDraftById(draftId)
  if (!draft || draft.companyId !== companyId) throw new Error('Draft not found in active company')
  const document = await getDocument(documentId)
  if (!document || document.companyId !== companyId) throw new Error('Document not found in active company')

  const updated = await updateAccountingDraft(draftId, { documentId })
  return { id: updated.id }
}

export async function validateDraft(
  companyId: string,
  draftId: string
): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
  const draft = await getAccountingDraftById(draftId)
  if (!draft || draft.companyId !== companyId) throw new Error('Draft not found in active company')

  const parsed = DraftPayloadSchema.safeParse(draft.payload)
  if (!parsed.success) {
    const errors = parsed.error.issues.map((i) => i.message)
    await updateAccountingDraft(draftId, {
      status: 'FAILED',
      validation: { isValid: false, errors, warnings: [] },
    })

    return { isValid: false, errors, warnings: [] }
  }

  const payload = parsed.data
  const warnings: string[] = []
  const lineTotal = payload.lineItems.reduce((sum, li) => sum + li.amount, 0)
  if (payload.lineItems.length > 0 && Math.abs(lineTotal - payload.amount) > 1) {
    warnings.push('Line item total does not match draft amount')
  }

  const validation = { isValid: true, errors: [], warnings }
  await updateAccountingDraft(draftId, {
    status: 'VALIDATED',
    validation,
  })

  return validation
}

export async function submitDraftForApproval(
  companyId: string,
  draftId: string,
  userId: string
): Promise<{ id: string }> {
  const draft = await getAccountingDraftById(draftId)
  if (!draft || draft.companyId !== companyId) throw new Error('Draft not found in active company')

  const activeContext = await getActiveAccountingContext(companyId)
  if (!activeContext) {
    throw new Error('Company context is not active. Complete context wizard first.')
  }

  const contextParsed = AccountingContextSchema.safeParse(activeContext.context)
  if (!contextParsed.success) {
    throw new Error('Company context is incomplete. Complete context wizard first.')
  }

  await updateAccountingDraft(draftId, {
    status: 'SUBMITTED',
    submittedAt: new Date(),
    approvalMeta: {
      submittedBy: userId,
    },
  })

  return { id: draftId }
}

export async function approveAndPostDraft(
  companyId: string,
  draftId: string,
  userId: string
): Promise<{ id: string; status: 'POSTED' | 'FAILED' }> {
  const draft = await getAccountingDraftById(draftId)
  if (!draft || draft.companyId !== companyId) throw new Error('Draft not found in active company')

  const connection = await getCompanyZohoConnection(draft.companyId)
  if (!connection) {
    throw new Error('Zoho connection is missing for this company')
  }

  const payload = DraftPayloadSchema.parse(draft.payload)

  let result: VoucherResult
  if (payload.type === 'expense') {
    result = await postExpense(toExpenseData(payload), connection.orgId, connection.tokens.accessToken)
  } else {
    result = await postPurchase(toPurchaseData(payload), connection.orgId, connection.tokens.accessToken)
  }

  const nextStatus = result.success ? 'POSTED' : 'FAILED'
  await updateAccountingDraft(draftId, {
    status: nextStatus,
    approvedAt: new Date(),
    postedAt: result.success ? new Date() : null,
    zohoResult: result as unknown as Record<string, unknown>,
    approvalMeta: {
      ...((draft.approvalMeta ?? {}) as Record<string, unknown>),
      approvedBy: userId,
    },
  })

  await createLearningSignal({
    organizationId: draft.organizationId,
    companyId: draft.companyId,
    draftId: draft.id,
    documentId: draft.documentId,
    eventType: result.success ? 'auto_accepted' : 'post_failed',
    payload: {
      result,
    },
    createdBy: userId,
  })

  return { id: draftId, status: nextStatus }
}

export async function getCompanySummary(
  companyId: string,
  dateRange?: { from?: string; to?: string }
): Promise<{
  dateRange: { from?: string; to?: string } | null
  totalDrafts: number
  totalDraftAmount: number
  byStatus: Record<string, number>
}> {
  const drafts = await listAccountingDrafts(companyId)

  const totalDraftAmount = drafts.reduce((sum, draft) => {
    const parsed = DraftPayloadSchema.safeParse(draft.payload)
    const amount = parsed.success ? parsed.data.amount : 0
    return sum + amount
  }, 0)

  return {
    dateRange: dateRange ?? null,
    totalDrafts: drafts.length,
    totalDraftAmount,
    byStatus: drafts.reduce<Record<string, number>>((acc, draft) => {
      acc[draft.status] = (acc[draft.status] ?? 0) + 1
      return acc
    }, {}),
  }
}
