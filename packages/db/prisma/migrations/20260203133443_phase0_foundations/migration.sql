-- CreateEnum
CREATE TYPE "accounting"."DocumentType" AS ENUM ('EXPENSE', 'PURCHASE', 'INVOICE');

-- CreateEnum
CREATE TYPE "accounting"."ProcessingStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'EXTRACTED', 'POSTED', 'FAILED');

-- CreateEnum
CREATE TYPE "accounting"."OrgRole" AS ENUM ('OWNER', 'ADMIN', 'ACCOUNTANT', 'VIEWER');

-- CreateEnum
CREATE TYPE "accounting"."IntegrationProvider" AS ENUM ('ZOHO_BOOKS', 'TALLY');

-- CreateEnum
CREATE TYPE "accounting"."IntegrationStatus" AS ENUM ('PENDING', 'CONNECTED', 'DISCONNECTED', 'ERROR');

-- CreateEnum
CREATE TYPE "accounting"."ContextStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "accounting"."organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "defaultCurrency" VARCHAR(3),
    "timezone" TEXT DEFAULT 'Asia/Kolkata',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."org_memberships" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "accounting"."OrgRole" NOT NULL DEFAULT 'ACCOUNTANT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "org_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."org_policies" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "policyType" TEXT NOT NULL DEFAULT 'defaults',
    "data" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "org_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."companies" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "baseCurrency" VARCHAR(3),
    "timezone" TEXT DEFAULT 'Asia/Kolkata',
    "industry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."accounting_contexts" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "accounting"."ContextStatus" NOT NULL DEFAULT 'DRAFT',
    "context" JSONB NOT NULL,
    "notes" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activatedAt" TIMESTAMP(3),
    "supersededAt" TIMESTAMP(3),

    CONSTRAINT "accounting_contexts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."integration_connections" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "provider" "accounting"."IntegrationProvider" NOT NULL,
    "status" "accounting"."IntegrationStatus" NOT NULL DEFAULT 'PENDING',
    "externalOrgId" TEXT,
    "metadata" JSONB,
    "lastSyncedAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integration_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."learning_signals" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "companyId" TEXT,
    "documentId" TEXT,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."oauth_tokens" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'zoho_books',
    "orgId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."processed_documents" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "documentType" "accounting"."DocumentType" NOT NULL,
    "status" "accounting"."ProcessingStatus" NOT NULL,
    "extractedData" JSONB,
    "postingResult" JSONB,
    "zohoVoucherId" TEXT,
    "zohoOrgId" TEXT,
    "error" TEXT,
    "processedAt" TIMESTAMP(3),
    "organizationId" TEXT,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "processed_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "accounting"."organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "org_memberships_organizationId_userId_key" ON "accounting"."org_memberships"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "org_policies_organizationId_isActive_idx" ON "accounting"."org_policies"("organizationId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "companies_organizationId_slug_key" ON "accounting"."companies"("organizationId", "slug");

-- CreateIndex
CREATE INDEX "accounting_contexts_companyId_status_idx" ON "accounting"."accounting_contexts"("companyId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "integration_connections_companyId_provider_key" ON "accounting"."integration_connections"("companyId", "provider");

-- CreateIndex
CREATE INDEX "learning_signals_organizationId_idx" ON "accounting"."learning_signals"("organizationId");

-- CreateIndex
CREATE INDEX "learning_signals_companyId_idx" ON "accounting"."learning_signals"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_tokens_provider_orgId_key" ON "accounting"."oauth_tokens"("provider", "orgId");

-- CreateIndex
CREATE INDEX "processed_documents_organizationId_idx" ON "accounting"."processed_documents"("organizationId");

-- CreateIndex
CREATE INDEX "processed_documents_companyId_idx" ON "accounting"."processed_documents"("companyId");

-- AddForeignKey
ALTER TABLE "accounting"."org_memberships" ADD CONSTRAINT "org_memberships_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "accounting"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."org_policies" ADD CONSTRAINT "org_policies_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "accounting"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."companies" ADD CONSTRAINT "companies_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "accounting"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."accounting_contexts" ADD CONSTRAINT "accounting_contexts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "accounting"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."integration_connections" ADD CONSTRAINT "integration_connections_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "accounting"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."learning_signals" ADD CONSTRAINT "learning_signals_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "accounting"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."learning_signals" ADD CONSTRAINT "learning_signals_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "accounting"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."learning_signals" ADD CONSTRAINT "learning_signals_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "accounting"."processed_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."oauth_tokens" ADD CONSTRAINT "oauth_tokens_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "accounting"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."processed_documents" ADD CONSTRAINT "processed_documents_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "accounting"."organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."processed_documents" ADD CONSTRAINT "processed_documents_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "accounting"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
