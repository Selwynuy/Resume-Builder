import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { 
  validateRequestSize, 
  validateArrayLength, 
  sanitizeInput, 
  INPUT_LIMITS,
  sanitizeError 
} from '@/lib/security'

// Generic request validation schema
const BaseRequestSchema = z.object({
  // Add common fields that should be validated across all requests
}).passthrough()

// Resume creation/update validation schema
export const ResumeRequestSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(1).max(INPUT_LIMITS.NAME),
    email: z.string().email().max(INPUT_LIMITS.EMAIL),
    phone: z.string().max(INPUT_LIMITS.PHONE).optional(),
    location: z.string().max(INPUT_LIMITS.LOCATION).optional(),
    summary: z.string().max(INPUT_LIMITS.SUMMARY).optional()
  }),
  experiences: z.array(z.object({
    company: z.string().min(1).max(INPUT_LIMITS.COMPANY),
    position: z.string().min(1).max(INPUT_LIMITS.POSITION),
    startDate: z.string().regex(/^\d{4}-\d{2}$/),
    endDate: z.string().regex(/^(\d{4}-\d{2}|Present)$/),
    description: z.string().min(1).max(INPUT_LIMITS.DESCRIPTION)
  })).max(INPUT_LIMITS.MAX_ARRAY_LENGTH).optional(),
  education: z.array(z.object({
    school: z.string().min(1).max(INPUT_LIMITS.SCHOOL),
    degree: z.string().min(1).max(INPUT_LIMITS.DEGREE),
    field: z.string().max(INPUT_LIMITS.FIELD).optional(),
    graduationDate: z.string().regex(/^\d{4}-\d{2}$/),
    gpa: z.string().optional()
  })).max(INPUT_LIMITS.MAX_ARRAY_LENGTH).optional(),
  skills: z.array(z.object({
    name: z.string().min(1).max(INPUT_LIMITS.SKILL_NAME),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
    years: z.number().min(0).max(50).optional(),
    certification: z.string().max(100).optional(),
    context: z.string().max(100).optional()
  })).max(INPUT_LIMITS.MAX_ARRAY_LENGTH).optional(),
  title: z.string().max(200).optional(),
  template: z.string().max(100).optional(),
  isDraft: z.boolean().optional()
})

// Template creation/update validation schema
export const TemplateRequestSchema = z.object({
  name: z.string().min(1).max(INPUT_LIMITS.TEMPLATE_NAME),
  description: z.string().min(1).max(INPUT_LIMITS.TEMPLATE_DESCRIPTION),
  category: z.enum(['professional', 'creative', 'modern', 'minimal', 'academic']),
  price: z.number().min(0).max(1000),
  htmlTemplate: z.string().min(1),
  cssStyles: z.string().optional(),
  placeholders: z.array(z.string()).max(INPUT_LIMITS.MAX_ARRAY_LENGTH),
  layout: z.enum(['single-column', 'two-column', 'modern', 'creative', 'custom']).optional()
})

// Review creation validation schema
export const ReviewRequestSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(INPUT_LIMITS.REVIEW_COMMENT).optional()
})

// AI request validation schemas
export const AIFeedbackRequestSchema = z.object({
  sectionText: z.string().min(1).max(5000)
})

export const AISummaryRequestSchema = z.object({
  mode: z.enum(['generate', 'improve']),
  text: z.string().max(5000).optional()
})

export const AIJobMatchRequestSchema = z.object({
  resume: z.string().min(1).max(10000),
  jobDescription: z.string().min(1).max(10000)
})

export const AICoverLetterRequestSchema = z.object({
  resume: z.string().min(1).max(10000),
  jobDescription: z.string().min(1).max(10000)
})

export const AIInterviewPrepRequestSchema = z.object({
  resume: z.string().min(1).max(10000),
  jobDescription: z.string().min(1).max(10000)
})

export const AIBulletRequestSchema = z.object({
  text: z.string().min(1).max(2000),
  mode: z.enum(['generate', 'rewrite'])
})

export const AISkillsRequestSchema = z.object({
  jobDescription: z.string().min(1).max(10000),
  currentSkills: z.array(z.string()).max(INPUT_LIMITS.MAX_ARRAY_LENGTH).optional()
})

// Input validation middleware factory
export function createInputValidator<T extends z.ZodType>(
  schema: T,
  options: {
    sanitize?: boolean
    maxBodySize?: number
    allowEmpty?: boolean
  } = {}
) {
  return async function validateInput(
    request: NextRequest
  ): Promise<{ success: true; data: z.infer<T> } | { success: false; response: NextResponse }> {
    
    // Check request size
    const contentLength = request.headers.get('content-length')
    const maxSize = options.maxBodySize || INPUT_LIMITS.REQUEST_BODY_SIZE
    
    if (!validateRequestSize(contentLength, maxSize)) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Request body too large' },
          { status: 413 }
        )
      }
    }

    try {
      // Parse JSON body
      const body = await request.json()
      
      // Validate against schema
      const validationResult = schema.safeParse(body)
      
      if (!validationResult.success) {
        return {
          success: false,
          response: NextResponse.json(
            { 
              error: 'Invalid input data',
              details: validationResult.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
              }))
            },
            { status: 400 }
          )
        }
      }

      let validatedData = validationResult.data

      // Apply sanitization if enabled
      if (options.sanitize) {
        validatedData = sanitizeObject(validatedData)
      }

      return {
        success: true,
        data: validatedData
      }
    } catch (error) {
      // Handle JSON parsing errors
      if (error instanceof SyntaxError) {
        return {
          success: false,
          response: NextResponse.json(
            { error: 'Invalid JSON in request body' },
            { status: 400 }
          )
        }
      }

      // Handle other errors
      return {
        success: false,
        response: NextResponse.json(
          { error: sanitizeError(error) },
          { status: 500 }
        )
      }
    }
  }
}

// Recursive object sanitization
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeInput(obj, 'text')
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item))
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value)
    }
    return sanitized
  }
  
  return obj
}

// Specific validation functions for different endpoints
export const validateResumeRequest = createInputValidator(ResumeRequestSchema, { sanitize: true })
export const validateTemplateRequest = createInputValidator(TemplateRequestSchema, { sanitize: true })
export const validateReviewRequest = createInputValidator(ReviewRequestSchema, { sanitize: true })
export const validateAIFeedbackRequest = createInputValidator(AIFeedbackRequestSchema, { sanitize: true })
export const validateAISummaryRequest = createInputValidator(AISummaryRequestSchema, { sanitize: true })
export const validateAIJobMatchRequest = createInputValidator(AIJobMatchRequestSchema, { sanitize: true })
export const validateAICoverLetterRequest = createInputValidator(AICoverLetterRequestSchema, { sanitize: true })
export const validateAIInterviewPrepRequest = createInputValidator(AIInterviewPrepRequestSchema, { sanitize: true })
export const validateAIBulletRequest = createInputValidator(AIBulletRequestSchema, { sanitize: true })
export const validateAISkillsRequest = createInputValidator(AISkillsRequestSchema, { sanitize: true })

// Generic validation for any endpoint
export const validateGenericRequest = createInputValidator(BaseRequestSchema, { sanitize: true })

// Utility function to validate URL parameters
export function validateUrlParams(params: Record<string, string>, requiredParams: string[]): {
  success: boolean
  response?: NextResponse
  validatedParams?: Record<string, string>
} {
  const missingParams = requiredParams.filter(param => !params[param])
  
  if (missingParams.length > 0) {
    return {
      success: false,
      response: NextResponse.json(
        { error: `Missing required parameters: ${missingParams.join(', ')}` },
        { status: 400 }
      )
    }
  }

  // Validate ObjectId format for MongoDB IDs
  const objectIdParams = ['id', 'resumeId', 'templateId', 'userId']
  for (const param of objectIdParams) {
    if (params[param] && !/^[0-9a-fA-F]{24}$/.test(params[param])) {
      return {
        success: false,
        response: NextResponse.json(
          { error: `Invalid ${param} format` },
          { status: 400 }
        )
      }
    }
  }

  return {
    success: true,
    validatedParams: params
  }
}

// Utility function to validate query parameters
export function validateQueryParams(query: URLSearchParams, allowedParams: string[]): {
  success: boolean
  response?: NextResponse
  validatedParams?: Record<string, string>
} {
  const validatedParams: Record<string, string> = {}
  
  for (const [key, value] of Array.from(query.entries())) {
    if (!allowedParams.includes(key)) {
      return {
        success: false,
        response: NextResponse.json(
          { error: `Invalid query parameter: ${key}` },
          { status: 400 }
        )
      }
    }
    // Validate array length for array parameters
    if (key === 'skills' || key === 'experiences' || key === 'education') {
      const items = value.split(',').filter(Boolean)
      if (!validateArrayLength(items)) {
        return {
          success: false,
          response: NextResponse.json(
            { error: `Too many items in ${key} parameter` },
            { status: 400 }
          )
        }
      }
    }
    validatedParams[key] = value
  }

  return {
    success: true,
    validatedParams
  }
} 