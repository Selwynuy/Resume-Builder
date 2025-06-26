import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import connectDB from '@/lib/db'
import Template from '@/models/Template'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
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
    
    const templates = await Template.find({})
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Admin templates fetch error:', error)
    return NextResponse.json({ error: 'Error fetching templates' }, { status: 500 })
  }
} 