import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUserId, getCurrentUserEmail, isAdmin, requireCreator } from '@/auth'
import dbConnect from '@/lib/db'
import Template from '@/models/Template'

// DELETE /api/templates/[id] - Delete user's template
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require creator role for template deletion
    const session = await requireCreator()
    const userId = await getCurrentUserId()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      )
    }

    await dbConnect()

    const template = await Template.findOneAndDelete({
      _id: params.id,
      createdBy: userId
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found or access denied' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
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
    const userId = await getCurrentUserId()
    const userEmail = await getCurrentUserEmail()
    
    if (!userId) {
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
    const userIsAdmin = userEmail ? isAdmin(userEmail) : false

    let template
    if (userIsAdmin) {
      // Admin can access any template
      template = await Template.findById(params.id)
    } else {
      // Regular users can only access their own templates or approved public ones
      template = await Template.findOne({
        _id: params.id,
        $or: [
          { createdBy: userId },
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
    // Require creator role for template updates
    const session = await requireCreator()
    const userId = await getCurrentUserId()

    const body = await request.json()
    const { name, description, category, price, htmlTemplate, cssStyles, placeholders, layout, supportedDocumentTypes } = body

    if (!name || !description || !htmlTemplate || !placeholders) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate supportedDocumentTypes
    const allowedTypes = ['resume', 'cv', 'biodata']
    if (!Array.isArray(supportedDocumentTypes) || supportedDocumentTypes.length === 0 ||
      !supportedDocumentTypes.every((t) => allowedTypes.includes(t))) {
      return NextResponse.json(
        { error: 'supportedDocumentTypes must be a non-empty array containing only resume, cv, or biodata.' },
        { status: 400 }
      )
    }

    await dbConnect()

    const template = await Template.findOneAndUpdate(
      { _id: params.id, createdBy: userId },
      {
        name,
        description,
        category: category || 'professional',
        price: price || 0,
        htmlTemplate,
        cssStyles: cssStyles || '',
        placeholders,
        layout: layout || 'single-column',
        supportedDocumentTypes, // <-- add this
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
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
} 