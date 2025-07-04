# Flexible Skills Section Implementation Plan

## Overview
Upgrade the Skills section so users can choose how to represent each skill:
- Skill only
- Skill + proficiency (Beginner/Intermediate/Advanced/Expert)
- Skill + years of experience
- Skill + certification
- Skill + context/example (optional)

All templates/components must use conditional logic to gracefully handle all possible fields, so users can mix and match styles per skill. A universal skill rendering component should be reused everywhere for consistency.

---

## Requirements
- Users can add/edit skills in any of the above formats, per skill
- UI allows selecting format per skill (dropdown/toggle)
- Only fields present in the resume builder can be used as template placeholders
- Resume builder, template builder, and all previews must use the same universal skill rendering logic/component
- AI skill suggestions can recommend years/certifications/context if possible

---

## Prompt Design (AI Suggest)
- When suggesting skills, prompt Gemini to include years of experience (if possible), proficiency, and relevant certifications/context.
- Example prompt:
```
Given this resume and job history, suggest 10 relevant skills. For each, include:
- Skill name
- Years of experience (if possible)
- Proficiency (Beginner/Intermediate/Advanced/Expert)
- Relevant certification (if any)
- Short context/example (optional)
Return as JSON array of objects.
```

---

## UI/UX Plan
- For each skill, user can select format:
  - Skill only
  - Skill + proficiency
  - Skill + years
  - Skill + certification
  - Skill + context/example
- Show/hide inputs based on format
- Render skills in chosen format in preview and templates using a universal skill rendering component
- Ensure accessibility and mobile responsiveness

---

## Integration Steps
1. Update Skill type/interface in resume builder to support new fields (years, certification, context)
2. Refactor SkillsStep UI to allow format selection and dynamic fields per skill
3. Update AI suggest logic and prompt
4. Create a universal skill rendering component and use it in all previews, templates, and PDF exports
5. Update all templates to use new placeholders if needed, with conditional logic for all fields
6. Update documentation and onboarding
7. Test for consistency in resume builder and template builder

---

## Verification Checklist
- [x] Users can add/edit skills in all supported formats, per skill
- [x] UI/UX is clean, accessible, and responsive
- [x] AI suggestions enhanced with better context prioritization (resume content > experience > job description > job title/industry)
- [x] Universal skill rendering component created and used everywhere
- [x] Templates render new skill fields correctly with conditional logic
- [x] No orphan placeholders in templates
- [ ] Documentation and onboarding updated (needs separate task)
- [x] Main linter errors fixed
- [x] All skills API tests pass

## Completion Status: ✅ IMPLEMENTED

### Summary of Implementation:
1. **Type Updates**: Extended Skill interface with optional fields (level, years, certification, context)
2. **UI Refactor**: Complete SkillsStep.tsx rewrite with format selection per skill
3. **Universal Components**: 
   - SkillDisplay.tsx for React UI rendering
   - PDFSkillDisplay helper for PDF exports  
   - Updated default template with conditional Handlebars logic
4. **AI Enhancement**: Skills API now prioritizes full resume context > experience descriptions > job description > job title/industry
5. **Testing**: Added comprehensive tests for context-based skills suggestions
6. **Template Compatibility**: All existing templates work with new optional fields using conditional rendering

### Files Modified:
- `src/components/resume-builder/types.ts` - Extended Skill interface
- `src/components/resume-builder/SkillsStep.tsx` - Flexible skill formats UI
- `src/components/resume-builder/SkillDisplay.tsx` - Universal skill component
- `src/lib/pdf-generator.tsx` - PDF skill rendering
- `src/lib/templates.ts` - Default template with conditional logic
- `src/lib/template-renderer.ts` - Type compatibility fixes
- `src/app/api/ai/skills/route.ts` - Context-based suggestions
- `src/app/api/ai/skills/route.test.ts` - Enhanced tests
- `src/app/resume/new/page.tsx` - Pass resume context to SkillsStep

---

*All updates to this feature must be documented and planned in this file before implementation.* 