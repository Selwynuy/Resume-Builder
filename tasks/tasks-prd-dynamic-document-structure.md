## Relevant Files

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

- [x] 1.0 Extend Data Structures and Types
  - [x] 1.1 Update ResumeData interface to include documentType field
  - [x] 1.2 Create DocumentType enum with Resume, CV, and Biodata options
  - [x] 1.3 Create StepConfiguration interface for defining step structures
  - [x] 1.4 Update Template model to include supportedDocumentTypes array
  - [x] 1.5 Add validation schemas for different document types
  - [x] 1.6 Write unit tests for all new type definitions
- [ ] 2.0 Implement Document Type Selection UI
  - [ ] 2.1 Create DocumentTypeSelector component with clear descriptions
  - [ ] 2.2 Integrate document type selection into TemplateSelector component
  - [ ] 2.3 Add visual indicators for document type differences
  - [ ] 2.4 Implement template filtering based on selected document type
  - [ ] 2.5 Add document type change functionality before wizard starts
  - [ ] 2.6 Write unit tests for document type selection components
- [ ] 3.0 Create Dynamic Step Configuration System
  - [ ] 3.1 Create step-configuration.ts utility with predefined configurations
  - [ ] 3.2 Define step configurations for Resume (5-6 steps)
  - [ ] 3.3 Define step configurations for CV (8-10 steps)
  - [ ] 3.4 Define step configurations for Biodata (6-8 steps)
  - [ ] 3.5 Implement step validation rules per document type
  - [ ] 3.6 Add support for optional step addition/removal
  - [ ] 3.7 Write unit tests for step configuration system
- [ ] 4.0 Update Progress Bar for Variable Step Counts
  - [ ] 4.1 Modify ProgressBar component to handle up to 10 steps
  - [ ] 4.2 Update step navigation logic for variable step counts
  - [ ] 4.3 Implement step completion tracking for longer documents
  - [ ] 4.4 Add visual indicators for optional vs required steps
  - [ ] 4.5 Ensure mobile responsiveness with longer step counts
  - [ ] 4.6 Write unit tests for updated ProgressBar functionality
- [ ] 5.0 Implement CV and Biodata Step Components
  - [ ] 5.1 Create PublicationsStep component for CV documents
  - [ ] 5.2 Create PresentationsStep component for CV documents
  - [ ] 5.3 Create ResearchStep component for CV documents
  - [ ] 5.4 Create AwardsStep component for CV documents
  - [ ] 5.5 Create ReferencesStep component for CV documents
  - [ ] 5.6 Create LanguagesStep component for Biodata documents
  - [ ] 5.7 Create PersonalDetailsStep component for Biodata documents
  - [ ] 5.8 Create DeclarationStep component for Biodata documents
  - [ ] 5.9 Update useResumeWizard hook to handle new step components
  - [ ] 5.10 Write unit tests for all new step components 