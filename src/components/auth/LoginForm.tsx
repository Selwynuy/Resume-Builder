"use client"

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

import { useToast } from '@/components/providers/ToastProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FcGoogle } from 'react-icons/fc'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        showToast('Invalid email or password. Please try again.', 'error')
      } else {
        showToast('Login successful!', 'success')
        router.push('/dashboard')
      }
    } catch (error) {
      showToast('An unexpected error occurred. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="max-w-md mx-auto border border-slate-200 rounded-2xl shadow-lg p-8 bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <div className="text-right mt-1">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          <div className="text-center text-xs text-slate-400 my-2 font-medium select-none">or</div>
        </form>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-3 mt-4 bg-white hover:bg-slate-50 transition"
          disabled={isLoading}
          onClick={() => signIn('google')}
        >
          <FcGoogle className="w-5 h-5" />
          <span className="font-medium text-slate-700">Sign in with Google</span>
        </button>
        <div className="mt-4 text-center text-sm text-slate-500">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </div>
      </div>
    </>
  )
} 