# Environment Variables Guide - Resume Builder

This document outlines all environment variables used in the Resume Builder application, their purposes, and security best practices.

## Table of Contents

1. [Required Variables](#required-variables)
2. [Optional Variables](#optional-variables)
3. [Development Variables](#development-variables)
4. [Production Variables](#production-variables)
5. [Security Best Practices](#security-best-practices)
6. [Environment Setup](#environment-setup)

## Required Variables

These variables must be set for the application to function properly.

### Database Configuration

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/resume-builder
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/resume-builder
```

**Purpose**: Database connection string for MongoDB
**Security**: Contains database credentials - keep secure
**Examples**:
- Local: `mongodb://localhost:27017/resume-builder`
- Atlas: `mongodb+srv://username:password@cluster.mongodb.net/resume-builder`

### Authentication Configuration

```env
# NextAuth.js secret key (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-secret-key-here

# NextAuth.js URL (must match your domain)
NEXTAUTH_URL=http://localhost:3000
```

**Purpose**: NextAuth.js configuration for session management
**Security**: NEXTAUTH_SECRET must be kept secret and unique per environment
**Generation**: Use `openssl rand -base64 32` to generate a secure secret

### Google OAuth (Optional but Recommended)

```env
# Google OAuth client ID
GOOGLE_CLIENT_ID=your-google-client-id

# Google OAuth client secret
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Purpose**: Google OAuth authentication
**Setup**: Configure in Google Cloud Console
**Security**: Keep client secret secure

### AI Integration

```env
# Google Gemini API key
GEMINI_API_KEY=your-gemini-api-key
```

**Purpose**: AI-powered features (content generation, optimization)
**Setup**: Get from Google AI Studio
**Security**: Keep API key secure and monitor usage

## Optional Variables

These variables enhance functionality but are not required.

### Analytics and Monitoring

```env
# Google Analytics ID
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry DSN for error tracking
SENTRY_DSN=https://your-sentry-dsn

# Application environment
NODE_ENV=development
```

**Purpose**: Analytics, error tracking, and environment identification
**Security**: NEXT_PUBLIC_GA_ID is safe to expose (client-side)

### Performance and Caching

```env
# Redis URL (for production caching)
REDIS_URL=redis://localhost:6379

# CDN URL (for static assets)
NEXT_PUBLIC_CDN_URL=https://cdn.yourdomain.com
```

**Purpose**: Performance optimization and caching
**Security**: Keep Redis credentials secure

### Email Configuration

```env
# SMTP configuration for email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Purpose**: Email notifications and password reset
**Security**: Use app passwords, not regular passwords

## Development Variables

These variables are used during development.

```env
# Development-specific settings
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Debug logging
DEBUG=resume-builder:*

# Development database
MONGODB_URI=mongodb://localhost:27017/resume-builder-dev
```

## Production Variables

These variables are used in production environments.

```env
# Production settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Production database (use Atlas or managed service)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-builder

# Production domain
NEXTAUTH_URL=https://yourdomain.com

# Security headers
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Security Best Practices

### 1. Environment File Management

**Never commit .env files to version control:**
```bash
# .gitignore should include:
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

**Use environment-specific files:**
- `.env.local` - Local development (gitignored)
- `.env.production` - Production settings (gitignored)
- `.env.example` - Template file (committed)

### 2. Secret Management

**Generate secure secrets:**
```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate database password
openssl rand -base64 16
```

**Use secrets management in production:**
- AWS Secrets Manager
- Azure Key Vault
- Google Secret Manager
- Vercel Environment Variables
- Netlify Environment Variables

### 3. Variable Naming

**Use descriptive names:**
```env
# Good
MONGODB_URI=mongodb://localhost:27017/resume-builder
NEXTAUTH_SECRET=your-secret-key

# Avoid
DB_URL=mongodb://localhost:27017/resume-builder
SECRET=your-secret-key
```

**Use NEXT_PUBLIC_ prefix for client-side variables:**
```env
# Available in browser
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Server-side only
MONGODB_URI=mongodb://localhost:27017/resume-builder
NEXTAUTH_SECRET=your-secret-key
```

### 4. Validation

**Validate environment variables on startup:**
```typescript
// lib/env.ts
export function validateEnv() {
  const required = [
    'MONGODB_URI',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ];

  for (const var_name of required) {
    if (!process.env[var_name]) {
      throw new Error(`Missing required environment variable: ${var_name}`);
    }
  }
}
```

## Environment Setup

### 1. Local Development

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/resume-builder

# Authentication
NEXTAUTH_SECRET=your-development-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI Integration
GEMINI_API_KEY=your-gemini-api-key

# Development
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

### 2. Production Setup

**Vercel:**
1. Go to project dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable with appropriate scopes

**AWS/EC2:**
```bash
# Create .env.production file
sudo nano /app/.env.production

# Set file permissions
sudo chmod 600 /app/.env.production
sudo chown app:app /app/.env.production
```

**Docker:**
```yaml
# docker-compose.yml
services:
  app:
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
```

### 3. Environment Template

Create a `.env.example` file (committed to git):

```env
# Database
MONGODB_URI=mongodb://localhost:27017/resume-builder

# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI Integration
GEMINI_API_KEY=your-gemini-api-key

# Environment
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Error Tracking (optional)
SENTRY_DSN=your-sentry-dsn
```

## Troubleshooting

### Common Issues

**1. Environment variables not loading:**
```bash
# Check file location
ls -la .env*

# Restart development server
npm run dev
```

**2. Database connection errors:**
```bash
# Test MongoDB connection
mongo "mongodb://localhost:27017/resume-builder" --eval "db.runCommand('ping')"
```

**3. Authentication issues:**
```bash
# Verify NextAuth configuration
echo $NEXTAUTH_SECRET
echo $NEXTAUTH_URL
```

### Validation Script

Create a validation script to check environment setup:

```bash
#!/bin/bash
# scripts/validate-env.sh

echo "Validating environment variables..."

required_vars=(
  "MONGODB_URI"
  "NEXTAUTH_SECRET"
  "NEXTAUTH_URL"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing required variable: $var"
    exit 1
  else
    echo "✅ $var is set"
  fi
done

echo "✅ All required environment variables are set"
```

## Security Checklist

- [ ] No .env files committed to git
- [ ] Strong, unique secrets for each environment
- [ ] Environment variables validated on startup
- [ ] Production secrets managed securely
- [ ] Client-side variables prefixed with NEXT_PUBLIC_
- [ ] Database credentials encrypted in transit
- [ ] API keys rotated regularly
- [ ] Environment-specific configurations used

## Support

For environment setup issues:
1. Check the validation script output
2. Verify file permissions and locations
3. Restart the development server
4. Check platform-specific documentation
5. Contact the development team 