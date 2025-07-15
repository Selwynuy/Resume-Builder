"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useToast } from '@/components/providers/ToastProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      showToast('Account created successfully! Please sign in.', 'success')
      router.push('/login')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Registration failed. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto border border-slate-200 rounded-2xl shadow-lg p-8 bg-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
        <div className="text-center text-xs text-slate-400 my-2 font-medium select-none">or</div>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-3 mt-2 bg-white hover:bg-slate-50 transition"
          disabled={isLoading}
          onClick={() => signIn('google')}
        >
          <FcGoogle className="w-5 h-5" />
          <span className="font-medium text-slate-700">Login with Google</span>
        </button>
      </form>
    </div>
  )
} 