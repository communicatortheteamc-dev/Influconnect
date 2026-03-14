import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page
  if (pathname.startsWith("/crm/login")) {
    return NextResponse.next()
  }

  // Protect CRM routes
  if (pathname.startsWith("/crm")) {
    const token = request.cookies.get("crm_token")

    // If no cookie → redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/crm/login", request.url))
    }

    // If cookie exists → allow
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/crm/:path*"],
}