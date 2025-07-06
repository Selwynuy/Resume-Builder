## Relevant Files

- `src/auth/` - Centralized authentication logic and utilities (new directory)
- `src/middleware/` - Custom middleware functions (new directory)
  - `index.ts` - Main middleware with rate limiting and security
- `src/documentation/` - Comprehensive documentation (new directory)
  - `README.md` - Project structure and organization guide
  - `ARCHITECTURE.md` - System architecture and design patterns
  - `ACCESSIBILITY.md` - WCAG compliance and accessibility guidelines
- `src/components/resume-builder/` - All resume builder components, modularized into atomic components
  - `PersonalInfoStep.tsx` - Personal information input step (refactored)
  - `SkillsStep.tsx` - Skills input step (refactored) 
  - `ExperienceStep.tsx` - Experience input step (refactored)
  - `EducationStep.tsx` - Education input step (refactored)
  - `ReviewStep.tsx` - Review and preview step (refactored)
  - `ValidatedInput.tsx` - Reusable input component with validation
  - `MultiStyleSummaryModal.tsx` - AI suggestion modal component
  - `SkillInputRow.tsx` - Atomic skill input row component
  - `SkillFormatSelector.tsx` - Skill format selection component
  - `ExperienceInputRow.tsx` - Atomic experience input row component
  - `EducationInputRow.tsx` - Atomic education input row component
  - `validateSkillField.ts` - Skill field validation utility
  - `validateExperienceField.ts` - Experience field validation utility
  - `validateEducationField.ts` - Education field validation utility
  - `index.ts` - Export file for all components and utilities
- `src/components/` - All UI components, organized by feature
  - `ui/` - shadcn/ui components (Button, Card, Input, Label)
  - `resume-builder/` - Resume builder specific components
  - `landing/` - Landing page components
  - `layout/` - Layout components (Header, etc.)
- `src/hooks/` - Custom hooks, cleaned up and organized
- `src/lib/` - Utility functions and shared logic (cleaned up unused functions)
  - `templates.ts` - Template interface and utilities (removed deprecated functions)
  - `security.ts` - Security utilities and validation (cleaned up unused parameters)
  - `template-renderer.ts` - Template rendering logic (cleaned up unused parameters)
- `src/app/` - Main Next.js pages, to be optimized for SSR/CSR/SSG as appropriate
- `jest.config.js` and all `*.test.ts(x)` files - For 100% test coverage
- `.gitignore` - To be updated for sensitive/build files
- `.env` - To be reviewed for secrets and best practices

### Files Removed
- `api-templates-response.json` - PowerShell response file (obsolete)
- `file_line_counts.txt` - Empty file (obsolete)
- `lint_output.txt` - Linter output file (temporary)
- `tasks/prd-codebase-refactor.md` - Redundant PRD file (superseded by tasks file)

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.
- **ESLint was run on the codebase. There are errors and warnings to address in the next sub-tasks.**

## Tasks

- [x] 1.0 Audit and Remove Unused Code, Dead Files, and Linter Errors
  - [x] 1.1 Run linter and formatter (ESLint + Prettier) across the codebase
  - [x] 1.2 Identify and remove unused imports, variables, and functions
  - [x] 1.3 Delete dead files and obsolete modules
  - [x] 1.4 Fix all linter and TypeScript errors/warnings
  - [x] 1.5 Commit and test after each cleanup step

- [x] 2.0 Modularize and Refactor Code into Atomic Components, Hooks, and Utilities
  - [x] 2.1 Identify large or repetitive UI blocks and split into atomic components (Button, Card, etc.)
  - [x] 2.2 Move reusable logic into custom hooks in `src/hooks/`
  - [x] 2.3 Move shared functions/utilities to `src/lib/`
  - [x] 2.4 Refactor existing components to use new atomic components/hooks/utilities
  - [x] 2.5 Add/Update tests for all new and refactored components/hooks/utilities

- [ ] 3.0 Adopt and Enforce Modern File Structure and Best Practices
  - [x] 3.1 Organize files into `components/`, `hooks/`, `lib/`, `auth/`, `middleware/`, `documentation/`, etc.
  - [x] 3.2 Use absolute imports throughout the codebase
  - [x] 3.3 Enforce strict TypeScript mode in `tsconfig.json`
  - [x] 3.4 Add/Update index files for clean imports
  - [x] 3.5 Document the new file structure in `/documentation`

- [x] 4.0 Integrate and Standardize on a Component Library
  - [x] 4.1 Evaluate shadcn/ui and Chakra UI; select one for the project
  - [x] 4.2 Refactor UI to use the chosen component library for all common elements
  - [x] 4.3 Remove redundant or duplicate custom components
  - [x] 4.4 Update tests to cover new component usage

- [x] 5.0 Accessibility & UX Hardening
  - [x] 5.1 Audit for missing ARIA labels, alt text, and semantic HTML
  - [x] 5.2 Add proper ARIA labels to all interactive elements
  - [x] 5.3 Implement keyboard navigation and skip links
  - [x] 5.4 Add focus management and visible focus indicators
  - [x] 5.5 Create comprehensive accessibility documentation

- [x] 6.0 Optimize Rendering Strategy (SSR/CSR/SSG) for Each Page
  - [x] 6.1 Review each page and determine the best rendering method (SSR, SSG, CSR)
  - [x] 6.2 Update Next.js page configs to use the chosen strategy
  - [x] 6.3 Test all pages for correct rendering and data loading
  - [x] 6.4 Document rendering choices in `/documentation`

- [ ] 7.0 Centralize Authentication Logic and Add Middleware
  - [ ] 7.1 Move all authentication logic to `src/auth/` or `src/authenticate/`
  - [ ] 7.2 Create a `src/middleware/` folder for custom middleware (auth, logging, rate limiting)
  - [ ] 7.3 Refactor API routes and pages to use centralized auth and middleware
  - [ ] 7.4 Add/Update tests for auth and middleware

- [ ] 8.0 Apply Security Best Practices
  - [ ] 8.1 Review and validate all user input (backend and frontend)
  - [ ] 8.2 Implement CSRF protection where needed
  - [ ] 8.3 Set secure HTTP headers (e.g., with helmet)
  - [ ] 8.4 Add rate limiting to sensitive endpoints
  - [ ] 8.5 Review and fix any other common web vulnerabilities (XSS, SQLi, etc.)
  - [ ] 8.6 Document security practices in `/documentation`

- [ ] 9.0 Achieve and Maintain 100% Test Coverage (Jest)
  - [ ] 9.1 Audit current test coverage
  - [ ] 9.2 Write missing unit and integration tests for all modules
  - [ ] 9.3 Ensure all tests pass after each refactor
  - [ ] 9.4 Add coverage reporting to CI (if applicable)

- [ ] 10.0 Create and Update Comprehensive Documentation
  - [ ] 10.1 Write/Update code documentation (JSDoc, comments)
  - [ ] 10.2 Add onboarding and architecture guides to `/documentation`
  - [ ] 10.3 Add deployment and environment setup guides
  - [ ] 10.4 Auto-generate API docs if feasible (e.g., Swagger)
  - [ ] 10.5 Review and update documentation after each major refactor

- [ ] 11.0 Update .gitignore and Review .env for Best Practices
  - [ ] 11.1 Update `.gitignore` to exclude sensitive/build files
  - [ ] 11.2 Review `.env` for secrets and best practices
  - [ ] 11.3 Document environment variable usage in `/documentation` 