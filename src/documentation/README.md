# Resume Builder Documentation

This directory contains comprehensive documentation for the Resume Builder project.

## Directory Structure

### `/src/auth/`
Centralized authentication logic and utilities.

### `/src/components/`
UI components organized by feature with clean imports:
- `/resume-builder/` - Resume creation components
- `/landing/` - Landing page components  
- `/ui/` - Reusable UI components
- `/layout/` - Layout components
- `/providers/` - Context providers
- `index.ts` - Main export file for all components

### `/src/hooks/`
Custom React hooks for shared logic:
- `index.ts` - Clean exports for all hooks

### `/src/lib/`
Utility functions and shared logic:
- `db.ts` - Database utilities
- `security.ts` - Security utilities
- `gemini.ts` - AI integration
- `pdf-generator.tsx` - PDF generation
- `resume-api.ts` - Resume API utilities
- `templates.ts` - Template utilities
- `utils.ts` - General utilities
- `index.ts` - Clean exports for all utilities

### `/src/middleware/`
Custom middleware functions:
- `index.ts` - Main middleware with rate limiting and security

### `/src/models/`
Data models and types:
- `index.ts` - Clean exports for all models

### `/src/types/`
TypeScript type definitions:
- `index.ts` - Clean exports for all types

## Architecture

The project follows a modular, atomic component architecture with:
- **Atomic Components**: Small, reusable UI components
- **Validation Utilities**: Centralized field validation
- **Custom Hooks**: Shared business logic
- **Security Middleware**: Rate limiting and CSRF protection
- **Type Safety**: Strict TypeScript throughout

## Clean Imports

The project uses index files throughout to enable clean, organized imports:

### Import Examples

```typescript
// Instead of multiple imports from different files:
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useResumeWizard } from '@/hooks/useResumeWizard'
import { db } from '@/lib/db'

// You can now use clean imports:
import { Button, Card } from '@/components/ui'
import { useResumeWizard } from '@/hooks'
import { db } from '@/lib'
```

### Available Index Files

- `@/components` - All UI components
- `@/components/resume-builder` - Resume builder components
- `@/components/ui` - Reusable UI components
- `@/hooks` - Custom React hooks
- `@/lib` - Utility functions
- `@/models` - Data models
- `@/types` - TypeScript types

## Best Practices

1. **Component Organization**: Use atomic design principles
2. **Type Safety**: All components and functions are properly typed
3. **Validation**: Centralized validation utilities
4. **Security**: Rate limiting, CSRF protection, secure headers
5. **Testing**: Comprehensive test coverage
6. **Documentation**: Keep documentation updated with code changes
7. **Clean Imports**: Use index files for organized imports 