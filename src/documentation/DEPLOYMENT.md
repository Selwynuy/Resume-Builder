# Deployment Guide - Resume Builder

This guide covers deploying the Resume Builder application to various platforms and environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Options](#deployment-options)
4. [Production Considerations](#production-considerations)
5. [Monitoring and Maintenance](#monitoring-and-maintenance)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- **Production Database**: MongoDB Atlas or self-hosted MongoDB
- **Domain Name**: For SSL certificates and user experience
- **Environment Variables**: All required production environment variables
- **API Keys**: Google OAuth, Gemini AI, and other service keys
- **Monitoring Tools**: Error tracking and performance monitoring

## Environment Setup

### Production Environment Variables

Create a `.env.production` file or set environment variables in your deployment platform:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-builder

# Authentication
NEXTAUTH_SECRET=your-production-secret-key
NEXTAUTH_URL=https://yourdomain.com

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI Integration
GEMINI_API_KEY=your-gemini-api-key

# Environment
NODE_ENV=production

# Optional: Analytics and Monitoring
NEXT_PUBLIC_GA_ID=your-google-analytics-id
SENTRY_DSN=your-sentry-dsn
```

### Security Considerations

1. **Secrets Management**: Use your platform's secrets management system
2. **Environment Separation**: Keep dev/staging/prod environments separate
3. **Access Control**: Limit access to production environment variables
4. **Regular Rotation**: Rotate secrets and API keys regularly

## Deployment Options

### 1. Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### Setup

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel --prod
```

#### Configuration

Create a `vercel.json` file in the root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "NEXTAUTH_URL": "@nextauth-url",
    "GOOGLE_CLIENT_ID": "@google-client-id",
    "GOOGLE_CLIENT_SECRET": "@google-client-secret",
    "GEMINI_API_KEY": "@gemini-api-key"
  }
}
```

#### Environment Variables in Vercel

1. Go to your project dashboard
2. Navigate to Settings > Environment Variables
3. Add each environment variable with appropriate scopes

### 2. Netlify

#### Setup

1. **Build Command**:
```bash
npm run build
```

2. **Publish Directory**:
```
.next
```

3. **Environment Variables**: Set in Netlify dashboard

#### Configuration

Create a `netlify.toml` file:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. AWS (EC2 + Load Balancer)

#### Prerequisites

- AWS account with EC2, RDS, and Load Balancer access
- Domain name with DNS management
- SSL certificate (AWS Certificate Manager)

#### Setup

1. **Launch EC2 Instance**:
```bash
# Use Ubuntu 20.04 LTS
# Instance type: t3.medium or larger
# Security group: Allow ports 22, 80, 443
```

2. **Install Dependencies**:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

3. **Deploy Application**:
```bash
# Clone repository
git clone <repository-url>
cd Resume-Builder

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "resume-builder" -- start
pm2 startup
pm2 save
```

4. **Configure Nginx**:
```nginx
# /etc/nginx/sites-available/resume-builder
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Enable Site**:
```bash
sudo ln -s /etc/nginx/sites-available/resume-builder /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Docker Deployment

#### Dockerfile

Create a `Dockerfile` in the root:

```dockerfile
# Use Node.js 18 Alpine
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

#### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Production Considerations

### 1. Performance Optimization

#### Build Optimization

```bash
# Analyze bundle size
npm run build
npm run analyze

# Enable compression
# Add to next.config.js
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false
}
```

#### Caching Strategy

```typescript
// Add to API routes
export const revalidate = 3600; // 1 hour

// Add to pages
export const revalidate = 1800; // 30 minutes
```

### 2. Security Hardening

#### Security Headers

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  return response;
}
```

#### Rate Limiting

```typescript
// middleware/rate-limiting.ts
export const RATE_LIMIT_CONFIGS = {
  auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  ai: { maxRequests: 20, windowMs: 15 * 60 * 1000 }, // 20 requests per 15 minutes
  api: { maxRequests: 100, windowMs: 15 * 60 * 1000 } // 100 requests per 15 minutes
};
```

### 3. Database Optimization

#### MongoDB Atlas

1. **Choose the right cluster tier**
2. **Enable connection pooling**
3. **Set up proper indexes**
4. **Monitor performance**

#### Connection Management

```typescript
// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
```

### 4. Monitoring and Logging

#### Error Tracking

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

#### Performance Monitoring

```typescript
// lib/analytics.ts
export function trackEvent(event: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, properties);
  }
}
```

## Monitoring and Maintenance

### 1. Health Checks

Create a health check endpoint:

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    await dbConnect();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 500 }
    );
  }
}
```

### 2. Backup Strategy

#### Database Backups

```bash
# MongoDB Atlas: Enable automated backups
# Self-hosted: Set up cron jobs

# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://localhost:27017/resume-builder" --out="/backups/$DATE"
```

#### File Backups

```bash
# Backup uploaded files
rsync -av /app/uploads/ /backups/uploads/
```

### 3. Update Strategy

#### Automated Updates

```bash
# Create update script
#!/bin/bash
git pull origin main
npm install
npm run build
pm2 restart resume-builder
```

#### Rollback Plan

```bash
# Rollback to previous version
git checkout HEAD~1
npm install
npm run build
pm2 restart resume-builder
```

## Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Clear cache
rm -rf .next
rm -rf node_modules/.cache
npm install
npm run build
```

#### 2. Database Connection Issues

```bash
# Check connection
mongo "mongodb://localhost:27017/resume-builder" --eval "db.runCommand('ping')"

# Check logs
pm2 logs resume-builder
```

#### 3. Memory Issues

```bash
# Monitor memory usage
pm2 monit

# Restart if needed
pm2 restart resume-builder
```

#### 4. SSL Issues

```bash
# Check certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Renew certificate (Let's Encrypt)
certbot renew
```

### Performance Issues

#### 1. Slow Page Loads

- Check database query performance
- Optimize images and assets
- Enable caching
- Use CDN for static assets

#### 2. High Memory Usage

- Monitor memory leaks
- Optimize bundle size
- Use streaming for large responses
- Implement proper garbage collection

### Getting Help

1. **Check Logs**: Review application and server logs
2. **Monitor Metrics**: Use monitoring tools to identify issues
3. **Documentation**: Refer to platform-specific documentation
4. **Community**: Reach out to the development team

## Best Practices

1. **Always test in staging first**
2. **Use blue-green deployments when possible**
3. **Monitor key metrics continuously**
4. **Keep backups up to date**
5. **Document deployment procedures**
6. **Have a rollback plan ready**
7. **Use environment-specific configurations**
8. **Implement proper logging and monitoring**

Remember: Production deployments should be treated with care and always tested thoroughly in staging environments first. 