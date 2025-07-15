"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CSRFTokenInput } from '@/components/ui/csrf-token'
import { useMemo, useState } from 'react'

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

  // Modal state
  const [modalOpen, setModalOpen] = useState<null | { id: string, action: 'approve' | 'reject', name: string }>(null)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(false)

  // Filter templates client-side by document type (optional, or could be server-side)
  const filteredTemplates = useMemo(() => {
    if (!selectedDocumentType) return templates
    return templates.filter(t => t.supportedDocumentTypes?.includes(selectedDocumentType))
  }, [templates, selectedDocumentType])

  // Approve/Reject handler
  const handleAction = async () => {
    if (!modalOpen) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/templates/${modalOpen.id}/${modalOpen.action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (res.ok) {
        setToast({ message: `Template "${modalOpen.name}" ${modalOpen.action === 'approve' ? 'approved' : 'rejected'} successfully!`, type: 'success' })
        setModalOpen(null)
        // Optionally, refresh the page or re-fetch data
        router.refresh()
      } else {
        setToast({ message: data.error || 'Something went wrong.', type: 'error' })
      }
    } catch (e) {
      setToast({ message: 'Network error. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Toast/Modal for feedback */}
      {toast && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
          onClick={() => setToast(null)}
        >
          {toast.message}
        </div>
      )}
      {/* Modal for Approve/Reject confirmation */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              {modalOpen.action === 'approve' ? 'Approve Template' : 'Reject Template'}
            </h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to <span className={modalOpen.action === 'approve' ? 'text-green-600' : 'text-red-600'}>{modalOpen.action}</span> <b>{modalOpen.name}</b>?
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                onClick={() => setModalOpen(null)}
                disabled={loading}
              >Cancel</button>
              <button
                className={`px-4 py-2 rounded text-white ${modalOpen.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                onClick={handleAction}
                disabled={loading}
              >{loading ? 'Processing...' : (modalOpen.action === 'approve' ? 'Approve' : 'Reject')}</button>
            </div>
          </div>
        </div>
      )}
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
                          <button
                            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                            onClick={() => setModalOpen({ id: template._id, action: 'approve', name: template.name })}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                            onClick={() => setModalOpen({ id: template._id, action: 'reject', name: template.name })}
                          >
                            Reject
                          </button>
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