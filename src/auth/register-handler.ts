import { NextResponse } from 'next/server'
import { registerUser, type RegistrationData } from './register'

/**
 * API route handler for user registration
 */
export async function handleRegistration(req: Request): Promise<NextResponse> {
  try {
    const data = await req.json()
    const result = await registerUser(data)
    if (!result.success) {
      // Return 400 for known/validation errors, 500 for generic failure
      const knownErrors = [
        'User already exists',
      ]
      const isValidation = result.error?.startsWith('Invalid input:')
      const isKnown = knownErrors.includes(result.error || '')
      return NextResponse.json(
        { error: result.error },
        { status: isValidation || isKnown ? 400 : 500 }
      )
    }
    return NextResponse.json(result.user, { status: 201 })
  } catch (error) {
    console.error('Registration handler error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
} 