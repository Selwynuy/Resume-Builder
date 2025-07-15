import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/app/api/auth/options'
import connectDB from '@/lib/db'
import Template from '@/models/Template'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as { user: { email: string } } | null
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Simple admin check - enhance with proper role system
    const adminEmails = [
      'admin@resumebuilder.com',
      'selwyn.cybersec@gmail.com',
      session?.user?.email || '' // Temporary: allow current user for testing
    ]
    
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    await connectDB()
    
    const template = await Template.findByIdAndUpdate(
      params.id,
      { 
        isApproved: false,
        isPublic: false
      },
      { new: true }
    )

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Template rejected successfully',
      template 
    })
  } catch (error) {
    console.error('Template rejection error:', error)
    return NextResponse.json({ error: 'Error rejecting template' }, { status: 500 })
  }
} 

export async function POST(req: Request, ctx: any) {
  return PATCH(req, ctx)
} 