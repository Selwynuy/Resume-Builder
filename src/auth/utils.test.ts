import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth/next'

import {
  getCurrentSession,
  getCurrentUserId,
  getCurrentUserEmail,
  requireAuth,
  requireAdmin,
  isAdmin,
  optionalAuth
} from './utils'

// Mock NextAuth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn()
}))

// Mock auth config
jest.mock('./config', () => ({
  authOptions: {}
}))

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

describe('Auth Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCurrentSession', () => {
    it('should return session from getServerSession', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User'
        },
        expires: '2024-12-31'
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await getCurrentSession()

      expect(mockGetServerSession).toHaveBeenCalledWith({})
      expect(result).toEqual(mockSession)
    })

    it('should return null when no session', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const result = await getCurrentSession()

      expect(result).toBeNull()
    })
  })

  describe('getCurrentUserId', () => {
    it('should return user ID from session', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com'
        }
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await getCurrentUserId()

      expect(result).toBe('user123')
    })

    it('should return null when no session', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const result = await getCurrentUserId()

      expect(result).toBeNull()
    })

    it('should return null when no user ID', async () => {
      const mockSession = {
        user: {
          email: 'test@example.com'
        }
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await getCurrentUserId()

      expect(result).toBeNull()
    })
  })

  describe('getCurrentUserEmail', () => {
    it('should return user email from session', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com'
        }
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await getCurrentUserEmail()

      expect(result).toBe('test@example.com')
    })

    it('should return null when no session', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const result = await getCurrentUserEmail()

      expect(result).toBeNull()
    })

    it('should return null when no user email', async () => {
      const mockSession = {
        user: {
          id: 'user123'
        }
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await getCurrentUserEmail()

      expect(result).toBeNull()
    })
  })

  describe('requireAuth', () => {
    it('should return session when authenticated', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com'
        }
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await requireAuth()

      expect(result).toEqual(mockSession)
    })

    it('should redirect when not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)
      await expect(requireAuth()).rejects.toThrow('NEXT_REDIRECT')
    })
  })

  describe('requireAdmin', () => {
    it('should return session when user is admin', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'admin@resumebuilder.com'
        }
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await requireAdmin()

      expect(result).toEqual(mockSession)
    })

    it('should redirect to login when not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)
      await expect(requireAdmin()).rejects.toThrow('NEXT_REDIRECT')
    })

    it('should redirect to dashboard when not admin', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'user@example.com'
        }
      }
      mockGetServerSession.mockResolvedValue(mockSession)
      await expect(requireAdmin()).rejects.toThrow('NEXT_REDIRECT')
    })
  })

  describe('isAdmin', () => {
    it('should return true for admin emails', () => {
      expect(isAdmin('admin@resumebuilder.com')).toBe(true)
      expect(isAdmin('selwyn.cybersec@gmail.com')).toBe(true)
    })

    it('should return false for non-admin emails', () => {
      expect(isAdmin('user@example.com')).toBe(false)
      expect(isAdmin('test@gmail.com')).toBe(false)
      expect(isAdmin('')).toBe(false)
    })
  })

  describe('optionalAuth', () => {
    it('should return session when available', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com'
        }
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await optionalAuth()

      expect(result).toEqual(mockSession)
    })

    it('should return null when no session', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const result = await optionalAuth()

      expect(result).toBeNull()
    })
  })
}) 