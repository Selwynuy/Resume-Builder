import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/db'
import Template from '@/models/Template'
import User from '@/models/User'
import { TemplateMetadataSchema, sanitizeTemplateContent, sanitizeCss, sanitizeError } from '@/lib/security'

// GET /api/templates - Fetch all public templates
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'popular'
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')

    // Build query
    const query: any = {
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
    let sortOption: any = {}
    switch (sort) {
      case 'popular':
        sortOption = { downloads: -1 }
        break
      case 'rating':
        sortOption = { rating: -1 }
        break
      case 'newest':
        sortOption = { createdAt: -1 }
        break
      case 'price-low':
        sortOption = { price: 1 }
        break
      case 'price-high':
        sortOption = { price: -1 }
        break
      default:
        sortOption = { downloads: -1 }
    }

    const skip = (page - 1) * limit

    const templates = await Template.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name')
      .lean()

    // Transform data to include creator name
    const transformedTemplates = templates.map(template => ({
      ...template,
      creatorName: (template.createdBy as any)?.name || 'Unknown'
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
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// POST /api/templates - Create a new template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    console.log('Session:', session) // Debug log
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    await dbConnect()
    console.log('Database connected successfully') // Debug log

    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2)) // Debug log
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
    const userId = session.user.id || session.user.email
    console.log('User ID:', userId) // Debug log
    
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
    
    console.log('Template data:', templateData) // Debug log
    
    const template = new Template(templateData)
    const savedTemplate = await template.save()
    
    console.log('Template saved:', savedTemplate._id) // Debug log

    return NextResponse.json(
      { 
        message: 'Template created successfully',
        templateId: savedTemplate._id
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating template:', error)
    
    const isDevelopment = process.env.NODE_ENV === 'development'
    return NextResponse.json(
      { 
        error: sanitizeError(error, isDevelopment),
        stack: isDevelopment ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 