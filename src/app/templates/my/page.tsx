'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, useEffect, useCallback } from 'react'

interface UserTemplate {
  _id: string
  name: string
  description: string
  category: string
  price: number
  downloads: number
  rating: number
  ratingCount: number
  isApproved: boolean
  isPublic: boolean
  createdAt: string
}

export default function MyTemplatesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [templates, setTemplates] = useState<UserTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTemplates: 0,
    totalDownloads: 0,
    averageRating: 0,
    totalEarnings: 0
  })

  const fetchMyTemplates = useCallback(async () => {
    try {
      const response = await fetch('/api/templates/my')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
        setStats(calculateStats(data.templates || []))
      } else {
        console.error('Failed to fetch templates')
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    fetchMyTemplates()
  }, [session, status, router, fetchMyTemplates])

  const calculateStats = (templateList: UserTemplate[]) => {
    const totalTemplates = templateList.length
    const totalDownloads = templateList.reduce((sum, t) => sum + t.downloads, 0)
    const totalRating = templateList.reduce((sum, t) => sum + (t.rating * t.ratingCount), 0)
    const totalRatingCount = templateList.reduce((sum, t) => sum + t.ratingCount, 0)
    const averageRating = totalRatingCount > 0 ? totalRating / totalRatingCount : 0
    const totalEarnings = templateList.reduce((sum, t) => sum + (t.price * t.downloads), 0)

    return {
      totalTemplates,
      totalDownloads,
      averageRating,
      totalEarnings
    }
  }

  const deleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return
    
    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setTemplates(prev => prev.filter(t => t._id !== templateId))
        alert('Template deleted successfully!')
      } else {
        alert('Error deleting template')
      }
    } catch (error) {
      alert('Error deleting template')
    }
  }

  const getStatusBadge = (template: UserTemplate) => {
    if (!template.isPublic) {
      return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Draft</span>
    }
    if (!template.isApproved) {
      return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Pending Approval</span>
    }
    return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Published</span>
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-12 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">My Templates</h1>
              <p className="text-slate-600">Manage and track your template creations</p>
            </div>
            
            <Link
              href="/templates/create"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 font-semibold shadow-lg"
            >
              ➕ Create New Template
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="text-3xl font-bold text-blue-600">{stats.totalTemplates}</div>
              <div className="text-gray-600">Total Templates</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="text-3xl font-bold text-green-600">{stats.totalDownloads}</div>
              <div className="text-gray-600">Total Downloads</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="text-3xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}⭐</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="text-3xl font-bold text-purple-600">${stats.totalEarnings.toFixed(2)}</div>
              <div className="text-gray-600">Total Earnings</div>
            </div>
          </div>

          {/* Templates List */}
          {templates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">No templates yet</h3>
              <p className="text-gray-500 mb-6">Start creating your first template to share with the community!</p>
              <Link
                href="/templates/create"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Template
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Your Templates ({templates.length})</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {templates.map((template) => (
                      <tr key={template._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{template.name}</div>
                            <div className="text-sm text-gray-500 capitalize">{template.category}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(template)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {template.price === 0 ? 'Free' : `$${template.price}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {template.downloads}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {template.ratingCount > 0 ? (
                            <>⭐ {template.rating.toFixed(1)} ({template.ratingCount})</>
                          ) : (
                            'No ratings'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(template.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Link
                            href={`/templates/edit/${template._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteTemplate(template._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/templates/create"
              className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="font-semibold mb-1">Create New Template</h3>
              <p className="text-gray-600 text-sm">Design and share your own resume template</p>
            </Link>
            
            <Link
              href="/templates"
              className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-2">🏪</div>
              <h3 className="font-semibold mb-1">Browse Marketplace</h3>
              <p className="text-gray-600 text-sm">Discover templates from other creators</p>
            </Link>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Analytics</h3>
              <p className="text-gray-600 text-sm">Coming soon: Detailed insights and analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 