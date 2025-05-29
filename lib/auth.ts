import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { z } from 'zod'

type AppUser = {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string
}

async function loginWithExternalApi(email: string, password: string) {
  try {
    const data = new FormData()
    data.append('email', email)
    data.append('password', password)

    const baseIdentifikaUrl = process.env.IDENTIFIKA_API_URL

    const res = await fetch(`${baseIdentifikaUrl}/login`, {
      method: 'POST',
      body: data,
      mode: 'cors',
    })

    if (res.status !== 200) return null

    return res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsed.success) return null

        const user = await loginWithExternalApi(
          parsed.data.email,
          parsed.data.password
        )

        return user?.result ?? null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as AppUser
      }
      return token
    },
    async session({ session, token }) {
      session.user = token.user as AppUser
      return session
    },
  },
  pages: {
    signIn: '/signin',
    newUser: '/signup',
  },
  cookies: {
    sessionToken: {
      name: '__Secure-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
  },
}
