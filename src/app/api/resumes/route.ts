import { NextResponse } from 'next/server'

import { getCurrentUserId } from '@/auth'
import connectDB from '@/lib/db'
import { validateResumeRequest } from '@/middleware/input-validation'
import Resume from '@/models/Resume'

// GET - Fetch user's resumes
export async function GET() {
  console.log('🔍 [RESUMES API] GET request received')
  
  try {
    const userId = await getCurrentUserId()
    console.log('🔍 [RESUMES API] User ID from session:', userId)
    
    if (!userId) {
      console.log('❌ [RESUMES API] No user ID found - unauthorized')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🔍 [RESUMES API] Connecting to database...')
    await connectDB()
    console.log('✅ [RESUMES API] Database connected successfully')

    console.log('🔍 [RESUMES API] Querying resumes for userId:', userId)
    const resumes = await Resume.find({ userId })
      .sort({ updatedAt: -1 })
      .select('title personalInfo.name createdAt updatedAt isDraft')
    
    console.log('🔍 [RESUMES API] Query executed, found resumes:', resumes.length)
    console.log('🔍 [RESUMES API] Resume data:', JSON.stringify(resumes, null, 2))

    return NextResponse.json(resumes)
  } catch (error: unknown) {
    console.error('❌ [RESUMES API] Get resumes error:', error)
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 })
  }
}

// POST - Create new resume (publish)
export async function POST(req: Request) {
  console.log('🔍 [RESUMES API] POST request received')
  
  try {
    const userId = await getCurrentUserId()
    console.log('🔍 [RESUMES API] User ID from session:', userId)
    
    if (!userId) {
      console.log('❌ [RESUMES API] No user ID found - unauthorized')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Use the new input validation middleware
    const validationResult = await validateResumeRequest(req as any)
    if (!validationResult.success) {
      console.log('❌ [RESUMES API] Validation failed:', validationResult.response)
      return validationResult.response
    }

    const { personalInfo, experiences, education, skills, title, template, isDraft = false } = validationResult.data
    console.log('🔍 [RESUMES API] Validated data received:', { title, isDraft, personalInfoName: personalInfo?.name })

    // Validate required fields for published resumes
    if (!isDraft) {
      if (!personalInfo?.name || !personalInfo?.email || !personalInfo?.phone || !personalInfo?.location) {
        console.log('❌ [RESUMES API] Missing required personal info for published resume')
        return NextResponse.json(
          { error: 'Personal information (name, email, phone, location) is required for published resumes' },
          { status: 400 }
        )
      }

      // Filter and validate experiences
      const validExperiences = (experiences || []).filter((exp: { company?: string; position?: string; startDate?: string; endDate?: string; description?: string }) => 
        exp.company?.trim() && exp.position?.trim() && exp.startDate?.trim() && exp.endDate?.trim() && exp.description?.trim()
      )

      if (validExperiences.length === 0) {
        console.log('❌ [RESUMES API] No valid experiences found for published resume')
        return NextResponse.json(
          { error: 'At least one complete work experience is required' },
          { status: 400 }
        )
      }
    }

    console.log('🔍 [RESUMES API] Connecting to database...')
    await connectDB()
    console.log('✅ [RESUMES API] Database connected successfully')

    console.log('🔍 [RESUMES API] Creating resume with userId:', userId)
    const resume = await Resume.create({
      userId,
      title: title || `${personalInfo.name}'s Resume`,
      personalInfo,
      experiences: experiences || [],
      education: education || [],
      skills: skills || [],
      template: template || '',
      isDraft
    })

    console.log('✅ [RESUMES API] Resume created successfully:', resume._id)
    return NextResponse.json(resume, { status: 201 })
  } catch (error: unknown) {
    console.error('❌ [RESUMES API] Create resume error:', error)
    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 })
  }
} 