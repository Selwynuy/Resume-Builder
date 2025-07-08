'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Calendar,
  User
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ConfirmModal from '@/components/ui/ConfirmModal'

interface Resume {
  _id: string;
  title: string;
  personalInfo: {
    name: string;
    summary?: string;
  };
  experiences?: { description: string }[];
  skills?: { name: string }[];
  createdAt: string;
  updatedAt: string;
  isDraft: boolean;
}

interface Template {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  downloads: number;
  isApproved: boolean;
}

interface QuickStats {
  totalResumes: number;
  draftResumes: number;
  publishedResumes: number;
  totalTemplates: number;
}

interface DashboardClientProps {
  session: any;
  resumes: Resume[];
  templates: Template[];
  quickStats: QuickStats;
}

export default function DashboardClient({ session, resumes, templates, quickStats }: DashboardClientProps) {
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
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{quickStats.totalTemplates}</p>
                    <p className="text-sm text-gray-600 mt-1">Templates</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-600" />
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
            <Link href="/templates/create">
              <Button variant="outline" className="px-6 py-3 rounded-lg flex items-center gap-2 border-2 hover:border-blue-300 transition-all duration-200">
                <FileText className="h-5 w-5" />
                Create Template
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

          {/* Recent Templates */}
          {templates.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Templates</h2>
                <Link href="/templates/my">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.slice(0, 3).map((template) => (
                  <Card key={template._id} className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={`text-xs ${template.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {template.isApproved ? "Approved" : "Pending"}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {template.downloads} downloads
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link href={`/templates/edit/${template._id}`}>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                        </Link>
                        <Link href={`/templates/${template._id}`}>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
} 