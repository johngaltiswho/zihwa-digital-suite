import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'
import type { CookieOptions } from '@supabase/ssr'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  const publicKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!publicKey) {
    throw new Error('Missing Supabase public key. Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).')
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    publicKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          // In some server contexts, setting cookies may fail; middleware/route handlers
          // should still refresh session cookies where writable.
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // no-op
          }
        },
      },
    }
  )
}

async function syncUserProfile(user: User) {
  if (!user.email) {
    throw new Error('Authenticated user is missing an email address')
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email

  // Check by authId first
  const existingByAuth = await prisma.user.findUnique({
    where: { authId: user.id },
  })

  if (existingByAuth) {
    // ✅ NEVER overwrite role — only update name/email
    return prisma.user.update({
      where: { id: existingByAuth.id },
      data: { email: user.email, name: displayName },
    })
  }

  // Check by email
  const existingByEmail = await prisma.user.findUnique({
    where: { email: user.email },
  })

  if (existingByEmail) {
    // ✅ Link authId but NEVER overwrite role
    return prisma.user.update({
      where: { id: existingByEmail.id },
      data: { authId: user.id, email: user.email, name: displayName },
    })
  }

  // Brand new user — default to CONSULTANT
  return prisma.user.create({
    data: {
      authId: user.id,
      email: user.email,
      name: displayName,
      role: UserRole.CONSULTANT,
    },
  })
}

export async function getServerAuth() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, dbUser: null }
  const dbUser = await syncUserProfile(user)
  return { user, dbUser }
}

export async function getRouteAuth() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, dbUser: null }
  const dbUser = await syncUserProfile(user)
  return { user, dbUser }
}


/**
 * Returns a Prisma WHERE filter scoping data to the user's assigned companies.
 * - ADMIN/CONSULTANT → {} (no filter, sees everything)
 * - ACCOUNTANT → only their assigned companies
 * - ACCOUNTANT with no companies → sees nothing
 */
export async function getCompanyWhereFilter(
  dbUser: { id: string; role: string } | null,
  companyField = 'companyId'
): Promise<Record<string, unknown>> {
  console.log('getCompanyWhereFilter — role:', dbUser?.role, 'id:', dbUser?.id)

   if (!dbUser || (dbUser.role !== 'ACCOUNTANT' )) return {}

  const accesses = await prisma.companyAccess.findMany({
    where: { userId: dbUser.id },
    select: { companyId: true },
  })

  console.log('company_accesses found:', JSON.stringify(accesses))

  const ids = accesses.map((a) => a.companyId)

  if (ids.length === 0) return { [companyField]: { in: ['__no_access__'] } }

  return { [companyField]: { in: ids } }
}
