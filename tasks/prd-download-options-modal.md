# PRD: Download Options Modal for Resume Export

## 1. Introduction/Overview
Replace the current “Export PDF” button in the ReviewStep with a new download button. When clicked, it opens a modal offering three download formats: plain text, Word (.docx), and PDF. The exported file should use the resume’s name (from PersonalInfoStep) as the filename. For PDF and Word, the export should render the selected template (HTML/CSS). For text, export a readable, well-formatted plain text version.

## 2. Goals
- Allow users to export their resume in three formats: text, Word (.docx), and PDF.
- Use the resume’s name as the default filename.
- Render the selected template for both PDF and Word exports.
- Modal matches existing UI/UX.
- Modal only accessible from ReviewStep.

## 3. User Stories
- As a user, I want to choose between text, Word, or PDF when downloading my resume, so I can use it in different contexts.
- As a user, I want the exported file to use my resume’s name, so it’s easy to identify.
- As a user, I want the Word and PDF exports to look like my selected template, so my resume is visually consistent.

## 4. Functional Requirements
1. Replace the “Export PDF” button with a “Download” button in ReviewStep.
2. Clicking the button opens a modal with three options: “Text”, “Word (.docx)”, and “PDF”.
3. The modal must require explicit user action to close (not auto-close on download).
4. The exported file’s name defaults to the value of `resumeData.personalInfo.name` (e.g., “John Doe.pdf”).
5. PDF and Word exports must render the selected template (HTML/CSS) with all resume data.
6. Text export must include all resume sections in a readable, plain text format.
7. Always export the full resume; no section selection.
8. Modal must match the site’s existing modal UI/UX.
9. Modal is only accessible from ReviewStep.
10. If the resume is incomplete, the download button should be disabled or hidden (existing logic).

## 5. Non-Goals (Out of Scope)
- No analytics or tracking of downloads.
- No section selection for export.
- No download options outside ReviewStep.
- No custom styling for the modal beyond matching existing UI.

## 6. Design Considerations
- Modal should use the same style/components as other modals (e.g., AIFeedbackModal).
- Download button should be visually distinct and accessible.
- For Word export, use a library that can render HTML/CSS to .docx (e.g., html-docx-js, mammoth.js, or server-side Puppeteer-to-Word).
- For PDF, continue using the current export logic.
- For text, use a simple formatter for readability.

## 7. Technical Considerations
- Use the value from PersonalInfoStep for the filename, sanitized for filesystem safety.
- For Word export, if client-side rendering is insufficient, consider a serverless function or API route.
- Ensure modal is accessible (keyboard navigation, focus trap).
- Reuse existing logic for PDF export and template rendering where possible.

## 8. Success Metrics
- Users can successfully export resumes in all three formats.
- Exported files use the correct filename and format.
- No major UI/UX regressions or accessibility issues.

## 9. Open Questions
- Should there be a fallback filename if the user’s name is missing? (e.g., “resume.pdf”)
- Any need for localization of modal text/options?
- Should we show a success message or toast after download? 