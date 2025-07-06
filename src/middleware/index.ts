import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { checkRateLimit } from './rate-limiting'
import { addSecurityHeaders, checkCSRF, validateContentType, sanitizeHeaders } from './security'
import { createRequestLog, logRequest, logResponse, shouldLogRequest } from './logging'

// Export the middleware function for Next.js
export function middleware(request: NextRequest) {
  const startTime = Date.now()
  
  // Create request log for tracking
  const requestLog = createRequestLog(request)
  
  // Log incoming request
  if (shouldLogRequest(request)) {
    logRequest(requestLog)
  }

  // Sanitize headers
  sanitizeHeaders(request)

  // Check rate limiting first
  const rateLimitResponse = checkRateLimit(request)
  if (rateLimitResponse) {
    logResponse(requestLog, 429, Date.now() - startTime)
    return addSecurityHeaders(rateLimitResponse)
  }

  // Check CSRF protection
  const csrfResponse = checkCSRF(request)
  if (csrfResponse) {
    logResponse(requestLog, 403, Date.now() - startTime)
    return addSecurityHeaders(csrfResponse)
  }

  // Validate content type for API requests
  const contentTypeResponse = validateContentType(request)
  if (contentTypeResponse) {
    logResponse(requestLog, 400, Date.now() - startTime)
    return addSecurityHeaders(contentTypeResponse)
  }

  // Continue with the request
  const response = NextResponse.next()
  
  // Add security headers
  addSecurityHeaders(response)
  
  // Log response
  logResponse(requestLog, 200, Date.now() - startTime)

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
     * - api/auth (NextAuth.js routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
}

// Export middleware modules for use in other parts of the application
export * from './rate-limiting'
export * from './security'
export * from './logging'
export * from './input-validation' 