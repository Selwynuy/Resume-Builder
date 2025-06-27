import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { securityHeaders } from './lib/security'

// Rate limiting store (in production, use Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>()

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now()
  rateLimit.forEach((value, key) => {
    if (now > value.resetTime) {
      rateLimit.delete(key)
    }
  })
}, 60 * 60 * 1000)

function getRateLimitKey(request: NextRequest): string {
  // Use IP address and path for rate limiting key
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous'
  const path = request.nextUrl.pathname
  return `${ip}:${path}`
}

function isRateLimited(request: NextRequest, maxRequests: number, windowMs: number): boolean {
  const key = getRateLimitKey(request)
  const now = Date.now()
  const windowStart = now - windowMs

  // Get current rate limit data
  const current = rateLimit.get(key)

  if (!current) {
    // First request
    rateLimit.set(key, { count: 1, resetTime: now + windowMs })
    return false
  }

  if (now > current.resetTime) {
    // Reset window
    rateLimit.set(key, { count: 1, resetTime: now + windowMs })
    return false
  }

  if (current.count >= maxRequests) {
    return true
  }

  // Increment count
  current.count++
  return false
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Rate limiting for authentication endpoints
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    if (isRateLimited(request, 5, 15 * 60 * 1000)) { // 5 requests per 15 minutes
      return new NextResponse(
        JSON.stringify({ error: 'Too many authentication attempts' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '900', // 15 minutes
            ...Object.fromEntries(Object.entries(securityHeaders))
          }
        }
      )
    }
  }

  // Rate limiting for API endpoints
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (isRateLimited(request, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '900',
            ...Object.fromEntries(Object.entries(securityHeaders))
          }
        }
      )
    }
  }

  // CSRF protection for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')
    
    // Allow same-origin requests and localhost for development
    const allowedOrigins = [
      `https://${host}`,
      `http://${host}`,
      'http://localhost:3000',
      'http://127.0.0.1:3000'
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
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 