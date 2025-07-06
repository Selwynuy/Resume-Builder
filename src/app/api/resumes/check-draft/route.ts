import { NextResponse } from 'next/server'

import { getCurrentUserId } from '@/auth'
import connectDB from '@/lib/db'
import Resume from '@/models/Resume'

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const draft = await Resume.findOne({
      userId,
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