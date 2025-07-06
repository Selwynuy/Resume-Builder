import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  errorMessage?: string
}

export const RATE_LIMIT_CONFIGS = {
  // Authentication endpoints - strict limiting
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    errorMessage: 'Too many authentication attempts'
  },
  // Session management - more lenient
  session: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    errorMessage: 'Too many session requests'
  },
  // General API endpoints
  api: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    errorMessage: 'Too many requests'
  },
  // Resume operations - moderate limiting
  resume: {
    maxRequests: 50,
    windowMs: 15 * 60 * 1000, // 15 minutes
    errorMessage: 'Too many resume operations'
  }
}

function getRateLimitKey(request: NextRequest): string {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous'
  const path = request.nextUrl.pathname
  
  // Create specific keys for different types of requests
  if (path.startsWith('/api/auth/session') || path.startsWith('/api/auth/_log')) {
    return `session:${ip}`
  } else if (path.startsWith('/api/auth/')) {
    return `auth:${ip}:${path}`
  } else if (path.startsWith('/api/resumes/')) {
    return `resume:${ip}:${path}`
  } else if (path.startsWith('/api/')) {
    return `api:${ip}:${path}`
  } else {
    return `general:${ip}:${path}`
  }
}

function isRateLimited(request: NextRequest, config: RateLimitConfig): boolean {
  const key = getRateLimitKey(request)
  const now = Date.now()

  const current = rateLimit.get(key)

  if (!current) {
    rateLimit.set(key, { count: 1, resetTime: now + config.windowMs })
    return false
  }

  if (now > current.resetTime) {
    rateLimit.set(key, { count: 1, resetTime: now + config.windowMs })
    return false
  }

  if (current.count >= config.maxRequests) {
    return true
  }

  current.count++
  return false
}

export function createRateLimitResponse(config: RateLimitConfig): NextResponse {
  return new NextResponse(
    JSON.stringify({ error: config.errorMessage || 'Rate limit exceeded' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil(config.windowMs / 1000).toString(),
      }
    }
  )
}

export function checkRateLimit(request: NextRequest): NextResponse | null {
  const path = request.nextUrl.pathname
  
  // NextAuth session management - lenient
  if (path.startsWith('/api/auth/session') || path.startsWith('/api/auth/_log')) {
    if (isRateLimited(request, RATE_LIMIT_CONFIGS.session)) {
      return createRateLimitResponse(RATE_LIMIT_CONFIGS.session)
    }
  }
  // Authentication endpoints - strict
  else if (path.startsWith('/api/auth/')) {
    if (isRateLimited(request, RATE_LIMIT_CONFIGS.auth)) {
      return createRateLimitResponse(RATE_LIMIT_CONFIGS.auth)
    }
  }
  // Resume operations - moderate
  else if (path.startsWith('/api/resumes/')) {
    if (isRateLimited(request, RATE_LIMIT_CONFIGS.resume)) {
      return createRateLimitResponse(RATE_LIMIT_CONFIGS.resume)
    }
  }
  // General API endpoints
  else if (path.startsWith('/api/')) {
    if (isRateLimited(request, RATE_LIMIT_CONFIGS.api)) {
      return createRateLimitResponse(RATE_LIMIT_CONFIGS.api)
    }
  }
  
  return null
} 

export function clearRateLimitStore() {
  rateLimit.clear()
} 