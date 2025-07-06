# Security Documentation - Resume Builder Application

## Overview

This document outlines the security measures implemented in the Resume Builder application to protect against common web vulnerabilities and ensure data protection.

## Security Architecture

### 1. Authentication & Authorization

#### Password Security
- **Hashing**: Passwords are hashed using bcrypt with salt rounds of 10
- **Complexity Requirements**: 
  - Minimum 8 characters, maximum 128 characters
  - Must contain lowercase, uppercase, number, and special character
  - Common weak passwords are blocked
- **Storage**: Passwords are never stored in plain text

#### Session Management
- **JWT-based**: Uses NextAuth.js with JWT strategy
- **Secure Cookies**: HTTP-only, secure, same-site cookies
- **Session Timeout**: 24-hour session timeout
- **CSRF Protection**: Origin and referer validation for state-changing requests

#### Access Control
- **Route Protection**: All sensitive routes require authentication
- **Resource Ownership**: Users can only access their own data
- **Admin Routes**: Protected admin endpoints for template approval

### 2. Input Validation & Sanitization

#### Validation Framework
- **Zod Schemas**: Type-safe validation for all user inputs
- **Input Limits**: Strict character limits on all fields
- **Pattern Matching**: Regex validation for emails, phones, URLs
- **Array Limits**: Maximum array lengths to prevent DoS

#### Sanitization
- **HTML Sanitization**: DOMPurify for template content
- **CSS Sanitization**: Removes dangerous CSS constructs
- **XSS Prevention**: All user content is sanitized before rendering
- **SQL Injection Prevention**: Parameterized queries with Mongoose

#### Input Limits
```typescript
export const INPUT_LIMITS = {
  NAME: 50,
  EMAIL: 100,
  PHONE: 20,
  LOCATION: 100,
  SUMMARY: 500,
  COMPANY: 100,
  POSITION: 100,
  DESCRIPTION: 1000,
  SCHOOL: 100,
  DEGREE: 100,
  FIELD: 100,
  SKILL_NAME: 50,
  TEMPLATE_NAME: 100,
  TEMPLATE_DESCRIPTION: 500,
  REVIEW_COMMENT: 1000,
  REQUEST_BODY_SIZE: 1024 * 1024, // 1MB
  MAX_ARRAY_LENGTH: 100
}
```

### 3. Rate Limiting

#### Endpoint-Specific Limits
- **Authentication**: 5 requests per 15 minutes
- **AI Endpoints**: 20 requests per 15 minutes (cost protection)
- **Template Operations**: 30 requests per 15 minutes
- **Resume Operations**: 50 requests per 15 minutes
- **General API**: 100 requests per 15 minutes
- **Session Management**: 100 requests per 15 minutes

#### Implementation
- **IP-based**: Rate limiting by IP address
- **Automatic Cleanup**: Expired entries removed every hour
- **Proper Headers**: Retry-After headers in 429 responses
- **Memory Store**: In-memory with Redis recommended for production

### 4. CSRF Protection

#### Multi-Layer Protection
- **Origin Validation**: Checks request origin against allowed hosts
- **Referer Validation**: Validates referer header for additional protection
- **Token-based**: CSRF tokens for form submissions (optional enhancement)
- **Same-Origin Policy**: Enforces same-origin for state-changing requests

#### Allowed Origins
- Same-origin requests (https://host, http://host)
- Localhost development (localhost:3000, 127.0.0.1:3000)
- Secure subdomains

### 5. Security Headers

#### HTTP Security Headers
```typescript
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()',
  'X-DNS-Prefetch-Control': 'off',
  'X-Download-Options': 'noopen',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}
```

#### Content Security Policy
- **Script Sources**: Only same-origin scripts allowed
- **Style Sources**: Same-origin and inline styles
- **Frame Ancestors**: No embedding allowed (X-Frame-Options: DENY)
- **Base URI**: Restricted to same-origin
- **Form Action**: Restricted to same-origin

### 6. Error Handling & Logging

#### Error Sanitization
- **Development**: Detailed error messages for debugging
- **Production**: Generic error messages to prevent information disclosure
- **Error Types**: Mapped to user-friendly messages
- **Stack Traces**: Never exposed in production

#### Logging
- **Request Logging**: All API requests logged with timing
- **Error Logging**: Structured error logging
- **Security Events**: Rate limit violations, CSRF failures logged
- **No Sensitive Data**: Passwords, tokens never logged

### 7. Data Protection

#### Database Security
- **MongoDB**: NoSQL injection protection through Mongoose
- **ObjectId Validation**: All IDs validated before database queries
- **Connection Security**: TLS/SSL for database connections
- **Query Sanitization**: All queries use parameterized inputs

#### File Upload Security
- **Type Validation**: Only allowed file types
- **Size Limits**: Maximum file size restrictions
- **Virus Scanning**: Recommended for production
- **Secure Storage**: Files stored outside web root

### 8. API Security

#### Request Validation
- **Content-Type**: JSON required for API requests
- **Request Size**: 1MB maximum request body size
- **Method Validation**: Only allowed HTTP methods
- **Parameter Validation**: All query parameters validated

#### Response Security
- **CORS**: Proper CORS configuration
- **Headers**: Security headers on all responses
- **Status Codes**: Proper HTTP status codes
- **No Sensitive Data**: Sensitive data never in responses

### 9. AI Integration Security

#### API Key Protection
- **Environment Variables**: API keys stored in environment
- **Rate Limiting**: Strict limits on AI endpoints
- **Input Validation**: All AI prompts validated and sanitized
- **Output Sanitization**: AI responses sanitized before use

#### Cost Protection
- **Request Limits**: 20 AI requests per 15 minutes per user
- **Prompt Validation**: Maximum prompt length limits
- **Error Handling**: Graceful handling of API failures
- **Fallback**: Non-AI alternatives available

### 10. Template Security

#### Content Sanitization
- **HTML Sanitization**: DOMPurify with restrictive settings
- **CSS Sanitization**: Dangerous CSS constructs removed
- **JavaScript Prevention**: No script execution allowed
- **URL Validation**: Only safe URLs allowed

#### Template Validation
- **Structure Validation**: Template structure validated
- **Placeholder Validation**: Safe placeholder names only
- **Size Limits**: Template size restrictions
- **Approval Process**: Templates require admin approval

## Security Testing

### Automated Testing
- **Unit Tests**: Security functions tested
- **Integration Tests**: API security tested
- **Rate Limiting Tests**: Rate limit functionality verified
- **CSRF Tests**: CSRF protection validated

### Manual Testing
- **Penetration Testing**: Regular security assessments
- **Vulnerability Scanning**: Automated vulnerability scans
- **Code Review**: Security-focused code reviews
- **Dependency Audits**: Regular dependency updates

## Incident Response

### Security Incidents
1. **Immediate Response**: Isolate affected systems
2. **Investigation**: Determine scope and impact
3. **Containment**: Prevent further damage
4. **Recovery**: Restore normal operations
5. **Post-Incident**: Document lessons learned

### Reporting
- **Security Team**: Immediate notification
- **Management**: Escalation procedures
- **Users**: Transparent communication
- **Regulators**: Compliance reporting if required

## Compliance

### GDPR Compliance
- **Data Minimization**: Only necessary data collected
- **User Consent**: Clear consent mechanisms
- **Right to Erasure**: User data deletion capability
- **Data Portability**: Export user data functionality

### SOC 2 Type II
- **Access Controls**: Documented access procedures
- **Change Management**: Controlled deployment process
- **Monitoring**: Security event monitoring
- **Incident Response**: Documented response procedures

## Best Practices

### Development
- **Secure Coding**: Follow OWASP guidelines
- **Code Review**: Security-focused reviews
- **Dependency Management**: Regular updates
- **Testing**: Comprehensive security testing

### Deployment
- **Environment Separation**: Dev, staging, production
- **Secrets Management**: Secure secret storage
- **Monitoring**: Security event monitoring
- **Backup**: Regular secure backups

### Maintenance
- **Updates**: Regular security updates
- **Monitoring**: Continuous security monitoring
- **Auditing**: Regular security audits
- **Training**: Security awareness training

## Security Contacts

- **Security Team**: security@resumebuilder.com
- **Bug Reports**: security-bugs@resumebuilder.com
- **Emergency**: +1-555-SECURITY

## Version History

- **v1.0**: Initial security documentation
- **v1.1**: Added CSRF protection details
- **v1.2**: Enhanced rate limiting documentation
- **v1.3**: Added AI integration security
- **v1.4**: Updated CSP and security headers 