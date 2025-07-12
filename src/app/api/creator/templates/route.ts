import { NextRequest, NextResponse } from 'next/server'
import { requireCreator } from '@/auth'
import connectDB from '@/lib/db'
import Template from '@/models/Template'

// GET /api/creator/templates
export async function GET(request: NextRequest) {
  try {
    const session = await requireCreator()
    await connectDB()
    const userEmail = session.user.email
    // Find userId
    const user = await (await import('@/models/User')).default.findOne({ email: userEmail })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const userId = user._id

    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortDir = searchParams.get('sortDir') === 'asc' ? 1 : -1
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '5')

    // Build query
    const query: any = { createdBy: userId }
    if (status) query.approvalStatus = status
    if (category) query.category = category
    if (search) query.name = { $regex: search, $options: 'i' }

    // Build sort
    const sort: any = {}
    sort[sortBy] = sortDir

    const total = await Template.countDocuments(query)
    const templates = await Template.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    return NextResponse.json({
      templates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
} 