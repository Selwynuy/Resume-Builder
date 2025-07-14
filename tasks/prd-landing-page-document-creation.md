# PRD: Landing Page Document Creation & Step 1 Improvements

## Introduction/Overview

This feature addresses two key UX improvements in the document creation flow:

1. **Landing Page Integration**: Move the "Create New Document" button from the templates page to the landing page, with automatic modal opening on redirect
2. **Step 1 Optimization**: Remove redundant document type selection in Step 1 and display the selected template's document type as read-only information

The goal is to streamline the user journey from landing page to document creation while eliminating redundant selection steps.

## Goals

1. **Improve User Onboarding**: Make document creation more accessible from the landing page
2. **Reduce Redundancy**: Eliminate duplicate document type selection in Step 1
3. **Enhance User Flow**: Create a seamless transition from landing page to template selection
4. **Maintain Data Integrity**: Ensure document type consistency throughout the creation process
5. **Improve UX Clarity**: Provide clear visual feedback about selected template and document type

## User Stories

1. **As a new user**, I want to start creating a document directly from the landing page so that I can begin immediately without navigating through multiple pages.

2. **As a user**, I want to see the document type of my selected template clearly displayed in Step 1 so that I understand what type of document I'm creating without having to select it again.

3. **As a user**, I want to be able to go back to template selection from Step 1 so that I can change my template choice if needed.

4. **As a user**, I want the document type to be locked based on my template selection so that I don't accidentally create the wrong type of document.

## Functional Requirements

### Landing Page Integration
1. The system must display a "Create New Document" button prominently on the landing page
2. The system must redirect users to the templates page when the button is clicked
3. The system must automatically open the document type selection modal upon redirect to templates page
4. The system must maintain the modal state during the redirect process

### Step 1 Improvements
5. The system must remove the document type selection dropdown/component from Step 1
6. The system must display the selected template's document type as read-only text below the template name
7. The system must lock the document type based on the selected template
8. The system must prevent users from changing the document type in Step 1
9. The system must provide a "Back to Templates" button in Step 1
10. The system must allow users to return to template selection from Step 1

### Template Selection Modal
11. The system must automatically open the document type selection modal when redirected from landing page
12. The system must allow users to close the modal and browse templates normally
13. The system must maintain modal state during page navigation

### Data Flow
14. The system must pass the selected document type from template selection to Step 1
15. The system must validate that the document type matches the selected template
16. The system must prevent direct navigation to Step 1 without template selection

## Non-Goals (Out of Scope)

- Adding new document types or template categories
- Modifying the existing template selection logic beyond the modal behavior
- Changing the visual design of the landing page beyond adding the new button
- Adding animations or transitions for the modal opening
- Implementing template preview functionality in Step 1
- Adding document type validation beyond template compatibility

## Design Considerations

### Landing Page Button
- Place the "Create New Document" button in the hero section or prominent call-to-action area
- Use consistent styling with existing landing page buttons
- Ensure the button is clearly visible and accessible

### Step 1 Document Type Display
- Display document type as a simple text label below the template name
- Use muted/neutral styling to indicate it's informational
- Ensure sufficient contrast for readability
- Position the text to avoid confusion with interactive elements

### Back to Templates Button
- Place the button in a logical location (e.g., top-left or near the template display)
- Use secondary button styling to indicate it's a navigation action
- Ensure it's clearly labeled and accessible

## Technical Considerations

### URL Parameters
- Use URL parameters to pass modal state and document type selection
- Implement proper URL handling for direct navigation prevention
- Ensure URL parameters are properly encoded/decoded

### State Management
- Update the resume wizard hook to handle the new flow
- Ensure template and document type state is properly maintained
- Implement proper state validation and error handling

### Navigation Guards
- Prevent direct access to Step 1 without proper template selection
- Implement proper redirect logic for invalid states
- Handle edge cases where users navigate directly to Step 1

### Modal Integration
- Integrate with existing modal system
- Ensure modal state persists during page transitions
- Handle modal closing and reopening scenarios

## Success Metrics

1. **User Engagement**: Increase in document creation starts from landing page (target: 25% increase)
2. **Completion Rate**: Maintain or improve document creation completion rate
3. **User Feedback**: Positive feedback on streamlined flow (target: 90% satisfaction)
4. **Error Reduction**: Decrease in support tickets related to document type confusion
5. **Navigation Efficiency**: Reduced time from landing page to document creation start

## Open Questions

1. Should the "Create New Document" button have different text or styling to distinguish it from other landing page CTAs?
2. What should happen if a user closes the modal on the templates page - should they be redirected back to landing page?
3. Should there be any visual indication in Step 1 that the document type is locked/read-only?
4. How should the system handle cases where the selected template becomes unavailable between selection and Step 1?
5. Should there be any analytics tracking for the new landing page to document creation flow?

## Implementation Priority

**High Priority:**
- Landing page button addition
- Modal auto-opening functionality
- Step 1 document type display removal
- Read-only document type display

**Medium Priority:**
- Back to templates navigation
- URL parameter handling
- State validation

**Low Priority:**
- Analytics integration
- Advanced error handling
- Performance optimizations 