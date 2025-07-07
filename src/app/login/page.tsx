import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getCurrentSession } from '@/auth'
import LoginForm from '@/components/auth/LoginForm'

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
        <LoginForm />
      </div>
    </div>
  )
} 