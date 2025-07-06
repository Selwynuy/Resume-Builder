import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
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
  
  // Allow same-origin requests and localhost for development
  const allowedOrigins = [
    `https://${host}`,
    `http://${host}`,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ]

  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(
      JSON.stringify({ error: 'CSRF validation failed' }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(Object.entries(securityHeaders))
        }
      }
    )
  }

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