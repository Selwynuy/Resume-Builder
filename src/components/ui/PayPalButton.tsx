'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { getAmount, isStudentEmail } from '@/lib/paypal';

interface PayPalButtonProps {
  tier: string;
  billingCycle: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: any) => void;
  className?: string;
}

export default function PayPalButton({ 
  tier, 
  billingCycle, 
  onSuccess, 
  onError,
  className = ''
}: PayPalButtonProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  if (!session?.user?.email) {
    return (
      <button 
        className={`w-full py-3 px-6 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 ${className}`}
        onClick={() => window.location.href = '/login'}
      >
        Login to Subscribe
      </button>
    );
  }

  const isStudent = isStudentEmail(session.user.email);
  const amount = getAmount(tier, billingCycle, isStudent);

  const createOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/billing/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          tier, 
          billingCycle, 
          isStudent,
          amount 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (data: any) => {
    try {
      const response = await fetch('/api/billing/capture-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: data.orderID }),
      });

      if (!response.ok) {
        throw new Error('Failed to capture payment');
      }

      const result = await response.json();
      onSuccess?.(data.orderID);
      
      // Redirect to dashboard on success
      window.location.href = '/dashboard?success=true';
    } catch (error) {
      console.error('Error capturing payment:', error);
      onError?.(error);
    }
  };

  return (
    <div className={className}>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => {
          console.error('PayPal error:', err);
          onError?.(err);
        }}
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'pay',
        }}
      />
    </div>
  );
} 