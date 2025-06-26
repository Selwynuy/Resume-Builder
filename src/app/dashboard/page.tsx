'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Resume {
  _id: string
  title: string
  personalInfo: {
    name: string
  }
  createdAt: string
  updatedAt: string
  isDraft: boolean
}

interface QuickStats {
  totalResumes: number
  draftResumes: number
  publishedResumes: number
  totalTemplates: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [quickStats, setQuickStats] = useState<QuickStats>({
    totalResumes: 0,
    draftResumes: 0,
    publishedResumes: 0,
    totalTemplates: 0
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session) router.push('/login')
    else {
      fetchResumes()
      fetchQuickStats()
    }
  }, [session, status, router])

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resumes')
      if (response.ok) {
        const data = await response.json()
        setResumes(data)
        
        // Calculate stats from resumes
        const draftCount = data.filter((r: Resume) => r.isDraft).length
        const publishedCount = data.filter((r: Resume) => !r.isDraft).length
        
        setQuickStats(prev => ({
          ...prev,
          totalResumes: data.length,
          draftResumes: draftCount,
          publishedResumes: publishedCount
        }))
      }
    } catch (error) {
      console.error('Error fetching resumes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchQuickStats = async () => {
    try {
      const templatesResponse = await fetch('/api/templates/my')
      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json()
        setQuickStats(prev => ({
          ...prev,
          totalTemplates: templatesData.templates?.length || 0
        }))
      }
    } catch (error) {
      console.error('Error fetching template stats:', error)
    }
  }

  const deleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setResumes(resumes.filter(resume => resume._id !== id))
      } else {
        alert('Error deleting resume')
      }
    } catch (error) {
      alert('Error deleting resume')
    }
  }



  const downloadPDF = async (resumeId: string, title: string) => {
    try {
      const response = await fetch(`/api/resumes/${resumeId}/export`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${title}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      } else {
        alert('Error downloading PDF')
      }
    } catch (error) {
      alert('Error downloading PDF')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-24">
        <div className="glass-card p-8 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen pt-28 pb-12">
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Welcome back, {session.user?.name}! 👋
          </h1>
          <p className="text-slate-600 text-lg">
            Manage your resumes and explore professional templates
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto">
          <div className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-primary-600 mb-2">{quickStats.totalResumes}</div>
            <div className="text-slate-600">Total Resumes</div>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{quickStats.draftResumes}</div>
            <div className="text-slate-600">Draft Resumes</div>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-green-600 mb-2">{quickStats.publishedResumes}</div>
            <div className="text-slate-600">Published Resumes</div>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-purple-600 mb-2">{quickStats.totalTemplates}</div>
            <div className="text-slate-600">Your Templates</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/resume/new" className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Create Resume</h3>
              <p className="text-slate-600 text-sm">Start building your professional resume</p>
            </Link>
            
            <Link href="/templates" className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Template Marketplace</h3>
              <p className="text-slate-600 text-sm">Discover premium resume templates</p>
            </Link>

            <Link href="/templates/my" className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">My Templates</h3>
              <p className="text-slate-600 text-sm">Manage your created templates</p>
            </Link>
            
            <Link href="/templates/create" className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Create Template</h3>
              <p className="text-slate-600 text-sm">Design and sell custom templates</p>
            </Link>
          </div>
        </div>

        {/* My Resumes Section */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800">My Resumes</h2>
            <div className="flex items-center space-x-4">
              <span className="text-slate-600 text-sm">
                {resumes.length} total • {quickStats.draftResumes} drafts • {quickStats.publishedResumes} published
              </span>
            </div>
          </div>

        {resumes.length === 0 ? (
            <div className="text-center max-w-lg mx-auto">
            <div className="glass-card p-12 rounded-3xl">
              <div className="w-20 h-20 bg-gradient-to-r from-slate-300 to-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">No resumes yet</h3>
              <p className="text-slate-600 mb-6">Create your first professional resume to get started</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/resume/new" className="btn-gradient">
                Create Your First Resume
              </Link>
                  <Link href="/templates" className="bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-xl font-medium hover:bg-primary-50 transition-colors">
                    Browse Templates
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <div key={resume._id} className="glass-card p-6 rounded-2xl border hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-800 truncate mb-1">{resume.title}</h3>
                      <p className="text-slate-600 text-sm">{resume.personalInfo.name}</p>
          </div>
                    {resume.isDraft ? (
                      <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                        Draft
                      </span>
                    ) : (
                      <span className="bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                        Published
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-slate-500 mb-4 space-y-1">
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Updated:</span>
                      <span>{new Date(resume.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/resume/new?edit=${resume._id}`}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-all duration-300 text-center"
                    >
                      {resume.isDraft ? 'Continue' : 'Edit'}
                    </Link>
                    
                    {!resume.isDraft && (
                      <button
                        onClick={() => downloadPDF(resume._id, resume.title)}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-all duration-300"
                        title="Download PDF"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    )}
                    
                  <button
                    onClick={() => deleteResume(resume._id)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-all duration-300"
                      title="Delete Resume"
                  >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  )
} 