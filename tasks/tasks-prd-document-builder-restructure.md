## Relevant Files

- `src/components/resume-builder/` → `src/components/document-builder/` - Main folder to be renamed and restructured
- `src/components/resume-builder/types.ts` - Contains ResumeData interface that needs to be extended with documentType field
- `src/components/resume-builder/types.test.ts` - Unit tests for the updated types
- `src/components/resume-builder/TemplateSelector.tsx` - Component that needs to be updated to include document type selection
- `src/components/resume-builder/TemplateSelector.test.tsx` - Unit tests for TemplateSelector component
- `src/components/resume-builder/ProgressBar.tsx` - Component that needs to be updated to handle variable step counts
- `src/components/resume-builder/ProgressBar.test.tsx` - Unit tests for ProgressBar component
- `src/hooks/useResumeWizard.ts` - Hook that needs to be extended to support dynamic step configuration
- `src/hooks/useResumeWizard.test.ts` - Unit tests for useResumeWizard hook
- `src/lib/step-configuration.ts` - New utility file for managing step configurations per document type
- `src/lib/step-configuration.test.ts` - Unit tests for step configuration utilities
- `src/models/Template.ts` - Template model that needs to be updated with supportedDocumentTypes field
- `src/models/Template.test.ts` - Unit tests for Template model
- `src/app/api/resumes/route.ts` - API endpoint that needs optional documentType parameter
- `src/app/api/resumes/route.test.ts` - Unit tests for resumes API endpoint
- `src/components/resume-builder/ReviewStep.tsx` - Component that needs to handle different document types
- `src/components/resume-builder/ReviewStep.test.tsx` - Unit tests for ReviewStep component

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Implement Document Type Selection Modal and Template Filtering
  - [x] 1.1 Create DocumentTypeSelector modal component with full-screen design
  - [x] 1.2 Add document type selection state management to templates page
  - [x] 1.3 Implement template filtering based on selected document type
  - [x] 1.4 Add visual indicators (badges/icons) to template cards showing supported document types
  - [x] 1.5 Update templates page to show modal when "Create New Document" is clicked
  - [x] 1.6 Add document type change functionality from templates page
  - [x] 1.7 Write unit tests for DocumentTypeSelector component
  - [x] 1.8 Write unit tests for template filtering functionality
- [ ] 2.0 Rename Resume-Builder to Document-Builder and Update All References
  - [ ] 2.1 Rename `src/components/resume-builder/` folder to `src/components/document-builder/`
  - [ ] 2.2 Update all import statements throughout the codebase
  - [ ] 2.3 Update all export statements and index files
  - [ ] 2.4 Update component names and references in JSX
  - [ ] 2.5 Update route paths and navigation references
  - [ ] 2.6 Update test file imports and references
  - [ ] 2.7 Verify all TypeScript compilation passes after renaming
  - [ ] 2.8 Run full test suite to ensure no broken references
- [ ] 3.0 Break Down CVStep into Individual Step Components
  - [ ] 3.1 Create PublicationsStep component for CV documents
  - [ ] 3.2 Create ResearchExperienceStep component for CV documents
  - [ ] 3.3 Create AcademicAchievementsStep component for CV documents
  - [ ] 3.4 Create TeachingExperienceStep component for CV documents
  - [ ] 3.5 Create GrantsStep component for CV documents
  - [ ] 3.6 Create ConferencesStep component for CV documents
  - [ ] 3.7 Create LanguagesStep component for CV documents
  - [ ] 3.8 Create ReferencesStep component for CV documents
  - [ ] 3.9 Update CVStep to use individual step components
  - [ ] 3.10 Write unit tests for all new CV step components
  - [ ] 3.11 Update step configuration to include new CV steps
- [ ] 4.0 Break Down BiodataStep into Individual Step Components
  - [ ] 4.1 Create PersonalDetailsStep component for Biodata documents
  - [ ] 4.2 Create FamilyMembersStep component for Biodata documents
  - [ ] 4.3 Create HobbiesStep component for Biodata documents
  - [ ] 4.4 Create DeclarationStep component for Biodata documents
  - [ ] 4.5 Update BiodataStep to use individual step components
  - [ ] 4.6 Write unit tests for all new Biodata step components
  - [ ] 4.7 Update step configuration to include new Biodata steps
- [ ] 5.0 Update Progress Bar and Navigation for Dynamic Step Counts
  - [ ] 5.1 Modify ProgressBar component to handle up to 12 steps
  - [ ] 5.2 Update step navigation logic for variable step counts
  - [ ] 5.3 Implement step completion tracking for longer documents
  - [ ] 5.4 Add visual indicators for optional vs required steps
  - [ ] 5.5 Ensure mobile responsiveness with longer step counts
  - [ ] 5.6 Update useResumeWizard hook to handle dynamic step configurations
  - [ ] 5.7 Write unit tests for updated ProgressBar functionality
  - [ ] 5.8 Write unit tests for dynamic step navigation 