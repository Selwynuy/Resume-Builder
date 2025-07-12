# PayPal Setup Guide for ResumeAI Pricing

This guide will help you set up PayPal for the pricing implementation.

## 1. Create a PayPal Developer Account

1. Go to [developer.paypal.com](https://developer.paypal.com)
2. Sign in with your PayPal account or create one
3. Navigate to the Developer Dashboard

## 2. Create a PayPal App

1. Go to **My Apps & Credentials**
2. Click **Create App**
3. Name your app: "ResumeAI"
4. Select **Business** account type
5. Click **Create App**

## 3. Get Your Credentials

1. In your app dashboard, you'll see:
   - **Client ID** (starts with `AQ...`)
   - **Secret** (starts with `EF...`)
2. Copy both values for your environment variables

## 4. Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/resume-builder

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# PayPal Configuration (Sandbox)
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_secret_here

# For Production (when ready)
# PAYPAL_CLIENT_ID=your_live_client_id_here
# PAYPAL_CLIENT_SECRET=your_live_secret_here
```

## 5. Test the Integration

### Test Cards (Sandbox Mode)
- **Success**: Use any valid card number (e.g., 4111111111111111)
- **Decline**: Use 4000000000000002
- **Expiry**: Any future date
- **CVV**: Any 3 digits

### Test PayPal Accounts
- **Buyer**: sb-buyer@business.example.com
- **Seller**: sb-seller@business.example.com

## 6. Set Up Webhooks (Optional)

1. Go to **Webhooks** in your PayPal Developer Dashboard
2. Click **Add Webhook**
3. **URL**: `https://yourdomain.com/api/billing/webhook`
4. **Events to listen for**:
   - `CHECKOUT.ORDER.APPROVED`
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`

## 7. Go Live

When ready for production:

1. **Switch to Live Mode** in PayPal Developer Dashboard
2. **Update environment variables** with live credentials
3. **Update webhook URL** to production domain
4. **Test with real PayPal accounts**

## 8. Pricing Strategy

Your current pricing in USD:
- **Basic**: $6/month ($4.20 with student discount)
- **Pro**: $15/quarter ($10.50 with student discount)
- **Enterprise**: $25/month ($17.50 with student discount)

## 9. Benefits of PayPal

✅ **Widely accepted in the Philippines**  
✅ **Supports international cards**  
✅ **Easy to set up**  
✅ **No complex subscription management**  
✅ **Built-in fraud protection**  
✅ **Mobile-friendly checkout**  

## 10. Testing Checklist

- [ ] PayPal order creation works
- [ ] Student discount is applied correctly
- [ ] Payment capture works
- [ ] Success/cancel URLs redirect properly
- [ ] Webhook events are received (if configured)
- [ ] Error handling works

## 11. Troubleshooting

### Common Issues:
- **"Invalid client"**: Check your Client ID and Secret
- **"Order not found"**: Verify order ID in PayPal dashboard
- **Webhook not receiving events**: Check webhook URL and events
- **Payment not captured**: Verify webhook is processing events

### Support:
- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Developer Support](https://developer.paypal.com/support/)

## 12. Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Implement proper error handling
- Validate webhook events in production
- Use HTTPS for all webhook endpoints 