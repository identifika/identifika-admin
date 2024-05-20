import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const currentUser = request.cookies.get("next-auth.session-token")

    if (!currentUser) {
        if (request.nextUrl.pathname.startsWith('/dashboard')) {
            return Response.redirect(new URL('/signin', request.url))
        }
    }

    if (currentUser && request.nextUrl.pathname.startsWith('/signin')) {
        return Response.redirect(new URL('/dashboard', request.url))
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}