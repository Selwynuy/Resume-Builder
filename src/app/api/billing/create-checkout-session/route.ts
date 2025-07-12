import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/options';
import { createPayPalOrder, isStudentEmail } from '@/lib/paypal';
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { tier, billingCycle } = await request.json();

    if (!tier || !billingCycle) {
      return NextResponse.json(
        { error: 'Tier and billing cycle are required' },
        { status: 400 }
      );
    }

    // Validate tier and billing cycle
    const validTiers = ['basic', 'pro', 'enterprise'];
    const validBillingCycles = ['monthly', 'quarterly'];
    
    if (!validTiers.includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      );
    }

    if (!validBillingCycles.includes(billingCycle)) {
      return NextResponse.json(
        { error: 'Invalid billing cycle' },
        { status: 400 }
      );
    }

    // Validate tier and billing cycle combination
    if (tier === 'pro' && billingCycle !== 'quarterly') {
      return NextResponse.json(
        { error: 'Pro tier only supports quarterly billing' },
        { status: 400 }
      );
    }

    if (tier === 'basic' && billingCycle !== 'monthly') {
      return NextResponse.json(
        { error: 'Basic tier only supports monthly billing' },
        { status: 400 }
      );
    }

    if (tier === 'enterprise' && billingCycle !== 'monthly') {
      return NextResponse.json(
        { error: 'Enterprise tier only supports monthly billing' },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is a student
    const isStudent = isStudentEmail(session.user.email);

    // Update user student status if needed
    if (user.isStudent !== isStudent) {
      user.isStudent = isStudent;
      await user.save();
    }

    // Create PayPal order
    const paypalOrder = await createPayPalOrder(tier, billingCycle, isStudent);

    return NextResponse.json({
      orderId: paypalOrder.id,
      approvalUrl: paypalOrder.links?.find(link => link.rel === 'approve')?.href,
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 