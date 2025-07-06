import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/app/api/auth/options'
import connectDB from '@/lib/db'
import Template from '@/models/Template'

// GET /api/templates/my - Fetch user's templates
export async function GET(_req: Request) {
  try {
    const session = await getServerSession(authOptions) as unknown as { user: { id: string } }
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    await connectDB()
    
    const templates = await Template.find({ createdBy: session.user.id })
      .sort({ createdAt: -1 })
      .lean()
    
    return NextResponse.json({ templates })
    
  } catch (error: unknown) {
    console.error('Error fetching user templates:', error)
    return NextResponse.json({ error: 'Error fetching templates' }, { status: 500 })
  }
} 