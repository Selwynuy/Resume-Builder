import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getCurrentSession } from '@/auth'

export const metadata: Metadata = {
  title: 'Login - Resume Builder',
  description: 'Sign in to your Resume Builder account to create and manage your resumes.',
  robots: 'noindex, nofollow', // Login page should not be indexed
}

// Server-side rendering for login - form validation and error handling
export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const session = await getCurrentSession()
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" action="/api/auth/signin" method="POST">
          <input type="hidden" name="callbackUrl" value="/dashboard" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="email"
                type="email"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Sign in
            </button>
          </div>

          <div className="text-center">
            <Link href="/signup" className="text-primary-600 hover:text-primary-500">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 