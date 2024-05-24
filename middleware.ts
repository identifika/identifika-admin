import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const currentUser = request.cookies.get("next-auth.session-token")

    if (!currentUser) {
        if (request.nextUrl.pathname.startsWith('/dashboard')) {
            return Response.redirect(new URL('/signin', request.url))
        }
    }

    if (currentUser && request.nextUrl.pathname.startsWith('/signin')) {
        return Response.redirect(new URL('/dashboard', request.url))
    }

    if (currentUser && request.nextUrl.pathname.startsWith('/signup')) {
        return Response.redirect(new URL('/dashboard', request.url))
    }

    if(currentUser){
        var token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
        if (!token) {
            return Response.redirect(new URL('/signin', request.url))
        }
    
        var role = (token as { user: { role: string } })?.user?.role;

        if (role === 'user') {
            if(request.nextUrl.pathname.startsWith('/dashboard/users') ||request.nextUrl.pathname.startsWith('/dashboard/reports') ){
                return Response.redirect(new URL('/dashboard', request.url))
            }
        }
    }
    
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}