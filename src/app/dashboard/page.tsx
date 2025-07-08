import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
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
import { requireAuth } from '@/auth'
import { cookies } from 'next/headers'
import DashboardClient from './DashboardClient'

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
      const errorText = await response.text()
    }
  } catch (error) {
  }
  return []
}

async function getTemplates(): Promise<Template[]> {
  try {
    const url = `${process.env.NEXTAUTH_URL}/api/templates/my`
    const cookieStore = cookies()
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        cookie: cookieStore.toString(),
      },
    })
    if (response.ok) {
      const data = await response.json()
      return Array.isArray(data.templates) ? data.templates : []
    } else {
      const errorText = await response.text()
    }
  } catch (error) {
  }
  return []
}

export default async function DashboardPage() {
  const session = await requireAuth()

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

  return (
    <DashboardClient 
      session={session}
      resumes={resumes}
      templates={templates}
      quickStats={quickStats}
    />
  )
}
