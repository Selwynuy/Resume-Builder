import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/db'
import { PersonalInfoSchema, ExperienceSchema, EducationSchema, SkillSchema, sanitizeError } from '@/lib/security'
import Resume from '@/models/Resume'

// GET - Fetch user's resumes
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const resumes = await Resume.find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .select('title personalInfo.name createdAt updatedAt isDraft')

    return NextResponse.json(resumes)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch resumes' },
      { status: 500 }
    )
  }
}

// POST - Create new resume (publish)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await req.json()
    const { personalInfo, experiences, education, skills, title, template, isDraft = false } = data

    // Validate personal info
    const personalInfoValidation = PersonalInfoSchema.safeParse(personalInfo)
    if (!personalInfoValidation.success) {
      return NextResponse.json(
        { error: 'Invalid personal information: ' + personalInfoValidation.error.errors[0].message },
        { status: 400 }
      )
    }

    // Validate experiences
    if (experiences && Array.isArray(experiences)) {
      for (const exp of experiences) {
        if (exp.company || exp.position) { // Only validate if not empty
          const expValidation = ExperienceSchema.safeParse(exp)
          if (!expValidation.success) {
            return NextResponse.json(
              { error: 'Invalid experience data: ' + expValidation.error.errors[0].message },
              { status: 400 }
            )
          }
        }
      }
    }

    // Validate education
    if (education && Array.isArray(education)) {
      for (const edu of education) {
        if (edu.school || edu.degree) { // Only validate if not empty
          const eduValidation = EducationSchema.safeParse(edu)
          if (!eduValidation.success) {
            return NextResponse.json(
              { error: 'Invalid education data: ' + eduValidation.error.errors[0].message },
              { status: 400 }
            )
          }
        }
      }
    }

    // Validate skills
    if (skills && Array.isArray(skills)) {
      for (const skill of skills) {
        if (skill.name) { // Only validate if not empty
          const skillValidation = SkillSchema.safeParse(skill)
          if (!skillValidation.success) {
            return NextResponse.json(
              { error: 'Invalid skill data: ' + skillValidation.error.errors[0].message },
              { status: 400 }
            )
          }
        }
      }
    }

    // Validate required fields for published resumes
    if (!isDraft) {
      if (!personalInfo?.name || !personalInfo?.email || !personalInfo?.phone || !personalInfo?.location) {
        return NextResponse.json(
          { error: 'Personal information (name, email, phone, location) is required for published resumes' },
          { status: 400 }
        )
      }

      // Filter and validate experiences
      const validExperiences = (experiences || []).filter((exp: any) => 
        exp.company?.trim() && exp.position?.trim() && exp.startDate?.trim() && exp.endDate?.trim() && exp.description?.trim()
      )

      // Filter and validate education
      const validEducation = (education || []).filter((edu: any) => 
        edu.school?.trim() && edu.degree?.trim() && edu.graduationDate?.trim()
      )

      // Filter and validate skills
      const validSkills = (skills || []).filter((skill: any) => 
        skill.name?.trim() && skill.level?.trim()
      )

      if (validExperiences.length === 0) {
        return NextResponse.json(
          { error: 'At least one complete work experience is required' },
          { status: 400 }
        )
      }
    }

    await connectDB()

    const resume = await Resume.create({
      userId: session.user.id,
      title: title || `${personalInfo.name}'s Resume`,
      personalInfo,
      experiences: experiences || [],
      education: education || [],
      skills: skills || [],
      template: template || '',
      isDraft
    })

    return NextResponse.json(resume, { status: 201 })
  } catch (error: any) {
    console.error('Resume creation error:', error)
    const isDevelopment = process.env.NODE_ENV === 'development'
    return NextResponse.json(
      { error: sanitizeError(error, isDevelopment) },
      { status: 500 }
    )
  }
} 