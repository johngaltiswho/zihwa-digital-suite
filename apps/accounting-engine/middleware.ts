import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const COOKIE_DOMAIN =
  process.env.NODE_ENV === 'production' ? '.zihwainsights.com' : 'localhost'

export async function middleware(request: NextRequest) {

  const hrUrl = process.env.NEXT_PUBLIC_HR_URL ?? 'http://localhost:3007'
  const LOGIN_URL = `${hrUrl}/sign-in`

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              domain: COOKIE_DOMAIN,
            })
          )
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()


  if (!session) {
    const loginUrl = new URL(LOGIN_URL)
    loginUrl.searchParams.set('redirectedFrom', 'ledger')
    console.log('↩️ Redirecting to:', loginUrl.toString())
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}