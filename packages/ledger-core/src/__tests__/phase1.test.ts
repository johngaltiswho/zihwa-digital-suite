import test from 'node:test'
import assert from 'node:assert/strict'
import { AccountingContextSchema, hasCompanyPermission } from '../index'

test('AccountingContextSchema accepts valid minimum payload', () => {
  const parsed = AccountingContextSchema.safeParse({
    version: 1,
    baseCurrency: 'INR',
    timezone: 'Asia/Kolkata',
    posting: {
      allowAutoPost: false,
      autoPostConfidence: 90,
      manualReviewConfidence: 70,
      roundingPolicy: 'NONE',
      attachmentPolicy: 'OPTIONAL',
      autoVendorCreate: false,
    },
    vendorRules: [],
    ledgerRules: [],
    allocation: {
      useProjects: false,
      rules: [],
    },
    gst: {
      registered: true,
      requireGstin: true,
      defaultTreatment: 'INTRA',
      exemptVendorIds: [],
      manualRateVendors: [],
    },
    risk: {
      tolerancePercent: 1,
      duplicateDetectionPolicy: 'STRICT',
      blockedVendors: [],
      holdKeywords: [],
    },
  })

  assert.equal(parsed.success, true)
})

test('AccountingContextSchema fails when required top-level fields are missing', () => {
  const parsed = AccountingContextSchema.safeParse({
    version: 1,
    baseCurrency: 'INR',
    posting: {
      allowAutoPost: false,
      autoPostConfidence: 90,
      manualReviewConfidence: 70,
      roundingPolicy: 'NONE',
      attachmentPolicy: 'OPTIONAL',
      autoVendorCreate: false,
    },
    vendorRules: [],
    ledgerRules: [],
    allocation: { useProjects: false, rules: [] },
    gst: {
      registered: true,
      requireGstin: true,
      defaultTreatment: 'INTRA',
      exemptVendorIds: [],
      manualRateVendors: [],
    },
    risk: {
      tolerancePercent: 1,
      duplicateDetectionPolicy: 'STRICT',
      blockedVendors: [],
      holdKeywords: [],
    },
  })

  assert.equal(parsed.success, false)
})

test('RBAC permission matrix works for viewer/preparer/approver/admin', () => {
  assert.equal(hasCompanyPermission('VIEWER', 'company.read'), true)
  assert.equal(hasCompanyPermission('VIEWER', 'draft.create'), false)

  assert.equal(hasCompanyPermission('PREPARER', 'draft.create'), true)
  assert.equal(hasCompanyPermission('PREPARER', 'draft.approve'), false)

  assert.equal(hasCompanyPermission('APPROVER', 'draft.approve'), true)
  assert.equal(hasCompanyPermission('APPROVER', 'settings.manage'), false)

  assert.equal(hasCompanyPermission('ADMIN', 'integration.manage'), true)
})
