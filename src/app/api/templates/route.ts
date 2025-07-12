import type { SortOrder } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { requireCreator } from '@/auth'
import connectDB from '@/lib/db'
import { TemplateMetadataSchema, sanitizeTemplateContent, sanitizeCss } from '@/lib/security'
import Template from '@/models/Template'
import User from '@/models/User'

// GET /api/templates - Fetch all public templates
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'popular'
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')

    // Build query
    const query: { isPublic: boolean; isApproved: boolean; category?: string; $text?: { $search: string } } = {
      isPublic: true,
      isApproved: true
    }

    if (category && category !== 'all') {
      query.category = category
    }

    if (search) {
      query.$text = { $search: search }
    }

    // Build sort
    let sortOption: { [key: string]: SortOrder } = {}
    switch (sort) {
      case 'popular':
        sortOption = { downloads: -1 as SortOrder }
        break
      case 'rating':
        sortOption = { rating: -1 as SortOrder }
        break
      case 'newest':
        sortOption = { createdAt: -1 as SortOrder }
        break
      case 'price-low':
        sortOption = { price: 1 as SortOrder }
        break
      case 'price-high':
        sortOption = { price: -1 as SortOrder }
        break
      default:
        sortOption = { downloads: -1 as SortOrder }
    }

    const skip = (page - 1) * limit

    const templates = await Template.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name')
      .lean()

    // Transform data to include creator name and always include htmlTemplate/cssStyles
    const transformedTemplates = templates.map(template => ({
      ...template,
      creatorName: (template.createdBy as { name?: string })?.name || 'Unknown',
      htmlTemplate: template.htmlTemplate,
      cssStyles: template.cssStyles,
    }))

    const total = await Template.countDocuments(query)

    return NextResponse.json({
      templates: transformedTemplates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

// POST /api/templates - Create a new template
export async function POST(request: NextRequest) {
  try {
    // Require creator role for template creation
    const session = await requireCreator()

    await connectDB()

    const body = await request.json()
    const {
      name,
      description,
      category,
      price,
      htmlTemplate,
      cssStyles,
      placeholders,
      layout
    } = body

    // Validate template metadata
    const metadataValidation = TemplateMetadataSchema.safeParse({
      name,
      description,
      category: category || 'professional',
      price: price || 0
    })
    
    if (!metadataValidation.success) {
      return NextResponse.json(
        { error: 'Invalid template data: ' + metadataValidation.error.errors[0].message },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!htmlTemplate || !placeholders) {
      return NextResponse.json(
        { error: 'HTML template and placeholders are required' },
        { status: 400 }
      )
    }

    // Sanitize template content
    const sanitizedHtml = sanitizeTemplateContent(htmlTemplate)
    const sanitizedCss = sanitizeCss(cssStyles || '')

    // Get user details  
    const _userId = (session.user as { id?: string }).id // Unused but kept for future use
    
    // Always try to find by email first since session.user.id might not be set properly
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create template with sanitized content
    const templateData = {
      name: name.trim(),
      description: description.trim(),
      category: category || 'professional',
      price: price || 0,
      htmlTemplate: sanitizedHtml,
      cssStyles: sanitizedCss,
      placeholders,
      layout: layout || 'single-column',
      createdBy: user._id,
      creatorName: user.name,
      validation: {
        isValid: true,
        requiredMissing: [],
        optionalMissing: [],
        errors: []
      }
    }
    
    const template = new Template(templateData)
    const savedTemplate = await template.save()

    return NextResponse.json(
      { 
        message: 'Template created successfully',
        templateId: savedTemplate._id
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
} 