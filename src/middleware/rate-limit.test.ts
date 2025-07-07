import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, RATE_LIMIT_CONFIGS, createRateLimitResponse, clearRateLimitStore } from './rate-limiting'

describe('Rate Limiting Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    clearRateLimitStore()
  })

  const createMockRequest = (ip: string = '127.0.0.1', path: string = '/api/test') => {
    const request = new NextRequest(`http://localhost${path}`)
    // Mock the IP address
    Object.defineProperty(request, 'ip', {
      value: ip,
      writable: true
    })
    return request
  }

  describe('checkRateLimit', () => {
    it('should return null for requests within rate limit', () => {
      const request = createMockRequest()
      // By default, the in-memory store is empty, so should not be rate limited
      const result = checkRateLimit(request)
      expect(result).toBeNull()
    })

    it('should return rate limit response for exceeded requests', () => {
      // Simulate exceeding the rate limit by calling checkRateLimit multiple times
      const request = createMockRequest('127.0.0.1', '/api/auth/login')
      for (let i = 0; i < RATE_LIMIT_CONFIGS.auth.maxRequests; i++) {
        checkRateLimit(request)
      }
      const result = checkRateLimit(request)
      expect(result).not.toBeNull()
      expect(result?.status).toBe(429)
    })

    it('should apply different limits to different paths', () => {
      const authRequest = createMockRequest('127.0.0.1', '/api/auth/login')
      const resumeRequest = createMockRequest('127.0.0.1', '/api/resumes/123')
      const apiRequest = createMockRequest('127.0.0.1', '/api/templates')

      // All should not be rate limited initially
      expect(checkRateLimit(authRequest)).toBeNull()
      expect(checkRateLimit(resumeRequest)).toBeNull()
      expect(checkRateLimit(apiRequest)).toBeNull()
    });

    it('should handle general API endpoints', () => {
      const request = createMockRequest('127.0.0.1', '/api/some-other-endpoint')
      // Exceed the general API limit
      for (let i = 0; i < RATE_LIMIT_CONFIGS.api.maxRequests; i++) {
        checkRateLimit(request)
      }
      const result = checkRateLimit(request)
      expect(result).not.toBeNull()
      expect(result?.status).toBe(429)
    });

    it('should handle general non-API paths', () => {
      const request = createMockRequest('127.0.0.1', '/some-other-path')
      // General paths should not be rate limited by default
      const result = checkRateLimit(request)
      expect(result).toBeNull()
    });

    it('should handle session management paths', () => {
      const sessionRequest = createMockRequest('127.0.0.1', '/api/auth/session')
      const logRequest = createMockRequest('127.0.0.1', '/api/auth/_log')
      
      // Exceed the session limit
      for (let i = 0; i < RATE_LIMIT_CONFIGS.session.maxRequests; i++) {
        checkRateLimit(sessionRequest)
      }
      const sessionResult = checkRateLimit(sessionRequest)
      expect(sessionResult).not.toBeNull()
      expect(sessionResult?.status).toBe(429)

      // Log requests should also be rate limited
      for (let i = 0; i < RATE_LIMIT_CONFIGS.session.maxRequests; i++) {
        checkRateLimit(logRequest)
      }
      const logResult = checkRateLimit(logRequest)
      expect(logResult).not.toBeNull()
      expect(logResult?.status).toBe(429)
    });

    it('should handle AI endpoints with strict limiting', () => {
      const request = createMockRequest('127.0.0.1', '/api/ai/summary')
      // Exceed the AI limit
      for (let i = 0; i < RATE_LIMIT_CONFIGS.ai.maxRequests; i++) {
        checkRateLimit(request)
      }
      const result = checkRateLimit(request)
      expect(result).not.toBeNull()
      expect(result?.status).toBe(429)
    });

    it('should handle template endpoints', () => {
      const request = createMockRequest('127.0.0.1', '/api/templates/123')
      // Exceed the template limit
      for (let i = 0; i < RATE_LIMIT_CONFIGS.template.maxRequests; i++) {
        checkRateLimit(request)
      }
      const result = checkRateLimit(request)
      expect(result).not.toBeNull()
      expect(result?.status).toBe(429)
    });

    it('should handle resume endpoints', () => {
      const request = createMockRequest('127.0.0.1', '/api/resumes/123/edit')
      // Exceed the resume limit
      for (let i = 0; i < RATE_LIMIT_CONFIGS.resume.maxRequests; i++) {
        checkRateLimit(request)
      }
      const result = checkRateLimit(request)
      expect(result).not.toBeNull()
      expect(result?.status).toBe(429)
    });

    it('should handle requests without IP address', () => {
      const request = createMockRequest('', '/api/test')
      Object.defineProperty(request, 'ip', { value: null })
      const result = checkRateLimit(request)
      expect(result).toBeNull()
    });

    it('should handle requests with x-forwarded-for header', () => {
      const request = createMockRequest('', '/api/test')
      Object.defineProperty(request, 'ip', { value: null })
      request.headers.set('x-forwarded-for', '192.168.1.1')
      const result = checkRateLimit(request)
      expect(result).toBeNull()
    });
  })

  describe('createRateLimitResponse', () => {
    it('should create proper rate limit response', () => {
      const config = RATE_LIMIT_CONFIGS.auth
      const result = createRateLimitResponse(config)
      expect(result.status).toBe(429)
      expect(result.headers.get('Content-Type')).toBe('application/json')
      expect(result.headers.get('Retry-After')).toBe('900')
    })

    it('should create response with custom error message', async () => {
      const config = { ...RATE_LIMIT_CONFIGS.auth, errorMessage: 'Custom error message' }
      const result = createRateLimitResponse(config)
      const body = await result.text()
      const parsedBody = JSON.parse(body)
      expect(parsedBody.error).toBe('Custom error message')
    })

    it('should create response with default error message', async () => {
      const config = { maxRequests: 10, windowMs: 60000 }
      const result = createRateLimitResponse(config)
      const body = await result.text()
      const parsedBody = JSON.parse(body)
      expect(parsedBody.error).toBe('Rate limit exceeded')
    })
  })

  describe('RATE_LIMIT_CONFIGS', () => {
    it('should have correct auth configuration', () => {
      expect(RATE_LIMIT_CONFIGS.auth.maxRequests).toBe(5)
      expect(RATE_LIMIT_CONFIGS.auth.windowMs).toBe(15 * 60 * 1000)
      expect(RATE_LIMIT_CONFIGS.auth.errorMessage).toBe('Too many authentication attempts')
    })

    it('should have correct session configuration', () => {
      expect(RATE_LIMIT_CONFIGS.session.maxRequests).toBe(100)
      expect(RATE_LIMIT_CONFIGS.session.windowMs).toBe(15 * 60 * 1000)
      expect(RATE_LIMIT_CONFIGS.session.errorMessage).toBe('Too many session requests')
    })

    it('should have correct api configuration', () => {
      expect(RATE_LIMIT_CONFIGS.api.maxRequests).toBe(100)
      expect(RATE_LIMIT_CONFIGS.api.windowMs).toBe(15 * 60 * 1000)
      expect(RATE_LIMIT_CONFIGS.api.errorMessage).toBe('Too many requests')
    })

    it('should have correct resume configuration', () => {
      expect(RATE_LIMIT_CONFIGS.resume.maxRequests).toBe(50)
      expect(RATE_LIMIT_CONFIGS.resume.windowMs).toBe(15 * 60 * 1000)
      expect(RATE_LIMIT_CONFIGS.resume.errorMessage).toBe('Too many resume operations')
    })

    it('should have correct ai configuration', () => {
      expect(RATE_LIMIT_CONFIGS.ai.maxRequests).toBe(20)
      expect(RATE_LIMIT_CONFIGS.ai.windowMs).toBe(15 * 60 * 1000)
      expect(RATE_LIMIT_CONFIGS.ai.errorMessage).toBe('Too many AI requests. Please wait before making more requests.')
    })

    it('should have correct template configuration', () => {
      expect(RATE_LIMIT_CONFIGS.template.maxRequests).toBe(30)
      expect(RATE_LIMIT_CONFIGS.template.windowMs).toBe(15 * 60 * 1000)
      expect(RATE_LIMIT_CONFIGS.template.errorMessage).toBe('Too many template operations')
    })
  })
}) 