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
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null)
  const [deleting, setDeleting] = useState(false)
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

  const handleDeleteClick = (resume: Resume) => {
    setResumeToDelete(resume)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!resumeToDelete) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/resumes/${resumeToDelete._id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setResumes(resumes.filter(resume => resume._id !== resumeToDelete._id))
        setShowDeleteModal(false)
        setResumeToDelete(null)
      } else {
        alert('Error deleting resume')
      }
    } catch (error) {
      alert('Error deleting resume')
    } finally {
      setDeleting(false)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setResumeToDelete(null)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/20 text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-primary-400 animate-ping mx-auto"></div>
          </div>
          <p className="text-slate-700 mt-6 font-medium">Loading your workspace...</p>
          <p className="text-slate-500 text-sm mt-2">Preparing your dashboard experience</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Header */}
      <div className="pt-32 pb-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 mb-6">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-primary-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Welcome back, {session.user?.name?.split(' ')[0]}! 
                <span className="inline-block ml-2 animate-wave">👋</span>
              </h1>
              <p className="text-slate-600 text-xl font-medium">
                Your professional resume workspace awaits
              </p>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="max-w-7xl mx-auto mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">Quick Actions</h2>
              <p className="text-slate-600">Everything you need to build your perfect resume</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Link href="/resume/new" className="group relative bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-8 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Create Resume</h3>
                  <p className="text-slate-600 leading-relaxed">Start building your professional resume with our guided builder</p>
                </div>
              </Link>
              
              <Link href="/templates" className="group relative bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-8 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Browse Templates</h3>
                  <p className="text-slate-600 leading-relaxed">Discover premium resume templates from our marketplace</p>
                </div>
              </Link>

              <Link href="/templates/my" className="group relative bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-8 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">My Templates</h3>
                  <p className="text-slate-600 leading-relaxed">Manage and organize your custom template designs</p>
                </div>
              </Link>
              
              <Link href="/templates/create" className="group relative bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-8 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Create Template</h3>
                  <p className="text-slate-600 leading-relaxed">Design and sell custom templates to the community</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Enhanced My Resumes Section */}
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">My Resumes</h2>
                <p className="text-slate-600">
                  {resumes.length} total • {quickStats.draftResumes} in progress • {quickStats.publishedResumes} completed
                </p>
              </div>
              {resumes.length > 0 && (
                <Link href="/resume/new" className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300 shadow-lg">
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>New Resume</span>
                  </span>
                </Link>
              )}
            </div>

            {resumes.length === 0 ? (
              <div className="text-center max-w-2xl mx-auto">
                <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-3xl p-16 shadow-xl">
                  <div className="w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <svg className="w-16 h-16 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-4">Ready to get started?</h3>
                  <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                    Create your first professional resume and take the next step in your career journey. Our builder makes it easy!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/resume/new" className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Create Your First Resume</span>
                    </Link>
                    <Link href="/templates" className="bg-white/80 backdrop-blur-sm text-primary-600 border-2 border-primary-200 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>Browse Templates</span>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {resumes.map((resume) => (
                  <div key={resume._id} className="group relative bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-slate-800 truncate mb-2">{resume.title}</h3>
                          <p className="text-slate-600 font-medium">{resume.personalInfo.name}</p>
                        </div>
                        {resume.isDraft ? (
                          <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                            Draft
                          </span>
                        ) : (
                          <span className="bg-gradient-to-r from-emerald-400 to-green-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                            Complete
                          </span>
                        )}
                      </div>
                      
                      <div className="bg-slate-50/50 rounded-xl p-4 mb-6 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-medium">Created:</span>
                          <span className="text-slate-700">{new Date(resume.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-medium">Updated:</span>
                          <span className="text-slate-700">{new Date(resume.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Link
                          href={`/resume/new?edit=${resume._id}`}
                          className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 text-center shadow-lg"
                        >
                          {resume.isDraft ? 'Continue Editing' : 'Edit Resume'}
                        </Link>
                        
                        <button
                          onClick={() => handleDeleteClick(resume)}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
                          title="Delete Resume"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full mx-4 transform transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Delete Resume</h3>
              <p className="text-slate-600 mb-2">Are you sure you want to delete</p>
              <p className="text-lg font-semibold text-slate-800 mb-6">"{resumeToDelete?.title}"?</p>
              <p className="text-sm text-slate-500 mb-8">This action cannot be undone. All resume data will be permanently removed.</p>
              
              <div className="flex gap-4">
                <button
                  onClick={cancelDelete}
                  disabled={deleting}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete Resume'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 