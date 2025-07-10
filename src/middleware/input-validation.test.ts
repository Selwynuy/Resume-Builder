import { NextRequest } from 'next/server'

import {
  createInputValidator,
  validateResumeRequest,
  validateTemplateRequest,
  validateReviewRequest,
  validateAIFeedbackRequest,
  validateAISummaryRequest,
  validateAIJobMatchRequest,
  validateUrlParams,
  validateQueryParams,
  ResumeRequestSchema
} from './input-validation'

// Helper function to create mock requests with absolute URLs
function createMockRequest(
  path: string,
  method: string,
  body?: any,
  headers?: Record<string, string>
): NextRequest {
  const url = `http://localhost:3000${path}`
  const request = new NextRequest(url, {
    method,
    headers: {
      'content-type': 'application/json',
      ...headers
    }
  })

  // Mock the json method
  if (body) {
    request.json = jest.fn().mockResolvedValue(body)
  }

  return request
}

describe('Input Validation Middleware', () => {
  describe('createInputValidator', () => {
    it('should validate valid input successfully', async () => {
      const schema = ResumeRequestSchema
      const validator = createInputValidator(schema, { sanitize: true })
      
      const validData = {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          location: 'New York, NY',
          summary: 'Experienced developer'
        },
        experiences: [{
          company: 'Tech Corp',
          position: 'Software Engineer',
          startDate: '2020-01',
          endDate: '2023-01',
          description: 'Developed web applications'
        }],
        education: [{
          school: 'University',
          degree: 'Computer Science',
          field: 'Software Engineering',
          graduationDate: '2019-05',
          gpa: '3.8'
        }],
        skills: [{
          name: 'JavaScript',
          level: 'Advanced',
          years: 5,
          certification: 'AWS Certified',
          context: 'Web Development'
        }],
        title: 'Software Engineer Resume',
        template: 'professional',
        isDraft: false
      }

      const request = createMockRequest('/api/resumes', 'POST', validData)
      const result = await validator(request)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should reject requests with invalid data', async () => {
      const schema = ResumeRequestSchema
      const validator = createInputValidator(schema)
      
      const invalidData = {
        personalInfo: {
          name: '', // Invalid: empty name
          email: 'invalid-email', // Invalid: not an email
          phone: '123', // Invalid: too short
          location: 'A'.repeat(300), // Invalid: too long
          summary: 'Valid summary'
        }
      }

      const request = createMockRequest('/api/resumes', 'POST', invalidData)
      const result = await validator(request)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.response.status).toBe(400)
        const data = await result.response.json()
        expect(data.error).toBe('Invalid input data')
        expect(data.details).toBeDefined()
        expect(data.details.length).toBeGreaterThan(0)
      }
    })

    it('should reject requests with oversized body', async () => {
      const schema = ResumeRequestSchema
      const validator = createInputValidator(schema, { maxBodySize: 100 }) // 100 bytes limit
      
      const largeData = {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          summary: 'A'.repeat(200) // This will exceed 100 bytes
        }
      }

      const request = createMockRequest('/api/resumes', 'POST', largeData, {
        'content-length': '500' // Simulate large request
      })
      const result = await validator(request)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.response.status).toBe(413)
        const data = await result.response.json()
        expect(data.error).toBe('Request body too large')
      }
    })

    it('should handle JSON parsing errors', async () => {
      const schema = ResumeRequestSchema
      const validator = createInputValidator(schema)
      
      const request = createMockRequest('/api/resumes', 'POST')
      request.json = jest.fn().mockRejectedValue(new SyntaxError('Invalid JSON'))
      
      const result = await validator(request)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.response.status).toBe(400)
        const data = await result.response.json()
        expect(data.error).toBe('Invalid JSON in request body')
      }
    })

    it('should sanitize input when sanitize option is enabled', async () => {
      const schema = ResumeRequestSchema
      const validator = createInputValidator(schema, { sanitize: true })
      
      const dataWithScript = {
        personalInfo: {
          name: 'John Doe<script>alert("xss")</script>',
          email: 'john@example.com',
          summary: 'Valid summary'
        }
      }

      const request = createMockRequest('/api/resumes', 'POST', dataWithScript)
      const result = await validator(request)

      expect(result.success).toBe(true)
      if (result.success) {
        // The script tag should be sanitized
        expect(result.data.personalInfo.name).not.toContain('<script>')
        expect(result.data.personalInfo.name).toContain('&lt;script&gt;')
      }
    })
  })

  describe('Resume Request Validation', () => {
    it('should validate valid resume data', async () => {
      const validData = {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          location: 'New York, NY',
          summary: 'Experienced developer'
        },
        experiences: [{
          company: 'Tech Corp',
          position: 'Software Engineer',
          startDate: '2020-01',
          endDate: '2023-01',
          description: 'Developed web applications'
        }],
        title: 'Software Engineer Resume',
        isDraft: true
      }

      const request = createMockRequest('/api/resumes', 'POST', validData)
      const result = await validateResumeRequest(request)

      expect(result.success).toBe(true)
    })

    it('should reject resume with too many experiences', async () => {
      const dataWithTooManyExperiences = {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        experiences: Array(150).fill({
          company: 'Tech Corp',
          position: 'Software Engineer',
          startDate: '2020-01',
          endDate: '2023-01',
          description: 'Developed web applications'
        })
      }

      const request = createMockRequest('/api/resumes', 'POST', dataWithTooManyExperiences)
      const result = await validateResumeRequest(request)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.response.status).toBe(400)
      }
    })
  })

  describe('Template Request Validation', () => {
    it('should validate valid template data', async () => {
      const validData = {
        name: 'Professional Template',
        description: 'A clean professional template',
        category: 'professional',
        price: 0,
        htmlTemplate: '<div>{{personalInfo.name}}</div>',
        placeholders: ['{{personalInfo.name}}', '{{personalInfo.email}}'],
        layout: 'single-column'
      }

      const request = createMockRequest('/api/templates', 'POST', validData)
      const result = await validateTemplateRequest(request)

      expect(result.success).toBe(true)
    })

    it('should reject template with invalid category', async () => {
      const invalidData = {
        name: 'Test Template',
        description: 'Test description',
        category: 'invalid-category', // Invalid category
        price: 0,
        htmlTemplate: '<div>Test</div>',
        placeholders: ['{{test}}']
      }

      const request = createMockRequest('/api/templates', 'POST', invalidData)
      const result = await validateTemplateRequest(request)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.response.status).toBe(400)
      }
    })
  })

  describe('Review Request Validation', () => {
    it('should validate valid review data', async () => {
      const validData = {
        rating: 5,
        comment: 'Great template!'
      }

      const request = createMockRequest('/api/templates/123/reviews', 'POST', validData)
      const result = await validateReviewRequest(request)

      expect(result.success).toBe(true)
    })

    it('should reject review with invalid rating', async () => {
      const invalidData = {
        rating: 6, // Invalid: should be 1-5
        comment: 'Great template!'
      }

      const request = createMockRequest('/api/templates/123/reviews', 'POST', invalidData)
      const result = await validateReviewRequest(request)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.response.status).toBe(400)
      }
    })
  })

  describe('AI Request Validation', () => {
    it('should validate AI feedback request', async () => {
      const validData = {
        sectionText: 'Developed web applications using React and Node.js'
      }

      const request = createMockRequest('/api/ai/feedback', 'POST', validData)
      const result = await validateAIFeedbackRequest(request)

      expect(result.success).toBe(true)
    })

    it('should validate AI summary request', async () => {
      const validData = {
        mode: 'generate'
      }

      const request = createMockRequest('/api/ai/summary', 'POST', validData)
      const result = await validateAISummaryRequest(request)

      expect(result.success).toBe(true)
    })

    it('should validate AI job match request', async () => {
      const validData = {
        resume: 'Experienced software engineer...',
        jobDescription: 'We are looking for a software engineer...'
      }

      const request = createMockRequest('/api/ai/job-match', 'POST', validData)
      const result = await validateAIJobMatchRequest(request)

      expect(result.success).toBe(true)
    })

    it('should reject AI request with missing required fields', async () => {
      const invalidData = {
        // Missing required fields
      }

      const request = createMockRequest('/api/ai/feedback', 'POST', invalidData)
      const result = await validateAIFeedbackRequest(request)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.response.status).toBe(400)
      }
    })
  })

  describe('URL Parameters Validation', () => {
    it('should validate valid URL parameters', () => {
      const params = {
        id: '507f1f77bcf86cd799439011',
        resumeId: '507f1f77bcf86cd799439012'
      }
      const requiredParams = ['id']

      const result = validateUrlParams(params, requiredParams)

      expect(result.success).toBe(true)
      expect(result.validatedParams).toEqual(params)
    })

    it('should reject missing required parameters', () => {
      const params = {
        resumeId: '507f1f77bcf86cd799439012'
      }
      const requiredParams = ['id', 'resumeId']

      const result = validateUrlParams(params, requiredParams)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.response?.status).toBe(400)
      }
    })

    it('should reject invalid ObjectId format', () => {
      const params = {
        id: 'invalid-id-format'
      }
      const requiredParams = ['id']

      const result = validateUrlParams(params, requiredParams)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.response?.status).toBe(400)
      }
    })
  })

  describe('Query Parameters Validation', () => {
    it('should validate valid query parameters', () => {
      const query = new URLSearchParams({
        category: 'professional',
        search: 'developer',
        limit: '20',
        page: '1'
      })
      const allowedParams = ['category', 'search', 'limit', 'page']

      const result = validateQueryParams(query, allowedParams)

      expect(result.success).toBe(true)
      expect(result.validatedParams).toEqual({
        category: 'professional',
        search: 'developer',
        limit: '20',
        page: '1'
      })
    })

    it('should reject invalid query parameters', () => {
      const query = new URLSearchParams({
        category: 'professional',
        invalidParam: 'value'
      })
      const allowedParams = ['category']

      const result = validateQueryParams(query, allowedParams)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.response?.status).toBe(400)
      }
    })

    it('should validate array length for array parameters', () => {
      const skills = Array(150).fill('JavaScript').join(',')
      const query = new URLSearchParams({
        skills
      })
      const allowedParams = ['skills']

      const result = validateQueryParams(query, allowedParams)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.response?.status).toBe(400)
      }
    })

    it('should handle empty query parameters', () => {
      const query = new URLSearchParams()
      const allowedParams = ['category', 'search']

      const result = validateQueryParams(query, allowedParams)

      expect(result.success).toBe(true)
      expect(result.validatedParams).toEqual({})
    })
  })
}) 