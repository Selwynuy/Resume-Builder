## Relevant Files

- `src/app/page.tsx` - Landing page component that needs the "Create New Document" button
- `src/app/templates/page.tsx` - Templates page that needs modal auto-opening functionality
- `src/components/document-builder/TemplateSelector.tsx` - Component that needs modal state management
- `src/components/document-builder/TemplateSelector.test.tsx` - Unit tests for TemplateSelector component
- `src/app/resume/new/page.tsx` - Step 1 page that needs document type removal and display improvements
- `src/hooks/useResumeWizard.ts` - Hook that needs URL parameter handling and state management
- `src/hooks/useResumeWizard.test.ts` - Unit tests for useResumeWizard hook
- `src/lib/utils.ts` - Utility functions for URL parameter handling
- `src/lib/utils.test.ts` - Unit tests for utility functions
- `src/components/landing/HeroSection.tsx` - Hero section component for landing page button placement
- `src/components/landing/HeroSection.test.tsx` - Unit tests for HeroSection component

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Landing Page Integration
  - [x] 1.1 Add "Create New Document" button to landing page hero section
  - [x] 1.2 Implement button click handler with redirect to templates page
  - [x] 1.3 Add URL parameter to indicate modal should auto-open
  - [x] 1.4 Style button consistently with existing landing page CTAs
  - [x] 1.5 Write unit tests for landing page button functionality
  - [x] 1.6 Test button accessibility and responsive design

- [ ] 2.0 Template Selection Modal Enhancement
  - [x] 2.1 Update TemplateSelector component to handle auto-open modal state
  - [x] 2.2 Implement modal auto-opening logic based on URL parameters
  - [x] 2.3 Add modal state persistence during page navigation
  - [x] 2.4 Handle modal closing and reopening scenarios
  - [x] 2.5 Update templates page to read and handle URL parameters
  - [x] 2.6 Write unit tests for modal auto-opening functionality
  - [x] 2.7 Test modal state management and edge cases

- [ ] 3.0 Step 1 Document Type Optimization
  - [x] 3.1 Remove document type selection dropdown from Step 1
  - [x] 3.2 Add read-only document type display below template name
  - [x] 3.3 Style document type display with muted/neutral styling
  - [x] 3.4 Add "Back to Templates" button in Step 1
  - [x] 3.5 Implement back navigation functionality
  - [x] 3.6 Lock document type based on selected template
  - [x] 3.7 Update Step 1 layout and styling for new elements
  - [x] 3.8 Write unit tests for Step 1 improvements
  - [x] 3.9 Test document type display and navigation functionality

- [ ] 4.0 URL Parameter and State Management
  - [x] 4.1 Create utility functions for URL parameter handling
  - [x] 4.2 Update useResumeWizard hook to handle URL parameters
  - [x] 4.3 Implement state validation for template and document type
  - [x] 4.4 Add URL parameter encoding/decoding utilities
  - [x] 4.5 Update state management for template selection flow
  - [x] 4.6 Handle state persistence across page navigation
  - [x] 4.7 Write unit tests for URL parameter utilities
  - [x] 4.8 Test state management and validation logic

- [ ] 5.0 Navigation Guards and Validation
  - [x] 5.1 Implement navigation guard for Step 1 access
  - [x] 5.2 Add validation to prevent direct Step 1 navigation
  - [x] 5.3 Create redirect logic for invalid states
  - [x] 5.4 Handle edge cases for template availability
  - [x] 5.5 Add error handling for missing template data
  - [x] 5.6 Implement fallback behavior for invalid URLs
  - [x] 5.7 Write unit tests for navigation guards
  - [ ] 5.8 Test error handling and edge cases 