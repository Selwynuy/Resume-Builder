"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CSRFTokenInput } from '@/components/ui/csrf-token'
import { useMemo } from 'react'

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

export default function AdminDashboardClient({ templates }: { templates: Template[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedDocumentType = searchParams?.get('documentType') ?? null

  // Filter templates client-side by document type (optional, or could be server-side)
  const filteredTemplates = useMemo(() => {
    if (!selectedDocumentType) return templates
    return templates.filter(t => t.supportedDocumentTypes?.includes(selectedDocumentType))
  }, [templates, selectedDocumentType])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Review and approve template submissions</p>
          <Link href="/admin/users" className="inline-block mt-4 text-blue-600 hover:underline font-semibold">Go to User Management</Link>
          {/* Document Type Filter UI */}
          <div className="flex flex-wrap gap-2 mt-4">
            {['resume', 'cv', 'biodata'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  const params = new URLSearchParams(window.location.search)
                  params.set('documentType', type)
                  router.push(`/admin?${params.toString()}`)
                }}
                className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors duration-150 mb-1 ${selectedDocumentType === type ?
                  (type === 'resume' ? 'bg-blue-600 text-white border-blue-600' : type === 'cv' ? 'bg-purple-600 text-white border-purple-600' : 'bg-green-600 text-white border-green-600') :
                  (type === 'resume' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' : type === 'cv' ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100')}`}
              >
                {type === 'resume' ? 'Resume' : type === 'cv' ? 'CV' : 'Biodata'}
              </button>
            ))}
            {selectedDocumentType && (
              <button
                onClick={() => {
                  const params = new URLSearchParams(window.location.search)
                  params.delete('documentType')
                  router.push(`/admin${params.toString() ? `?${params.toString()}` : ''}`)
                }}
                className="ml-0 sm:ml-2 text-gray-500 hover:text-gray-700 text-xs sm:text-sm underline mb-1"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredTemplates.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredTemplates.map((template) => (
                <div key={template._id.toString()} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {template.name}
                      </h3>
                      {/* Document Type Badges */}
                      {template.supportedDocumentTypes && template.supportedDocumentTypes.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {template.supportedDocumentTypes.map((type: string) => (
                            <span
                              key={type}
                              className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm
                                ${type === 'resume' ? 'bg-blue-100 text-blue-800' :
                                  type === 'cv' ? 'bg-purple-100 text-purple-800' :
                                  type === 'biodata' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'}`}
                            >
                              {type === 'resume' ? 'Resume' : type === 'cv' ? 'CV' : type === 'biodata' ? 'Biodata' : type}
                            </span>
                          ))}
                        </div>
                      )}
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