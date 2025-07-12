# PRD: Dynamic Document Structure Support

## 1. Introduction/Overview

Currently, the resume builder only supports a fixed 5-step wizard for US-style resumes. This limitation prevents users from creating other professional document types like CVs (Curriculum Vitae) for academic/international applications or Biodata for South Asian markets. This feature will implement a flexible document structure system that allows users to create different document types with varying step counts and requirements while maintaining the existing user experience for current resume users.

**Problem:** Users can only create US-style resumes but need CVs for academic/international applications, are confused about which document type to choose, and the current 5-step wizard is too rigid for different document formats.

**Goal:** Implement a dynamic document structure system that supports Resume (5-6 steps), CV (8-10 steps), and Biodata (6-8 steps) formats while preserving the existing user experience.

## 2. Goals

1. **Support Multiple Document Types**: Enable creation of Resumes, CVs, and Biodata with appropriate step configurations
2. **Preserve Existing Experience**: Maintain current 5-step resume workflow for existing users
3. **Flexible Step Configuration**: Allow users to add/remove optional steps within document types
4. **Template Compatibility**: Support type-specific templates while maintaining existing template functionality
5. **User-Friendly Selection**: Integrate document type selection into template selection step
6. **Progressive Validation**: Start with basic validation and add strict rules incrementally
7. **Clear Progress Indication**: Show all steps in progress bar regardless of document type
8. **Backward Compatibility**: Keep existing resumes unchanged, apply new types only to new documents

## 3. User Stories

- **As an academic user**, I want to create a CV with detailed education and research sections so I can apply for academic positions
- **As an international user**, I want to create a CV with publications and presentations sections so I can apply for positions outside the US
- **As a South Asian user**, I want to create a Biodata with personal details and family information so I can follow local professional standards
- **As an existing user**, I want my current resumes to continue working exactly as before so I don't lose my work
- **As a new user**, I want to easily understand which document type to choose for my situation so I can create the right document
- **As a user**, I want to see all my document steps in the progress bar so I know how much work remains
- **As a user**, I want to customize which sections to include in my document so I can tailor it to my needs

## 4. Functional Requirements

### 4.1 Document Type Selection
1. The system must integrate document type selection into the template selection step
2. The system must display three document type options: Resume, CV, and Biodata
3. The system must provide clear descriptions of each document type and when to use them
4. The system must default to "Resume" for new users
5. The system must allow users to change document type before starting the wizard

### 4.2 Step Configuration System
6. The system must support flexible step configurations for each document type
7. The system must allow users to add/remove optional steps within their selected document type
8. The system must define core required steps for each document type
9. The system must support step reordering within document type constraints
10. The system must maintain step validation rules appropriate to each document type

### 4.3 Document Type Definitions
11. **Resume**: Must support 5-6 steps (Personal Info, Summary, Experience, Education, Skills, Optional sections)
12. **CV**: Must support 8-10 steps (Personal Info, Summary, Education, Research, Work, Publications, Presentations, Skills, Awards, References)
13. **Biodata**: Must support 6-8 steps (Personal Info, Education, Work, Skills, Languages, Personal Details, References, Declaration)

### 4.4 Progress Indication
14. The system must display all steps in the progress bar regardless of document type
15. The system must show current step number and total steps (e.g., "Step 3 of 10")
16. The system must maintain visual consistency with existing progress bar design
17. The system must allow navigation to any completed step

### 4.5 Template Compatibility
18. The system must start with type-specific templates only
19. The system must filter templates based on selected document type
20. The system must maintain existing template functionality for Resume type
21. The system must support template switching within the same document type

### 4.6 Validation System
22. The system must start with basic validation rules for all document types
23. The system must allow users to proceed with incomplete documents
24. The system must provide warnings for missing required sections
25. The system must support progressive validation rule enhancement

### 4.7 Backward Compatibility
26. The system must preserve all existing resume functionality
27. The system must not modify existing user resumes
28. The system must apply new document types only to newly created documents
29. The system must maintain existing API endpoints and data structures

## 5. Non-Goals (Out of Scope)

- **Template Cross-Compatibility**: Templates supporting multiple document types simultaneously
- **Advanced Validation**: Strict validation rules in initial implementation
- **User Migration**: Automatic conversion of existing resumes to new document types
- **Custom Step Definitions**: User-defined step configurations beyond predefined document types
- **Regional Auto-Detection**: Automatic document type selection based on user location
- **Document Type Conversion**: Converting between document types after creation
- **Advanced Navigation**: Collapsible sections or different navigation patterns for longer documents

## 6. Design Considerations

### 6.1 UI/UX Requirements
- Document type selection should be integrated into existing template selection UI
- Progress bar should accommodate up to 10 steps while maintaining visual clarity
- Step descriptions should be clear and informative for each document type
- Optional step indicators should be visually distinct from required steps
- Template filtering should be intuitive and non-disruptive

### 6.2 Component Integration
- Leverage existing `TemplateSelector` component for document type selection
- Extend `ProgressBar` component to handle variable step counts
- Update `useResumeWizard` hook to support dynamic step configuration
- Maintain existing step components (`PersonalInfoStep`, `ExperienceStep`, etc.)

### 6.3 Responsive Design
- Progress bar should remain usable on mobile devices with 10 steps
- Document type selection should work well on all screen sizes
- Step navigation should be touch-friendly on mobile devices

## 7. Technical Considerations

### 7.1 Data Structure Changes
- Extend `ResumeData` interface to include `documentType` field
- Create step configuration schemas for each document type
- Update template model to include `supportedDocumentTypes` array
- Maintain backward compatibility with existing resume data

### 7.2 State Management
- Extend `useResumeWizard` hook to handle dynamic step configuration
- Add document type selection state management
- Update step navigation logic to support variable step counts
- Maintain existing auto-save functionality

### 7.3 API Compatibility
- Preserve all existing API endpoints
- Add optional `documentType` parameter to resume creation endpoints
- Maintain existing data validation schemas
- Support gradual migration of templates to new document types

### 7.4 Performance Considerations
- Step configuration should be loaded efficiently
- Progress bar rendering should remain smooth with 10 steps
- Template filtering should be performant with large template collections

## 8. Success Metrics

### 8.1 User Adoption Metrics
- **Document Type Distribution**: Track percentage of users creating each document type
- **Completion Rates**: Measure completion rates for each document type
- **User Satisfaction**: Collect feedback on document type selection experience

### 8.2 Technical Metrics
- **Performance**: Maintain sub-2-second page load times
- **Error Rates**: Keep step navigation error rate below 1%
- **Template Compatibility**: Ensure 95% of existing templates work with new system

### 8.3 Business Metrics
- **User Retention**: Maintain or improve existing user retention rates
- **Feature Usage**: Track adoption of new document types
- **Support Tickets**: Monitor for any increase in support requests related to document types

## 9. Open Questions

1. **Step Content**: Should CV and Biodata use the same step components as Resume, or do they need specialized components?
2. **Template Migration**: How should we handle existing templates that don't specify supported document types?
3. **Validation Progression**: What is the timeline for implementing stricter validation rules?
4. **Internationalization**: Should document type descriptions be localized for different regions?
5. **Analytics**: What specific user behavior data should we track for document type selection?
6. **Error Handling**: How should we handle cases where a user's selected template doesn't support their chosen document type?
7. **Step Customization**: What level of step customization should be allowed for each document type?
8. **Performance Optimization**: Should we implement lazy loading for step components to improve performance with longer documents?

## 10. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- Implement document type selection UI in template selection step
- Create step configuration system for each document type
- Update progress bar to handle variable step counts
- Add basic validation for new document types

### Phase 2: Template Integration (Week 3-4)
- Update template model to support document type filtering
- Implement template compatibility checking
- Create type-specific template collections
- Test template functionality with new document types

### Phase 3: Step Components (Week 5-6)
- Extend existing step components for new document types
- Implement CV-specific step components (Publications, Presentations, etc.)
- Implement Biodata-specific step components (Personal Details, Declaration, etc.)
- Add step customization options

### Phase 4: Testing & Polish (Week 7-8)
- Comprehensive testing across all document types
- Performance optimization for longer documents
- User acceptance testing
- Documentation and training materials

## 11. Risk Assessment

### 11.1 Technical Risks
- **Performance Impact**: Longer documents may affect page load times
- **Template Compatibility**: Existing templates may not work well with new document types
- **State Management Complexity**: Dynamic step configuration may complicate state management

### 11.2 User Experience Risks
- **Choice Paralysis**: Too many options may confuse new users
- **Learning Curve**: Existing users may need time to adapt to new document types
- **Template Availability**: Limited template options for new document types initially

### 11.3 Mitigation Strategies
- **Progressive Enhancement**: Start with basic functionality and add features incrementally
- **Clear Guidance**: Provide clear descriptions and examples for each document type
- **Backward Compatibility**: Ensure existing users' experience remains unchanged
- **Performance Monitoring**: Implement comprehensive performance monitoring and optimization 