import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/db'
import Template from '@/models/Template'

// DELETE /api/templates/[id] - Delete user's template
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      )
    }

    await dbConnect()

    const template = await Template.findOneAndDelete({
      _id: params.id,
      createdBy: session.user.id
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found or access denied' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}

// Add GET method to existing file
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      )
    }

    await dbConnect()

    // Check if user is admin
    const adminEmails = [
      'admin@resumebuilder.com',
      'selwyn.cybersec@gmail.com',
      session?.user?.email || ''
    ]
    const isAdmin = adminEmails.includes(session.user.email || '')

    let template
    if (isAdmin) {
      // Admin can access any template
      template = await Template.findById(params.id)
    } else {
      // Regular users can only access their own templates or approved public ones
      template = await Template.findOne({
        _id: params.id,
        $or: [
          { createdBy: session.user.id },
          { isApproved: true, isPublic: true }
        ]
      })
    }

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found or access denied' },
        { status: 404 }
      )
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

// Add PUT method for updates
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, category, price, htmlTemplate, cssStyles, placeholders, layout } = body

    if (!name || !description || !htmlTemplate || !placeholders) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await dbConnect()

    const template = await Template.findOneAndUpdate(
      { _id: params.id, createdBy: session.user.id },
      {
        name,
        description,
        category: category || 'professional',
        price: price || 0,
        htmlTemplate,
        cssStyles: cssStyles || '',
        placeholders,
        layout: layout || 'single-column',
        validation: {
          isValid: true,
          requiredMissing: [],
          optionalMissing: [],
          errors: []
        }
      },
      { new: true }
    )

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found or access denied' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Template updated successfully', templateId: template._id })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
} 