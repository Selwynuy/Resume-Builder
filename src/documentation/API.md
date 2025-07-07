# API Documentation - Resume Builder

This document provides comprehensive documentation for all API endpoints in the Resume Builder application.

## Table of Contents

1. [Authentication](#authentication)
2. [Base URL](#base-url)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [API Endpoints](#api-endpoints)
6. [Data Models](#data-models)

## Authentication

The application uses NextAuth.js for authentication. Most API endpoints require authentication unless specified otherwise.

### Authentication Headers

```http
Authorization: Bearer <session-token>
```

### Session Management

- Sessions are managed via HTTP-only cookies
- Session tokens are automatically handled by NextAuth.js
- No manual token management required for frontend requests

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://yourdomain.com`

## Error Handling

All API endpoints return consistent error responses:

### Error Response Format

```json
{
  "error": "Error message description",
  "status": 400
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

## Rate Limiting

Different endpoints have different rate limits:

- **Authentication**: 5 requests per 15 minutes
- **AI Endpoints**: 20 requests per 15 minutes
- **Template Operations**: 30 requests per 15 minutes
- **Resume Operations**: 50 requests per 15 minutes
- **General API**: 100 requests per 15 minutes

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

## API Endpoints

### Authentication

#### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Validation Rules:**
- Name: 2-50 characters, letters, spaces, hyphens, periods, apostrophes
- Email: Valid email format, max 254 characters
- Password: 8-128 characters, must contain lowercase, uppercase, number, and special character

#### POST /api/auth/login

Authenticate a user and create a session.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Resume Management

#### GET /api/resumes

Get all resumes for the authenticated user.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of resumes per page (default: 10)

**Response:**
```json
{
  "resumes": [
    {
      "id": "resume_id",
      "title": "Software Engineer Resume",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### POST /api/resumes

Create a new resume.

**Request Body:**
```json
{
  "title": "Software Engineer Resume",
  "content": {
    "personalInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-555-0123",
      "location": "San Francisco, CA",
      "summary": "Experienced software engineer..."
    },
    "experience": [
      {
        "company": "Tech Corp",
        "position": "Senior Software Engineer",
        "startDate": "2022-01",
        "endDate": "Present",
        "description": "Led development of..."
      }
    ],
    "education": [
      {
        "school": "University of Technology",
        "degree": "Bachelor of Science",
        "field": "Computer Science",
        "graduationDate": "2020-05",
        "gpa": "3.8/4.0"
      }
    ],
    "skills": [
      {
        "name": "JavaScript",
        "level": "Expert",
        "years": 5,
        "certification": "AWS Certified Developer",
        "context": "Full-stack development"
      }
    ]
  },
  "template": "professional"
}
```

**Response:**
```json
{
  "resume": {
    "id": "resume_id",
    "title": "Software Engineer Resume",
    "content": { /* resume content */ },
    "template": "professional",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/resumes/{id}

Get a specific resume by ID.

**Response:**
```json
{
  "resume": {
    "id": "resume_id",
    "title": "Software Engineer Resume",
    "content": { /* resume content */ },
    "template": "professional",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/resumes/{id}

Update an existing resume.

**Request Body:** Same as POST /api/resumes

**Response:** Same as POST /api/resumes

#### DELETE /api/resumes/{id}

Delete a resume.

**Response:**
```json
{
  "message": "Resume deleted successfully"
}
```

#### POST /api/resumes/{id}/export

Export a resume as PDF.

**Request Body:**
```json
{
  "format": "pdf",
  "template": "professional"
}
```

**Response:**
```json
{
  "downloadUrl": "https://yourdomain.com/api/resumes/resume_id/download",
  "filename": "Software_Engineer_Resume.pdf"
}
```

#### POST /api/resumes/autosave

Auto-save resume content (for real-time saving).

**Request Body:**
```json
{
  "resumeId": "resume_id",
  "content": { /* partial or complete resume content */ }
}
```

**Response:**
```json
{
  "message": "Resume auto-saved successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### GET /api/resumes/check-draft

Check for unsaved draft content.

**Query Parameters:**
- `resumeId` (optional): Resume ID to check

**Response:**
```json
{
  "hasDraft": true,
  "lastSaved": "2024-01-01T00:00:00.000Z",
  "draftContent": { /* draft content */ }
}
```

### Template Management

#### GET /api/templates

Get all available templates.

**Query Parameters:**
- `category` (optional): Filter by category (professional, creative, modern, minimal, academic)
- `approved` (optional): Filter by approval status (true/false)
- `page` (optional): Page number for pagination
- `limit` (optional): Number of templates per page

**Response:**
```json
{
  "templates": [
    {
      "id": "template_id",
      "name": "Professional Template",
      "description": "Clean and professional design",
      "category": "professional",
      "preview": "data:image/png;base64,...",
      "price": 0,
      "rating": 4.5,
      "downloads": 1250,
      "isApproved": true,
      "createdBy": {
        "id": "user_id",
        "name": "Template Creator"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### GET /api/templates/{id}

Get a specific template by ID.

**Response:**
```json
{
  "template": {
    "id": "template_id",
    "name": "Professional Template",
    "description": "Clean and professional design",
    "category": "professional",
    "preview": "data:image/png;base64,...",
    "htmlTemplate": "<!DOCTYPE html>...",
    "cssStyles": "body { font-family: Arial; }",
    "price": 0,
    "rating": 4.5,
    "downloads": 1250,
    "isApproved": true,
    "createdBy": {
      "id": "user_id",
      "name": "Template Creator"
    }
  }
}
```

#### POST /api/templates

Create a new template (requires authentication).

**Request Body:**
```json
{
  "name": "My Custom Template",
  "description": "A custom template I created",
  "category": "professional",
  "htmlTemplate": "<!DOCTYPE html>...",
  "cssStyles": "body { font-family: Arial; }",
  "price": 0
}
```

**Response:**
```json
{
  "template": {
    "id": "template_id",
    "name": "My Custom Template",
    "description": "A custom template I created",
    "category": "professional",
    "isApproved": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/templates/{id}

Update an existing template (owner only).

**Request Body:** Same as POST /api/templates

**Response:** Same as POST /api/templates

#### DELETE /api/templates/{id}

Delete a template (owner only).

**Response:**
```json
{
  "message": "Template deleted successfully"
}
```

#### GET /api/templates/my

Get templates created by the authenticated user.

**Response:**
```json
{
  "templates": [
    {
      "id": "template_id",
      "name": "My Template",
      "description": "My custom template",
      "category": "professional",
      "isApproved": true,
      "downloads": 50,
      "rating": 4.2
    }
  ]
}
```

#### POST /api/templates/{id}/download

Download a template.

**Response:**
```json
{
  "downloadUrl": "https://yourdomain.com/api/templates/template_id/download",
  "filename": "Professional_Template.zip"
}
```

#### POST /api/templates/{id}/reviews

Add a review to a template.

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent template, very professional!"
}
```

**Response:**
```json
{
  "review": {
    "id": "review_id",
    "rating": 5,
    "comment": "Excellent template, very professional!",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "user_id",
      "name": "John Doe"
    }
  }
}
```

### AI Integration

#### POST /api/ai/bullet

Generate or optimize resume bullet points using AI.

**Request Body:**
```json
{
  "text": "Developed a React application",
  "mode": "generate",
  "stylePrompt": "Focus on quantifiable achievements"
}
```

**Modes:**
- `generate`: Create a new bullet point from experience description
- `rewrite`: Improve an existing bullet point
- `multi`: Generate multiple style variations

**Response (generate/rewrite):**
```json
{
  "suggestion": "Developed and deployed a React-based web application that improved user engagement by 25% and reduced page load times by 40%"
}
```

**Response (multi):**
```json
{
  "summaries": {
    "resultsOriented": "Developed a React application that increased user engagement by 25%",
    "teamPlayer": "Collaborated with cross-functional teams to develop a React application",
    "innovative": "Designed and implemented an innovative React application using modern web technologies",
    "concise": "Built a React application that improved user experience"
  }
}
```

#### POST /api/ai/summary

Generate professional summaries using AI.

**Request Body:**
```json
{
  "mode": "generate",
  "content": {
    "experience": "5 years of software development",
    "skills": "JavaScript, React, Node.js",
    "targetRole": "Senior Software Engineer"
  }
}
```

**Modes:**
- `generate`: Create a new professional summary
- `improve`: Improve an existing summary

**Response:**
```json
{
  "summaries": {
    "professional": "Experienced software engineer with 5 years of expertise...",
    "creative": "Passionate developer who transforms ideas into reality...",
    "friendly": "Dedicated team player with strong technical skills...",
    "technical": "Full-stack developer specializing in JavaScript ecosystems..."
  }
}
```

#### POST /api/ai/skills

Get AI-powered skills suggestions.

**Request Body:**
```json
{
  "jobTitle": "Software Engineer",
  "industry": "Technology",
  "experience": "3-5 years"
}
```

**Response:**
```json
{
  "suggestions": [
    {
      "name": "React",
      "level": "Intermediate",
      "context": "Frontend development",
      "relevance": 0.95
    },
    {
      "name": "Node.js",
      "level": "Intermediate",
      "context": "Backend development",
      "relevance": 0.88
    }
  ]
}
```

#### POST /api/ai/cover-letter

Generate cover letter content using AI.

**Request Body:**
```json
{
  "jobTitle": "Senior Software Engineer",
  "company": "Tech Corp",
  "resumeContent": { /* resume content */ },
  "jobDescription": "We are looking for a senior software engineer..."
}
```

**Response:**
```json
{
  "coverLetter": "Dear Hiring Manager,\n\nI am writing to express my interest...",
  "suggestions": [
    "Emphasize your React experience",
    "Mention your team leadership skills"
  ]
}
```

#### POST /api/ai/interview-prep

Get interview preparation suggestions using AI.

**Request Body:**
```json
{
  "jobTitle": "Software Engineer",
  "company": "Tech Corp",
  "resumeContent": { /* resume content */ }
}
```

**Response:**
```json
{
  "questions": [
    "Tell me about a challenging project you worked on",
    "How do you handle conflicting requirements?"
  ],
  "tips": [
    "Prepare specific examples from your experience",
    "Research the company's recent projects"
  ],
  "skills": [
    "System design",
    "Algorithm optimization"
  ]
}
```

#### POST /api/ai/feedback

Get AI-powered resume feedback.

**Request Body:**
```json
{
  "resumeContent": { /* resume content */ },
  "targetRole": "Software Engineer",
  "industry": "Technology"
}
```

**Response:**
```json
{
  "feedback": {
    "overall": "Strong resume with good technical skills",
    "strengths": [
      "Clear project descriptions",
      "Good technical skills"
    ],
    "improvements": [
      "Add more quantifiable achievements",
      "Include specific technologies used"
    ],
    "score": 8.5
  }
}
```

### Admin Endpoints

#### GET /api/admin/templates

Get all templates for admin review (admin only).

**Query Parameters:**
- `status` (optional): Filter by approval status (pending, approved, rejected)
- `page` (optional): Page number for pagination
- `limit` (optional): Number of templates per page

**Response:**
```json
{
  "templates": [
    {
      "id": "template_id",
      "name": "New Template",
      "description": "A new template awaiting approval",
      "category": "professional",
      "isApproved": false,
      "createdBy": {
        "id": "user_id",
        "name": "Template Creator"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

#### POST /api/admin/templates/{id}/approve

Approve a template (admin only).

**Response:**
```json
{
  "message": "Template approved successfully"
}
```

#### POST /api/admin/templates/{id}/reject

Reject a template (admin only).

**Request Body:**
```json
{
  "reason": "Template contains inappropriate content"
}
```

**Response:**
```json
{
  "message": "Template rejected successfully"
}
```

## Data Models

### Resume Model

```typescript
interface Resume {
  id: string;
  userId: string;
  title: string;
  content: {
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
  };
  template: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Template Model

```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'modern' | 'minimal' | 'academic';
  htmlTemplate: string;
  cssStyles: string;
  preview?: string;
  price: number;
  rating: number;
  downloads: number;
  isApproved: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### User Model

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Hashed
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

## Testing the API

### Using curl

```bash
# Get all resumes
curl -X GET "http://localhost:3000/api/resumes" \
  -H "Cookie: next-auth.session-token=your-session-token"

# Create a new resume
curl -X POST "http://localhost:3000/api/resumes" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{
    "title": "My Resume",
    "content": {
      "personalInfo": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }'
```

### Using Postman

1. Import the collection from the project repository
2. Set up environment variables for base URL and authentication
3. Use the pre-configured requests for testing

## Rate Limiting Examples

### Rate Limit Response

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1640995200
Retry-After: 900

{
  "error": "Rate limit exceeded. Please try again in 15 minutes."
}
```

## Security Considerations

1. **Input Validation**: All inputs are validated using Zod schemas
2. **XSS Prevention**: Content is sanitized using DOMPurify
3. **CSRF Protection**: Origin validation for state-changing requests
4. **Rate Limiting**: Per-endpoint rate limiting to prevent abuse
5. **Authentication**: JWT-based authentication with secure cookies

## Support

For API support or questions:
1. Check the error response for specific error messages
2. Review the validation rules for input requirements
3. Ensure proper authentication headers are included
4. Contact the development team for additional assistance 