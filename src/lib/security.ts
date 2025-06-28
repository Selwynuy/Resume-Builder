import DOMPurify from 'dompurify'
import { z } from 'zod'

// Input validation schemas
export const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/
export const nameRegex = /^[a-zA-Z\s\-\.\']{1,100}$/
export const locationRegex = /^[a-zA-Z0-9\s\,\-\.\']{1,200}$/

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
    .regex(/^[a-zA-Z0-9\s\-\.\,\&\']{1,200}$/, 'Company name contains invalid characters'),
  position: z.string()
    .min(1, 'Position is required')
    .max(200, 'Position too long')
    .regex(/^[a-zA-Z0-9\s\-\.\,\&\']{1,200}$/, 'Position contains invalid characters'),
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
    .regex(/^[a-zA-Z0-9\s\-\.\,\&\']{1,200}$/, 'School name contains invalid characters'),
  degree: z.string()
    .min(1, 'Degree is required')
    .max(200, 'Degree too long')
    .regex(/^[a-zA-Z0-9\s\-\.\,\&\']{1,200}$/, 'Degree contains invalid characters'),
  field: z.string()
    .max(200, 'Field too long')
    .regex(/^[a-zA-Z0-9\s\-\.\,\&\']{0,200}$/, 'Field contains invalid characters')
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
    .regex(/^[a-zA-Z0-9\s\-\.\,\&\+\#]{1,100}$/, 'Skill name contains invalid characters'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
    errorMap: () => ({ message: 'Invalid skill level' })
  })
})

export const TemplateMetadataSchema = z.object({
  name: z.string()
    .min(1, 'Template name is required')
    .max(100, 'Template name too long')
    .regex(/^[a-zA-Z0-9\s\-\.]{1,100}$/, 'Template name contains invalid characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description too long'),
  category: z.enum(['professional', 'creative', 'modern', 'minimal', 'academic']),
  price: z.number()
    .min(0, 'Price cannot be negative')
    .max(999.99, 'Price too high')
})

// HTML Sanitization
export const sanitizeHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    // Server-side: basic sanitization
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/javascript:/gi, '')
  }

  // Client-side: use DOMPurify
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'div', 'span', 'p', 'br', 'strong', 'em', 'b', 'i', 'u',
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'table', 'tr', 'td', 'th', 'thead', 'tbody',
      'section', 'article', 'header', 'footer'
    ],
    ALLOWED_ATTR: [
      'class', 'id', 'style'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  })
}

// Template content sanitization (more restrictive)
export const sanitizeTemplateContent = (html: string): string => {
  if (typeof window === 'undefined') {
    // Server-side basic sanitization
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/javascript:/gi, '')
      .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, '')
      .replace(/<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi, '')
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'div', 'span', 'p', 'br', 'strong', 'em', 'b', 'i', 'u',
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'table', 'tr', 'td', 'th', 'thead', 'tbody',
      'section', 'article', 'header', 'footer'
    ],
    ALLOWED_ATTR: ['class'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'link', 'style', 'meta'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
  })
}

// CSS Sanitization
export const sanitizeCss = (css: string): string => {
  // Remove potentially dangerous CSS
  return css
    .replace(/expression\s*\(/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/@import\s+/gi, '')
    .replace(/url\s*\(\s*['"]*javascript:/gi, '')
    .replace(/behavior\s*:/gi, '')
    .replace(/-moz-binding\s*:/gi, '')
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

// Input length limits
export const INPUT_LIMITS = {
  NAME: 100,
  EMAIL: 254,
  PHONE: 20,
  LOCATION: 200,
  SUMMARY: 1000,
  COMPANY: 200,
  POSITION: 200,
  DESCRIPTION: 2000,
  SCHOOL: 200,
  DEGREE: 200,
  FIELD: 200,
  SKILL_NAME: 100,
  TEMPLATE_NAME: 100,
  TEMPLATE_DESCRIPTION: 500,
  REVIEW_COMMENT: 1000
}

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
export const PasswordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password too long')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
  .regex(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/, 'Password contains invalid characters')

// Registration schema
export const RegistrationSchema = z.object({
  name: PersonalInfoSchema.shape.name,
  email: PersonalInfoSchema.shape.email,
  password: PasswordSchema
}) 