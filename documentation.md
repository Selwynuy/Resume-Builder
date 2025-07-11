# Resume Builder with AI Integration and Template Marketplace
## Documentation

### Methodology

#### 1. System Architecture

##### 1.1 Frontend Architecture
- **Framework**: Next.js 14
  - Server-side rendering for better SEO
  - API routes for backend integration
  - File-based routing system
- **State Management**: 
  - React Context for global state
  - Zustand for complex state management
- **UI Components**:
  - Tailwind CSS for styling
  - Shadcn/ui for component library
  - React-PDF for PDF generation
  - React-DnD for drag-and-drop functionality

##### 1.2 Backend Architecture
- **Server**: Node.js with Express
- **Database**: MongoDB
  - Collections:
    - Users
    - Resumes
    - Templates
    - Marketplace
- **Storage**: AWS S3
  - Template assets
  - User uploads
  - Generated PDFs

##### 1.3 AI Integration
- **OpenAI GPT-4**
  - Content optimization
  - Grammar checking
  - Style suggestions
- **Custom ML Models**
  - ATS compatibility scoring
  - Keyword optimization
  - Skills gap analysis

#### 2. Development Methodology

##### 2.1 Agile Development
- Two-week sprints
- Daily standups
- Sprint planning and retrospectives
- Continuous integration/deployment

##### 2.2 Version Control
- Git workflow
- Feature branches
- Pull request reviews
- Automated testing

#### 3. Implementation Phases

##### Phase 1: Core Resume Builder (Weeks 1-4)
1. Basic user authentication
2. Resume creation interface
3. PDF export functionality
4. Basic template system

##### Phase 2: AI Integration (Weeks 5-8)
1. OpenAI API integration
2. Content optimization features
3. ATS compatibility checker
4. Skills gap analysis

##### Phase 3: Template Marketplace (Weeks 9-12)
1. Template creation tools
2. Marketplace infrastructure
3. Payment integration
4. Template review system

##### Phase 4: Advanced Features (Weeks 13-16)
1. Advanced AI features
2. Analytics dashboard
3. User feedback system
4. Performance optimization

#### 4. Technical Specifications

##### 4.1 Frontend Requirements
```typescript
// Core Dependencies
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "@react-pdf/renderer": "^3.1.0",
    "react-dnd": "^16.0.0",
    "zustand": "^4.4.0"
  }
}
```

##### 4.2 Backend Requirements
```typescript
// Core Dependencies
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.0.0",
    "aws-sdk": "^2.1000.0",
    "openai": "^4.0.0",
    "jsonwebtoken": "^9.0.0"
  }
}
```

#### 5. Data Models

##### 5.1 User Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  resumes: Resume[];
  templates: Template[];
}
```

##### 5.2 Resume Model
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

##### 5.3 Template Model
```typescript
interface Template {
  id: string;
  creatorId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  preview: string;
  content: {
    layout: Layout;
    styles: Styles;
    customFields: CustomField[];
  };
  rating: number;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 6. API Endpoints

##### 6.1 User Endpoints
```typescript
// Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

// User Management
GET /api/users/profile
PUT /api/users/profile
DELETE /api/users/profile
```

##### 6.2 Resume Endpoints
```typescript
// Resume Management
GET /api/resumes
POST /api/resumes
GET /api/resumes/:id
PUT /api/resumes/:id
DELETE /api/resumes/:id
POST /api/resumes/:id/export
```

##### 6.3 Template Endpoints
```typescript
// Template Management
GET /api/templates
POST /api/templates
GET /api/templates/:id
PUT /api/templates/:id
DELETE /api/templates/:id
POST /api/templates/:id/purchase
```

#### 7. Security Measures

##### 7.1 Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration

##### 7.2 Data Protection
- Input validation
- XSS prevention
- CSRF protection
- Data encryption

#### 8. Testing Strategy

##### 8.1 Unit Testing
- Jest for frontend
- Mocha for backend
- Component testing
- API endpoint testing

##### 8.2 Integration Testing
- End-to-end testing with Cypress
- API integration tests
- Database integration tests

##### 8.3 Performance Testing
- Load testing with k6
- Stress testing
- Memory leak detection

#### 9. Deployment Strategy

##### 9.1 Infrastructure
- AWS EC2 for hosting
- MongoDB Atlas for database
- AWS S3 for storage
- CloudFront for CDN

##### 9.2 CI/CD Pipeline
- GitHub Actions for automation
- Docker containerization
- Automated testing
- Zero-downtime deployment

#### 10. Monitoring and Analytics

##### 10.1 Application Monitoring
- Error tracking with Sentry
- Performance monitoring
- User behavior analytics
- Server health checks

##### 10.2 Business Analytics
- User engagement metrics
- Template popularity
- Revenue tracking
- Conversion rates 

## AI Integration: Google Gemini API

### Setup
- Add your Gemini API key to your environment variables as `GEMINI_API_KEY`.
- The utility is located at `src/lib/gemini.ts`.

### Usage
```ts
import { getGeminiCompletion } from '@/lib/gemini'

const result = await getGeminiCompletion('Write a professional summary for a software engineer.')
```
- Supports options for system prompt, temperature, and max tokens.
- Handles rate limiting (1.5s between calls) and logs errors.

### Testing
- Tests are in `src/lib/gemini.test.ts` (Jest).
- Mocks fetch and environment variable for safe testing. 

## Multi-Style AI Summary Modal (Personal Info Step)

- Click the "AI Suggest" button in the Personal Info step to open the AI summary modal.
- The modal displays 4 labeled summary options: Professional, Creative, Friendly, Technical.
- Each option has:
  - **Use**: Inserts the summary into your resume and closes the modal.
  - **Copy**: Copies the summary to your clipboard (modal stays open).
- The currently selected summary is highlighted.
- Fully accessible: keyboard navigation, focus management, and ARIA labels.
- UI/UX matches the current design system.

No explanations are shown—just the summaries and labels for quick selection.

# Changelog

- AI Suggestion modals (PersonalInfoStep, ExperienceStep, SkillsStep) are now wide, scrollable, and include a Copy button for convenience.
- Gemini API endpoint updated to use gemini-2.0-flash (v1beta).

## AI Features

- AI Suggestion modals now handle large responses gracefully with a wide, scrollable design.
- Users can copy AI-generated suggestions to clipboard with a single click.
- Gemini API integration uses the latest gemini-2.0-flash model for faster, more cost-effective suggestions. 

# HeroSection Redesign (2024)

## Overview
The HeroSection was redesigned for a modern, engaging, and accessible look inspired by user feedback and contemporary landing page trends.

## Key Features
- **Full viewport height**: Uses 100vh (`h-screen`) for an immersive hero section
- **Light background** for a clean, modern feel
- **Blue/purple/teal blobs**: Animated, blurred blobs and playful bubble blobs for visual interest
- **Large heading** ("Build Your Future") partially behind the robot for visual impact, now highly readable
- **Robot image** centered, with subtle floating animation
- **Prominent CTA button** ("Create my Resume") below the hero area, with animated hover glow
- **Left value prop**: Short, bold statement about the product
- **Right features**: Key selling points (Free, No Credit Card, ATS Optimized)
- **Responsive** layout for mobile and desktop
- **Accessibility**: Good color contrast, alt text, keyboard navigation

## Improvements
- Subtle, modern animations for engagement (blobs, bubbles, robot float)
- Clear, accessible CTA

## File
- `src/components/landing/HeroSection.tsx`

---

_Last updated: 2024-_ 