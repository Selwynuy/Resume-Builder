import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/app/api/auth/options'

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
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email || !isAdmin(session.user.email, session?.user?.email)) {
    redirect('/dashboard')
  }

  const templates = await getTemplates()

  return (
    <div className="min-h-screen pt-32 pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex space-x-2">
            <span className="px-4 py-2 rounded bg-blue-600 text-white">
              All ({templates.length})
            </span>
            <span className="px-4 py-2 rounded bg-yellow-600 text-white">
              Pending ({templates.filter(t => !t.isApproved).length})
            </span>
            <span className="px-4 py-2 rounded bg-green-600 text-white">
              Approved ({templates.filter(t => t.isApproved).length})
            </span>
          </div>
        </div>

        <div className="grid gap-6">
          {templates.map((template) => (
            <div key={template._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                  <p className="text-gray-600 mb-3">{template.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Creator:</span> {template.creatorName}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>
                      <span className="ml-1 bg-gray-100 px-2 py-1 rounded text-xs capitalize">
                        {template.category}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Price:</span> 
                      <span className="ml-1 text-green-600 font-semibold">
                        {template.price === 0 ? 'Free' : `$${template.price}`}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Downloads:</span> {template.downloads}
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Created: {new Date(template.createdAt).toLocaleDateString()}
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
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                        >
                          Approve
                        </button>
                      </form>
                      <form action={`/api/admin/templates/${template._id}/reject`} method="POST">
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

        {templates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates to review</h3>
            <p className="text-gray-600">All templates have been processed.</p>
          </div>
        )}
      </div>
    </div>
  )
} 