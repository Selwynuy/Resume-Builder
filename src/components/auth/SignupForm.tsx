"use client"

import { useState, useRef } from 'react'
import Link from 'next/link'
import { CSRFTokenInput } from '@/components/ui/csrf-token'

export default function SignupForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const formData = {
      name: nameRef.current?.value || '',
      email: emailRef.current?.value || '',
      password: passwordRef.current?.value || ''
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed')
      } else {
        setSuccess(true)
        // Redirect to login after successful registration
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mt-8 space-y-6">
        <div className="text-center">
          <div className="text-green-600 text-lg font-medium mb-2">
            Registration successful!
          </div>
          <div className="text-gray-600">
            Redirecting to login page...
          </div>
        </div>
      </div>
    )
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <CSRFTokenInput />
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <input
            name="name"
            type="text"
            required
            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Full name"
            ref={nameRef}
          />
        </div>
        <div>
          <input
            name="email"
            type="email"
            required
            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </div>

      <div className="text-center">
        <Link href="/login" className="text-primary-600 hover:text-primary-500">
          Already have an account? Sign in
        </Link>
      </div>
    </form>
  )
} 