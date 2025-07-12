'use client';

import { useState } from 'react';
import { X, Check, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  message?: string;
}

export default function UpgradeModal({ isOpen, onClose, feature, message }: UpgradeModalProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async (tier: string, billingCycle: string) => {
    if (!session) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier, billingCycle }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStudent = session?.user?.email?.endsWith('.edu');

  const plans = [
    {
      name: 'Basic',
      price: 6,
      discountedPrice: isStudent ? 4.20 : undefined,
      billingCycle: 'month',
      features: ['PDF & Word export', 'Full AI features', 'Premium templates'],
      tier: 'basic',
    },
    {
      name: 'Pro',
      price: 15,
      discountedPrice: isStudent ? 10.50 : undefined,
      billingCycle: 'quarter',
      features: ['All Basic features', 'Priority support', 'Advanced analytics'],
      popular: true,
      tier: 'pro',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Upgrade to Access {feature}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {message && (
            <p className="text-gray-600 mb-6 text-center">
              {message}
            </p>
          )}

          {/* Student Discount Banner */}
          {isStudent && (
            <div className="mb-6 inline-flex items-center px-4 py-2 bg-green-100 border border-green-200 rounded-full">
              <span className="text-green-800 font-medium">
                🎓 Student Discount: 30% off all plans
              </span>
            </div>
          )}

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative border-2 rounded-xl p-6 ${
                  plan.popular
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                } transition-all duration-200`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                      ${plan.discountedPrice || plan.price}
                    </span>
                    <span className="text-gray-500 ml-1">
                      /{plan.billingCycle}
                    </span>
                  </div>
                  {plan.discountedPrice && (
                    <div className="mt-1">
                      <span className="text-sm text-gray-500 line-through">
                        ${plan.price}/{plan.billingCycle}
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.tier, plan.billingCycle)}
                  disabled={loading}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200'
                  }`}
                >
                  {loading ? 'Loading...' : `Choose ${plan.name}`}
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>Cancel anytime. No questions asked.</p>
            <p className="mt-1">
              Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 