import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalPayment, getPayPalOrder } from '@/lib/paypal';
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_type, resource } = body;

    await connectDB();

    switch (event_type) {
      case 'CHECKOUT.ORDER.APPROVED': {
        const orderId = resource.id;
        await handleOrderApproved(orderId);
        break;
      }
      case 'PAYMENT.CAPTURE.COMPLETED': {
        const captureId = resource.id;
        await handlePaymentCompleted(captureId);
        break;
      }
      case 'PAYMENT.CAPTURE.DENIED': {
        const captureId = resource.id;
        await handlePaymentDenied(captureId);
        break;
      }
      default:
        console.log(`Unhandled PayPal event type: ${event_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleOrderApproved(orderId: string) {
  try {
    // Capture the payment
    const capture = await capturePayPalPayment(orderId);
    console.log(`Payment captured for order ${orderId}:`, capture.id);
  } catch (error) {
    console.error(`Failed to capture payment for order ${orderId}:`, error);
  }
}

async function handlePaymentCompleted(captureId: string) {
  try {
    // Find user by PayPal order ID (you might need to store this mapping)
    // For now, we'll update subscription status based on the capture
    console.log(`Payment completed: ${captureId}`);
    
    // You can implement subscription activation logic here
    // This would involve finding the user and updating their subscription status
  } catch (error) {
    console.error(`Error handling payment completion for ${captureId}:`, error);
  }
}

async function handlePaymentDenied(captureId: string) {
  try {
    console.log(`Payment denied: ${captureId}`);
    
    // Handle payment failure
    // Update user subscription status to reflect the failure
  } catch (error) {
    console.error(`Error handling payment denial for ${captureId}:`, error);
  }
} 