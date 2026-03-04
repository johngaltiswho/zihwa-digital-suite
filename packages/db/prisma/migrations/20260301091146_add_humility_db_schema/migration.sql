-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "humility_db";

-- CreateEnum
CREATE TYPE "humility_db"."BeltRank" AS ENUM ('WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK');

-- CreateEnum
CREATE TYPE "humility_db"."SubscriptionTier" AS ENUM ('FREE', 'BASIC', 'PREMIUM');

-- CreateEnum
CREATE TYPE "humility_db"."SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING');

-- CreateEnum
CREATE TYPE "humility_db"."TechniqueCategory" AS ENUM ('GUARD', 'PASSING', 'SUBMISSIONS', 'ESCAPES', 'TRANSITIONS', 'TAKEDOWNS');

-- CreateEnum
CREATE TYPE "humility_db"."Position" AS ENUM ('CLOSED_GUARD', 'OPEN_GUARD', 'HALF_GUARD', 'SIDE_CONTROL', 'MOUNT', 'BACK', 'STANDING');

-- CreateEnum
CREATE TYPE "humility_db"."DifficultyLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "humility_db"."VideoProcessingStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "humility_db"."AnalysisType" AS ENUM ('TECHNIQUE_FORM', 'POSITIONING', 'MOVEMENT_FLOW');

-- CreateEnum
CREATE TYPE "humility_db"."ProgressStatus" AS ENUM ('NOT_STARTED', 'LEARNING', 'PRACTICING', 'PROFICIENT', 'MASTERED');

-- CreateEnum
CREATE TYPE "humility_db"."PlanStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "humility_db"."PromptCategory" AS ENUM ('DAILY_PRACTICE', 'TRAINING_INSIGHTS', 'LEADERSHIP', 'FLOW_STATE');

-- CreateTable
CREATE TABLE "humility_db"."students" (
    "id" TEXT NOT NULL,
    "vendureCustomerId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "beltRank" "humility_db"."BeltRank" NOT NULL DEFAULT 'WHITE',
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "humility_db"."subscriptions" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "vendureOrderId" TEXT,
    "tier" "humility_db"."SubscriptionTier" NOT NULL,
    "status" "humility_db"."SubscriptionStatus" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "humility_db"."techniques" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "humility_db"."TechniqueCategory" NOT NULL,
    "position" "humility_db"."Position" NOT NULL,
    "difficultyLevel" "humility_db"."DifficultyLevel" NOT NULL,
    "youtubeUrl" TEXT,
    "youtubeId" TEXT,
    "durationMinutes" INTEGER,
    "instructorNotes" TEXT,
    "keyPoints" JSONB NOT NULL,
    "prerequisites" JSONB,
    "nextTechniques" JSONB,
    "thumbnailUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "techniques_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "humility_db"."video_uploads" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "humility_db"."VideoProcessingStatus" NOT NULL,
    "processingStartedAt" TIMESTAMP(3),
    "processingCompletedAt" TIMESTAMP(3),

    CONSTRAINT "video_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "humility_db"."video_analyses" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "frameNumber" INTEGER NOT NULL,
    "timestamp" DOUBLE PRECISION NOT NULL,
    "frameUrl" TEXT NOT NULL,
    "analysisType" "humility_db"."AnalysisType" NOT NULL DEFAULT 'TECHNIQUE_FORM',
    "formScore" INTEGER,
    "positioningScore" INTEGER,
    "feedback" TEXT NOT NULL,
    "strengths" JSONB NOT NULL,
    "improvements" JSONB NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "humility_db"."technique_progress" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "techniqueId" TEXT NOT NULL,
    "status" "humility_db"."ProgressStatus" NOT NULL,
    "proficiencyLevel" INTEGER NOT NULL DEFAULT 0,
    "practiceCount" INTEGER NOT NULL DEFAULT 0,
    "lastPracticedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technique_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "humility_db"."bjj_copilot_threads" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bjj_copilot_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "humility_db"."bjj_copilot_messages" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "role" "accounting"."CopilotMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "videoAnalysisId" TEXT,
    "trainingPlanId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bjj_copilot_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "humility_db"."bjj_copilot_tool_calls" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "toolName" TEXT NOT NULL,
    "input" JSONB,
    "output" JSONB,
    "status" "accounting"."ToolCallStatus" NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bjj_copilot_tool_calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "humility_db"."training_plans" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "goalBeltRank" "humility_db"."BeltRank",
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "humility_db"."PlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdBy" TEXT NOT NULL DEFAULT 'copilot',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "humility_db"."training_plan_items" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "techniqueId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "targetReps" INTEGER,
    "targetDuration" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "training_plan_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "humility_db"."reflections" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "promptCategory" "humility_db"."PromptCategory" NOT NULL,
    "promptQuestion" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "tags" JSONB,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reflections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_vendureCustomerId_key" ON "humility_db"."students"("vendureCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "humility_db"."students"("email");

-- CreateIndex
CREATE INDEX "subscriptions_studentId_status_idx" ON "humility_db"."subscriptions"("studentId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "techniques_slug_key" ON "humility_db"."techniques"("slug");

-- CreateIndex
CREATE INDEX "techniques_category_difficultyLevel_idx" ON "humility_db"."techniques"("category", "difficultyLevel");

-- CreateIndex
CREATE INDEX "video_uploads_studentId_status_idx" ON "humility_db"."video_uploads"("studentId", "status");

-- CreateIndex
CREATE INDEX "video_analyses_videoId_idx" ON "humility_db"."video_analyses"("videoId");

-- CreateIndex
CREATE INDEX "technique_progress_studentId_status_idx" ON "humility_db"."technique_progress"("studentId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "technique_progress_studentId_techniqueId_key" ON "humility_db"."technique_progress"("studentId", "techniqueId");

-- CreateIndex
CREATE INDEX "bjj_copilot_threads_studentId_updatedAt_idx" ON "humility_db"."bjj_copilot_threads"("studentId", "updatedAt");

-- CreateIndex
CREATE INDEX "bjj_copilot_messages_threadId_createdAt_idx" ON "humility_db"."bjj_copilot_messages"("threadId", "createdAt");

-- CreateIndex
CREATE INDEX "bjj_copilot_tool_calls_messageId_idx" ON "humility_db"."bjj_copilot_tool_calls"("messageId");

-- CreateIndex
CREATE INDEX "training_plans_studentId_status_idx" ON "humility_db"."training_plans"("studentId", "status");

-- CreateIndex
CREATE INDEX "training_plan_items_planId_orderIndex_idx" ON "humility_db"."training_plan_items"("planId", "orderIndex");

-- CreateIndex
CREATE INDEX "reflections_studentId_createdAt_idx" ON "humility_db"."reflections"("studentId", "createdAt");

-- AddForeignKey
ALTER TABLE "humility_db"."subscriptions" ADD CONSTRAINT "subscriptions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "humility_db"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "humility_db"."video_uploads" ADD CONSTRAINT "video_uploads_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "humility_db"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "humility_db"."video_analyses" ADD CONSTRAINT "video_analyses_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "humility_db"."video_uploads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "humility_db"."technique_progress" ADD CONSTRAINT "technique_progress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "humility_db"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "humility_db"."technique_progress" ADD CONSTRAINT "technique_progress_techniqueId_fkey" FOREIGN KEY ("techniqueId") REFERENCES "humility_db"."techniques"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "humility_db"."bjj_copilot_threads" ADD CONSTRAINT "bjj_copilot_threads_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "humility_db"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "humility_db"."bjj_copilot_messages" ADD CONSTRAINT "bjj_copilot_messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "humility_db"."bjj_copilot_threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "humility_db"."bjj_copilot_messages" ADD CONSTRAINT "bjj_copilot_messages_videoAnalysisId_fkey" FOREIGN KEY ("videoAnalysisId") REFERENCES "humility_db"."video_analyses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "humility_db"."bjj_copilot_messages" ADD CONSTRAINT "bjj_copilot_messages_trainingPlanId_fkey" FOREIGN KEY ("trainingPlanId") REFERENCES "humility_db"."training_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "humility_db"."bjj_copilot_tool_calls" ADD CONSTRAINT "bjj_copilot_tool_calls_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "humility_db"."bjj_copilot_messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "humility_db"."training_plans" ADD CONSTRAINT "training_plans_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "humility_db"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "humility_db"."training_plan_items" ADD CONSTRAINT "training_plan_items_planId_fkey" FOREIGN KEY ("planId") REFERENCES "humility_db"."training_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "humility_db"."training_plan_items" ADD CONSTRAINT "training_plan_items_techniqueId_fkey" FOREIGN KEY ("techniqueId") REFERENCES "humility_db"."techniques"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "humility_db"."reflections" ADD CONSTRAINT "reflections_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "humility_db"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
