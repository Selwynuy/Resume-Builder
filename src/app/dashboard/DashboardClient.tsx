'use client'

import {
  FileText,
  Plus,
  Edit,
  Trash2,
  User
} from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ConfirmModal from '@/components/ui/ConfirmModal'

interface Resume {
  _id: string;
  title: string;
  personalInfo: {
    name: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
  };
  experiences?: {
    company?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
  education?: {
    school?: string;
    degree?: string;
    field?: string;
    graduationDate?: string;
    gpa?: string;
  }[];
  skills?: {
    name?: string;
    level?: string;
  }[];
  createdAt: string;
  updatedAt: string;
  isDraft: boolean;
}

interface QuickStats {
  totalResumes: number;
  draftResumes: number;
  publishedResumes: number;
}

interface DashboardClientProps {
  session: any;
  resumes: Resume[];
  quickStats: QuickStats;
  error?: string;
}

export default function DashboardClient({ session, resumes, quickStats, error }: DashboardClientProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [resumesState, setResumesState] = useState(resumes)

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/resumes/${deleteId}`, { method: 'DELETE' })
      if (res.ok) {
        setResumesState(prev => prev.filter(r => r._id !== deleteId))
        setToast({ message: 'Resume deleted successfully', type: 'success' })
      } else {
        const data = await res.json()
        setToast({ message: data.error || 'Failed to delete resume', type: 'error' })
      }
    } catch (e) {
      setToast({ message: 'Network error', type: 'error' })
    } finally {
      setDeleting(false)
      setDeleteId(null)
      setTimeout(() => setToast(null), 3000)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCompletionPercentage = (resume: Resume) => {
    let totalFields = 0
    let filledFields = 0

    // Personal Info (5 fields, 3 required)
    totalFields += 5
    filledFields += Object.values(resume.personalInfo).filter(Boolean).length

    // Experience
    if (resume.experiences) {
      resume.experiences.forEach(exp => {
        totalFields += 5
        filledFields += Object.values(exp).filter(Boolean).length
      })
    }

    // Education
    if (resume.education) {
      resume.education.forEach(edu => {
        totalFields += 5
        filledFields += Object.values(edu).filter(Boolean).length
      })
    }

    // Skills
    if (resume.skills) {
      resume.skills.forEach(skill => {
        totalFields += 2
        filledFields += skill.name ? 2 : 0
      })
    }

    return Math.min(Math.round((filledFields / totalFields) * 100), 100)
  }

  return (
    <>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.message}</div>
      )}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Resume?"
        message="This will permanently delete your resume. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Welcome back{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-gray-600 text-lg">Here&apos;s what&apos;s happening with your resumes today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading resumes</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{quickStats.totalResumes}</p>
                    <p className="text-sm text-gray-600 mt-1">Total Resumes</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{quickStats.draftResumes}</p>
                    <p className="text-sm text-gray-600 mt-1">Drafts</p>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Edit className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{quickStats.publishedResumes}</p>
                    <p className="text-sm text-gray-600 mt-1">Published</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link href="/resume/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="h-5 w-5" />
                Create New Resume
              </Button>
            </Link>
          </div>

          {/* Recent Resumes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Resumes</h2>
              <Link href="/resume/new">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Resume
                </Button>
              </Link>
            </div>
            
            {resumesState.length === 0 ? (
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No resumes yet</h3>
                  <p className="text-gray-600 mb-4">Create your first resume to get started</p>
                  <Link href="/resume/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Create Your First Resume
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumesState.slice(0, 6).map((resume) => (
                  <Card key={resume._id} className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {resume.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {resume.personalInfo.name}
                          </p>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={`text-xs ${resume.isDraft ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'}`}>
                              {resume.isDraft ? "Draft" : "Published"}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDate(resume.updatedAt)}
                            </span>
                          </div>
                          {/* Completion Progress */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">Completion</span>
                              <span className="text-xs font-medium text-gray-700">{getCompletionPercentage(resume)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                  getCompletionPercentage(resume) >= 80 ? 'bg-green-500' :
                                  getCompletionPercentage(resume) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${getCompletionPercentage(resume)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link href={`/resume/edit/${resume._id}`}>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteId(resume._id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>


        </main>
      </div>
    </>
  )
} 