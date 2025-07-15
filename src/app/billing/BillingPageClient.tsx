'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, CreditCard, Download, Crown, GraduationCap } from 'lucide-react';

interface SubscriptionData {
  subscriptionTier: string;
  subscriptionStatus: string;
  isStudent: boolean;
  subscriptionEndDate?: string;
  billingCycle: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

interface BillingPageClientProps {
  session: any;
}

export default function BillingPageClient({ session }: BillingPageClientProps) {
  const { data: clientSession } = useSession();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (clientSession) {
      fetchSubscription();
    }
  }, [clientSession]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/billing/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You\'ll continue to have access until the end of your current billing period.')) {
      return;
    }

    setCanceling(true);
    try {
      const response = await fetch('/api/billing/cancel', {
        method: 'POST',
      });

      if (response.ok) {
        await fetchSubscription();
        alert('Your subscription has been canceled. You\'ll continue to have access until the end of your current billing period.');
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setCanceling(false);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return <Crown className="w-6 h-6 text-purple-600" />;
      case 'pro':
        return <Crown className="w-6 h-6 text-blue-600" />;
      case 'basic':
        return <CreditCard className="w-6 h-6 text-green-600" />;
      default:
        return <Download className="w-6 h-6 text-gray-600" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return 'text-purple-600 bg-purple-100';
      case 'pro':
        return 'text-blue-600 bg-blue-100';
      case 'basic':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'canceled':
        return 'text-red-600 bg-red-100';
      case 'past_due':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
        <p className="text-gray-600">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {getTierIcon(subscription?.subscriptionTier || 'free')}
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {subscription?.subscriptionTier?.charAt(0).toUpperCase() + subscription?.subscriptionTier?.slice(1) || 'Free'} Plan
              </h2>
              <p className="text-gray-600">
                {subscription?.billingCycle === 'quarterly' ? 'Quarterly' : 'Monthly'} billing
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {subscription?.isStudent && (
              <div className="flex items-center px-3 py-1 bg-green-100 border border-green-200 rounded-full">
                <GraduationCap className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-800 text-sm font-medium">Student</span>
              </div>
            )}
            
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription?.subscriptionStatus || 'active')}`}>
              {subscription?.subscriptionStatus?.replace('_', ' ').toUpperCase() || 'ACTIVE'}
            </span>
          </div>
        </div>

        {/* Plan Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {subscription?.subscriptionTier === 'free' ? 'Free' : 
               subscription?.subscriptionTier === 'basic' ? '$6' :
               subscription?.subscriptionTier === 'pro' ? '$15' : '$25'}
            </div>
            <div className="text-gray-600">
              {subscription?.subscriptionTier === 'free' ? 'Forever' :
               subscription?.billingCycle === 'quarterly' ? 'per quarter' : 'per month'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {subscription?.subscriptionTier === 'free' ? 'Limited' : 'Full'}
            </div>
            <div className="text-gray-600">AI Features</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {subscription?.subscriptionTier === 'free' ? 'TXT' : 'All'}
            </div>
            <div className="text-gray-600">Export Formats</div>
          </div>
        </div>

        {/* Actions */}
        {subscription?.subscriptionTier !== 'free' && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.href = '/pricing'}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
            >
              Change Plan
            </button>
            
            {subscription?.subscriptionStatus === 'active' && (
              <button
                onClick={handleCancelSubscription}
                disabled={canceling}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
              >
                {canceling ? 'Canceling...' : 'Cancel Subscription'}
              </button>
            )}
          </div>
        )}

        {/* Subscription End Date */}
        {subscription?.subscriptionEndDate && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800">
                {subscription.subscriptionStatus === 'canceled' 
                  ? 'Access until: ' 
                  : 'Next billing date: '}
                {new Date(subscription.subscriptionEndDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade CTA for Free Users */}
      {subscription?.subscriptionTier === 'free' && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to unlock premium features?</h3>
          <p className="text-blue-100 mb-6">
            Get access to AI-powered resume optimization, premium templates, and multiple export formats.
          </p>
          <button
            onClick={() => window.location.href = '/pricing'}
            className="bg-white text-blue-600 hover:bg-gray-100 py-3 px-8 rounded-lg font-medium transition-colors duration-200"
          >
            View Plans
          </button>
        </div>
      )}
    </div>
  );
} 