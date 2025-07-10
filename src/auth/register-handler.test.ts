jest.mock('./register', () => ({
  __esModule: true,
  registerUser: jest.fn()
}));

import { registerUser } from './register'
import { handleRegistration } from './register-handler'

const mockRegisterUser = registerUser as jest.MockedFunction<typeof registerUser>

describe('handleRegistration', () => {
  const validRegistrationData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'SecurePass123!'
  }

  beforeEach(() => {
    mockRegisterUser.mockReset()
  })

  it('should return 201 status for successful registration', async () => {
    // Mock successful registration
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User'
    }
    mockRegisterUser.mockResolvedValue({
      success: true,
      user: mockUser
    })

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(validRegistrationData)
    })

    const response = await handleRegistration(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data).toEqual(mockUser)
  })

  it('should return 400 status for failed registration', async () => {
    mockRegisterUser.mockResolvedValue({
      success: false,
      error: 'User already exists'
    })

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(validRegistrationData)
    })

    const response = await handleRegistration(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('User already exists')
  })

  it('should return 500 status for server errors', async () => {
    mockRegisterUser.mockRejectedValue(
      new Error('Database connection failed')
    )

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(validRegistrationData)
    })

    const response = await handleRegistration(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Registration failed')
  })

  it('should handle invalid JSON in request body', async () => {
    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: 'invalid json'
    })

    const response = await handleRegistration(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Registration failed')
  })
}) 