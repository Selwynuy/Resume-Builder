# Stripe Setup Guide for ResumeAI Pricing

This guide will help you set up Stripe for the pricing implementation.

## 1. Create a Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the account verification process
3. Switch to test mode for development

## 2. Get API Keys

1. Go to the Stripe Dashboard
2. Navigate to Developers > API keys
3. Copy your **Publishable key** and **Secret key**
4. Add them to your `.env.local` file:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## 3. Create Products and Prices

### Basic Plan (Monthly)
1. Go to Products > Add product
2. Name: "Basic Plan"
3. Price: $6.00 USD
4. Billing: Recurring, Monthly
5. Copy the Price ID and add to `.env.local`:
   ```env
   STRIPE_BASIC_MONTHLY_PRICE_ID=price_xxxxx
   ```

### Pro Plan (Quarterly)
1. Go to Products > Add product
2. Name: "Pro Plan"
3. Price: $15.00 USD
4. Billing: Recurring, Quarterly
5. Copy the Price ID and add to `.env.local`:
   ```env
   STRIPE_PRO_QUARTERLY_PRICE_ID=price_xxxxx
   ```

### Enterprise Plan (Monthly)
1. Go to Products > Add product
2. Name: "Enterprise Plan"
3. Price: $25.00 USD
4. Billing: Recurring, Monthly
5. Copy the Price ID and add to `.env.local`:
   ```env
   STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_xxxxx
   ```

## 4. Create Student Discount Coupon

1. Go to Products > Coupons
2. Click "Create coupon"
3. Settings:
   - Name: "Student Discount"
   - Amount off: 30%
   - Duration: Forever
   - Restrictions: None
4. Copy the Coupon ID and add to `.env.local`:
   ```env
   STRIPE_STUDENT_DISCOUNT_COUPON_ID=coupon_xxxxx
   ```

## 5. Set Up Webhooks

1. Go to Developers > Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/billing/webhook`
4. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the Webhook signing secret and add to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

## 6. Test the Integration

1. Use Stripe's test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
2. Test with a .edu email to verify student discount
3. Test subscription creation and cancellation

## 7. Go Live

1. Switch to live mode in Stripe Dashboard
2. Update API keys to live keys
3. Update webhook endpoint to production URL
4. Test with real payment methods

## Environment Variables Summary

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Stripe Price IDs
STRIPE_BASIC_MONTHLY_PRICE_ID=price_basic_monthly_live
STRIPE_PRO_QUARTERLY_PRICE_ID=price_pro_quarterly_live
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_enterprise_monthly_live

# Stripe Student Discount Coupon ID
STRIPE_STUDENT_DISCOUNT_COUPON_ID=coupon_student_discount_30_live
```

## Troubleshooting

- **Webhook errors**: Check webhook endpoint URL and secret
- **Price not found**: Verify price IDs in environment variables
- **Student discount not applied**: Check coupon ID and .edu email detection
- **Payment failures**: Test with Stripe's test cards first

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Implement proper error handling for payment failures
- Validate webhook signatures to prevent fraud 