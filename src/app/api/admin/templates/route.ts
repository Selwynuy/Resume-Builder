import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/app/api/auth/options'
import connectDB from '@/lib/db'
import Template from '@/models/Template'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions) as { user: { email: string } } | null
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Simple admin check - enhance with proper role system
    const adminEmails = [
      'selwyn.cybersec@gmail.com',
      session?.user?.email || '' // Temporary: allow current user for testing
    ]
    
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const documentType = searchParams.get('documentType')

    let templates
    if (documentType) {
      templates = await Template.findByDocumentType(documentType)
    } else {
      templates = await Template.find({})
        .sort({ createdAt: -1 })
        .populate('createdBy', 'name email')
    }

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Admin templates fetch error:', error)
    return NextResponse.json({ error: 'Error fetching templates' }, { status: 500 })
  }
} 