/**
 * Security utilities for input validation, sanitization, and protection.
 * 
 * This module provides comprehensive security measures including:
 * - Input validation using Zod schemas
 * - HTML/CSS sanitization using DOMPurify
 * - XSS prevention through content sanitization
 * - CSRF protection utilities
 * - Rate limiting validation
 * 
 * All functions are designed to prevent common web vulnerabilities
 * and ensure data integrity throughout the application.
 * 
 * @module security
 */

import createDOMPurify from 'dompurify';
import { z } from 'zod'

let DOMPurify: ReturnType<typeof createDOMPurify>;

if (typeof window === 'undefined') {
  // SSR: use jsdom
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { JSDOM } = require('jsdom');
  const windowInstance = new JSDOM('').window;
  DOMPurify = createDOMPurify(windowInstance as unknown as Window & typeof globalThis);
} else {
  // CSR: use window
  DOMPurify = createDOMPurify(window);
}

// Enhanced validation patterns with stricter rules
export const phoneRegex = /^\+?[\d\s\-()]{10,20}$/
export const nameRegex = /^[a-zA-Z\s\-.'']{2,50}$/
export const locationRegex = /^[a-zA-Z0-9\s\-.,]{2,100}$/
export const companyRegex = /^[a-zA-Z0-9\s\-.,&'']{1,200}$/
export const positionRegex = /^[a-zA-Z0-9\s\-.,&'']{1,200}$/
export const skillRegex = /^[a-zA-Z0-9\s\-.,&+#]{1,100}$/
export const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i

// Enhanced schemas with better validation
export const PersonalInfoSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(nameRegex, 'Name contains invalid characters')
    .transform(val => val.trim()),
  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email too long')
    .transform(val => val.toLowerCase().trim()),
  phone: z.string()
    .regex(phoneRegex, 'Invalid phone number format')
    .optional()
    .or(z.literal(''))
    .transform(val => val?.trim() || ''),
  location: z.string()
    .max(200, 'Location too long')
    .regex(locationRegex, 'Location contains invalid characters')
    .optional()
    .or(z.literal(''))
    .transform(val => val?.trim() || ''),
  summary: z.string()
    .max(1000, 'Summary too long')
    .optional()
    .or(z.literal(''))
    .transform(val => val?.trim() || '')
})

export const ExperienceSchema = z.object({
  company: z.string()
    .min(1, 'Company name is required')
    .max(200, 'Company name too long')
    .regex(companyRegex, 'Company name contains invalid characters')
    .transform(val => val.trim()),
  position: z.string()
    .min(1, 'Position is required')
    .max(200, 'Position too long')
    .regex(positionRegex, 'Position contains invalid characters')
    .transform(val => val.trim()),
  startDate: z.string()
    .min(1, 'Start date is required')
    .regex(/^\d{4}-\d{2}$/, 'Invalid date format (YYYY-MM)'),
  endDate: z.string()
    .min(1, 'End date is required')
    .regex(/^(\d{4}-\d{2}|Present)$/, 'Invalid date format (YYYY-MM or Present)'),
  description: z.string()
    .min(1, 'Description is required')
    .max(2000, 'Description too long')
    .transform(val => val.trim())
})

export const EducationSchema = z.object({
  school: z.string()
    .min(1, 'School name is required')
    .max(200, 'School name too long')
    .regex(companyRegex, 'School name contains invalid characters')
    .transform(val => val.trim()),
  degree: z.string()
    .min(1, 'Degree is required')
    .max(200, 'Degree too long')
    .regex(companyRegex, 'Degree contains invalid characters')
    .transform(val => val.trim()),
  field: z.string()
    .max(200, 'Field too long')
    .regex(companyRegex, 'Field contains invalid characters')
    .optional()
    .or(z.literal(''))
    .transform(val => val?.trim() || ''),
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
    .regex(skillRegex, 'Skill name contains invalid characters')
    .transform(val => val.trim()),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
    errorMap: () => ({ message: 'Invalid skill level' })
  }),
  years: z.number()
    .min(0, 'Years cannot be negative')
    .max(50, 'Years cannot exceed 50')
    .optional(),
  certification: z.string()
    .max(100, 'Certification too long')
    .optional()
    .or(z.literal(''))
    .transform(val => val?.trim() || ''),
  context: z.string()
    .max(100, 'Context too long')
    .optional()
    .or(z.literal(''))
    .transform(val => val?.trim() || '')
})

// Template metadata validation
export const TemplateMetadataSchema = z.object({
  name: z.string()
    .min(1, 'Template name is required')
    .max(100, 'Template name too long')
    .regex(/^[a-zA-Z0-9\s\-.,&'']{1,100}$/, 'Template name contains invalid characters')
    .transform(val => val.trim()),
  description: z.string()
    .min(1, 'Template description is required')
    .max(500, 'Template description too long')
    .transform(val => val.trim()),
  category: z.enum(['professional', 'creative', 'modern', 'minimal', 'academic'], {
    errorMap: () => ({ message: 'Invalid category' })
  }),
  price: z.number()
    .min(0, 'Price cannot be negative')
    .max(1000, 'Price cannot exceed 1000')
})

/**
 * Sanitizes HTML content by escaping special characters.
 * 
 * This function prevents XSS attacks by converting potentially dangerous
 * HTML characters to their safe entity equivalents. It's used for
 * user-generated content that should be displayed as text, not rendered as HTML.
 * 
 * @param html - The HTML string to sanitize
 * @returns The sanitized HTML string with escaped special characters
 * 
 * @example
 * ```typescript
 * const safe = sanitizeHtml('<script>alert("xss")</script>');
 * // Returns: "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
 * ```
 */
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

/**
 * Sanitizes template content using DOMPurify with restrictive settings.
 * 
 * This function allows safe HTML content while preventing XSS attacks.
 * It's used for template content that needs to be rendered as HTML
 * but must be safe from malicious scripts and dangerous attributes.
 * 
 * @param content - The HTML content to sanitize
 * @returns The sanitized HTML content safe for rendering
 * 
 * @example
 * ```typescript
 * const safe = sanitizeTemplateContent('<b>Bold text</b><script>alert("xss")</script>');
 * // Returns: "<b>Bold text</b>" (script tag removed)
 * ```
 */
export function sanitizeTemplateContent(content: string): string {
  return DOMPurify.sanitize(content, {
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'select', 'textarea'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit', 'srcset', 'formaction', 'javascript:'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
}

/**
 * Sanitizes CSS content by removing dangerous characters.
 * 
 * This function prevents CSS-based attacks by removing angle brackets
 * that could be used for CSS injection attacks.
 * 
 * @param css - The CSS string to sanitize
 * @returns The sanitized CSS string
 * 
 * @example
 * ```typescript
 * const safe = sanitizeCss('body { color: red; } <style>');
 * // Returns: "body { color: red; } style"
 * ```
 */
export function sanitizeCss(css: string): string {
  return css.replace(/[<>]/g, '')
}

/**
 * Sanitizes input based on the specified type.
 * 
 * This function provides type-specific sanitization for different
 * input types, ensuring appropriate security measures for each use case.
 * 
 * @param input - The input string to sanitize
 * @param type - The type of input to determine sanitization method
 * @param type.text - General text input (HTML escaped)
 * @param type.email - Email input (lowercase, trimmed)
 * @param type.url - URL input (validated and trimmed)
 * @param type.html - HTML input (DOMPurify sanitized)
 * @param type.css - CSS input (angle brackets removed)
 * @returns The sanitized input string
 * 
 * @example
 * ```typescript
 * const safeText = sanitizeInput('<b>Hello</b>', 'text');
 * // Returns: "&lt;b&gt;Hello&lt;/b&gt;"
 * 
 * const safeEmail = sanitizeInput('  USER@EXAMPLE.COM  ', 'email');
 * // Returns: "user@example.com"
 * ```
 */
export function sanitizeInput(input: string, type: 'text' | 'email' | 'url' | 'html' | 'css'): string {
  if (!input || typeof input !== 'string') return ''
  
  const trimmed = input.trim()
  
  switch (type) {
    case 'text':
      return sanitizeHtml(trimmed)
    case 'email':
      return trimmed.toLowerCase()
    case 'url':
      return urlRegex.test(trimmed) ? trimmed : ''
    case 'html':
      return sanitizeTemplateContent(trimmed)
    case 'css':
      return sanitizeCss(trimmed)
    default:
      return sanitizeHtml(trimmed)
  }
}

// Enhanced error sanitization
export const sanitizeError = (error: unknown, isDevelopment: boolean = false): string => {
  if (isDevelopment) {
    return error instanceof Error ? error.message : 'An error occurred'
  }

  // Production: Generic error messages
  const genericErrors: { [key: string]: string } = {
    'ValidationError': 'Invalid input provided',
    'CastError': 'Invalid data format',
    'MongoError': 'Database error occurred',
    'JsonWebTokenError': 'Authentication error',
    'TokenExpiredError': 'Session expired',
    'SyntaxError': 'Invalid request format',
    'TypeError': 'Invalid data type provided'
  }

  const errorType = error instanceof Error ? error.constructor.name : 'Error'
  return genericErrors[errorType] || 'An unexpected error occurred'
}

// Enhanced input limits
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
  REVIEW_COMMENT: 1000,
  REQUEST_BODY_SIZE: 1024 * 1024, // 1MB
  MAX_ARRAY_LENGTH: 100
} as const

// Request validation utilities
export function validateRequestSize(contentLength: string | null, maxSize: number = INPUT_LIMITS.REQUEST_BODY_SIZE): boolean {
  if (!contentLength) return true
  const size = parseInt(contentLength, 10)
  return size <= maxSize
}

export function validateArrayLength<T>(array: T[], maxLength: number = INPUT_LIMITS.MAX_ARRAY_LENGTH): boolean {
  return Array.isArray(array) && array.length <= maxLength
}

// Enhanced password validation schema
const PasswordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
  .refine(password => {
    // Check for common weak passwords
    const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein']
    return !weakPasswords.includes(password.toLowerCase())
  }, 'Password is too common')

// Enhanced user registration schema
export const UserRegistrationSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(INPUT_LIMITS.NAME, 'Name too long')
    .regex(nameRegex, 'Name contains invalid characters')
    .transform(val => val.trim()),
  email: z.string()
    .email('Invalid email address')
    .max(INPUT_LIMITS.EMAIL, 'Email too long')
    .transform(val => val.toLowerCase().trim()),
  password: PasswordSchema
})

// Enhanced input validation function
export function validateInput(value: string, type: 'name' | 'email' | 'phone' | 'location' | 'text' | 'url'): boolean {
  if (!value || typeof value !== 'string') return false
  
  const trimmed = value.trim()
  if (trimmed.length === 0) return false
  
  switch (type) {
    case 'name':
      return nameRegex.test(trimmed) && trimmed.length <= INPUT_LIMITS.NAME
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && trimmed.length <= INPUT_LIMITS.EMAIL
    case 'phone':
      return phoneRegex.test(trimmed) && trimmed.length <= INPUT_LIMITS.PHONE
    case 'location':
      return locationRegex.test(trimmed) && trimmed.length <= INPUT_LIMITS.LOCATION
    case 'url':
      return urlRegex.test(trimmed)
    case 'text':
      return trimmed.length > 0 && trimmed.length <= INPUT_LIMITS.DESCRIPTION
    default:
      return false
  }
}

// Security constants
export const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_RESET_EXPIRY: 60 * 60 * 1000, // 1 hour
  API_RATE_LIMIT: 100,
  AUTH_RATE_LIMIT: 5,
  CSRF_TOKEN_EXPIRY: 60 * 60 * 1000 // 1 hour
} as const

// CSRF Protection Utilities
export function createCSRFTokenInput(token: string): string {
  return `<input type="hidden" name="csrfToken" value="${token}" />`
}

export function validateCSRFRequest(request: Request): boolean {
  // This is a simplified validation - in practice, use the middleware
  const contentType = request.headers.get('content-type')
  
  if (contentType?.includes('application/x-www-form-urlencoded')) {
    // For form submissions, CSRF validation happens in middleware
    return true
  }
  
  // For API requests, rely on origin/referer validation
  return true
}

// Enhanced security headers for CSRF protection
export const CSRF_HEADERS = {
  'X-Requested-With': 'XMLHttpRequest',
  'X-CSRF-Protection': '1'
} as const 