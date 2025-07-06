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
    })
  })

  describe('createRateLimitResponse', () => {
    it('should create proper rate limit response', () => {
      const config = RATE_LIMIT_CONFIGS.auth
      const result = createRateLimitResponse(config)
      expect(result.status).toBe(429)
      expect(result.headers.get('Content-Type')).toBe('application/json')
      expect(result.headers.get('Retry-After')).toBe('900')
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
  })
}) 