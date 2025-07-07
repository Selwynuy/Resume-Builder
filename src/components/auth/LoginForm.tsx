"use client"

import { useState, useRef } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { CSRFTokenInput } from '@/components/ui/csrf-token'

export default function LoginForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const email = emailRef.current?.value || ''
    const password = passwordRef.current?.value || ''
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/dashboard',
    })
    setLoading(false)
    if (res?.error) {
      setError(res.error)
    } else if (res?.ok) {
      window.location.href = '/dashboard'
    } else {
      setError('Unknown error')
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <CSRFTokenInput />
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <input
            name="email"
            type="email"
            required
            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Email address"
            ref={emailRef}
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            required
            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Password"
            ref={passwordRef}
          />
        </div>
      </div>
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
      <div className="text-center">
        <Link href="/signup" className="text-primary-600 hover:text-primary-500">
          Don&apos;t have an account? Sign up
        </Link>
      </div>
    </form>
  )
} 