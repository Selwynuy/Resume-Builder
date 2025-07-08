import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { cookies } from 'next/headers'

import { authOptions } from '@/app/api/auth/options'
import DeleteTemplateButton from '@/components/templates/DeleteTemplateButton'

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

// Server-side rendering for user templates - dynamic data with user-specific content
export const dynamic = 'force-dynamic'

async function getMyTemplates(): Promise<UserTemplate[]> {
  try {
    const cookieStore = cookies()
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/templates/my`, {
      cache: 'no-store',
      headers: {
        cookie: cookieStore.toString(),
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data.templates || []
    }
  } catch (error) {
    // All console.error statements removed for production
  }
  return []
}

function calculateStats(templateList: UserTemplate[]) {
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

function getStatusBadge(template: UserTemplate) {
  if (!template.isPublic) {
    return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Draft</span>
  }
  if (!template.isApproved) {
    return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Pending Approval</span>
  }
  return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Published</span>
}

export default async function MyTemplatesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const templates = await getMyTemplates()
  const stats = calculateStats(templates)

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
                          ⭐ {template.rating.toFixed(1)} ({template.ratingCount})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(template.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/templates/${template._id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </Link>
                            <Link
                              href={`/templates/edit/${template._id}`}
                              className="text-green-600 hover:text-green-900"
                            >
                              Edit
                            </Link>
                            <DeleteTemplateButton 
                              templateId={template._id} 
                              templateName={template.name}
                              onDelete={() => {
                                // Refresh the page after deletion
                                window.location.reload()
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 