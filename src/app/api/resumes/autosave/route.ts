import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/db'
import Resume from '@/models/Resume'

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const { personalInfo, experiences, education, skills, template } = data

    if (!personalInfo?.name) {
      return NextResponse.json({ success: false })
    }

    await connectDB()

    // Check if user has an existing draft
    let resume = await Resume.findOne({
      userId: session.user.id,
      title: 'Draft Resume'
    })

    if (resume) {
      // Update existing draft
      resume.personalInfo = personalInfo
      resume.experiences = experiences || []
      resume.education = education || []
      resume.skills = skills || []
      resume.template = template || 'classic'
      await resume.save()
    } else {
      // Create new draft
      resume = await Resume.create({
        userId: session.user.id,
        title: 'Draft Resume',
        personalInfo,
        experiences: experiences || [],
        education: education || [],
        skills: skills || [],
        template: template || 'classic'
      })
    }

    return NextResponse.json({ success: true, resumeId: resume._id })
  } catch (error: any) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
} 