// PayPal configuration
const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const environment = process.env.NODE_ENV === 'production' ? 'live' : 'sandbox';
const baseUrl = environment === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

// Only check credentials when actually using server-side functions
function checkCredentials() {
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are not set in environment variables');
  }
}

// Get PayPal access token
async function getPayPalAccessToken(): Promise<string> {
  checkCredentials();
  
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

// Pricing configuration (USD)
type PricingTier = {
  amount: number;
  currency: string;
};

type PricingCycle = {
  [key: string]: PricingTier;
};

type PricingConfig = {
  [key: string]: PricingCycle;
};

export const PRICING: PricingConfig = {
  basic: {
    monthly: {
      amount: 6.00, // $6.00 USD
      currency: 'USD',
    },
  },
  pro: {
    quarterly: {
      amount: 15.00, // $15.00 USD
      currency: 'USD',
    },
  },
  enterprise: {
    monthly: {
      amount: 25.00, // $25.00 USD
      currency: 'USD',
    },
  },
};

// Student discount percentage
export const STUDENT_DISCOUNT_PERCENTAGE = 30;

// Calculate discounted price
export const calculateDiscountedPrice = (originalPrice: number): number => {
  return Math.round(originalPrice * (1 - STUDENT_DISCOUNT_PERCENTAGE / 100) * 100) / 100;
};

// Check if email is a student email (.edu domain)
export const isStudentEmail = (email: string): boolean => {
  return email.toLowerCase().endsWith('.edu');
};

// Get amount for subscription tier and billing cycle
export const getAmount = (tier: string, billingCycle: string, isStudent: boolean = false): number => {
  const pricing = PRICING[tier];
  if (!pricing) {
    throw new Error(`Invalid tier: ${tier}`);
  }
  
  const cyclePricing = pricing[billingCycle];
  if (!cyclePricing) {
    throw new Error(`Invalid billing cycle: ${billingCycle} for tier: ${tier}`);
  }
  
  return isStudent ? calculateDiscountedPrice(cyclePricing.amount) : cyclePricing.amount;
};

// Create PayPal order
export const createPayPalOrder = async (
  tier: string,
  billingCycle: string,
  isStudent: boolean = false
) => {
  const amount = getAmount(tier, billingCycle, isStudent);
  const accessToken = await getPayPalAccessToken();
  
  const request = {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: amount.toFixed(2),
      },
      description: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan - ${billingCycle}ly billing`,
      custom_id: `${tier}_${billingCycle}_${isStudent ? 'student' : 'regular'}`,
    }],
    application_context: {
      return_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      brand_name: 'ResumeAI',
      landing_page: 'BILLING',
      user_action: 'PAY_NOW',
    },
  };

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to create PayPal order');
  }

  return await response.json();
};

// Capture PayPal payment
export const capturePayPalPayment = async (orderId: string) => {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to capture PayPal payment');
  }

  return await response.json();
};

// Get PayPal order details
export const getPayPalOrder = async (orderId: string) => {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal order');
  }

  return await response.json();
}; 