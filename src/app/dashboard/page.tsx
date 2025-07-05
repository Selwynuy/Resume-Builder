'use client';

import {
  FileText,
  Edit3,
  Trash2,
  Plus,
  Calendar,
  User,
  FileCheck,
  FilePlus,
  Layout,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

interface QuickStats {
  totalResumes: number;
  draftResumes: number;
  publishedResumes: number;
  totalTemplates: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [quickStats, setQuickStats] = useState<QuickStats>({
    totalResumes: 0,
    draftResumes: 0,
    publishedResumes: 0,
    totalTemplates: 0,
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/login');
    else {
      fetchResumes();
      fetchQuickStats();
    }
  }, [session, status, router]);

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resumes');
      if (response.ok) {
        const data = await response.json();
        setResumes(data);
        // Calculate stats from resumes
        const draftCount = data.filter((r: Resume) => r.isDraft).length;
        const publishedCount = data.filter((r: Resume) => !r.isDraft).length;
        setQuickStats(prev => ({
          ...prev,
          totalResumes: data.length,
          draftResumes: draftCount,
          publishedResumes: publishedCount,
        }));
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuickStats = async () => {
    try {
      const templatesResponse = await fetch('/api/templates/my');
      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json();
        setQuickStats(prev => ({
          ...prev,
          totalTemplates: templatesData.templates?.length || 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching template stats:', error);
    }
  };

  const handleDeleteClick = (resume: Resume) => {
    setResumeToDelete(resume);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!resumeToDelete) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/resumes/${resumeToDelete._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setResumes(resumes.filter(resume => resume._id !== resumeToDelete._id));
        setShowDeleteModal(false);
        setResumeToDelete(null);
      } else {
        alert('Error deleting resume');
      }
    } catch (error) {
      alert('Error deleting resume');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setResumeToDelete(null);
  };

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
    );
  }

  if (!session) {
    return null;
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
                  <Edit3 className="h-5 w-5 text-yellow-600" />
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
                  <FileCheck className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Link href="/templates/my">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{quickStats.totalTemplates}</p>
                    <p className="text-sm text-gray-600 mt-1">Templates</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Layout className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Link href="/resume/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              New Resume
            </Button>
          </Link>
          <Link href="/templates/create">
            <Button
              variant="outline"
              className="border-gray-200 hover:bg-gray-50 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] shadow-sm bg-transparent"
            >
              <FilePlus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </Link>
        </div>

        {/* My Resumes Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">My Resumes</h2>
            <p className="text-sm text-gray-600">{resumes.length} resumes</p>
          </div>

          {resumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map(resume => (
                <Card
                  key={resume._id}
                  className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate text-lg">
                            {resume.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <User className="h-3 w-3 mr-1" />
                            {resume.personalInfo.name}
                          </div>
                        </div>
                        {/* Inline action buttons */}
                        <div className="flex gap-2">
                          <Link href={`/resume/new?edit=${resume._id}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteClick(resume)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {/* Status Badge */}
                      <div>
                        <Badge
                          className={
                            resume.isDraft
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-0'
                              : 'bg-green-100 text-green-800 hover:bg-green-100 border-0'
                          }
                        >
                          {resume.isDraft ? 'Draft' : 'Complete'}
                        </Badge>
                      </div>
                      {/* Dates */}
                      <div className="space-y-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Created: {formatDate(resume.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <Edit3 className="h-3 w-3 mr-1" />
                          Updated: {formatDate(resume.updatedAt)}
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Link href={`/resume/new?edit=${resume._id}`} className="flex-1">
                          <Button
                            size="sm"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        {/* Optionally add View logic here */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State */
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="p-4 bg-blue-50 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
                  <p className="text-gray-600 mb-6">
                    Get started by creating your first resume. Choose from our professional
                    templates or start from scratch.
                  </p>
                  <Link href="/resume/new">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02]">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Resume
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full mx-4 transform transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Delete Resume</h3>
                <p className="text-slate-600 mb-2">Are you sure you want to delete</p>
                <p className="text-lg font-semibold text-slate-800 mb-6">
                  &quot;{resumeToDelete?.title}&quot;?
                </p>
                <p className="text-sm text-slate-500 mb-8">
                  This action cannot be undone. All resume data will be permanently removed.
                </p>
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
                      <span>Delete Resume</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
