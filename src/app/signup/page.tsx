import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getCurrentSession } from '@/auth'
import SignupForm from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Sign Up - Resume Builder',
  description: 'Create your Resume Builder account to start building professional resumes.',
  robots: 'noindex, nofollow', // Signup page should not be indexed
}

// Server-side rendering for signup - form validation and error handling
export const dynamic = 'force-dynamic'

export default async function SignupPage() {
  const session = await getCurrentSession()
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <SignupForm />
      </div>
    </div>
  )
} 