import { NextResponse } from 'next/server'

import { getCurrentUserId } from '@/auth'
import connectDB from '@/lib/db'
import Template from '@/models/Template'

// GET /api/templates/my - Fetch user's templates
export async function GET(_req: Request) {
  try {
    const userId = await getCurrentUserId()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    await connectDB()
    
    const templates = await Template.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .lean()
    
    return NextResponse.json({ templates })
    
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Error fetching templates' }, { status: 500 })
  }
} 