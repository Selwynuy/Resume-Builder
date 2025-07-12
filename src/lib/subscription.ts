import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/options';
import User from '@/models/User';
import connectDB from '@/lib/db';

export interface SubscriptionStatus {
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  isStudent: boolean;
  subscriptionEndDate?: Date;
  billingCycle: 'monthly' | 'quarterly';
}

// Get user's subscription status
export async function getUserSubscription(): Promise<SubscriptionStatus | null> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return null;
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return null;
    }

    return {
      tier: user.subscriptionTier,
      status: user.subscriptionStatus,
      isStudent: user.isStudent,
      subscriptionEndDate: user.subscriptionEndDate,
      billingCycle: user.billingCycle,
    };
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
}

// Check if user has access to a specific feature
export function hasFeatureAccess(
  subscription: SubscriptionStatus | null,
  feature: 'ai_features' | 'premium_templates' | 'pdf_export' | 'word_export'
): boolean {
  if (!subscription) {
    return false;
  }

  // Free tier restrictions
  if (subscription.tier === 'free') {
    switch (feature) {
      case 'ai_features':
        return false; // Limited AI features only
      case 'premium_templates':
        return false;
      case 'pdf_export':
        return false;
      case 'word_export':
        return false;
      default:
        return false;
    }
  }

  // Paid tiers have access to all features
  if (['basic', 'pro', 'enterprise'].includes(subscription.tier)) {
    return subscription.status === 'active';
  }

  return false;
}

// Check if user can access premium templates
export function canAccessPremiumTemplate(subscription: SubscriptionStatus | null): boolean {
  return hasFeatureAccess(subscription, 'premium_templates');
}

// Check if user can use AI features
export function canUseAIFeatures(subscription: SubscriptionStatus | null): boolean {
  return hasFeatureAccess(subscription, 'ai_features');
}

// Check if user can export to PDF
export function canExportPDF(subscription: SubscriptionStatus | null): boolean {
  return hasFeatureAccess(subscription, 'pdf_export');
}

// Check if user can export to Word
export function canExportWord(subscription: SubscriptionStatus | null): boolean {
  return hasFeatureAccess(subscription, 'word_export');
}

// Get upgrade prompt message
export function getUpgradePrompt(feature: string): string {
  const prompts = {
    ai_features: 'Upgrade to access AI-powered resume feedback and optimization',
    premium_templates: 'Upgrade to access premium resume templates',
    pdf_export: 'Upgrade to export your resume as PDF',
    word_export: 'Upgrade to export your resume as Word document',
  };
  
  return prompts[feature as keyof typeof prompts] || 'Upgrade to access this feature';
} 