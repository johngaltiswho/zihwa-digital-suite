# Accounting Engine (Phase 1)

## What is implemented

- Auth-gated app shell with active `organization` and `company` switchers.
- Onboarding + org/company creation flow.
- Settings page for org members and optional company-level role overrides.
- Accounting Context Wizard (`/companies/[companyId]/context`) with draft/activate flow.
- Company Zoho integration management (`/companies/[companyId]/integrations/zoho`).
- Copilot route with tool-based action API (`/companies/[companyId]/copilot`).
- Approval queue (`/companies/[companyId]/approvals`) and approve/post endpoint.
- Learning insights (`/companies/[companyId]/insights`).
- Tenant scoping guards on document APIs and copilot tools.

## Setup

1. Copy env:
   - `cp apps/accounting-engine/.env.example apps/accounting-engine/.env.local`
2. Fill Supabase, DB, OpenAI, Zoho, and encryption variables.
3. Generate Prisma client (from `packages/db`):
   - `npx prisma generate`
4. Apply migrations:
   - Local/dev DB: `npx prisma migrate dev`
   - Shared/prod DB: `npx prisma migrate deploy`
5. Start app:
   - `pnpm --filter accounting-engine dev`

## Notes

- Posting is blocked when company context is missing/incomplete.
- Copilot side effects are restricted to server tool handlers with RBAC checks.
- All company write actions enforce company membership and role permissions.
