'use client'

import { useEffect, useState } from 'react'

interface CSRFTokenInputProps {
  name?: string
  className?: string
}

export function CSRFTokenInput({ name = 'csrfToken', className }: CSRFTokenInputProps) {
  const [token, setToken] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/csrf')
        if (response.ok) {
          const data = await response.json()
          setToken(data.token)
        } else {
          console.error('Failed to fetch CSRF token')
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchToken()
  }, [])

  if (loading) {
    return null // Don't render anything while loading
  }

  if (!token) {
    return null // Don't render if no token
  }

  return (
    <input
      type="hidden"
      name={name}
      value={token}
      className={className}
    />
  )
} 