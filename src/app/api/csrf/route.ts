import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/auth'
import { generateCSRFToken } from '@/middleware/security'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Generate CSRF token using session ID
    const sessionId = session.user.id || session.user.email || 'anonymous'
    const token = generateCSRFToken(sessionId)

    return NextResponse.json({ 
      token,
      expires: Date.now() + (60 * 60 * 1000) // 1 hour
    })
  } catch (error) {
    console.error('CSRF token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
} 