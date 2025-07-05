import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/db'
import Resume from '@/models/Resume'
import mongoose from 'mongoose'

// GET - Fetch specific resume
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid resume ID' },
        { status: 400 }
      )
    }

    await connectDB()

    const resume = await Resume.findOne({
      _id: params.id,
      userId: session.user.id
    })

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(resume)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch resume' },
      { status: 500 }
    )
  }
}

// PUT - Update resume
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid resume ID' },
        { status: 400 }
      )
    }

    const data = await req.json()
    const { personalInfo, experiences, education, skills, title, template } = data

    if (!personalInfo?.name) {
      return NextResponse.json(
        { error: 'Personal information with name is required' },
        { status: 400 }
      )
    }

    await connectDB()

    const resume = await Resume.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      {
        title: title || `${personalInfo.name}'s Resume`,
        personalInfo,
        experiences: experiences || [],
        education: education || [],
        skills: skills || [],
        template: template || '',
        updatedAt: new Date()
      },
      { new: true }
    )

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(resume)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update resume' },
      { status: 500 }
    )
  }
}

// DELETE - Delete resume
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid resume ID' },
        { status: 400 }
      )
    }

    await connectDB()

    const resume = await Resume.findOneAndDelete({
      _id: params.id,
      userId: session.user.id
    })

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

    // Remove resume from user's resumes array
    const User = mongoose.models.User || mongoose.model('User')
    await User.findByIdAndUpdate(
      session.user.id,
      { $pull: { resumes: params.id } }
    )

    return NextResponse.json({ message: 'Resume deleted successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete resume' },
      { status: 500 }
    )
  }
} 