import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/options';
import { capturePayPalPayment } from '@/lib/paypal';
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Capture the payment
    const capture = await capturePayPalPayment(orderId);

    // Update user subscription status
    const user = await User.findOne({ email: session.user.email });
    if (user) {
      // Extract subscription info from the order
      const customId = capture.purchase_units?.[0]?.custom_id;
      if (customId) {
        const [tier, billingCycle, studentStatus] = customId.split('_');
        user.subscriptionTier = tier;
        user.billingCycle = billingCycle;
        user.subscriptionStatus = 'active';
        user.subscriptionEndDate = billingCycle === 'monthly' 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
        user.isStudent = studentStatus === 'student';
        // Optionally: user.paypalOrderId = orderId; user.paypalCaptureId = capture.id;
        await user.save();
      }
    }

    return NextResponse.json({
      success: true,
      captureId: capture.id,
    });
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 