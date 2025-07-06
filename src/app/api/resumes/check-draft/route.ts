import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/app/api/auth/options'
import connectDB from '@/lib/db'
import Resume from '@/models/Resume'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const draft = await Resume.findOne({
      userId: session.user.id,
      isDraft: true,
      title: { $regex: /^Draft Resume/ }
    })

    return NextResponse.json({ 
      draftId: draft?._id || null 
    })
  } catch (error) {
    return NextResponse.json({ draftId: null })
  }
} 