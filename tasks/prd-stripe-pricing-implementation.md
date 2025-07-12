# Product Requirements Document: PayPal Pricing Implementation

## Introduction/Overview

This document outlines the implementation of a comprehensive pricing system using PayPal for the ResumeAI platform. The feature will introduce tiered pricing with student discounts, feature gating for AI capabilities and premium content, and a dedicated pricing page. The goal is to monetize the platform while maintaining accessibility for students through a 30% discount program.

## Goals

1. **Revenue Generation**: Implement a sustainable pricing model that converts free users to paid subscribers
2. **Student Accessibility**: Provide 30% discount for verified students to maintain educational access
3. **Feature Monetization**: Gate AI features, premium templates, and export options behind paywalls
4. **User Experience**: Create a seamless payment flow with clear pricing transparency
5. **Subscription Management**: Allow users to upgrade, downgrade, and cancel subscriptions easily

## User Stories

### Primary User Stories
- **As a job seeker**, I want to access AI-powered resume feedback so that I can improve my resume quality
- **As a student**, I want to get discounted pricing so that I can afford premium features on a limited budget
- **As a professional**, I want to export my resume in multiple formats so that I can use it across different platforms
- **As a user**, I want to easily understand pricing tiers so that I can choose the right plan for my needs
- **As a subscriber**, I want to manage my subscription so that I can upgrade, downgrade, or cancel as needed

### Secondary User Stories
- **As a user**, I want to see what features are included in each tier so that I can make an informed decision
- **As a student**, I want a simple verification process so that I can quickly access my discount
- **As a user**, I want a secure payment process so that I can trust the platform with my payment information

## Functional Requirements

### 1. Pricing Tiers Implementation
1.1. The system must support four pricing tiers: Free, Basic, Pro, and Enterprise
1.2. Each tier must have clearly defined features and limitations
1.3. Pricing must be displayed prominently on the pricing page
1.4. The system must support monthly and quarterly billing cycles
1.5. Free tier must only allow TXT format exports

### 2. Student Discount System
2.1. The system must automatically detect .edu email addresses for student verification
2.2. The system must apply a 30% discount to all pricing tiers for verified students
2.3. The system must display discounted pricing alongside regular pricing for students
2.4. The system must maintain student discount status across subscription changes

### 3. Header Navigation Integration
3.1. The header must include a "Pricing" navigation item in the main menu
3.2. The pricing link must be accessible from all pages
3.3. The pricing link must be responsive and work on mobile devices

### 4. Pricing Page Development
4.1. The pricing page must display all three pricing tiers with feature comparisons
4.2. The pricing page must show both regular and student-discounted pricing
4.3. The pricing page must include clear call-to-action buttons for each tier
4.4. The pricing page must be responsive and mobile-friendly

### 5. Stripe Integration
5.1. The system must integrate with Stripe Checkout for payment processing
5.2. The system must handle successful and failed payment scenarios
5.3. The system must create and manage Stripe customers and subscriptions
5.4. The system must handle webhook events from Stripe for subscription updates

### 6. Feature Gating
6.1. The system must restrict AI features (summaries, feedback, interview prep) to paid tiers
6.2. The system must restrict premium templates to paid tiers
6.3. The system must restrict export options (PDF, Word) to paid tiers (Free tier: TXT only)
6.4. The system must show upgrade prompts when users attempt to access gated features
6.5. The system must allow creators to mark templates as premium in the template dashboard

### 7. Subscription Management
7.1. Users must be able to upgrade their subscription tier
7.2. Users must be able to downgrade their subscription tier
7.3. Users must be able to cancel their subscription
7.4. Users must be able to view their current subscription status and billing history

### 8. User Experience Requirements
8.1. Payment flow must be secure and user-friendly
8.2. Error messages must be clear and actionable
8.3. Loading states must be implemented for all payment-related actions
8.4. Success confirmations must be provided after successful payments

## Non-Goals (Out of Scope)

- **Advanced Analytics**: Detailed usage tracking and analytics dashboard
- **Team Management**: Bulk billing or team subscription management
- **Custom Billing**: Custom pricing or enterprise-specific billing arrangements
- **Multiple Payment Methods**: Support for payment methods beyond Stripe's standard offerings
- **Trial Periods**: Free trial periods for paid tiers (beyond existing free tier)
- **Refund Processing**: Automated refund handling (will be manual through Stripe dashboard)

## Design Considerations

### UI/UX Requirements
- Follow existing design system using Tailwind CSS and current component library
- Maintain consistent branding with blue/indigo gradient theme
- Ensure pricing page is visually appealing with clear feature comparisons
- Implement responsive design for all screen sizes
- Use clear visual hierarchy to distinguish between tiers

### Pricing Page Layout
- Three-column layout for desktop (one column per tier)
- Stacked layout for mobile devices
- Feature comparison table below pricing cards
- Student discount prominently displayed for .edu users
- Clear CTAs with gradient buttons matching existing design

## Technical Considerations

### Stripe Integration
- Use Stripe Checkout for secure payment processing
- Implement webhook handling for subscription lifecycle events
- Store Stripe customer IDs and subscription IDs in user model
- Handle subscription status updates in real-time

### Database Schema Updates
- Add subscription-related fields to User model:
  - `stripeCustomerId`: String
  - `stripeSubscriptionId`: String
  - `subscriptionTier`: Enum (free, basic, pro, enterprise)
  - `subscriptionStatus`: Enum (active, canceled, past_due)
  - `isStudent`: Boolean
  - `subscriptionEndDate`: Date
  - `billingCycle`: Enum (monthly, quarterly)
- Add premium field to Template model:
  - `isPremium`: Boolean (default: false)

### API Endpoints Required
- `POST /api/billing/create-checkout-session`: Create Stripe checkout session
- `POST /api/billing/webhook`: Handle Stripe webhooks
- `GET /api/billing/subscription`: Get current subscription status
- `POST /api/billing/cancel`: Cancel subscription
- `POST /api/billing/upgrade`: Upgrade subscription tier
- `POST /api/billing/downgrade`: Downgrade subscription tier

### Security Considerations
- Implement CSRF protection for all billing endpoints
- Validate webhook signatures from Stripe
- Ensure sensitive billing data is not exposed in client-side code
- Implement proper error handling to prevent information leakage

## Success Metrics

### Primary Metrics
- **Conversion Rate**: Percentage of free users who upgrade to paid tiers
- **Student Adoption**: Percentage of students who take advantage of discount
- **Revenue Growth**: Monthly recurring revenue (MRR) increase
- **Churn Rate**: Percentage of subscribers who cancel within 30 days

### Secondary Metrics
- **Feature Usage**: Usage patterns of gated features after implementation
- **Support Tickets**: Reduction in billing-related support requests
- **Page Performance**: Pricing page load times and user engagement
- **Payment Success Rate**: Percentage of successful payment attempts

## Pricing Strategy (Confirmed)

### Tier Pricing (Philippine Market Focus)
- **Free**: $0/month - TXT export only, basic templates, no AI features
- **Basic**: $6/month ($5.40 with student discount) - PDF/Word export, AI features, premium templates
- **Pro**: $15/quarter ($13.50 with student discount) - All Basic features + priority support
- **Enterprise**: $25/month ($22.50 with student discount) - All Pro features + team management

### Billing Cycles
- Monthly billing for Basic and Enterprise tiers
- Quarterly billing for Pro tier (better value proposition)
- Student discount: 30% off all paid tiers
- No annual billing (quarterly provides good balance)

### Feature Distribution
- **Free**: TXT export, basic templates, limited AI features
- **Paid Tiers**: PDF/Word export, premium templates, full AI features
- **Premium Templates**: Creators can mark templates as premium in dashboard

## Open Questions

1. **Feature Limits**: Should there be usage limits (e.g., number of AI summaries per month) for different tiers?
2. **Grandfathering**: How should existing users be handled when implementing feature gating?
3. **Student Verification**: Should there be additional verification steps beyond .edu email domains?
4. **Export Formats**: Which specific export formats should be gated (PDF, Word, plain text)?
5. **Template Premium Selection**: Should there be approval process for marking templates as premium?

## Implementation Phases

### Phase 1: Foundation
- Set up Stripe integration and webhook handling
- Update database schema for subscription management
- Create basic billing API endpoints

### Phase 2: Pricing Page
- Develop pricing page with tier comparison
- Implement student discount detection and display
- Add pricing navigation to header

### Phase 3: Payment Flow
- Implement Stripe Checkout integration
- Create subscription management UI
- Add feature gating logic

### Phase 4: Testing & Polish
- Comprehensive testing of payment flows
- Error handling and edge case management
- Performance optimization and monitoring setup

## Dependencies

- Stripe account and API keys
- Existing authentication system (NextAuth.js)
- Current user model and database setup
- Existing UI component library and design system
- SSL certificate for secure payment processing 