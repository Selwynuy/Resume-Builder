

import { cookies } from 'next/headers'
import React from 'react'

import { requireAuth } from '@/auth'

import DashboardClient from './DashboardClient'

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

// Server-side rendering for dashboard - user-specific data
export const dynamic = 'force-dynamic'

async function getResumes(): Promise<Resume[]> {
  try {
    const url = `${process.env.NEXTAUTH_URL}/api/resumes`
    const cookieStore = cookies()
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        cookie: cookieStore.toString(),
      },
    })
    if (response.ok) {
      const data = await response.json()
      return Array.isArray(data) ? data : []
    } else {
      console.error('Failed to fetch resumes:', response.status, response.statusText)
      throw new Error(`Failed to fetch resumes: ${response.status}`)
    }
  } catch (error) {
    console.error('Error fetching resumes:', error)
    throw error
  }
}



export default async function DashboardPage() {
  const session = await requireAuth()

  try {
    const resumes = await getResumes()

    // Calculate stats
    const draftCount = resumes.filter((r: Resume) => r.isDraft).length
    const publishedCount = resumes.filter((r: Resume) => !r.isDraft).length
    const quickStats: QuickStats = {
      totalResumes: resumes.length,
      draftResumes: draftCount,
      publishedResumes: publishedCount,
    }

    return (
      <DashboardClient 
        session={session}
        resumes={resumes}
        quickStats={quickStats}
      />
    )
  } catch (error) {
    // Return error state to client component
    return (
      <DashboardClient 
        session={session}
        resumes={[]}
        quickStats={{
          totalResumes: 0,
          draftResumes: 0,
          publishedResumes: 0,
        }}
        error={error instanceof Error ? error.message : 'Failed to load resumes'}
      />
    )
  }
}
