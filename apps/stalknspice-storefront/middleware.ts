import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedPaths = ['/account', '/checkout'];

// Routes that should redirect authenticated users (login, register)
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the user has a Vendure session cookie
  // Vendure uses a cookie for session management
  const hasSession = request.cookies.has('vendure-auth-token') ||
                     request.cookies.has('session');

  // Check if trying to access protected route
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // Check if trying to access auth routes (login/register)
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  // Redirect to login if accessing protected route without session
  if (isProtectedPath && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to account page if accessing auth routes with active session
  if (isAuthPath && hasSession) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*$).*)',
  ],
};
