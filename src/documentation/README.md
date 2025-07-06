# Resume Builder Documentation

Welcome to the Resume Builder documentation. This guide provides comprehensive information about the project structure, architecture, and development practices.

## Table of Contents

1. [Architecture Overview](./ARCHITECTURE.md) - System architecture and design patterns
2. [Rendering Strategies](./RENDERING_STRATEGIES.md) - Performance optimization and rendering strategies
3. [API Documentation](./API.md) - REST API endpoints and usage
4. [Component Library](./COMPONENTS.md) - UI components and their usage
5. [Testing Guide](./TESTING.md) - Testing practices and coverage
6. [Deployment Guide](./DEPLOYMENT.md) - Deployment and environment setup

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