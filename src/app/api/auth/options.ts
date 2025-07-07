import CredentialsProvider from 'next-auth/providers/credentials'

import connectDB from '@/lib/db'
import User from '@/models/User'

export const authOptions = {
  debug: true, // Enable NextAuth debug mode
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
          
          const userData = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          }
          return userData
        } catch (error: unknown) {
          throw new Error(error instanceof Error ? error.message : 'Authentication error')
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt(params: unknown) {
      const { token, user } = params as { token: Record<string, unknown>; user: { id: string } | undefined }
      
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session(params: unknown) {
      const { session, token } = params as { session: { user: { id?: string; email?: string; name?: string }; expires: string }; token: { id?: string } }
      
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
} 