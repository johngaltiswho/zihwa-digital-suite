-- CreateEnum
CREATE TYPE "accounting"."CompanyRole" AS ENUM ('VIEWER', 'PREPARER', 'APPROVER', 'ADMIN');

-- CreateEnum
CREATE TYPE "accounting"."DraftStatus" AS ENUM ('DRAFT', 'VALIDATED', 'SUBMITTED', 'APPROVED', 'POSTED', 'REJECTED', 'FAILED');

-- CreateEnum
CREATE TYPE "accounting"."DraftSource" AS ENUM ('MANUAL', 'DOCUMENT', 'COPILOT');

-- CreateEnum
CREATE TYPE "accounting"."CopilotMessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "accounting"."ToolCallStatus" AS ENUM ('SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "accounting"."learning_signals" ADD COLUMN     "draftId" TEXT;

-- CreateTable
CREATE TABLE "accounting"."company_memberships" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "accounting"."CompanyRole" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."accounting_drafts" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "documentId" TEXT,
    "createdBy" TEXT NOT NULL,
    "status" "accounting"."DraftStatus" NOT NULL DEFAULT 'DRAFT',
    "source" "accounting"."DraftSource" NOT NULL DEFAULT 'MANUAL',
    "payload" JSONB NOT NULL,
    "validation" JSONB,
    "approvalMeta" JSONB,
    "zohoResult" JSONB,
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "postedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounting_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."copilot_threads" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "copilot_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."copilot_messages" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "role" "accounting"."CopilotMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "draftId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "copilot_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting"."copilot_tool_calls" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "toolName" TEXT NOT NULL,
    "input" JSONB,
    "output" JSONB,
    "status" "accounting"."ToolCallStatus" NOT NULL DEFAULT 'SUCCESS',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "copilot_tool_calls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "company_memberships_userId_idx" ON "accounting"."company_memberships"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "company_memberships_companyId_userId_key" ON "accounting"."company_memberships"("companyId", "userId");

-- CreateIndex
CREATE INDEX "accounting_drafts_organizationId_companyId_status_idx" ON "accounting"."accounting_drafts"("organizationId", "companyId", "status");

-- CreateIndex
CREATE INDEX "copilot_threads_organizationId_companyId_createdBy_idx" ON "accounting"."copilot_threads"("organizationId", "companyId", "createdBy");

-- CreateIndex
CREATE INDEX "copilot_messages_threadId_createdAt_idx" ON "accounting"."copilot_messages"("threadId", "createdAt");

-- CreateIndex
CREATE INDEX "copilot_tool_calls_messageId_idx" ON "accounting"."copilot_tool_calls"("messageId");

-- AddForeignKey
ALTER TABLE "accounting"."learning_signals" ADD CONSTRAINT "learning_signals_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "accounting"."accounting_drafts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."company_memberships" ADD CONSTRAINT "company_memberships_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "accounting"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."accounting_drafts" ADD CONSTRAINT "accounting_drafts_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "accounting"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."accounting_drafts" ADD CONSTRAINT "accounting_drafts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "accounting"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."accounting_drafts" ADD CONSTRAINT "accounting_drafts_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "accounting"."processed_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."copilot_threads" ADD CONSTRAINT "copilot_threads_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "accounting"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."copilot_threads" ADD CONSTRAINT "copilot_threads_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "accounting"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."copilot_messages" ADD CONSTRAINT "copilot_messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "accounting"."copilot_threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."copilot_messages" ADD CONSTRAINT "copilot_messages_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "accounting"."accounting_drafts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting"."copilot_tool_calls" ADD CONSTRAINT "copilot_tool_calls_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "accounting"."copilot_messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
