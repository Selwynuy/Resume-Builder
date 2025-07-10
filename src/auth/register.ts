
import connectDB from '@/lib/db'
import { UserRegistrationSchema } from '@/lib/security'
import User from '@/models/User'

export interface RegistrationData {
  email: string
  password: string
  name: string
}

export interface RegistrationResult {
  success: boolean
  user?: {
    id: string
    email: string
    name: string
  }
  error?: string
}

/**
 * Register a new user
 */
export async function registerUser(data: RegistrationData): Promise<RegistrationResult> {
  try {
    const { email, password, name } = data

    // Validate input using the registration schema
    const validation = UserRegistrationSchema.safeParse({ name, email, password })
    if (!validation.success) {
      return {
        success: false,
        error: 'Invalid input: ' + validation.error.errors[0].message
      }
    }

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return {
        success: false,
        error: 'User already exists'
      }
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name: name.trim(),
    })

    // Remove password from response
    const userWithoutPassword = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    }

    return {
      success: true,
      user: userWithoutPassword
    }
  } catch (error: unknown) {
    // All console.error statements removed for production
    return {
      success: false,
      error: 'Registration failed'
    }
  }
} 