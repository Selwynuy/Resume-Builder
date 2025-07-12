import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
});

// Pricing configuration
export const PRICING = {
  basic: {
    monthly: {
      priceId: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID || 'price_basic_monthly',
      amount: 600, // $6.00 in cents
    },
  },
  pro: {
    quarterly: {
      priceId: process.env.STRIPE_PRO_QUARTERLY_PRICE_ID || 'price_pro_quarterly',
      amount: 1500, // $15.00 in cents
    },
  },
  enterprise: {
    monthly: {
      priceId: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || 'price_enterprise_monthly',
      amount: 2500, // $25.00 in cents
    },
  },
};

// Student discount percentage
export const STUDENT_DISCOUNT_PERCENTAGE = 30;

// Calculate discounted price
export const calculateDiscountedPrice = (originalPrice: number): number => {
  return Math.round(originalPrice * (1 - STUDENT_DISCOUNT_PERCENTAGE / 100));
};

// Check if email is a student email (.edu domain)
export const isStudentEmail = (email: string): boolean => {
  return email.toLowerCase().endsWith('.edu');
};

// Get price ID for subscription tier and billing cycle
export const getPriceId = (tier: string, billingCycle: string): string => {
  const pricing = PRICING[tier as keyof typeof PRICING];
  if (!pricing) {
    throw new Error(`Invalid tier: ${tier}`);
  }
  
  const cyclePricing = pricing[billingCycle as keyof typeof pricing];
  if (!cyclePricing) {
    throw new Error(`Invalid billing cycle: ${billingCycle} for tier: ${tier}`);
  }
  
  return (cyclePricing as any).priceId;
};

// Get amount for subscription tier and billing cycle
export const getAmount = (tier: string, billingCycle: string, isStudent: boolean = false): number => {
  const pricing = PRICING[tier as keyof typeof PRICING];
  if (!pricing) {
    throw new Error(`Invalid tier: ${tier}`);
  }
  
  const cyclePricing = pricing[billingCycle as keyof typeof pricing];
  if (!cyclePricing) {
    throw new Error(`Invalid billing cycle: ${billingCycle} for tier: ${tier}`);
  }
  
  const amount = (cyclePricing as any).amount;
  return isStudent ? calculateDiscountedPrice(amount) : amount;
}; 