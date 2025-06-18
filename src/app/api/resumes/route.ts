import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/db'
import Resume from '@/models/Resume'

// GET - Fetch user's resumes
export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const resumes = await Resume.find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .select('title personalInfo.name createdAt updatedAt')

    return NextResponse.json(resumes)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch resumes' },
      { status: 500 }
    )
  }
}

// POST - Create new resume
export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await req.json()
    const { personalInfo, experiences, education, skills, title } = data

    if (!personalInfo?.name) {
      return NextResponse.json(
        { error: 'Personal information with name is required' },
        { status: 400 }
      )
    }

    await connectDB()

    const resume = await Resume.create({
      userId: session.user.id,
      title: title || `${personalInfo.name}'s Resume`,
      personalInfo,
      experiences: experiences || [],
      education: education || [],
      skills: skills || []
    })

    return NextResponse.json(resume, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create resume' },
      { status: 500 }
    )
  }
} 