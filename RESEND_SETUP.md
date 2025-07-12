# Resend Email Setup Guide

This guide will help you set up Resend for sending password reset emails.

## 1. Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your API Key

1. Go to the **API Keys** section in your Resend dashboard
2. Click **Create API Key**
3. Name it "ResumeAI Password Reset"
4. Copy the API key (starts with `re_`)

## 3. Set Up Environment Variables

Add this to your `.env.local` file:

```env
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
```

## 4. Verify Your Domain (Optional but Recommended)

For production, you should verify your domain:

1. Go to **Domains** in your Resend dashboard
2. Click **Add Domain**
3. Follow the DNS setup instructions
4. Update the `from` email in the forgot password route to use your domain

## 5. Test the Integration

1. Start your development server
2. Go to `/forgot-password`
3. Enter a valid email address
4. Check if the email is received

## 6. Email Templates

The current setup uses a simple HTML email template. You can customize it in:
- `src/app/api/auth/forgot-password/route.ts`

## 7. Security Features

- Reset tokens expire after 1 hour
- Tokens are cryptographically secure (32 bytes random)
- Emails don't reveal if an account exists
- Passwords are hashed with bcrypt

## 8. Troubleshooting

### Common Issues:
- **"Invalid API key"**: Check your RESEND_API_KEY environment variable
- **"Domain not verified"**: Use a verified domain or Resend's default domain
- **"Rate limit exceeded"**: Resend has rate limits on free plans

### Support:
- [Resend Documentation](https://resend.com/docs)
- [Resend Support](https://resend.com/support)

## 9. Production Considerations

1. **Domain Verification**: Verify your domain for better deliverability
2. **Rate Limits**: Monitor your email sending limits
3. **Monitoring**: Set up email delivery monitoring
4. **Backup Provider**: Consider having a backup email provider

## 10. Environment Variables Summary

Add these to your `.env.local`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/resume-builder

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# PayPal Configuration (Sandbox)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_secret_here

# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
``` 