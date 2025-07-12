import { NextRequest } from 'next/server'
import { GET } from './route'
import { requireCreator } from '@/auth'

// Mock dependencies
jest.mock('@/auth', () => ({
  requireCreator: jest.fn()
}))

jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('@/models/User', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn()
  }
}))

jest.mock('@/models/Template', () => ({
  __esModule: true,
  default: {
    countDocuments: jest.fn(),
    find: jest.fn()
  }
}))

describe('/api/creator/templates', () => {
  let mockLean: jest.Mock
  let mockLimit: jest.Mock
  let mockSkip: jest.Mock
  let mockSort: jest.Mock
  let mockFind: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup mock chain
    mockLean = jest.fn()
    mockLimit = jest.fn().mockReturnValue({ lean: mockLean })
    mockSkip = jest.fn().mockReturnValue({ limit: mockLimit })
    mockSort = jest.fn().mockReturnValue({ skip: mockSkip })
    mockFind = jest.fn().mockReturnValue({ sort: mockSort })
    
    // Update the mock
    const Template = require('@/models/Template').default
    Template.find = mockFind
  })

  it('should require creator role', async () => {
    (requireCreator as jest.Mock).mockRejectedValue(new Error('Creator role required'))
    const req = new NextRequest('http://localhost/api/creator/templates')
    const res = await GET(req)
    expect(res.status).toBe(500)
  })

  it('should return templates with pagination', async () => {
    const mockSession = { user: { email: 'creator@test.com' } }
    const mockUser = { _id: 'user123' }
    const mockTemplates = [{ _id: '1', name: 'Test' }]
    
    ;(requireCreator as jest.Mock).mockResolvedValue(mockSession)
    ;(await import('@/models/User')).default.findOne.mockResolvedValue(mockUser)
    ;(await import('@/models/Template')).default.countDocuments.mockResolvedValue(1)
    mockLean.mockResolvedValue(mockTemplates)

    const req = new NextRequest('http://localhost/api/creator/templates')
    const res = await GET(req)
    const data = await res.json()

    expect(data.templates).toEqual(mockTemplates)
    expect(data.pagination).toEqual({
      page: 1,
      limit: 5,
      total: 1,
      pages: 1
    })
  })

  it('should apply filters correctly', async () => {
    const mockSession = { user: { email: 'creator@test.com' } }
    const mockUser = { _id: 'user123' }
    
    ;(requireCreator as jest.Mock).mockResolvedValue(mockSession)
    ;(await import('@/models/User')).default.findOne.mockResolvedValue(mockUser)
    ;(await import('@/models/Template')).default.countDocuments.mockResolvedValue(0)
    mockLean.mockResolvedValue([])

    const req = new NextRequest('http://localhost/api/creator/templates?status=approved&category=professional&search=test&page=2&limit=10')
    await GET(req)

    expect(mockFind).toHaveBeenCalledWith({
      createdBy: 'user123',
      approvalStatus: 'approved',
      category: 'professional',
      name: { $regex: 'test', $options: 'i' }
    })
  })
}) 