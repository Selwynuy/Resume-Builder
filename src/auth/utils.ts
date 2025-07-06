import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

import { authOptions } from './config'

/**
 * Get the current user session on the server side
 */
export async function getCurrentSession() {
  return await getServerSession(authOptions)
}

/**
 * Get the current user ID from session
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getCurrentSession()
  return session?.user?.id || null
}

/**
 * Get the current user email from session
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  const session = await getCurrentSession()
  return session?.user?.email || null
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
  return await getCurrentSession()
} 