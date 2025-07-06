import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

import connectDB from '@/lib/db'
import User from '@/models/User'

interface _UserData {
  id: string
  email: string
  name: string
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        try {
          await connectDB()
          
          const user = await User.findOne({ email: credentials.email })
          if (!user) {
            throw new Error('No user found with this email')
          }

          const isValidPassword = await user.comparePassword(credentials.password)
          if (!isValidPassword) {
            throw new Error('Invalid password')
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          }
        } catch (error: unknown) {
          throw new Error(error instanceof Error ? error.message : 'Authentication error')
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt(params: unknown) {
      const { token, user } = params as { token: any; user: any }
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session(params: unknown) {
      const { session, token } = params as { session: any; token: any }
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 