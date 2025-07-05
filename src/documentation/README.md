# Resume Builder Documentation

This directory contains comprehensive documentation for the Resume Builder project.

## Directory Structure

### `/src/auth/`
Centralized authentication logic and utilities.

### `/src/components/`
UI components organized by feature:
- `/resume-builder/` - Resume creation components
- `/landing/` - Landing page components  
- `/ui/` - Reusable UI components
- `/layout/` - Layout components
- `/providers/` - Context providers

### `/src/hooks/`
Custom React hooks for shared logic.

### `/src/lib/`
Utility functions and shared logic:
- `db.ts` - Database utilities
- `security.ts` - Security utilities
- `gemini.ts` - AI integration
- `pdf-generator.tsx` - PDF generation
- `resume-api.ts` - Resume API utilities
- `templates.ts` - Template utilities
- `utils.ts` - General utilities

### `/src/middleware/`
Custom middleware functions:
- `index.ts` - Main middleware with rate limiting and security

### `/src/models/`
Data models and types.

### `/src/types/`
TypeScript type definitions.

## Architecture

The project follows a modular, atomic component architecture with:
- **Atomic Components**: Small, reusable UI components
- **Validation Utilities**: Centralized field validation
- **Custom Hooks**: Shared business logic
- **Security Middleware**: Rate limiting and CSRF protection
- **Type Safety**: Strict TypeScript throughout

## Best Practices

1. **Component Organization**: Use atomic design principles
2. **Type Safety**: All components and functions are properly typed
3. **Validation**: Centralized validation utilities
4. **Security**: Rate limiting, CSRF protection, secure headers
5. **Testing**: Comprehensive test coverage
6. **Documentation**: Keep documentation updated with code changes 