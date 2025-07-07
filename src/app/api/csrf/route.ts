import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/auth'
import { generateCSRFToken } from '@/middleware/security'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Generate CSRF token using session ID if available, otherwise use a default
    const sessionId = session?.user?.id || session?.user?.email || 'anonymous'
    const token = generateCSRFToken(sessionId)

    return NextResponse.json({ 
      token,
      expires: Date.now() + (60 * 60 * 1000) // 1 hour
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
} 