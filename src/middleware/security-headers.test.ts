import { NextRequest, NextResponse } from 'next/server'

import { addSecurityHeaders, checkCSRF, validateContentType, sanitizeHeaders, securityHeaders, generateCSRFToken, validateCSRFToken } from './security'

describe('Security Headers Middleware', () => {
  const createMockRequest = (path: string = '/api/test', method: string = 'GET') => {
    return new NextRequest(`http://localhost${path}`, { method })
  }

  describe('addSecurityHeaders', () => {
    it('should add all required security headers', () => {
      const response = NextResponse.next()

      const result = addSecurityHeaders(response)

      expect(result.headers.get('X-Frame-Options')).toBe('DENY')
      expect(result.headers.get('X-Content-Type-Options')).toBe('nosniff')
      expect(result.headers.get('X-XSS-Protection')).toBe('1; mode=block')
      expect(result.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
      expect(result.headers.get('Permissions-Policy')).toBe('camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()')
      expect(result.headers.get('Strict-Transport-Security')).toBe('max-age=31536000; includeSubDomains; preload')
    })

    it('should add CSP header', () => {
      const response = NextResponse.next()

      const result = addSecurityHeaders(response)

      const cspHeader = result.headers.get('Content-Security-Policy')
      expect(cspHeader).toContain("default-src 'self'")
      expect(cspHeader).toContain("script-src 'self' 'unsafe-inline'")
      expect(cspHeader).toContain("style-src 'self' 'unsafe-inline'")
      expect(cspHeader).toContain("img-src 'self' data: https:")
      expect(cspHeader).toContain("font-src 'self' data:")
      expect(cspHeader).toContain("connect-src 'self' https:")
    })

    it('should preserve existing headers', () => {
      const response = NextResponse.next()
      response.headers.set('Custom-Header', 'custom-value')

      const result = addSecurityHeaders(response)

      expect(result.headers.get('Custom-Header')).toBe('custom-value')
      expect(result.headers.get('X-Frame-Options')).toBe('DENY')
    })

    it('should not override existing security headers', () => {
      const response = NextResponse.next()
      response.headers.set('X-Frame-Options', 'SAMEORIGIN')
      response.headers.set('X-Content-Type-Options', 'nosniff')

      const result = addSecurityHeaders(response)

      // Should preserve existing values
      expect(result.headers.get('X-Frame-Options')).toBe('SAMEORIGIN')
      expect(result.headers.get('X-Content-Type-Options')).toBe('nosniff')
    })
  })

  describe('CSRF Token Management', () => {
    it('should generate valid CSRF tokens', () => {
      const sessionId = 'test-session-123'
      const token1 = generateCSRFToken(sessionId)
      const token2 = generateCSRFToken(sessionId)

      expect(token1).toBeDefined()
      expect(token1).toHaveLength(64) // 32 bytes = 64 hex chars
      expect(token2).toBeDefined()
      expect(token2).toHaveLength(64)
      expect(token1).not.toBe(token2) // Should be different each time
    })

    it('should validate CSRF tokens correctly', () => {
      const sessionId = 'test-session-456'
      const token = generateCSRFToken(sessionId)

      // Valid token should pass
      expect(validateCSRFToken(sessionId, token)).toBe(true)

      // Invalid token should fail
      expect(validateCSRFToken(sessionId, 'invalid-token')).toBe(false)

      // Non-existent session should fail
      expect(validateCSRFToken('non-existent', token)).toBe(false)
    })

    it('should allow one-time use of CSRF tokens', () => {
      const sessionId = 'test-session-789'
      const token = generateCSRFToken(sessionId)

      // First use should succeed
      expect(validateCSRFToken(sessionId, token)).toBe(true)

      // Second use should fail (token consumed)
      expect(validateCSRFToken(sessionId, token)).toBe(false)
    })
  })

  describe('checkCSRF', () => {
    it('should allow same-origin requests', () => {
      const request = createMockRequest('/api/resumes')
      request.headers.set('origin', 'http://localhost:3000')
      request.headers.set('host', 'localhost:3000')

      const result = checkCSRF(request)

      expect(result).toBeNull()
    })

    it('should block cross-origin requests for state-changing methods', async () => {
      const request = createMockRequest('/api/resumes', 'POST')
      request.headers.set('origin', 'https://malicious-site.com')
      request.headers.set('host', 'localhost:3000')

      const result = checkCSRF(request)

      expect(result?.status).toBe(403)
      if (result) {
        const data = await result.json()
        expect(data.error).toBe('CSRF validation failed: Invalid origin')
      }
    })

    it('should allow GET requests regardless of origin', () => {
      const request = createMockRequest('/api/resumes', 'GET')
      request.headers.set('origin', 'https://malicious-site.com')

      const result = checkCSRF(request)

      expect(result).toBeNull()
    })

    it('should allow localhost origins', () => {
      const localhostOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001'
      ]

      localhostOrigins.forEach(origin => {
        const request = createMockRequest('/api/resumes', 'POST')
        request.headers.set('origin', origin)
        request.headers.set('host', 'localhost:3000')

        const result = checkCSRF(request)

        expect(result).toBeNull()
      })
    })

    it('should validate referer header', async () => {
      const request = createMockRequest('/api/resumes', 'POST')
      request.headers.set('origin', 'http://localhost:3000')
      request.headers.set('host', 'localhost:3000')
      request.headers.set('referer', 'https://malicious-site.com/attack')

      const result = checkCSRF(request)

      expect(result?.status).toBe(403)
      if (result) {
        const data = await result.json()
        expect(data.error).toBe('CSRF validation failed: Invalid referer')
      }
    })

    it('should allow valid referer headers', () => {
      const request = createMockRequest('/api/resumes', 'POST')
      request.headers.set('origin', 'http://localhost:3000')
      request.headers.set('host', 'localhost:3000')
      request.headers.set('referer', 'http://localhost:3000/dashboard')

      const result = checkCSRF(request)

      expect(result).toBeNull()
    })
  })

  describe('validateContentType', () => {
    it('should allow GET requests without content type', () => {
      const request = createMockRequest('/api/resumes', 'GET')

      const result = validateContentType(request)

      expect(result).toBeNull()
    })

    it('should require JSON content type for POST requests to API', () => {
      const request = createMockRequest('/api/resumes', 'POST')
      request.headers.set('content-type', 'text/plain')

      const result = validateContentType(request)

      expect(result?.status).toBe(400)
      if (result) {
        const data = result.json()
        expect(data).resolves.toEqual({ error: 'Content-Type must be application/json' })
      }
    })

    it('should allow JSON content type for POST requests', () => {
      const request = createMockRequest('/api/resumes', 'POST')
      request.headers.set('content-type', 'application/json')

      const result = validateContentType(request)

      expect(result).toBeNull()
    })

    it('should not validate content type for non-API routes', () => {
      const request = createMockRequest('/dashboard', 'POST')
      request.headers.set('content-type', 'text/plain')

      const result = validateContentType(request)

      expect(result).toBeNull()
    })
  })

  describe('sanitizeHeaders', () => {
    it('should remove dangerous headers', () => {
      const request = createMockRequest('/api/resumes')
      request.headers.set('x-forwarded-host', 'malicious-host')
      request.headers.set('x-forwarded-proto', 'https')
      request.headers.set('x-real-ip', '192.168.1.1')
      request.headers.set('x-forwarded-for', '192.168.1.1')

      sanitizeHeaders(request)

      expect(request.headers.get('x-forwarded-host')).toBeNull()
      expect(request.headers.get('x-forwarded-proto')).toBeNull()
      expect(request.headers.get('x-real-ip')).toBeNull()
      expect(request.headers.get('x-forwarded-for')).toBeNull()
    })

    it('should preserve safe headers', () => {
      const request = createMockRequest('/api/resumes')
      request.headers.set('authorization', 'Bearer token')
      request.headers.set('content-type', 'application/json')

      sanitizeHeaders(request)

      expect(request.headers.get('authorization')).toBe('Bearer token')
      expect(request.headers.get('content-type')).toBe('application/json')
    })
  })

  describe('securityHeaders', () => {
    it('should contain all required security headers', () => {
      expect(securityHeaders['X-Frame-Options']).toBe('DENY')
      expect(securityHeaders['X-Content-Type-Options']).toBe('nosniff')
      expect(securityHeaders['X-XSS-Protection']).toBe('1; mode=block')
      expect(securityHeaders['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
      expect(securityHeaders['Strict-Transport-Security']).toBe('max-age=31536000; includeSubDomains; preload')
      expect(securityHeaders['Content-Security-Policy']).toBeDefined()
      expect(securityHeaders['Permissions-Policy']).toBe('camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()')
    })
  })
}) 