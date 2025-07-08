# Task List: Critical UX Fixes

Based on the PRD: `prd-critical-ux-fixes.md`

## Relevant Files

- `src/components/resume-builder/AISuggestionModal.tsx` - Unified AI suggestion modal component for all AI features
- `src/components/resume-builder/AISuggestionModal.test.tsx` - Unit tests for AISuggestionModal component
- `src/components/dashboard/DeleteResumeButton.tsx` - Delete button component for resumes with 'use client' directive
- `src/components/dashboard/DeleteResumeButton.test.tsx` - Unit tests for DeleteResumeButton component
- `src/components/providers/LoadingProvider.tsx` - Global loading context provider
- `src/components/providers/LoadingProvider.test.tsx` - Unit tests for LoadingProvider
- `src/hooks/useLoading.ts` - Custom hook for managing loading states
- `src/hooks/useLoading.test.ts` - Unit tests for useLoading hook
- `src/app/dashboard/page.tsx` - Dashboard page that needs delete button integration
- `src/app/resume/edit/[id]/page.tsx` - Edit resume page that needs template loading
- `src/components/resume-builder/ExperienceStep.tsx` - Experience step that needs AI modal integration
- `src/components/resume-builder/SkillsStep.tsx` - Skills step that needs AI modal integration
- `src/components/resume-builder/PersonalInfoStep.tsx` - Personal info step that needs AI modal integration
- `src/components/resume-builder/ReviewStep.tsx` - Review step that needs template selection
- `src/app/loading.tsx` - Global loading component for page navigation
- `src/app/layout.tsx` - Root layout that needs loading provider integration

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [x] 1.0 Create Unified AI Suggestion Modal System
  - [x] 1.1 Create AISuggestionModal component with TypeScript interfaces
  - [x] 1.2 Implement modal state management and loading states
  - [x] 1.3 Add support for different AI feature types (experience, skills, summary)
  - [x] 1.4 Integrate modal into ExperienceStep component
  - [x] 1.5 Integrate modal into SkillsStep component
  - [x] 1.6 Update PersonalInfoStep to use unified modal
  - [x] 1.7 Add error handling and retry mechanisms
  - [x] 1.8 Write unit tests for AISuggestionModal component

- [x] 2.0 Implement Delete Resume Button Functionality
  - [x] 2.1 Create DeleteResumeButton component with 'use client' directive
  - [x] 2.2 Implement delete confirmation dialog
  - [x] 2.3 Add delete API integration with error handling
  - [x] 2.4 Integrate DeleteResumeButton into dashboard page
  - [x] 2.5 Add optimistic updates and UI feedback
  - [x] 2.6 Write unit tests for DeleteResumeButton component

- [x] 3.0 Fix Template Loading for Edit Resume
  - [x] 3.1 Update edit resume page to fetch template data
  - [x] 3.2 Implement template preview in edit mode
  - [x] 3.3 Add template selection functionality during editing
  - [x] 3.4 Ensure template changes are saved with resume
  - [x] 3.5 Handle cases where original template no longer exists
  - [x] 3.6 Update ReviewStep to maintain template selection

- [x] 4.0 Implement Global Loading State System
  - [x] 4.1 Create LoadingProvider context and provider
  - [x] 4.2 Implement useLoading custom hook
  - [x] 4.3 Add loading states for page navigation
  - [x] 4.4 Add loading states for form submissions
  - [x] 4.5 Add loading states for API calls
  - [x] 4.6 Integrate LoadingProvider into root layout
  - [x] 4.7 Create global loading component for page transitions
  - [x] 4.8 Write unit tests for LoadingProvider and useLoading hook

- [x] 5.0 Apply UI/UX Improvements and Cleanup
  - [x] 5.1 Remove unnecessary "View" buttons from template cards in dashboard
  - [x] 5.2 Ensure consistent button hover and focus states
  - [x] 5.3 Implement consistent error message styling
  - [x] 5.4 Add success message feedback for all operations
  - [ ] 5.5 Verify accessibility attributes on all interactive elements 