import { NextRequest, NextResponse } from 'next/server'
import { requireCreator } from '@/auth'
import connectDB from '@/lib/db'
import Template from '@/models/Template'

export async function POST(request: NextRequest) {
  try {
    const session = await requireCreator()
    await connectDB()
    const userEmail = session.user.email
    const user = await (await import('@/models/User')).default.findOne({ email: userEmail })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const userId = user._id
    const { templateId } = await request.json()
    const orig = await Template.findOne({ _id: templateId, createdBy: userId })
    if (!orig) return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    const copy = new Template({
      ...orig.toObject(),
      _id: undefined,
      name: orig.name + ' (Copy)',
      approvalStatus: 'pending',
      rejectionReason: undefined,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      downloads: 0,
      rating: 0,
    })
    await copy.save()
    return NextResponse.json({ template: copy })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to duplicate template' }, { status: 500 })
  }
} 