import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

import connectDB from '@/lib/db'
import User from '@/models/User'
import mongoose from 'mongoose'

import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

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
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
    async jwt({ token, user, account, profile }: any) {
      // If logging in (user is defined)
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      // Always ensure token.id is a MongoDB ObjectId string
      if (!token.id || !mongoose.Types.ObjectId.isValid(String(token.id))) {
        await connectDB();
        let dbUser = null;
        if (token.email) {
          dbUser = await User.findOne({ email: token.email });
        }
        if (!dbUser && user && user.email) {
          dbUser = await User.findOne({ email: user.email });
        }
        if (!dbUser && profile && profile.email) {
          dbUser = await User.findOne({ email: profile.email });
        }
        if (!dbUser && token.email) {
          // Create user if not found (for Google login)
          dbUser = await User.create({
            email: token.email,
            name: token.name || (profile && profile.name) || '',
            password: Math.random().toString(36).slice(-8),
          });
        }
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        }
      }
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('[NextAuth] token.id set to:', token.id, 'role:', token.role);
      }
      return token;
    },
    async session(params: any) {
      const { session, token } = params;
      if (!session.user) {
        session.user = {
          id: token.id as string,
          name: token.name as string | undefined,
          email: token.email as string | undefined,
          image: token.picture as string | undefined,
          role: token.role as string | undefined,
        };
      } else {
        session.user.id = token.id as string;
        session.user.role = token.role as string | undefined;
      }
      return session;
    }
  }
} 