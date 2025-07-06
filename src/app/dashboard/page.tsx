import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
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
import { authOptions } from '@/app/api/auth/options'

interface Resume {
  _id: string;
  title: string;
  personalInfo: {
    name: string;
    summary?: string;
  };
  experience?: { description: string }[];
  skills?: string[];
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

// Server-side rendering for dashboard - user-specific data
export const dynamic = 'force-dynamic'

async function getResumes(): Promise<Resume[]> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/resumes`, {
      cache: 'no-store'
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Error fetching resumes:', error)
  }
  return []
}

async function getTemplates(): Promise<Template[]> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/templates/my`, {
      cache: 'no-store'
    })
    if (response.ok) {
      const data = await response.json()
      return data.templates || []
    }
  } catch (error) {
    console.error('Error fetching templates:', error)
  }
  return []
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const [resumes, templates] = await Promise.all([
    getResumes(),
    getTemplates()
  ])

  // Calculate stats
  const draftCount = resumes.filter((r: Resume) => r.isDraft).length
  const publishedCount = resumes.filter((r: Resume) => !r.isDraft).length
  const quickStats: QuickStats = {
    totalResumes: resumes.length,
    draftResumes: draftCount,
    publishedResumes: publishedCount,
    totalTemplates: templates.length,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
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
                  <FileText className="h-5 w-5 text-green-600" />
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
                  <User className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/resume/new">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <Plus className="w-5 h-5 mr-2" />
                Create New Resume
              </Button>
            </Link>
            <Link href="/templates/create">
              <Button variant="outline" className="px-6 py-3 rounded-xl font-medium transition-all duration-300 border-2 hover:border-primary-500 hover:text-primary-600">
                <Edit className="w-5 h-5 mr-2" />
                Create Template
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" className="px-6 py-3 rounded-xl font-medium transition-all duration-300 border-2 hover:border-primary-500 hover:text-primary-600">
                <FileText className="w-5 h-5 mr-2" />
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Resumes */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Resumes</h2>
            <Link href="/resume/new">
              <Button variant="outline" size="sm" className="text-primary-600 border-primary-200 hover:bg-primary-50">
                <Plus className="w-4 h-4 mr-1" />
                New Resume
              </Button>
            </Link>
          </div>
          
          {resumes.length === 0 ? (
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
                <p className="text-gray-600 mb-4">Create your first professional resume to get started</p>
                <Link href="/resume/new">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    Create Your First Resume
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resumes.slice(0, 6).map((resume) => (
                <Card key={resume._id} className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {resume.title || resume.personalInfo.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {resume.personalInfo.summary ? 
                            resume.personalInfo.summary.substring(0, 60) + '...' : 
                            'No summary available'
                          }
                        </p>
                      </div>
                      <Badge className={`ml-2 ${resume.isDraft ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {resume.isDraft ? 'Draft' : 'Published'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(resume.updatedAt)}
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {resume.experience?.length || 0} experiences
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/resume/edit/${resume._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
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
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Templates</h2>
              <Link href="/templates/my">
                <Button variant="outline" size="sm" className="text-primary-600 border-primary-200 hover:bg-primary-50">
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.slice(0, 3).map((template) => (
                <Card key={template._id} className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {template.description.substring(0, 60) + '...'}
                        </p>
                      </div>
                      <Badge className={`ml-2 ${template.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {template.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(template.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {template.downloads} downloads
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/templates/edit/${template._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/templates/${template._id}`}>
                        <Button variant="outline" size="sm">
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
  )
}
