# Multi-Style AI Summary Modal Implementation Plan

## Overview
Implement a modal in the Personal Info step that offers users multiple AI-generated summary styles (Professional, Creative, Friendly, Technical). Each style is labeled and can be inserted or copied with one click. This plan is tracked separately from the main ai-features.md for clarity and documentation.

---

## Requirements
- User clicks "AI Suggest" in Personal Info step
- Modal opens with 4 labeled summary options
- Each option has a "Use" (insert) and "Copy" button
- No explanations, just summaries and labels
- All UI/UX matches current design system
- All updates must be documented and planned

---

## Prompt Design
Send the following prompt to Gemini:
```
Here is a user's professional summary: [current summary or user info].
Improve and generate 4 different versions:
1. Professional
2. Creative
3. Friendly
4. Technical
Return only the summaries, each clearly labeled, in JSON:
{
  "professional": "...",
  "creative": "...",
  "friendly": "...",
  "technical": "..."
}
No explanations, no extra text.
```

---

## Backend/API
- [x] Parse Gemini response as JSON
- [x] Return object with 4 summaries to frontend
- [x] Handle errors and invalid responses (fallback for HTML/non-JSON)

---

## Frontend/UI
- [x] On "AI Suggest" click, open modal and show loading spinner
- [x] Display 4 labeled summary options with "Use" and "Copy" buttons
- [x] "Use" replaces summary field and closes modal
- [x] "Copy" copies summary to clipboard (modal stays open)
- [x] Highlight selected summary if it matches current field value
- [x] Show concise error if AI fails
- [x] Ensure modal matches design system (spacing, colors, focus states)
- [x] Accessibility: aria labels, focus, keyboard navigation

---

## Integration Steps
1. [x] Update AI prompt in frontend
2. [x] Update backend to parse and return JSON object
3. [x] Update modal UI for multi-style options
4. [x] Add loading, error, and interaction logic
5. [x] Polish for accessibility and design
6. [x] Update documentation and onboarding

---

## Verification Checklist
- [x] Prompt returns 4 labeled summaries in JSON
- [x] Modal displays all options with correct labels
- [x] "Use" and "Copy" buttons work as intended
- [x] Error handling is robust
- [x] UI/UX matches current design system
- [x] Accessibility and keyboard navigation
- [x] Documentation and onboarding updated

---

*All updates to this feature must be documented and planned in this file before implementation.* 