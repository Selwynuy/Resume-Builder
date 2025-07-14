# PRD: Document Builder Restructure and User Flow Improvements

## Introduction/Overview

This PRD addresses critical user flow improvements and structural changes to enhance the document creation experience. The current system has document type selection buried within the builder and monolithic step components that need to be broken down into individual, focused steps. The goal is to create a more intuitive flow where users select their document type upfront and have a cleaner, more modular step structure.

## Goals

1. **Improve User Flow**: Move document type selection to the beginning of the user journey for better UX
2. **Modular Step Structure**: Break down monolithic step components into individual, focused steps
3. **Consistent Naming**: Rename "resume-builder" to "document-builder" for better semantic clarity
4. **Template Filtering**: Implement intelligent template filtering based on document type selection
5. **Maintain Data Integrity**: Prevent data corruption by not allowing document type switching mid-creation

## User Stories

1. **As a user**, I want to select my document type (Resume, CV, Biodata) immediately when creating a new document so that I can see relevant templates and understand the process upfront.

2. **As a user**, I want to see only templates that match my selected document type so that I don't get confused by irrelevant options.

3. **As a user**, I want each step of the document creation process to be focused and manageable so that I don't feel overwhelmed by too much information at once.

4. **As a user**, I want clear visual indicators showing which document type each template supports so that I can make informed decisions.

5. **As a user**, I want to start fresh when creating different document types so that my data doesn't get mixed up between different document formats.

## Functional Requirements

### 1. Document Type Selection Modal
1. The system must display a full-screen modal on the templates page when users click "Create New Document"
2. The modal must present three document type options: Resume, CV, and Biodata with clear descriptions
3. The modal must close automatically when a document type is selected
4. The modal must set a filter on the templates page based on the selected document type
5. The modal must be dismissible without making a selection (users can select later)

### 2. Template Filtering and Display
6. The templates page must filter templates based on the selected document type
7. Templates must display visual indicators showing which document types they support
8. The system must not show templates for other document types while a filter is active
9. Users must be able to change document type selection from the templates page
10. Template cards must clearly indicate supported document types with icons or badges

### 3. Document Builder Restructuring
11. The system must rename the "resume-builder" folder to "document-builder"
12. All file references and imports must be updated to reflect the new naming
13. Monolithic step components (CVStep, BiodataStep) must be broken down into individual step components
14. Each step component must handle a single, focused aspect of document creation
15. The wizard must dynamically load step components based on the selected document type

### 4. Step Component Breakdown
16. CV documents must have individual steps for: Personal Info, Education, Experience, Publications, Research Experience, Academic Achievements, Teaching Experience, Grants, Conferences, Skills, Languages, References
17. Biodata documents must have individual steps for: Personal Details, Family Members, Education, Experience, Languages, Skills, Hobbies, References, Declaration
18. Resume documents must maintain existing step structure: Personal Info, Experience, Education, Skills
19. Each step component must be self-contained with its own validation and data handling
20. Step components must follow consistent naming conventions (e.g., PublicationsStep, LanguagesStep)

### 5. Progress Bar and Navigation
21. The progress bar must dynamically adjust to show the correct number of steps for each document type
22. Step navigation must work correctly with variable step counts (up to 12 steps for CV)
23. The system must maintain step completion tracking for longer document types
24. Mobile responsiveness must be maintained with longer step counts

### 6. Data Management
25. Users must not be able to switch document types after starting document creation
26. Each document type must maintain its own data structure and validation rules
27. The system must prevent data corruption between different document types
28. Existing validation schemas must be preserved and applied appropriately

## Non-Goals (Out of Scope)

- Allowing users to switch document types mid-creation
- Preserving data when switching between document types
- Creating separate folders for each document type's unique steps
- Maintaining backward compatibility with old resume-builder structure
- Adding new document types beyond Resume, CV, and Biodata
- Implementing data migration from old resume structure

## Design Considerations

- **Modal Design**: Full-screen modal with clear visual hierarchy and prominent document type options
- **Template Cards**: Add document type badges/icons to template cards for quick identification
- **Step Components**: Maintain consistent styling and layout across all individual step components
- **Progress Bar**: Ensure visual clarity with longer step counts, possibly using scrollable indicators
- **Mobile UX**: Optimize modal and step navigation for mobile devices

## Technical Considerations

- **File Renaming**: Update all imports, exports, and references from "resume-builder" to "document-builder"
- **Component Structure**: Ensure each individual step component follows the same interface pattern
- **Type Safety**: Maintain TypeScript interfaces for all new step components
- **Validation**: Leverage existing validation schemas and apply them to appropriate step components
- **State Management**: Ensure the wizard can handle variable step configurations dynamically

## Success Metrics

- **User Engagement**: Increase in document creation completion rates
- **User Satisfaction**: Reduction in support tickets related to document type confusion
- **Template Usage**: More balanced usage across different document types
- **Mobile Performance**: Maintain or improve mobile completion rates with longer step flows
- **Error Reduction**: Decrease in validation errors due to clearer step structure

## Open Questions

1. Should the document type selection be stored in user preferences for future sessions?
2. How should we handle users who have existing documents in the old structure?
3. Should we implement any analytics to track which document types are most popular?
4. Do we need to add any onboarding tooltips for the new document type selection flow?
5. Should the modal include any preview of what each document type typically contains?

## Implementation Priority

1. **High Priority**: Document type selection modal and template filtering
2. **High Priority**: Rename resume-builder to document-builder and update all references
3. **Medium Priority**: Break down CVStep into individual step components
4. **Medium Priority**: Break down BiodataStep into individual step components
5. **Low Priority**: Additional UI polish and mobile optimizations 