'use client'
import { Metadata } from 'next'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

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

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session?.user?.email || !isAdmin(session.user.email, session?.user?.email)) {
      router.push('/dashboard')
      return
    }

    fetchTemplates()
  }, [session, status, router])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/admin/templates/${templateId}/approve`, {
        method: 'PATCH'
      })
      if (response.ok) {
        fetchTemplates()
        alert('Template approved!')
      }
    } catch (error) {
      alert('Error approving template')
    }
  }

  const rejectTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/admin/templates/${templateId}/reject`, {
        method: 'PATCH'
      })
      if (response.ok) {
        fetchTemplates()
        alert('Template rejected!')
      }
    } catch (error) {
      alert('Error rejecting template')
    }
  }

  const filteredTemplates = templates.filter(template => {
    switch (filter) {
      case 'pending':
        return !template.isApproved
      case 'approved':
        return template.isApproved
      default:
        return true
    }
  })

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session?.user?.email || !isAdmin(session.user.email, session?.user?.email)) {
    return <div className="flex justify-center items-center min-h-screen">Access Denied</div>
  }

  return (
    <div className="min-h-screen pt-32 pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              aria-label={`Show all templates (${templates.length} total)`}
            >
              All ({templates.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
              aria-label={`Show pending templates (${templates.filter(t => !t.isApproved).length} pending)`}
            >
              Pending ({templates.filter(t => !t.isApproved).length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
              aria-label={`Show approved templates (${templates.filter(t => t.isApproved).length} approved)`}
            >
              Approved ({templates.filter(t => t.isApproved).length})
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredTemplates.map((template) => (
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
                      <button
                        onClick={() => approveTemplate(template._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectTemplate(template._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  <a
                    href={`/templates/${template._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Preview →
                  </a>
                </div>
              </div>
            </div>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No templates found for the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 