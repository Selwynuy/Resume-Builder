# Resume Builder Documentation

Welcome to the Resume Builder documentation. This guide provides comprehensive information about the project structure, architecture, and development practices.

## Table of Contents

1. [Architecture Overview](./ARCHITECTURE.md) - System architecture and design patterns
2. [Rendering Strategies](./RENDERING_STRATEGIES.md) - Performance optimization and rendering strategies
3. [API Documentation](./API.md) - REST API endpoints and usage
4. [Component Library](#component-library) - UI components and their usage
5. [Accessibility Guidelines](./ACCESSIBILITY.md) - WCAG compliance and accessibility standards
6. [Testing Guide](./TESTING.md) - Testing practices and coverage
7. [Deployment Guide](./DEPLOYMENT.md) - Deployment and environment setup

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB
- NextAuth.js configuration

### Installation
```bash
npm install
npm run dev
```

### Environment Variables
Create a `.env.local` file with:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and shared logic
├── models/             # Database models
├── types/              # TypeScript type definitions
├── middleware/         # Custom middleware functions
└── documentation/      # Project documentation
```

## Key Features

- **AI-Powered Resume Building** - Intelligent suggestions and content generation
- **Modern Templates** - Professional, ATS-optimized resume templates
- **Real-time Preview** - Live preview as you build your resume
- **Export Options** - PDF export with custom styling
- **User Management** - Secure authentication and user profiles
- **Admin Dashboard** - Template and content management

## Development Practices

### UI Component Library (shadcn/ui)

- **Standard**: All interactive UI elements (buttons, inputs, labels, cards, badges, etc.) use [shadcn/ui](https://ui.shadcn.com/) components for consistency and maintainability.
- **Icons**: Lucide icons are used by default, but icon standardization is planned.
- **Usage**:
  - Import from `@/components/ui`:
    ```tsx
    import { Button, Input, Label, Card, Badge } from '@/components/ui'
    ```
  - Example:
    ```tsx
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" />
    <Button variant="outline">Submit</Button>
    ```
- **Migration Notes**:
  - All legacy custom/className-based buttons and inputs have been replaced with shadcn/ui components.
  - New UI elements should always use shadcn/ui for consistency.
  - If you find a custom button/input, refactor it to use the standard components.
  - For theming/customization, edit the shadcn/ui component files in `src/components/ui/`.

### Accessibility Standards

- **WCAG 2.1 AA Compliance**: All components meet WCAG 2.1 AA standards.
- **Keyboard Navigation**: All interactive elements are keyboard accessible with proper focus management.
- **Screen Reader Support**: 
  - All buttons have descriptive `aria-label` attributes
  - Form inputs are properly associated with labels using `htmlFor`
  - Decorative icons have `aria-hidden="true"`
  - Loading states are announced to screen readers
- **Skip Links**: Keyboard users can skip to main content using the skip link.
- **Focus Management**: Visible focus indicators on all interactive elements.
- **Semantic HTML**: Proper use of semantic elements (`main`, `section`, `nav`, etc.).
- **Color Contrast**: All text meets WCAG contrast requirements.
- **High Contrast Mode**: Support for system high contrast preferences.

### Code Style
- TypeScript strict mode
- ESLint + Prettier (Airbnb config)
- Absolute imports (`@/components/...`)
- Component-based architecture

### Testing
- Jest for unit and integration tests
- 100% test coverage target
- Tests alongside source files

### Performance
- Optimized rendering strategies (SSG/SSR/CSR)
- Image optimization
- Code splitting
- SEO optimization

## Contributing

1. Follow the established code style
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## Support

For questions or issues, please refer to the relevant documentation section or create an issue in the project repository. 