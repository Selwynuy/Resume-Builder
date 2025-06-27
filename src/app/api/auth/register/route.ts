import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { PersonalInfoSchema, sanitizeError } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // Validate input
    const validation = PersonalInfoSchema.pick({ name: true, email: true }).safeParse({ name, email });
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input: ' + validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // Password validation
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        { error: 'Password too long' },
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
  } catch (error: any) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    return NextResponse.json(
      { error: sanitizeError(error, isDevelopment) },
      { status: 500 }
    );
  }
} 