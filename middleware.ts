import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token (if available)
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const isAuth = !!token
  const role = (token as any)?.user?.role

  // Redirect unauthenticated users from /dashboard
  if (!isAuth && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // Redirect authenticated users away from /signin or /signup
  if (isAuth && (pathname.startsWith('/signin') || pathname.startsWith('/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Optional: role-based protection
  if (isAuth && role === 'user') {
    if (
      pathname.startsWith('/dashboard/users') ||
      pathname.startsWith('/dashboard/reports')
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Allow request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
