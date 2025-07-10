import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/app/api/auth/options'

/**
 * Get the current user session on the server side
 */
export async function getCurrentSession() {
  // Check for cookies manually
  try {
    const cookieStore = await cookies()
    const nextAuthToken = cookieStore.get('next-auth.token')
    const nextAuthSessionToken = cookieStore.get('next-auth.session-token')
  } catch (error) {
  }
  
  const session = await getServerSession(authOptions)
  if (session) {
  }
  return session
}

/**
 * Get the current user ID from session
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getCurrentSession()
  const userId = session?.user?.id || null
  return userId
}

/**
 * Get the current user email from session
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  const session = await getCurrentSession()
  const email = session?.user?.email || null
  return email
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth() {
  const session = await getCurrentSession()
  if (!session?.user?.id) {
    redirect('/login')
  }
  return session
}

/**
 * Require admin access - redirects to dashboard if not admin
 */
export async function requireAdmin() {
  const session = await getCurrentSession()
  if (!session?.user?.email) {
    redirect('/login')
  }

  const adminEmails = [
    'admin@resumebuilder.com',
    'selwyn.cybersec@gmail.com'
  ]
  
  if (!adminEmails.includes(session.user.email)) {
    redirect('/dashboard')
  }
  
  return session
}

/**
 * Check if user is admin
 */
export function isAdmin(email: string): boolean {
  const adminEmails = [
    'admin@resumebuilder.com',
    'selwyn.cybersec@gmail.com'
  ]
  return adminEmails.includes(email)
}

/**
 * Optional authentication - returns session or null
 */
export async function optionalAuth() {
  const session = await getCurrentSession()
  return session
} 