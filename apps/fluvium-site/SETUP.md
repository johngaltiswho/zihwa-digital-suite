# Humility DB Setup Guide

## ✅ What's Been Built (Phase 1 Complete)

### 1. Database Foundation
- ✅ Complete `humility_db` Prisma schema with 13 models
- ✅ Database migrations run successfully
- ✅ 8 DB function files with full CRUD operations
- ✅ Technique library seeded with 16 BJJ techniques

### 2. Vendure Integration (Safe - No DB Modifications)
- ✅ Vendure auth files copied (client, auth-context, mutations, queries, types)
- ✅ fluvium-site wrapped with AuthProvider
- ✅ Student sync utility (links Vendure customers → humility_db Students)
- ✅ Subscription checking utility with tier-based limits

### 3. Video Upload System
- ✅ Supabase client with upload helpers
- ✅ Video upload API route (`/api/videos/upload`)
  - Auth check (Vendure customer)
  - Subscription tier check
  - Upload limit enforcement (FREE: 1/month, BASIC: 3/month, PREMIUM: unlimited)
  - File validation (100MB max, mp4/mov/avi)
- ✅ Video status API route (`/api/videos/[id]/status`)

---

## 📋 Required Setup Steps

### 1. Install Dependencies

```bash
# From the monorepo root
pnpm install

# This will install all dependencies including:
# - @supabase/supabase-js (video storage)
# - graphql-request (Vendure API client)
# - graphql (peer dependency)
# - @repo/db (workspace package - database functions)
```

### 2. Create Supabase Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create new bucket: **`humility-db-videos`**
3. Set policies:
   - **Public read**: Allowed
   - **Authenticated write**: Allowed (students upload their own videos)

### 3. Environment Variables

Create `/apps/fluvium-site/.env.local`:

```env
# Vendure Shop API
NEXT_PUBLIC_VENDURE_API_URL=http://localhost:3100/shop-api
NEXT_PUBLIC_VENDURE_CHANNEL_TOKEN=fluvium

# Supabase (use same credentials as vendure-backend)
NEXT_PUBLIC_SUPABASE_URL=https://fbflxwzygztakprsrmpc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# OpenAI (for video analysis - Phase 2)
OPENAI_API_KEY=<your-openai-api-key>
```

### 4. Verify Vendure Channel

Ensure the **"fluvium" channel** exists in Vendure Admin:
- URL: http://localhost:3100/dashboard
- Settings → Channels → Verify "fluvium" channel with token `fluvium`

---

## 🧪 Testing the Setup

### Test 1: Authentication

```bash
# Start fluvium-site
cd apps/fluvium-site
pnpm dev

# Visit http://localhost:3006
# Try logging in with a Vendure customer account
```

**Expected:** User can log in, Student record auto-created in humility_db

### Test 2: Video Upload

```bash
# Use a tool like Postman or curl
curl -X POST http://localhost:3006/api/videos/upload \
  -F "video=@test-video.mp4" \
  -H "Cookie: vendure-session-token=<your-token>"
```

**Expected:** Video uploaded to Supabase, VideoUpload record created

### Test 3: Video Status

```bash
curl http://localhost:3006/api/videos/[video-id]/status \
  -H "Cookie: vendure-session-token=<your-token>"
```

**Expected:** Returns video status and processing info

---

## 🔧 Architecture Overview

```
┌─────────────────┐
│  Fluvium Site   │
│  (Next.js 15)   │
└────────┬────────┘
         │
         ├─────────────► Vendure Shop API (port 3100)
         │               └─ Authentication only
         │               └─ No DB modifications
         │
         ├─────────────► Supabase Storage
         │               └─ humility-db-videos bucket
         │               └─ Video files + frames
         │
         └─────────────► PostgreSQL (humility_db schema)
                         ├─ Student (linked to Vendure customer)
                         ├─ Subscription (tier tracking)
                         ├─ VideoUpload (video metadata)
                         ├─ VideoAnalysis (AI results)
                         ├─ Technique (BJJ library)
                         ├─ TechniqueProgress (tracking)
                         ├─ BJJCopilotThread (AI chat)
                         └─ TrainingPlan (personalized)
```

---

## 🎯 Next Steps (Phase 2: Video Analysis)

### What's Needed:

1. **Frame Extraction**
   - Install FFmpeg or use `@ffmpeg/ffmpeg` (WASM)
   - Extract frames at intervals (e.g., every 5 seconds)
   - Upload frames to Supabase

2. **OpenAI Vision API Integration**
   - Analyze each frame for technique form & positioning
   - Generate scores (1-100) and feedback
   - Save VideoAnalysis records

3. **Async Processing**
   - Simple approach: `setTimeout` after upload
   - Better approach: BullMQ with Redis queue
   - Update VideoUpload status: UPLOADED → PROCESSING → COMPLETED

### Implementation Files Needed:

```
/apps/fluvium-site/src/lib/video/
  ├─ frame-extractor.ts    (FFmpeg frame extraction)
  ├─ analyzer.ts           (OpenAI Vision API)
  └─ processor.ts          (Orchestrate: extract → analyze → save)

/apps/fluvium-site/src/app/api/videos/
  └─ process/route.ts      (Trigger processing job)
```

---

## 🎯 Next Steps (Phase 3: BJJ Copilot)

### What's Needed:

1. **Tool Implementations**
   - `analyze_video` - Get aggregated video scores
   - `create_training_plan` - AI-generated curriculum
   - `track_progress` - Log practice
   - `suggest_next_technique` - Recommendations

2. **OpenAI Chat Integration**
   - Conversational AI with BJJ expertise
   - Function calling for tools
   - Student context (belt rank, progress)

### Implementation Files Needed:

```
/apps/fluvium-site/src/lib/copilot/
  ├─ action-dispatcher.ts  (Route tool calls)
  ├─ tool-impl.ts          (Tool functions)
  └─ openai-client.ts      (Chat completions)

/apps/fluvium-site/src/app/api/copilot/
  └─ actions/route.ts      (Main copilot endpoint)
```

---

## 📊 Subscription Tiers & Limits

| Feature | FREE | BASIC | PREMIUM |
|---------|------|-------|---------|
| Technique Library | ✅ | ✅ | ✅ |
| Reflections | ✅ | ✅ | ✅ |
| Video Uploads | 1/month | 3/month | Unlimited |
| Video Analysis | ❌ | ✅ | ✅ |
| Copilot Messages | 5/day | Unlimited | Unlimited |
| Training Plans | ❌ | ❌ | ✅ |
| Progress Tracking | ❌ | ✅ | ✅ |

---

## 🔒 Security Notes

- ✅ All API routes check Vendure authentication
- ✅ Students can only access their own videos
- ✅ Subscription tier enforced before premium features
- ✅ Upload limits prevent abuse
- ✅ File validation (size, type) before upload
- ✅ No modifications to Vendure database (safe for stalknspice)

---

## 🚀 Deployment Checklist

- [ ] Install dependencies
- [ ] Create Supabase bucket
- [ ] Set environment variables
- [ ] Verify Vendure channel
- [ ] Test authentication flow
- [ ] Test video upload
- [ ] Deploy to production

---

## 📝 Notes

- **Vendure Safety**: No custom fields added to Vendure (can be added later)
- **Channel Isolation**: fluvium channel completely separate from stalknspice
- **Data Ownership**: All Humility DB data in separate schema
- **Scalability**: Ready to add Vendure products when needed

