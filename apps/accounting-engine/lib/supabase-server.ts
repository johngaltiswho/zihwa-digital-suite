import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { CookieOptions } from '@supabase/ssr'

const COOKIE_DOMAIN =
  process.env.NODE_ENV === 'production' ? '.zihwainsights.com' : 'localhost'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                domain: COOKIE_DOMAIN,
              })
            })
          } catch {
            // no-op — middleware handles session refresh
          }
        },
      },
    }
  )
}

// ✅ ADD THIS — authz.ts needs it
export async function getServerSession() {
  const client = await createClient()
  const { data } = await client.auth.getSession()
  return { session: data.session }
}