import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from 'zod';
import { prisma } from '@/server';
import bcrypt from 'bcryptjs';

async function loginWithExternalApi(email: string, password: string) {
  try {
    var data = new FormData();
    data.append('email', email);
    data.append('password', password);

    var user = await fetch('http://127.0.0.1:8000/login', {
      method: 'POST',
      body: data,
      mode: 'cors'
    });


    if (user.status !== 200) {
      return null;
    }

    return user.json();

  } catch (error) {
    console.error(error);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  // Secret for Next-auth, without this JWT encryption/decryption won't work
  secret: process.env.NEXTAUTH_SECRET,

  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {

          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

          if (!parsedCredentials.success) {
            return null;
          }

          const user = await loginWithExternalApi(parsedCredentials.data.email, parsedCredentials.data.password);

          if (!user) {
            return null;
          }

          return user.result;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    },)
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user as { name?: string | null | undefined; email?: string | null | undefined; image?: string | null | undefined; } | undefined;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as { name?: string | null | undefined; email?: string | null | undefined; image?: string | null | undefined; } | undefined;
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    newUser: '/signup',
  },
}
