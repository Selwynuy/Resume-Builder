import { NextResponse } from 'next/server'

import connectDB from '@/lib/db'
import { UserRegistrationSchema } from '@/lib/security'
import User from '@/models/User'

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // Validate input using the new registration schema
    const validation = UserRegistrationSchema.safeParse({ name, email, password });
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input: ' + validation.error.errors[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name: name.trim(),
    });

    // Remove password from response
    const userWithoutPassword = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: unknown) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
} 