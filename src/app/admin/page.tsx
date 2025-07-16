import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getCurrentSession, getCurrentUserRole } from '@/auth'
import { CSRFTokenInput } from '@/components/ui/csrf-token'
import connectDB from '@/lib/db'
import Template from '@/models/Template'
import Link from 'next/link'
import AdminDashboardClient from './AdminDashboardClient'

interface Template {
  _id: string
  name: string
  description: string
  category: string
  price: number
  createdBy: string
  creatorName: string
  isApproved: boolean
  isPublic: boolean
  downloads: number
  rating: number
  createdAt: string
  supportedDocumentTypes: string[]
}

const isAdmin = (email: string, sessionEmail: string) => {
  const adminEmails = [
    'admin@resumebuilder.com',
    'selwyn.cybersec@gmail.com',
    sessionEmail || ''
  ]
  return adminEmails.includes(email)
}

export const metadata: Metadata = {
  title: 'Admin Dashboard - Resume Builder',
  description: 'Admin dashboard for managing templates and user content.',
  robots: 'noindex, nofollow', // Admin pages should not be indexed
}

// Server-side rendering for admin - dynamic data and real-time updates
export const dynamic = 'force-dynamic'

async function getTemplates(): Promise<Template[]> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/templates`, {
      cache: 'no-store'
    })
    if (response.ok) {
      const data = await response.json()
      return data.templates || []
    }
  } catch (error) {
    console.error('Error fetching templates:', error)
  }
  return []
}

export default async function AdminPage() {
  const session = await getCurrentSession()
  const role = await getCurrentUserRole()
  if (!session?.user) {
    redirect('/login')
  }
  if (role !== 'admin') {
    redirect('/dashboard')
  }

  await connectDB()
  const templates = await Template.find({ isApproved: false })
    .sort({ createdAt: -1 })
    .limit(50)

  return (
    <AdminDashboardClient templates={JSON.parse(JSON.stringify(templates))} />
  )
} 