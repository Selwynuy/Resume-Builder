'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Check, Star, GraduationCap, ChevronDown } from 'lucide-react';
import { isStudentEmail } from '@/lib/paypal';
import PayPalButton from '@/components/ui/PayPalButton';

interface PricingTier {
  name: string;
  price: number;
  discountedPrice?: number;
  billingCycle: string;
  features: string[];
  popular?: boolean;
  cta: string;
  tier: string;
}

interface PricingPageClientProps {
  session: any;
}

export default function PricingPageClient({ session: serverSession }: PricingPageClientProps) {
  const { data: session } = useSession();
  const [isStudent, setIsStudent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      setIsStudent(isStudentEmail(session.user.email));
    }
  }, [session]);

  const pricingTiers: PricingTier[] = [
    {
      name: 'Free',
      price: 0,
      billingCycle: 'forever',
      features: [
        'Basic resume templates',
        'TXT export only',
        'Limited AI features',
        'Community support',
      ],
      cta: 'Get Started Free',
      tier: 'free',
    },
    {
      name: 'Basic',
      price: 6,
      discountedPrice: isStudent ? 4.20 : undefined,
      billingCycle: 'month',
      features: [
        'All Free features',
        'PDF & Word export',
        'Full AI features',
        'Premium templates',
        'Email support',
      ],
      cta: 'Start Basic Plan',
      tier: 'basic',
    },
    {
      name: 'Pro',
      price: 15,
      discountedPrice: isStudent ? 10.50 : undefined,
      billingCycle: 'quarter',
      features: [
        'All Basic features',
        'Priority support',
        'Advanced analytics',
        'Custom branding',
        'API access',
      ],
      popular: true,
      cta: 'Start Pro Plan',
      tier: 'pro',
    },
    {
      name: 'Enterprise',
      price: 25,
      discountedPrice: isStudent ? 17.50 : undefined,
      billingCycle: 'month',
      features: [
        'All Pro features',
        'Team management',
        'White-label options',
        'Dedicated support',
        'Custom integrations',
      ],
      cta: 'Contact Sales',
      tier: 'enterprise',
    },
  ];

  const handleSubscribe = async (tier: string, billingCycle: string) => {
    // This is now handled by the PayPal button component
    console.log('Subscribe clicked:', tier, billingCycle);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Start building professional resumes with AI-powered features. 
          Perfect for students and professionals alike.
        </p>
        
        {/* Student Discount Banner */}
        {isStudent && (
          <div className="mt-8 inline-flex items-center px-4 py-2 bg-green-100 border border-green-200 rounded-full">
            <GraduationCap className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              Student Discount: 30% off all paid plans
            </span>
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
              tier.popular
                ? 'border-blue-500 scale-105'
                : 'border-gray-200 hover:border-blue-300'
            } transition-all duration-200`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {tier.name}
              </h3>
              
              <div className="mb-6">
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    ${tier.discountedPrice || tier.price}
                  </span>
                  {tier.price > 0 && (
                    <span className="text-gray-500 ml-1">
                      /{tier.billingCycle}
                    </span>
                  )}
                </div>
                
                {tier.discountedPrice && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-500 line-through">
                      ${tier.price}/{tier.billingCycle}
                    </span>
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8 text-left">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {tier.tier === 'free' ? (
                <button
                  onClick={() => window.location.href = '/resume/new'}
                  className="w-full py-3 px-6 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors duration-200"
                >
                  {tier.cta}
                </button>
              ) : tier.tier === 'enterprise' ? (
                <button
                  onClick={() => window.location.href = 'mailto:sales@resumeai.com'}
                  className="w-full py-3 px-6 rounded-lg font-medium bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 transition-colors duration-200"
                >
                  {tier.cta}
                </button>
              ) : (
                <PayPalButton
                  tier={tier.tier}
                  billingCycle={tier.billingCycle}
                  onSuccess={(orderId) => {
                    console.log('Payment successful:', orderId);
                  }}
                  onError={(error) => {
                    console.error('Payment error:', error);
                    alert('Payment failed. Please try again.');
                  }}
                  className="w-full"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-2xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-slate-200">
          {[
            {
              question: 'How does the student discount work?',
              answer: `Students with .edu email addresses automatically receive a 30% discount on all paid plans. The discount is applied at checkout.`,
            },
            {
              question: 'Can I cancel my subscription anytime?',
              answer: `Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your current billing period.`,
            },
            {
              question: 'What payment methods do you accept?',
              answer: `We accept all major credit cards, debit cards, and digital wallets through our secure Stripe payment processor.`,
            },
            {
              question: 'Is there a free trial?',
              answer: `We offer a free tier with basic features. You can upgrade to a paid plan anytime to unlock premium features.`,
            },
          ].map((faq, idx) => {
            const [open, setOpen] = useState(false);
            return (
              <div key={idx}>
                <button
                  className="w-full flex items-center justify-between py-6 px-4 text-left focus:outline-none group"
                  onClick={() => setOpen((prev) => !prev)}
                  aria-expanded={open}
                >
                  <span className="text-base md:text-lg font-medium text-slate-900 group-hover:text-blue-700 transition-colors">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-blue-500 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <div className="px-4 pb-6 text-slate-600 text-base leading-relaxed animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 