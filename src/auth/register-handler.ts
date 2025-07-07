import { NextResponse } from 'next/server'
import { registerUser, type RegistrationData } from './register'

/**
 * API route handler for user registration
 */
export async function handleRegistration(req: Request): Promise<NextResponse> {
  try {
    let data;
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      data = {
        email: form.get('email'),
        password: form.get('password'),
        name: form.get('name'),
      };
    } else {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
    }
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
    // All console.error statements removed for production
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
} 