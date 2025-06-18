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
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) router.push('/login')
    else fetchResumes()
  }, [session, status, router])

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resumes')
      if (response.ok) {
        const data = await response.json()
        setResumes(data)
      }
    } catch (error) {
      console.error('Error fetching resumes:', error)
    } finally {
      setLoading(false)
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
          <p className="text-slate-600 text-lg mb-8">
            Ready to build your next amazing resume?
          </p>
          <Link href="/resume/new" className="btn-gradient text-lg">
            Create New Resume
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="glass-card p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">{resumes.length}</div>
            <div className="text-slate-600">Resumes Created</div>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-accent-600 mb-2">0</div>
            <div className="text-slate-600">Downloads</div>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-secondary-600 mb-2">4</div>
            <div className="text-slate-600">Templates Available</div>
          </div>
        </div>

        {/* Resumes Grid or Empty State */}
        {resumes.length === 0 ? (
          <div className="text-center max-w-md mx-auto">
            <div className="glass-card p-12 rounded-3xl">
              <div className="w-20 h-20 bg-gradient-to-r from-slate-300 to-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">No resumes yet</h3>
              <p className="text-slate-600 mb-6">Create your first professional resume to get started</p>
              <Link href="/resume/new" className="btn-gradient">
                Create Your First Resume
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {resumes.map((resume) => (
              <div key={resume._id} className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-800 truncate pr-2">{resume.title}</h3>
                  <button
                    onClick={() => deleteResume(resume._id)}
                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-slate-600 text-sm mb-6">
                  Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                
                <div className="space-y-3">
                  <Link
                    href={`/resume/edit/${resume._id}`}
                    className="block w-full text-center bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 rounded-xl hover:scale-105 transition-all duration-300"
                  >
                    Edit Resume
                  </Link>
                  <button 
                    onClick={() => downloadPDF(resume._id, resume.title)}
                    className="block w-full text-center bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-3 rounded-xl hover:scale-105 transition-all duration-300"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 