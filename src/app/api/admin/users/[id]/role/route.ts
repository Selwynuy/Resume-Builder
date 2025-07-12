import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'

import { requireAdmin } from '@/auth'
import connectDB from '@/lib/db'
import User from '@/models/User'

// PUT /api/admin/users/[id]/role - Update user role (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin role for user role management
    await requireAdmin()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    await connectDB()

    const body = await request.json()
    const { role } = body

    // Validate role
    if (!['user', 'creator', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be user, creator, or admin' },
        { status: 400 }
      )
    }

    const user = await User.findByIdAndUpdate(
      params.id,
      { role },
      { new: true, select: 'name email role createdAt' }
    )

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: `User role updated to ${role}`,
      user
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    )
  }
}

// GET /api/admin/users/[id]/role - Get user role (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin role for user role management
    await requireAdmin()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findById(params.id, 'name email role createdAt')

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user role:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user role' },
      { status: 500 }
    )
  }
} 