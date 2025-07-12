# Task List: Template Creator Management Page

Based on PRD: `prd-template-creator-management.md`

## Relevant Files

- `src/app/creator/page.tsx` - Main creator management page component
- `src/app/creator/page.test.tsx` - Unit tests for creator page
- `src/app/creator/CreatorClient.tsx` - Client-side component for creator management
- `src/app/creator/CreatorClient.test.tsx` - Unit tests for CreatorClient
- `src/app/api/creator/templates/route.ts` - API endpoint for creator's templates
- `src/app/api/creator/templates/route.test.ts` - Unit tests for creator templates API
- `src/models/User.ts` - User model (needs creator role field)
- `src/models/User.test.ts` - Unit tests for User model updates
- `src/middleware/creator-auth.ts` - Middleware for creator role validation
- `src/middleware/creator-auth.test.ts` - Unit tests for creator auth middleware
- `src/components/creator/TemplateTable.tsx` - Reusable template table component
- `src/components/creator/TemplateTable.test.tsx` - Unit tests for TemplateTable
- `src/components/creator/TemplateActions.tsx` - Template action buttons component
- `src/components/creator/TemplateActions.test.tsx` - Unit tests for TemplateActions
- `src/lib/creator-utils.ts` - Utility functions for creator functionality
- `src/lib/creator-utils.test.ts` - Unit tests for creator utilities

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [x] 1.0 Implement Creator Role System and Access Control
  - [x] 1.1 Add creator role field to User model (role: 'user' | 'creator' | 'admin')
  - [x] 1.2 Create creator authentication middleware (creator-auth.ts)
  - [x] 1.3 Update auth utilities to check for creator role
  - [x] 1.4 Add creator role validation to existing auth functions
  - [x] 1.5 Create creator role assignment system (manual for now)
  - [x] 1.6 Add creator role checks to template creation endpoints
  - [x] 1.7 Write unit tests for creator role validation

- [ ] 2.0 Create Creator Management Page Structure and Navigation
  - [ ] 2.1 Create creator page route (/creator) with server-side rendering
  - [ ] 2.2 Build CreatorClient component with responsive layout
  - [ ] 2.3 Add page header with title and "Create New Template" button
  - [ ] 2.4 Implement breadcrumb navigation (Dashboard > Creator)
  - [ ] 2.5 Add loading states and error handling for page
  - [ ] 2.6 Create empty state for users with no templates
  - [ ] 2.7 Write unit tests for creator page components

- [ ] 3.0 Build Template Table Component with Display and Actions
  - [ ] 3.1 Create TemplateTable component with table structure
  - [ ] 3.2 Add template data columns (name, description, category, price, creation date)
  - [ ] 3.3 Implement approval status display with color coding
  - [ ] 3.4 Create TemplateActions component for row actions (edit, delete, duplicate, preview)
  - [ ] 3.5 Add confirmation modals for destructive actions
  - [ ] 3.6 Implement template preview functionality
  - [ ] 3.7 Add rejection reasons display for rejected templates
  - [ ] 3.8 Write unit tests for table and action components

- [ ] 4.0 Implement Sorting, Filtering, and Search Functionality
  - [ ] 4.1 Add sortable table headers for all relevant columns
  - [ ] 4.2 Implement client-side sorting logic
  - [ ] 4.3 Create filter dropdowns for approval status and category
  - [ ] 4.4 Add search input for template name filtering
  - [ ] 4.5 Implement combined filtering and sorting
  - [ ] 4.6 Add pagination for large template lists
  - [ ] 4.7 Maintain filter/sort state during page interactions
  - [ ] 4.8 Write unit tests for sorting and filtering logic

- [ ] 5.0 Add Analytics and Status Management Features
  - [ ] 5.1 Display download count for each template
  - [ ] 5.2 Show average rating with star display
  - [ ] 5.3 Add last updated timestamp display
  - [ ] 5.4 Implement status update indicators
  - [ ] 5.5 Create analytics summary cards (total templates, total downloads, etc.)
  - [ ] 5.6 Add performance trends display (if data available)
  - [ ] 5.7 Implement real-time status updates
  - [ ] 5.8 Write unit tests for analytics components

- [ ] 6.0 Integrate with Existing Template and Approval Systems
  - [ ] 6.1 Create creator templates API endpoint (/api/creator/templates)
  - [ ] 6.2 Integrate with existing template model and approval workflow
  - [ ] 6.3 Connect template actions to existing edit/delete endpoints
  - [ ] 6.4 Link "Create New Template" button to template creation page
  - [ ] 6.5 Ensure proper CSRF protection for all form submissions
  - [ ] 6.6 Add proper error handling for API failures
  - [ ] 6.7 Implement optimistic updates for better UX
  - [ ] 6.8 Write integration tests for API endpoints 