import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/db'
import Template from '@/models/Template'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    await connectDB()
    
    // Check if template exists and is approved
    const template = await Template.findById(params.id)
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }
    
    if (!template.isApproved) {
      return NextResponse.json({ error: 'Template not available' }, { status: 403 })
    }
    
    // Increment download count
    await Template.findByIdAndUpdate(params.id, {
      $inc: { downloads: 1 }
    })
    
    return NextResponse.json({ 
      message: 'Download tracked successfully',
      downloads: template.downloads + 1
    })
    
  } catch (error) {
    console.error('Error tracking download:', error)
    return NextResponse.json({ error: 'Error tracking download' }, { status: 500 })
  }
} 