# Onboarding Guide - Resume Builder

Welcome to the Resume Builder project! This guide will help you get up and running quickly.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Development Workflow](#development-workflow)
4. [Project Structure](#project-structure)
5. [Key Concepts](#key-concepts)
6. [Common Tasks](#common-tasks)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Package manager
- **Git** - Version control
- **MongoDB** - Database (local or Atlas)
- **VS Code** (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Resume-Builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/resume-builder
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/resume-builder

# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI Integration
GEMINI_API_KEY=your-gemini-api-key

# Development
NODE_ENV=development
```

### 4. Database Setup

If using local MongoDB:

```bash
# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Or with Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Development Workflow

### 1. Code Style and Standards

This project uses:
- **TypeScript** with strict mode
- **ESLint** with Airbnb config
- **Prettier** for code formatting
- **Absolute imports** (`@/components/...`)

### 2. Git Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ... code changes ...

# Run tests and linting
npm test
npm run lint

# Commit with conventional commits
git commit -m "feat: add new resume template feature"

# Push and create PR
git push origin feature/your-feature-name
```

### 3. Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test src/components/ValidatedInput.test.tsx

# Watch mode for development
npm test -- --watch
```

### 4. Code Quality

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Type checking
npm run type-check
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── resume/           # Resume builder pages
│   └── templates/        # Template marketplace
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── resume-builder/   # Resume-specific components
│   ├── landing/          # Landing page components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── models/               # Database models
├── middleware/           # Custom middleware
├── types/                # TypeScript type definitions
└── documentation/        # Project documentation
```

## Key Concepts

### 1. Component Architecture

The project follows atomic design principles:

- **Atoms**: Basic building blocks (Button, Input, Label)
- **Molecules**: Simple combinations (ValidatedInput, SkillInputRow)
- **Organisms**: Complex sections (ExperienceStep, SkillsStep)
- **Templates**: Page layouts
- **Pages**: Complete pages with data

### 2. State Management

- **Local State**: React useState for component-specific state
- **Form State**: Controlled components with validation
- **Global State**: NextAuth for authentication
- **Persistence**: LocalStorage for drafts, database for final data

### 3. Security

- **Input Validation**: Zod schemas for all user inputs
- **XSS Prevention**: DOMPurify for content sanitization
- **CSRF Protection**: Origin validation for state-changing requests
- **Rate Limiting**: Per-endpoint rate limiting
- **Authentication**: NextAuth.js with JWT strategy

### 4. AI Integration

- **Google Gemini API**: For content generation and optimization
- **Rate Limiting**: Built-in protection against API abuse
- **Error Handling**: Graceful fallbacks for AI failures
- **Caching**: LocalStorage caching for AI responses

## Common Tasks

### Adding a New Component

1. Create the component file:
```tsx
// src/components/NewComponent.tsx
import { ReactNode } from 'react';

interface NewComponentProps {
  title: string;
  children?: ReactNode;
}

export const NewComponent = ({ title, children }: NewComponentProps) => {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
};
```

2. Add to index file:
```tsx
// src/components/index.ts
export { NewComponent } from './NewComponent';
```

3. Write tests:
```tsx
// src/components/NewComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { NewComponent } from './NewComponent';

describe('NewComponent', () => {
  it('renders title', () => {
    render(<NewComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

### Adding a New API Route

1. Create the route file:
```typescript
// src/app/api/new-endpoint/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello World' });
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ received: body });
}
```

2. Write tests:
```typescript
// src/app/api/new-endpoint/route.test.ts
import { GET, POST } from './route';

describe('/api/new-endpoint', () => {
  it('GET returns hello world', async () => {
    const response = await GET();
    const data = await response.json();
    expect(data.message).toBe('Hello World');
  });
});
```

### Adding Database Models

1. Create the model:
```typescript
// src/models/NewModel.ts
import mongoose from 'mongoose';

const newModelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const NewModel = mongoose.models.NewModel || mongoose.model('NewModel', newModelSchema);
```

2. Add to index:
```typescript
// src/models/index.ts
export { NewModel } from './NewModel';
```

## Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Or check Docker container
docker ps | grep mongodb
```

**2. Environment Variables Not Loading**
- Ensure `.env.local` is in the root directory
- Restart the development server after adding new variables
- Check variable names match exactly

**3. TypeScript Errors**
```bash
# Run type checking
npm run type-check

# Check for missing types
npm install @types/package-name
```

**4. Test Failures**
```bash
# Clear Jest cache
npm test -- --clearCache

# Run specific failing test
npm test -- --testNamePattern="test name"
```

### Getting Help

1. **Check Documentation**: Review the documentation in `src/documentation/`
2. **Search Issues**: Look for similar issues in the repository
3. **Ask Questions**: Create an issue or reach out to the team
4. **Code Review**: Request a code review for complex changes

## Next Steps

1. **Read the Architecture Guide**: `src/documentation/ARCHITECTURE.md`
2. **Review Security Practices**: `src/documentation/SECURITY.md`
3. **Understand Rendering Strategies**: `src/documentation/RENDERING_STRATEGIES.md`
4. **Check Accessibility Guidelines**: `src/documentation/ACCESSIBILITY.md`
5. **Start with a Simple Task**: Pick up a "good first issue" or small bug fix

Welcome to the team! 🚀 