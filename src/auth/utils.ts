import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/app/api/auth/options'
import connectDB from '@/lib/db'
import User from '@/models/User'

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
 * Get the current user's role from database
 */
export async function getCurrentUserRole(): Promise<string | null> {
  const userId = await getCurrentUserId()
  if (!userId) return null
  
  try {
    await connectDB()
    const user = await User.findById(userId).select('role')
    return user?.role || 'user'
  } catch (error) {
    console.error('Error fetching user role:', error)
    return 'user' // Default to user role on error
  }
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
export function isAdmin(role: string | undefined): boolean {
  return role === 'admin'
}

/**
 * Optional authentication - returns session or null
 */
export async function optionalAuth() {
  const session = await getCurrentSession()
  return session
}

/**
 * Require creator access - redirects to dashboard if not creator
 */
export async function requireCreator() {
  const session = await getCurrentSession()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const userRole = await getCurrentUserRole()
  if (userRole !== 'creator' && userRole !== 'admin') {
    redirect('/dashboard')
  }
  
  return session
}

/**
 * Check if user is creator (async version for role-based checking)
 */
export async function isCreatorAsync(): Promise<boolean> {
  const userRole = await getCurrentUserRole()
  return userRole === 'creator' || userRole === 'admin'
}

/**
 * Check if user is creator (legacy email-based version - deprecated)
 */
export function isCreator(role: string | undefined): boolean {
  return role === 'creator' || role === 'admin'
} 