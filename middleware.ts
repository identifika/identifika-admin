import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

type MyToken = {
  user?: {
    role?: string
  }
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }) as MyToken

  const isAuth = !!token
  const { pathname } = request.nextUrl

  if (!isAuth && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  if (isAuth && (pathname.startsWith('/signin') || pathname.startsWith('/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (isAuth && token.user?.role === 'user') {
    if (pathname.startsWith('/dashboard/users') || pathname.startsWith('/dashboard/reports')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
