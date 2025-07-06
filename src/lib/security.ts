import { z } from 'zod'

// Validation patterns
export const phoneRegex = /^\+?[\d\s\-()]{10,}$/
export const nameRegex = /^[a-zA-Z\s\-.'']{2,50}$/
export const locationRegex = /^[a-zA-Z\s\-.,]{2,100}$/

export const PersonalInfoSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(nameRegex, 'Name contains invalid characters'),
  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email too long'),
  phone: z.string()
    .regex(phoneRegex, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  location: z.string()
    .max(200, 'Location too long')
    .regex(locationRegex, 'Location contains invalid characters')
    .optional()
    .or(z.literal('')),
  summary: z.string()
    .max(1000, 'Summary too long')
    .optional()
    .or(z.literal(''))
})

export const ExperienceSchema = z.object({
  company: z.string()
    .min(1, 'Company name is required')
    .max(200, 'Company name too long')
    .regex(/^[a-zA-Z0-9\s\-.,&'']{1,200}$/, 'Company name contains invalid characters'),
  position: z.string()
    .min(1, 'Position is required')
    .max(200, 'Position too long')
    .regex(/^[a-zA-Z0-9\s\-.,&'']{1,200}$/, 'Position contains invalid characters'),
  startDate: z.string()
    .min(1, 'Start date is required')
    .regex(/^\d{4}-\d{2}$/, 'Invalid date format (YYYY-MM)'),
  endDate: z.string()
    .min(1, 'End date is required')
    .regex(/^(\d{4}-\d{2}|Present)$/, 'Invalid date format (YYYY-MM or Present)'),
  description: z.string()
    .min(1, 'Description is required')
    .max(2000, 'Description too long')
})

export const EducationSchema = z.object({
  school: z.string()
    .min(1, 'School name is required')
    .max(200, 'School name too long')
    .regex(/^[a-zA-Z0-9\s\-.,&'']{1,200}$/, 'School name contains invalid characters'),
  degree: z.string()
    .min(1, 'Degree is required')
    .max(200, 'Degree too long')
    .regex(/^[a-zA-Z0-9\s\-.,&'']{1,200}$/, 'Degree contains invalid characters'),
  field: z.string()
    .max(200, 'Field too long')
    .regex(/^[a-zA-Z0-9\s\-.,&'']{0,200}$/, 'Field contains invalid characters')
    .optional()
    .or(z.literal('')),
  graduationDate: z.string()
    .min(1, 'Graduation date is required')
    .regex(/^\d{4}-\d{2}$/, 'Invalid date format (YYYY-MM)'),
  gpa: z.string()
    .regex(/^(\d{1,2}(\.\d{1,2})?\/\d{1,2}(\.\d{1,2})?|\d{1,2}(\.\d{1,2})?)?$/, 'Invalid GPA format')
    .optional()
    .or(z.literal(''))
})

export const SkillSchema = z.object({
  name: z.string()
    .min(1, 'Skill name is required')
    .max(100, 'Skill name too long')
    .regex(/^[a-zA-Z0-9\s\-.,&+#]{1,100}$/, 'Skill name contains invalid characters'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
    errorMap: () => ({ message: 'Invalid skill level' })
  })
})

export const TemplateMetadataSchema = z.object({
  name: z.string()
    .min(1, 'Template name is required')
    .max(100, 'Template name too long')
    .regex(/^[a-zA-Z0-9\s\-.]{1,100}$/, 'Template name contains invalid characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description too long'),
  category: z.enum(['professional', 'creative', 'modern', 'minimal', 'academic']),
  price: z.number()
    .min(0, 'Price cannot be negative')
    .max(999.99, 'Price too high')
})

// HTML Sanitization
export function sanitizeHtml(html: string): string {
  return html
    .replace(/[<>&'"]/g, (match) => {
      switch (match) {
        case '<': return '&lt;'
        case '>': return '&gt;'
        case '&': return '&amp;'
        case "'": return '&#39;'
        case '"': return '&quot;'
        default: return match
      }
    })
}

// Template content sanitization (more restrictive)
export function sanitizeTemplateContent(content: string, _forPreview: boolean = false): string {
  return content
    .replace(/[<>&'"]/g, (match) => {
      switch (match) {
        case '<': return '&lt;'
        case '>': return '&gt;'
        case '&': return '&amp;'
        case "'": return '&#39;'
        case '"': return '&quot;'
        default: return match
      }
    })
}

// CSS Sanitization
export function sanitizeCss(css: string): string {
  return css
    .replace(/[<>&'"]/g, (match) => {
      switch (match) {
        case '<': return '&lt;'
        case '>': return '&gt;'
        case '&': return '&amp;'
        case "'": return '&#39;'
        case '"': return '&quot;'
        default: return match
      }
    })
}

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
}

export const authRateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
}

// Error sanitization
export const sanitizeError = (error: any, isDevelopment: boolean = false): string => {
  if (isDevelopment) {
    return error?.message || 'An error occurred'
  }

  // Production: Generic error messages
  const genericErrors: { [key: string]: string } = {
    'ValidationError': 'Invalid input provided',
    'CastError': 'Invalid data format',
    'MongoError': 'Database error occurred',
    'JsonWebTokenError': 'Authentication error',
    'TokenExpiredError': 'Session expired'
  }

  const errorType = error?.constructor?.name || 'Error'
  return genericErrors[errorType] || 'An unexpected error occurred'
}

// Input limits
export const INPUT_LIMITS = {
  NAME: 50,
  EMAIL: 100,
  PHONE: 20,
  LOCATION: 100,
  SUMMARY: 500,
  COMPANY: 100,
  POSITION: 100,
  DESCRIPTION: 1000,
  SCHOOL: 100,
  DEGREE: 100,
  FIELD: 100,
  SKILL_NAME: 50,
  TEMPLATE_NAME: 100,
  TEMPLATE_DESCRIPTION: 500,
  REVIEW_COMMENT: 1000
} as const

// Security headers configuration
export const securityHeaders = {
  'X-DNS-Prefetch-Control': 'off',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': process.env.NODE_ENV === 'development'
    ? [
        "default-src 'self';",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
        "font-src 'self' https://fonts.gstatic.com;",
        "img-src 'self' data: https:;",
        "object-src 'none';",
        "base-uri 'self';",
        "frame-ancestors 'none';"
      ].join(' ')
    : [
        "default-src 'self';",
        "script-src 'self' 'unsafe-inline';",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
        "font-src 'self' https://fonts.gstatic.com;",
        "img-src 'self' data: https:;",
        "object-src 'none';",
        "base-uri 'self';",
        "frame-ancestors 'none';"
      ].join(' ')
}

// Password validation schema
const PasswordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')

// User registration schema
export const UserRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(INPUT_LIMITS.NAME),
  email: z.string().email('Invalid email address').max(INPUT_LIMITS.EMAIL),
  password: PasswordSchema
})

// Input validation
export function validateInput(value: string, type: 'name' | 'email' | 'phone' | 'location' | 'text'): boolean {
  if (!value || typeof value !== 'string') return false
  
  switch (type) {
    case 'name':
      return nameRegex.test(value.trim())
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    case 'phone':
      return phoneRegex.test(value.trim())
    case 'location':
      return locationRegex.test(value.trim())
    case 'text':
      return value.trim().length > 0 && value.trim().length <= INPUT_LIMITS.DESCRIPTION
    default:
      return false
  }
} 