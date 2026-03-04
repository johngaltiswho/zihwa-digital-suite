import { NextResponse } from "next/server"

/**
 * Middleware - currently disabled pending Vendure integration
 */
export async function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
}
