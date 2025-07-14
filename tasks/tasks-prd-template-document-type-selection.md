## Relevant Files

- `src/models/Template.ts` – Mongoose model for templates; add/validate `supportedDocumentTypes` field and related methods.
- `src/models/Template.test.ts` – Unit tests for model changes.
- `src/app/api/templates/route.ts` – API for template creation/editing and filtering by document type.
- `src/app/api/templates/[id]/route.ts` – API for editing templates; supports updating document types.
- `src/app/api/creator/templates/route.ts` – API for creator template management; support document type queries/updates.
- `src/app/api/admin/templates/route.ts` – API for admin template management; expose document type info/filtering.
- `src/app/api/admin/templates/[id]/approve/route.ts` – Admin template approval API includes document type info.
- `src/app/api/admin/templates/route.test.ts` – Unit tests for admin API document type filtering and info.
- `src/app/templates/page.tsx` – Main templates page; fetch and display templates with document type filtering.
- `src/app/templates/TemplatesPageClient.tsx` – Client logic for filtering, displaying, and selecting document types, with filter UI.
- `src/app/templates/create/CreateTemplateClient.tsx` – Template creation form with document type selection UI.
- `src/app/admin/page.tsx` – Admin template management UI with document type badges and filter UI.
- `src/components/document-builder/TemplateSelector.tsx` – UI for selecting templates and document types.
- `src/components/TemplatePreview.tsx` – Show document type badges on template previews/cards.
- `src/components/TemplatePreview.test.tsx` – Unit tests for badge display.
- `src/components/ui/DocumentTypeSelector.tsx` – (If not present, create) UI component for selecting one or more document types.
- `src/components/document-builder/TemplateSelector.test.tsx` – Unit tests for template/document type selection UI.
- `src/app/api/templates/route.test.ts` – API tests for document type handling.
- `src/app/api/creator/templates/route.test.ts` – API tests for creator management.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [x] 1.0 Update Template Data Model for Document Types
  - [x] 1.1 Add `supportedDocumentTypes` array field to `Template` model (enum: Resume, CV, Biodata).
  - [x] 1.2 Add default and validation logic for at least one document type.
  - [x] 1.3 Update model methods for filtering by document type.
  - [x] 1.4 Write/extend unit tests for model changes.

- [x] 2.0 Implement Document Type Selection in Template Creation & Editing
  - [x] 2.1 Add document type selection UI (checkboxes or multi-select) to template creation/edit forms.
  - [x] 2.2 Integrate `DocumentTypeSelector` component if not present.
  - [x] 2.3 Ensure at least one document type is required before submission (client-side).
  - [x] 2.4 Update template creation/edit API to accept and validate document types.
  - [x] 2.5 Allow editing of document types for existing templates.
  - [x] 2.6 Write/extend unit tests for UI and API changes.

- [x] 3.0 Integrate Document Type Filtering and Display in User-Facing Template Pages
  - [x] 3.1 Add document type filter UI to templates page.
  - [x] 3.2 Filter templates by selected document type(s) in UI and API.
  - [x] 3.3 Display document type badges (with color coding) on template cards/previews.
  - [x] 3.4 Ensure filtering and badges work on mobile.
  - [x] 3.5 Write/extend unit tests for filtering and display.

- [x] 4.0 Update Admin Tools for Document Type Management
  - [x] 4.1 Show document type(s) in admin template management UI.
  - [x] 4.2 Add filtering by document type in admin UI/API.
  - [x] 4.3 Ensure document type info is included in approval workflow.
  - [x] 4.4 Write/extend unit tests for admin changes.

- [x] 5.0 Ensure Backward Compatibility and Validation
  - [x] 5.1 Ensure templates without document types remain functional (treat as “universal” or per business logic).
  - [x] 5.2 Update search and filtering logic to handle legacy templates.
  - [x] 5.3 Add server-side validation for document type requirements.
  - [ ] 5.4 Test and document backward compatibility scenarios. 