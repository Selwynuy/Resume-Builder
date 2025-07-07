import { NextResponse } from 'next/server'

import { getCurrentUserId } from '@/auth'
import connectDB from '@/lib/db'
import Resume from '@/models/Resume'

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const { personalInfo, experiences, education, skills, template, resumeId } = data

    if (!personalInfo?.name?.trim()) {
      return NextResponse.json({ success: false, message: 'Name required for autosave' })
    }

    await connectDB()

    let resume

    if (resumeId) {
      // Update existing resume (when editing)
      resume = await Resume.findOneAndUpdate(
        { _id: resumeId, userId },
        {
          personalInfo,
          experiences: experiences || [],
          education: education || [],
          skills: skills || [],
          template: template || 'classic'
        },
        { new: true }
      )
      
      if (!resume) {
        return NextResponse.json({ success: false, error: 'Resume not found' }, { status: 404 })
      }
    } else {
      // Check for existing draft, or create new one
      resume = await Resume.findOne({
        userId,
        isDraft: true,
        title: { $regex: /^Draft Resume/ }
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
        // Create new draft only if none exists
              resume = await Resume.create({
        userId,
          title: 'Draft Resume',
          personalInfo,
          experiences: experiences || [],
          education: education || [],
          skills: skills || [],
          template: template || 'classic',
          isDraft: true
        })
      }
    }

    return NextResponse.json({ success: true, resumeId: resume._id })
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Autosave failed' }, { status: 500 })
  }
} 