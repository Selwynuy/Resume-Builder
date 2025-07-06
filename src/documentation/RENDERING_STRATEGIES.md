# Rendering Strategies Documentation

This document outlines the rendering strategies used throughout the Resume Builder application, explaining why each approach was chosen and how it's implemented.

## Overview

Our application uses a hybrid approach to rendering, selecting the optimal strategy for each page based on:
- **Content type** (static vs. dynamic)
- **User interaction requirements** (high vs. low interactivity)
- **Data freshness requirements** (real-time vs. cached)
- **SEO considerations** (public vs. private content)

## Rendering Strategies Used

### 1. Static Site Generation (SSG) with Incremental Static Regeneration (ISR)

**Used for:** Landing page, Template detail pages

**Implementation:**
```typescript
// Landing page - revalidates every hour
export const revalidate = 3600

// Template detail pages - revalidates every 30 minutes
export const revalidate = 1800
```

**Why SSG/ISR:**
- **Landing page**: Content rarely changes, benefits from fast loading and good SEO
- **Template detail pages**: Content changes infrequently, but needs to stay fresh for new templates

**Benefits:**
- Fastest possible loading times
- Excellent SEO performance
- Reduced server load
- Automatic content updates without full rebuilds

### 2. Server-Side Rendering (SSR)

**Used for:** Dashboard, Login, Signup, Templates listing, Admin pages, User templates

**Implementation:**
```typescript
export const dynamic = 'force-dynamic'
```

**Why SSR:**
- **Dashboard**: User-specific data that changes frequently
- **Auth pages**: Form validation and error handling
- **Templates listing**: Dynamic filtering and user-specific content
- **Admin pages**: Real-time data that needs to be fresh
- **User templates**: Personal content that varies by user

**Benefits:**
- Always fresh data
- Good SEO for public pages
- Secure server-side processing
- Consistent user experience

### 3. Client-Side Rendering (CSR)

**Used for:** Resume builder, Template preview components

**Implementation:**
```typescript
'use client'
```

**Why CSR:**
- **Resume builder**: Highly interactive with real-time updates
- **Template preview**: Complex rendering that benefits from client-side processing

**Benefits:**
- Rich interactivity
- Real-time updates
- Better user experience for complex interactions

## Page-by-Page Breakdown

### Public Pages

| Page | Strategy | Reason |
|------|----------|---------|
| `/` (Landing) | SSG + ISR | Static content, SEO critical |
| `/templates` | SSR | Dynamic filtering, user-specific content |
| `/templates/[id]` | SSG + ISR | Template details change infrequently |

### Authentication Pages

| Page | Strategy | Reason |
|------|----------|---------|
| `/login` | SSR | Form validation, error handling |
| `/signup` | SSR | Form validation, error handling |

### User Pages

| Page | Strategy | Reason |
|------|----------|---------|
| `/dashboard` | SSR | User-specific data, real-time stats |
| `/resume/new` | CSR | Highly interactive builder |
| `/resume/edit/[id]` | CSR | Highly interactive builder |
| `/templates/my` | SSR | User-specific templates |
| `/templates/create` | CSR | Interactive template builder |
| `/admin` | SSR | Real-time admin data |

## Component-Level Strategies

### Template Preview Component

**Strategy:** Client-side rendering with hydration-safe approach

**Implementation:**
```typescript
// Separate client component to avoid hydration errors
'use client'
import { useEffect, useState } from 'react'

export default function TemplatePreview({ template }) {
  const [preview, setPreview] = useState({ html: '', css: '' })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Generate preview on client-side only
    generatePreview()
  }, [template])
  
  // ... rest of component
}
```

**Why this approach:**
- Avoids hydration mismatches between server and client
- Ensures consistent DOMPurify sanitization
- Provides loading states for better UX

## Data Fetching Patterns

### Server-Side Data Fetching

```typescript
// For SSR pages
async function getData() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/endpoint`, {
    cache: 'no-store' // Always fresh data
  })
  return response.json()
}
```

### Client-Side Data Fetching

```typescript
// For CSR components
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('/api/endpoint')
    const data = await response.json()
    setData(data)
  }
  fetchData()
}, [])
```

## Security Considerations

### DOMPurify Integration

**Challenge:** DOMPurify works differently in server vs. client environments

**Solution:** Environment-aware DOMPurify setup
```typescript
import createDOMPurify from 'dompurify'

let DOMPurify: ReturnType<typeof createDOMPurify>

if (typeof window === 'undefined') {
  // SSR: use jsdom
  const { JSDOM } = require('jsdom')
  const windowInstance = new JSDOM('').window
  DOMPurify = createDOMPurify(windowInstance as unknown as Window & typeof globalThis)
} else {
  // CSR: use window
  DOMPurify = createDOMPurify(window)
}
```

## Performance Optimizations

### 1. Selective Hydration

- Only interactive components use client-side rendering
- Static content remains server-rendered
- Reduces JavaScript bundle size

### 2. Incremental Static Regeneration

- Templates and landing page content updates automatically
- No manual rebuilds required
- Balances performance with freshness

### 3. Caching Strategy

- Public pages: Aggressive caching with ISR
- User pages: No caching for fresh data
- API routes: Appropriate cache headers

## Monitoring and Debugging

### Hydration Errors

**Common cause:** Server and client rendering different content

**Solution:** 
- Use client components for dynamic content
- Ensure consistent data between server and client
- Use loading states to prevent mismatches

### Performance Monitoring

**Key metrics:**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)

## Best Practices

### 1. Choose the Right Strategy

- **Static content** → SSG/ISR
- **User-specific content** → SSR
- **Highly interactive** → CSR

### 2. Avoid Hydration Mismatches

- Keep server and client rendering consistent
- Use client components for dynamic content
- Implement proper loading states

### 3. Optimize Data Fetching

- Use appropriate caching strategies
- Implement error boundaries
- Provide loading states

### 4. Security First

- Always sanitize user-generated content
- Use environment-aware security libraries
- Implement proper authentication checks

## Future Considerations

### Potential Improvements

1. **Streaming SSR**: For better perceived performance
2. **React Server Components**: For more granular control
3. **Edge Runtime**: For global performance
4. **Image Optimization**: For template previews

### Migration Path

- Current setup is future-proof
- Easy to migrate to newer Next.js features
- Modular component structure supports gradual improvements

## Conclusion

Our hybrid rendering approach provides:
- **Optimal performance** for each use case
- **Excellent user experience** with appropriate interactivity
- **Strong security** with proper sanitization
- **Good SEO** for public content
- **Scalability** for future growth

The strategy balances performance, user experience, and maintainability while providing a solid foundation for future enhancements. 