import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { randomBytes } from 'crypto'

export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()',
  'X-DNS-Prefetch-Control': 'off',
  'X-Download-Options': 'noopen',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

// CSRF token store (in production, use Redis or database)
const csrfTokens = new Map<string, { token: string; expires: number }>()

// Clean up expired tokens every 30 minutes
setInterval(() => {
  const now = Date.now()
  csrfTokens.forEach((value, key) => {
    if (now > value.expires) {
      csrfTokens.delete(key)
    }
  })
}, 30 * 60 * 1000)

export function generateCSRFToken(sessionId: string): string {
  const token = randomBytes(32).toString('hex')
  const expires = Date.now() + (60 * 60 * 1000) // 1 hour
  
  csrfTokens.set(sessionId, { token, expires })
  return token
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId)
  if (!stored || stored.token !== token || Date.now() > stored.expires) {
    return false
  }
  
  // Remove token after use (one-time use)
  csrfTokens.delete(sessionId)
  return true
}

export function addSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (!response.headers.has(key)) {
      response.headers.set(key, value)
    }
  })
  return response
}

export function checkCSRF(request: NextRequest): NextResponse | null {
  // Only check state-changing methods
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    return null
  }

  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  const referer = request.headers.get('referer')
  
  // Allow same-origin requests and localhost for development
  const allowedOrigins = [
    `https://${host}`,
    `http://${host}`,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ]

  // Enhanced CSRF protection: check both origin and referer
  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(
      JSON.stringify({ error: 'CSRF validation failed: Invalid origin' }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(Object.entries(securityHeaders))
        }
      }
    )
  }

  // Check referer for additional protection
  if (referer) {
    const refererUrl = new URL(referer)
    const refererHost = refererUrl.host
    const requestHost = host || 'localhost'
    
    // Allow same host (with or without port)
    const refererHostWithoutPort = refererHost.split(':')[0]
    const requestHostWithoutPort = requestHost.split(':')[0]
    
    if (refererHostWithoutPort !== requestHostWithoutPort && 
        !['localhost', '127.0.0.1'].includes(refererHostWithoutPort) &&
        !refererHostWithoutPort.endsWith('.localhost')) {
      return new NextResponse(
        JSON.stringify({ error: 'CSRF validation failed: Invalid referer' }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            ...Object.fromEntries(Object.entries(securityHeaders))
          }
        }
      )
    }
  }

  // For form submissions, check CSRF token if present
  // Note: Form data validation is handled in the API routes that process form data
  // This middleware focuses on origin/referer validation for CSRF protection

  return null
}

export function validateContentType(request: NextRequest): NextResponse | null {
  // Only validate for API endpoints
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return null
  }

  const contentType = request.headers.get('content-type')
  
  // For POST/PUT/PATCH requests, require proper content type
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    if (!contentType || !contentType.includes('application/json')) {
      return new NextResponse(
        JSON.stringify({ error: 'Content-Type must be application/json' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...Object.fromEntries(Object.entries(securityHeaders))
          }
        }
      )
    }
  }

  return null
}

export function sanitizeHeaders(request: NextRequest): void {
  // Remove potentially dangerous headers
  const dangerousHeaders = [
    'x-forwarded-host',
    'x-forwarded-proto',
    'x-real-ip',
    'x-forwarded-for'
  ]

  dangerousHeaders.forEach(header => {
    if (request.headers.has(header)) {
      request.headers.delete(header)
    }
  })
} 