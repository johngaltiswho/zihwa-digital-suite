import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/sign-in', '/sign-up', '/reset-password']

// Only truly restricted pages — ACCOUNTANT can visit all others (data filtered at API level)
const ROLE_PROTECTED_ROUTES: { path: string; roles: string[] }[] = [
  { path: '/dashboard/hiring', roles: ['ADMIN', 'CONSULTANT'] },
  { path: '/dashboard/users',  roles: ['ADMIN', 'CONSULTANT'] },
]
export async function middleware(request: NextRequest) {
  
  const token = request.cookies.get('sb-access-token')
  const hasValidSession = !!token
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  )

  if (!hasValidSession && !isPublic) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/sign-in'
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Allow password recovery users to stay on /sign-in to update password
  const hasRecoveryCode = request.nextUrl.searchParams.has('code') ||
                        request.nextUrl.hash.includes('type=recovery')

  if (
    hasValidSession &&
    (request.nextUrl.pathname.startsWith('/sign-in') ||
      request.nextUrl.pathname.startsWith('/sign-up')) &&
    !hasRecoveryCode
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
 const response = NextResponse.next()


  if (hasValidSession && pathname.startsWith('/dashboard')) {
    const existingRole  = request.cookies.get('x-user-role')?.value
    const existingScope = request.cookies.get('x-company-scope')?.value

    if (!existingRole || !existingScope) {
      try {
        const roleRes = await fetch(`${request.nextUrl.origin}/api/users/user`, {
          headers: { cookie: request.headers.get('cookie') ?? '' },
        })

        if (roleRes.ok) {
          const { role, companyScope } = await roleRes.json()

          if (role) {
            response.cookies.set('x-user-role', role, { path: '/' })
          }

          // companyScope: comma-separated company IDs for ACCOUNTANT, or 'ALL' for others
          if (companyScope) {
            response.cookies.set('x-company-scope', companyScope, { path: '/' })
          }
        }
      } catch (e) {
        console.error('Middleware scope fetch error:', e)
    
      }
    }

    // Role-based route protection
    const role = request.cookies.get('x-user-role')?.value
    if (role) {
      const protectedRoute = ROLE_PROTECTED_ROUTES.find((r) => pathname.startsWith(r.path))
      if (protectedRoute && !protectedRoute.roles.includes(role)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return NextResponse.next()
}
const response = NextResponse.next()

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
