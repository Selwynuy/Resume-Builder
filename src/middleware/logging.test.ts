import { NextRequest, NextResponse } from 'next/server'
import { 
  logRequest, 
  logResponse, 
  logError, 
  createRequestLog, 
  shouldLogRequest,
  DEFAULT_LOGGING_CONFIG,
  type RequestLog 
} from './logging'

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation()
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation()

describe('Logging Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    mockConsoleLog.mockRestore()
    mockConsoleError.mockRestore()
  })

  const createMockRequest = (path: string = '/api/test', method: string = 'GET') => {
    const request = new NextRequest(`http://localhost${path}`, { method })
    request.headers.set('user-agent', 'Mozilla/5.0 (Test Browser)')
    request.headers.set('x-forwarded-for', '192.168.1.1')
    return request
  }

  describe('createRequestLog', () => {
    it('should create request log with all required fields', () => {
      const request = createMockRequest('/api/resumes', 'POST')

      const log = createRequestLog(request)

      expect(log.timestamp).toBeDefined()
      expect(log.method).toBe('POST')
      expect(log.url).toBe('/api/resumes')
      expect(log.ip).toBe('192.168.1.1')
      expect(log.userAgent).toBe('Mozilla/5.0 (Test Browser)')
    })

    it('should handle missing headers gracefully', () => {
      const request = createMockRequest('/api/test')
      request.headers.delete('x-forwarded-for')
      request.headers.delete('user-agent')

      const log = createRequestLog(request)

      expect(log.ip).toBe('unknown')
      expect(log.userAgent).toBe('unknown')
    })
  })

  describe('shouldLogRequest', () => {
    it('should return true for loggable requests', () => {
      const request = createMockRequest('/api/resumes')

      const result = shouldLogRequest(request)

      expect(result).toBe(true)
    })

    it('should return false for excluded paths', () => {
      const excludedPaths = [
        '/_next/static',
        '/_next/image',
        '/favicon.ico',
        '/api/auth/session',
        '/api/auth/_log'
      ]

      excludedPaths.forEach(path => {
        const request = createMockRequest(path)
        const result = shouldLogRequest(request)
        expect(result).toBe(false)
      })
    })

    it('should return false when logging is disabled', () => {
      const request = createMockRequest('/api/resumes')
      const config = { ...DEFAULT_LOGGING_CONFIG, enabled: false }

      const result = shouldLogRequest(request, config)

      expect(result).toBe(false)
    })
  })

  describe('logRequest', () => {
    it('should log request details', () => {
      const request = createMockRequest('/api/resumes', 'POST')
      const log = createRequestLog(request)

      logRequest(log)

      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('POST /api/resumes')
      )
    })

    it('should not log excluded paths', () => {
      const request = createMockRequest('/api/auth/session')
      const log = createRequestLog(request)

      logRequest(log)

      expect(mockConsoleLog).not.toHaveBeenCalled()
    })
  })

  describe('logResponse', () => {
    it('should log successful responses', () => {
      const request = createMockRequest('/api/resumes')
      const log = createRequestLog(request)

      logResponse(log, 200, 150)

      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('GET /api/resumes - 200 (150ms)')
      )
    })

    it('should log error responses', () => {
      const request = createMockRequest('/api/resumes', 'POST')
      const log = createRequestLog(request)

      logResponse(log, 404, 50)

      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('POST /api/resumes - 404 (50ms)')
      )
    })

    it('should not log excluded paths', () => {
      const request = createMockRequest('/api/auth/session')
      const log = createRequestLog(request)

      logResponse(log, 200, 100)

      expect(mockConsoleLog).not.toHaveBeenCalled()
    })
  })

  describe('logError', () => {
    it('should log error details', () => {
      const request = createMockRequest('/api/resumes')
      const error = new Error('Database connection failed')

      logError(error, request)

      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('GET /api/resumes')
      )
    })

    it('should include error stack trace', () => {
      const request = createMockRequest('/api/resumes')
      const error = new Error('Test error')

      logError(error, request)

      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('Test error')
      )
    })

    it('should not log errors for excluded paths', () => {
      const request = createMockRequest('/api/auth/session')
      const error = new Error('Test error')

      logError(error, request)

      expect(mockConsoleError).not.toHaveBeenCalled()
    })
  })

  describe('DEFAULT_LOGGING_CONFIG', () => {
    it('should have correct default configuration', () => {
      expect(DEFAULT_LOGGING_CONFIG.enabled).toBe(true)
      expect(DEFAULT_LOGGING_CONFIG.logLevel).toBe('info')
      expect(DEFAULT_LOGGING_CONFIG.excludePaths).toContain('/_next/static')
      expect(DEFAULT_LOGGING_CONFIG.excludePaths).toContain('/api/auth/session')
      expect(DEFAULT_LOGGING_CONFIG.includeHeaders).toContain('user-agent')
    })
  })

  describe('Integration tests', () => {
    it('should handle complete request-response cycle', () => {
      const request = createMockRequest('/api/resumes', 'POST')
      const log = createRequestLog(request)

      logRequest(log)
      logResponse(log, 201, 200)

      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('POST /api/resumes')
      )
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('POST /api/resumes - 201 (200ms)')
      )
    })

    it('should handle error scenarios', () => {
      const request = createMockRequest('/api/resumes', 'POST')
      const error = new Error('Validation failed')

      logError(error, request)

      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('POST /api/resumes')
      )
    })
  })
}) 