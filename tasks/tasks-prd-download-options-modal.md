## Relevant Files

- `src/components/resume-builder/ReviewStep.tsx` - Main component where the download button and modal will be implemented.
- `src/components/resume-builder/DownloadOptionsModal.tsx` - New modal component for download options (to be created).
- `src/lib/pdf-generator.tsx` - Handles PDF export logic; may need updates for integration.
- `src/lib/docx-generator.ts` - New or updated utility for Word (.docx) export.
- `src/lib/text-generator.ts` - New utility for plain text export.
- `src/components/resume-builder/__tests__/DownloadOptionsModal.test.tsx` - Unit tests for the modal component.
- `src/lib/docx-generator.test.ts` - Unit tests for Word export utility.
- `src/lib/text-generator.test.ts` - Unit tests for text export utility.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Replace Export PDF Button with Download Button in ReviewStep
  - [x] 1.1 Remove the existing Export PDF button from `ReviewStep.tsx`.
  - [x] 1.2 Add a new "Download" button in the same location.
  - [x] 1.3 Ensure the button is disabled or hidden if the resume is incomplete.

- [ ] 2.0 Implement Download Options Modal UI and Logic
  - [ ] 2.1 Create `DownloadOptionsModal.tsx` component matching existing modal UI/UX.
  - [ ] 2.2 Add three options: Text, Word (.docx), and PDF, each as a button or selectable item.
  - [ ] 2.3 Ensure modal requires explicit user action to close (not auto-close on download).
  - [ ] 2.4 Add accessibility features (keyboard navigation, focus trap, ARIA labels).
  - [ ] 2.5 Integrate modal open/close logic with the new Download button in `ReviewStep.tsx`.

- [ ] 3.0 Implement PDF, Word (.docx), and Text Export Functionality
  - [ ] 3.1 Reuse or update `pdf-generator.tsx` for PDF export, ensuring it uses the selected template and resume data.
  - [ ] 3.2 Implement `docx-generator.ts` to render the selected template and resume data as a .docx file (using html-docx-js, mammoth.js, or similar).
  - [ ] 3.3 Implement `text-generator.ts` to format all resume sections as readable plain text.
  - [ ] 3.4 Ensure all exports use the resume name from PersonalInfoStep as the filename, sanitized for filesystem safety.
  - [ ] 3.5 Handle download triggers for each format from the modal.

- [ ] 4.0 Integrate Modal and Export Logic with Resume Data and Template
  - [ ] 4.1 Pass all necessary resume data and selected template to the modal and export utilities.
  - [ ] 4.2 Ensure the correct template is rendered for both PDF and Word exports.
  - [ ] 4.3 Ensure text export includes all sections in a logical, readable order.
  - [ ] 4.4 Add error handling for failed exports or missing data.

- [ ] 5.0 Add Unit Tests and Ensure Accessibility/UI Consistency
  - [ ] 5.1 Write unit tests for `DownloadOptionsModal.tsx` (UI, logic, accessibility).
  - [ ] 5.2 Write unit tests for `docx-generator.ts` (correctness, edge cases).
  - [ ] 5.3 Write unit tests for `text-generator.ts` (formatting, completeness).
  - [ ] 5.4 Test integration with `ReviewStep.tsx` (button state, modal open/close, export triggers).
  - [ ] 5.5 Manually verify modal and export accessibility and UI consistency with existing modals. 