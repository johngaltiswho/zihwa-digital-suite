import { DocumentCategory, Frequency, PrismaClient } from '@prisma/client'

export const DEFAULT_DOCUMENT_TYPES = [
  {
    code: 'GST_CERT',
    title: 'GST Certificate',
    category: DocumentCategory.CERTIFICATE,
    frequency: Frequency.ONE_TIME,
    isMandatory: true,
    requiresPeriod: false,
  },
  {
    code: 'UDYAM_CERT',
    title: 'Udyam Certificate',
    category: DocumentCategory.CERTIFICATE,
    frequency: Frequency.ONE_TIME,
    isMandatory: true,
    requiresPeriod: false,
  },
  {
    code: 'PROPRIETOR_KYC',
    title: 'Individual KYC (PAN/Aadhaar)',
    category: DocumentCategory.KYC,
    frequency: Frequency.ONE_TIME,
    isMandatory: true,
    requiresPeriod: false,
  },
  {
    code: 'PROPRIETOR_ADDRESS_PROOF',
    title: 'Proprietor Address Proof',
    category: DocumentCategory.KYC,
    frequency: Frequency.ONE_TIME,
    isMandatory: true,
    requiresPeriod: false,
  },
  {
    code: 'LAST3YR_FINANCIALS',
    title: 'Financial Statements - Last 3 Years',
    category: DocumentCategory.FINANCIAL_STATEMENT,
    frequency: Frequency.ONE_TIME,
    isMandatory: true,
    requiresPeriod: false,
  },
  {
    code: 'PROVISIONAL_FINANCIALS',
    title: 'Provisional Financials (Latest Year)',
    category: DocumentCategory.FINANCIAL_STATEMENT,
    frequency: Frequency.ONE_TIME,
    isMandatory: true,
    requiresPeriod: false,
  },
  {
    code: 'MONTHLY_GST_RETURN',
    title: 'GST Return (Monthly)',
    category: DocumentCategory.COMPLIANCE_DOC,
    frequency: Frequency.MONTHLY,
    isMandatory: true,
    requiresPeriod: true,
    defaultDueDay: 11,
  },
  {
    code: 'MONTHLY_BANK_STATEMENT',
    title: 'Bank Statement (Monthly)',
    category: DocumentCategory.FINANCIAL_STATEMENT,
    frequency: Frequency.MONTHLY,
    isMandatory: true,
    requiresPeriod: true,
    defaultDueDay: 5,
  },
  {
    code: 'LOAN_SANCTION_LETTER',
    title: 'Existing Loan Sanction Letter',
    category: DocumentCategory.CONTRACT,
    frequency: Frequency.ONE_TIME,
    isMandatory: false,
    requiresPeriod: false,
  },
  {
    code: 'PROPRIETOR_PHOTOS',
    title: 'Proprietor Passport Photos',
    category: DocumentCategory.KYC,
    frequency: Frequency.ONE_TIME,
    isMandatory: true,
    requiresPeriod: false,
  },
  {
    code: 'CO_APPLICANT_KYC',
    title: 'Co-Applicant KYC',
    category: DocumentCategory.KYC,
    frequency: Frequency.ONE_TIME,
    isMandatory: false,
    requiresPeriod: false,
  },
  {
    code: 'CO_APPLICANT_PHOTO',
    title: 'Co-Applicant Photo',
    category: DocumentCategory.KYC,
    frequency: Frequency.ONE_TIME,
    isMandatory: false,
    requiresPeriod: false,
  },
]

export async function ensureDocumentTypes(prisma: PrismaClient) {
  for (const type of DEFAULT_DOCUMENT_TYPES) {
    await prisma.documentType.upsert({
      where: { code: type.code },
      update: {
        title: type.title,
        category: type.category,
        frequency: type.frequency,
        isMandatory: type.isMandatory,
        requiresPeriod: type.requiresPeriod,
        defaultDueDay: type.defaultDueDay,
      },
      create: type,
    })
  }
}
