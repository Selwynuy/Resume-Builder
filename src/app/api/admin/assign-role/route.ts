import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'

import { requireAdmin } from '@/auth'
import connectDB from '@/lib/db'
import User from '@/models/User'

// POST /api/admin/assign-role - Assign role by email (admin only)
export async function POST(request: NextRequest) {
  try {
    // Require admin role for user role management
    await requireAdmin()

    await connectDB()

    const body = await request.json()
    const { email, role } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!role) {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['user', 'creator', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be user, creator, or admin' },
        { status: 400 }
      )
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role },
      { new: true, select: 'name email role createdAt' }
    )

    if (!user) {
      return NextResponse.json(
        { error: 'User not found with that email' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: `Successfully assigned ${role} role to ${email}`,
      user
    })
  } catch (error) {
    console.error('Error assigning user role:', error)
    return NextResponse.json(
      { error: 'Failed to assign user role' },
      { status: 500 }
    )
  }
} 