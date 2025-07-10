import { registerUser, type RegistrationData } from './register'

import { ZodError } from 'zod'

// Mock dependencies for registerUser unit tests
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('@/lib/security', () => ({
  UserRegistrationSchema: {
    safeParse: jest.fn()
  }
}))

jest.mock('@/models/User', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}))

import connectDB from '@/lib/db'
import { UserRegistrationSchema } from '@/lib/security'
import User from '@/models/User'

const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>
const mockUserRegistrationSchema = UserRegistrationSchema as jest.Mocked<typeof UserRegistrationSchema>
const mockUser = User as jest.Mocked<typeof User>

describe('Registration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  describe('registerUser', () => {
    const validRegistrationData: RegistrationData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass123!'
    }

    it('should successfully register a new user', async () => {
      // Mock validation success
      mockUserRegistrationSchema.safeParse.mockReturnValue({
        success: true,
        data: validRegistrationData
      })

      // Mock no existing user
      mockUser.findOne.mockResolvedValue(null)

      // Mock user creation
      const mockCreatedUser = {
        _id: 'user123',
        email: 'test@example.com',
        name: 'Test User'
      }
      mockUser.create.mockResolvedValue(mockCreatedUser as any)

      const result = await registerUser(validRegistrationData)

      expect(mockConnectDB).toHaveBeenCalled()
      expect(mockUser.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })
      expect(mockUser.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User'
      })
      expect(result.success).toBe(true)
      expect(result.user).toEqual({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User'
      })
    })

    it('should return error for invalid input', async () => {
      // Mock validation failure
      mockUserRegistrationSchema.safeParse.mockReturnValue({
        success: false,
        error: new ZodError([
          {
            code: 'custom',
            message: 'Invalid email format',
            path: ['email'],
          },
        ]),
      })

      const result = await registerUser(validRegistrationData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid input: Invalid email format')
    })

    it('should return error when user already exists', async () => {
      // Mock validation success
      mockUserRegistrationSchema.safeParse.mockReturnValue({
        success: true,
        data: validRegistrationData
      })

      // Mock existing user
      mockUser.findOne.mockResolvedValue({ email: 'test@example.com' })

      const result = await registerUser(validRegistrationData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('User already exists')
      expect(mockUser.create).not.toHaveBeenCalled()
    })

    it('should handle database errors', async () => {
      // Mock validation success
      mockUserRegistrationSchema.safeParse.mockReturnValue({
        success: true,
        data: validRegistrationData
      })

      // Mock no existing user
      mockUser.findOne.mockResolvedValue(null)

      // Mock database error
      mockUser.create.mockRejectedValue(new Error('Database connection failed'))

      const result = await registerUser(validRegistrationData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Registration failed')
    })

    it('should normalize email to lowercase', async () => {
      const dataWithUppercaseEmail = {
        ...validRegistrationData,
        email: 'TEST@EXAMPLE.COM'
      }

      // Mock validation success
      mockUserRegistrationSchema.safeParse.mockReturnValue({
        success: true,
        data: dataWithUppercaseEmail
      })

      // Mock no existing user
      mockUser.findOne.mockResolvedValue(null)

      // Mock user creation
      const mockCreatedUser = {
        _id: 'user123',
        email: 'test@example.com',
        name: 'Test User'
      }
      mockUser.create.mockResolvedValue(mockCreatedUser as any)

      await registerUser(dataWithUppercaseEmail)

      expect(mockUser.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })
      expect(mockUser.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User'
      })
    })

    it('should trim name', async () => {
      const dataWithWhitespace = {
        ...validRegistrationData,
        name: '  Test User  '
      }

      // Mock validation success
      mockUserRegistrationSchema.safeParse.mockReturnValue({
        success: true,
        data: dataWithWhitespace
      })

      // Mock no existing user
      mockUser.findOne.mockResolvedValue(null)

      // Mock user creation
      const mockCreatedUser = {
        _id: 'user123',
        email: 'test@example.com',
        name: 'Test User'
      }
      mockUser.create.mockResolvedValue(mockCreatedUser as any)

      await registerUser(dataWithWhitespace)

      expect(mockUser.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User'
      })
    })
  })
}) 