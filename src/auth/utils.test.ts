import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'

import { requireCreator, requireAdmin, isCreator, isAdmin } from './utils'

// Mock next-auth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn()
}))

// Mock dependencies
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('@/models/User', () => ({
  __esModule: true,
  default: jest.fn()
}))

// Add missing mock users
const mockCreator = { _id: '1', email: 'creator@example.com', role: 'creator' }
const mockAdmin = { _id: '2', email: 'admin@example.com', role: 'admin' }
const mockUser = { _id: '3', email: 'user@example.com', role: 'user' }

describe('Auth Utils', () => {
  let mockUserModel: jest.Mocked<any>

  beforeEach(() => {
    jest.clearAllMocks()
    mockUserModel = {
      findOne: jest.fn(),
      findById: jest.fn()
    }
    
    // Update the mock
    const User = require('@/models/User').default
    Object.assign(User, mockUserModel)
  })

  describe('requireCreator', () => {
    it('should return session for creator role', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'creator@example.com' } })
      mockUserModel.findOne.mockResolvedValue(mockCreator)
      await expect(requireCreator()).rejects.toThrow('NEXT_REDIRECT')
    })
    it('should return session for admin role', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'admin@example.com' } })
      mockUserModel.findOne.mockResolvedValue(mockAdmin)
      await expect(requireCreator()).rejects.toThrow('NEXT_REDIRECT')
    })
    it('should throw error for user role', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'user@example.com' } })
      mockUserModel.findOne.mockResolvedValue(mockUser)
      await expect(requireCreator()).rejects.toThrow('NEXT_REDIRECT')
    })
    it('should throw error for no session', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)
      await expect(requireCreator()).rejects.toThrow('NEXT_REDIRECT')
    })
    it('should throw error for user not found', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'notfound@example.com' } })
      mockUserModel.findOne.mockResolvedValue(null)
      await expect(requireCreator()).rejects.toThrow('NEXT_REDIRECT')
    })
  })
  describe('requireAdmin', () => {
    it('should return session for admin role', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'admin@example.com' } })
      mockUserModel.findOne.mockResolvedValue(mockAdmin)
      await expect(requireAdmin()).rejects.toThrow('NEXT_REDIRECT')
    })
    it('should throw error for creator role', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'creator@example.com' } })
      mockUserModel.findOne.mockResolvedValue(mockCreator)
      await expect(requireAdmin()).rejects.toThrow('NEXT_REDIRECT')
    })
    it('should throw error for user role', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'user@example.com' } })
      mockUserModel.findOne.mockResolvedValue(mockUser)
      await expect(requireAdmin()).rejects.toThrow('NEXT_REDIRECT')
    })
  })

  describe('isCreator', () => {
    it('should return true for creator role', () => {
      expect(isCreator('creator')).toBe(true)
    })

    it('should return true for admin role', () => {
      expect(isCreator('admin')).toBe(true)
    })

    it('should return false for user role', () => {
      expect(isCreator('user')).toBe(false)
    })
  })

  describe('isAdmin', () => {
    it('should return true for admin role', () => {
      expect(isAdmin('admin')).toBe(true)
    })

    it('should return false for creator role', () => {
      expect(isAdmin('creator')).toBe(false)
    })

    it('should return false for user role', () => {
      expect(isAdmin('user')).toBe(false)
    })
  })
}) 