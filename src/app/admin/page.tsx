import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getCurrentSession } from '@/auth'
import { CSRFTokenInput } from '@/components/ui/csrf-token'
import connectDB from '@/lib/db'
import Template from '@/models/Template'
import Link from 'next/link'

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
  
  if (!session?.user) {
    redirect('/login')
  }

  // Check if user is admin (you can add admin role to user model)
  // For now, we'll allow any authenticated user to access admin
  // In production, add proper role-based access control

  await connectDB()
  
  const templates = await Template.find({ isApproved: false })
    .sort({ createdAt: -1 })
    .limit(50)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Review and approve template submissions</p>
          <Link href="/admin/users" className="inline-block mt-4 text-blue-600 hover:underline font-semibold">Go to User Management</Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {templates.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {templates.map((template) => (
                <div key={template._id.toString()} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {template.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Category: {template.category}</span>
                        <span>Price: ${template.price}</span>
                        <span>By: {template.creatorName}</span>
                        <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          template.isApproved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {template.isApproved ? 'Approved' : 'Pending'}
                      </span>

                      {!template.isApproved && (
                        <div className="flex space-x-2">
                          <form action={`/api/admin/templates/${template._id}/approve`} method="POST">
                            <CSRFTokenInput />
                            <button
                              type="submit"
                              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                            >
                              Approve
                            </button>
                          </form>
                          <form action={`/api/admin/templates/${template._id}/reject`} method="POST">
                            <CSRFTokenInput />
                            <button
                              type="submit"
                              className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates to review</h3>
              <p className="text-gray-600">All templates have been processed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 