# Implementation Plan: Additional Export Options (Word & Text)

## 1. Introduction/Overview

Add Word (.docx) and plain text export options to complement the existing PDF export functionality. The implementation will preserve the current PDF export system while adding new export formats that maintain template styling for Word documents and provide clean, readable plain text output.

## 2. Goals

- **Preserve existing PDF functionality**: No changes to current PDF export that could affect results
- **Add Word export**: Generate .docx files with template styling preserved
- **Add Text export**: Generate clean, formatted plain text files
- **Consistent UX**: All export options accessible through the same interface
- **Template compatibility**: Word exports maintain visual design, text exports are readable

## 3. User Stories

- As a user, I want to export my resume as a Word document so I can edit it in Microsoft Word
- As a user, I want to export my resume as plain text so I can paste it into online forms
- As a user, I want all export options to use my resume's name as the filename
- As a user, I want Word exports to look exactly like my selected template

## 4. Functional Requirements

### 4.1 Export Options Modal
- Replace single "Export PDF" button with "Download" button in ReviewStep
- Modal displays three options: "Text", "Word (.docx)", "PDF"
- Modal requires explicit user action to close (no auto-close)
- Modal matches existing UI/UX patterns

### 4.2 File Naming
- Default filename: `resumeData.personalInfo.name` + extension
- Examples: "John Doe.pdf", "John Doe.docx", "John Doe.txt"
- Fallback to "Resume" if name is empty

### 4.3 Export Formats

#### 4.3.1 Word Export (.docx)
- Preserve template HTML/CSS styling
- Maintain layout, fonts, colors, spacing
- Include all resume sections
- Compatible with Microsoft Word, Google Docs, LibreOffice

#### 4.3.2 Text Export (.txt)
- Clean, readable plain text format
- Include all resume sections
- Proper formatting with headers, bullet points
- No styling, just structured text content

#### 4.3.3 PDF Export (Existing)
- No changes to current implementation
- Preserve all existing functionality

## 5. Technical Requirements

### 5.1 Dependencies
```json
{
  "dependencies": {
    "docx": "^8.5.0",           // Word document generation
    "html-to-text": "^9.0.4"    // HTML to plain text conversion
  }
}
```

### 5.2 API Endpoints
```typescript
// New endpoints to add
POST /api/resumes/[id]/export/word
POST /api/resumes/[id]/export/text

// Existing endpoint (no changes)
POST /api/resumes/[id]/export/pdf
```

### 5.3 File Generation Functions
```typescript
// New utility functions
export const generateWordDocument = (resumeData, template) => Buffer
export const generateTextDocument = (resumeData) => string
```

## 6. Implementation Steps

### Phase 1: Backend Infrastructure (Week 1)
1. **Install dependencies**
   - Add `docx` and `html-to-text` packages
   - Update package.json and lock file

2. **Create Word export utility**
   - `src/lib/word-generator.ts`
   - Convert HTML template to Word document
   - Preserve styling and layout

3. **Create Text export utility**
   - `src/lib/text-generator.ts`
   - Convert resume data to structured text
   - Handle formatting and sections

4. **Add API endpoints**
   - `/api/resumes/[id]/export/word`
   - `/api/resumes/[id]/export/text`
   - Follow existing PDF endpoint pattern

### Phase 2: Frontend Integration (Week 2)
1. **Create Export Options Modal**
   - `src/components/resume-builder/ExportOptionsModal.tsx`
   - Three export options with icons
   - Loading states for each option

2. **Update ReviewStep component**
   - Replace "Export PDF" button with "Download"
   - Integrate ExportOptionsModal
   - Handle export function calls

3. **Add export functions to useResumeWizard hook**
   - `handleExportWord()`
   - `handleExportText()`
   - Preserve existing `handleExportPDF()`

### Phase 3: Testing & Polish (Week 3)
1. **Unit tests**
   - Test Word generation utility
   - Test Text generation utility
   - Test API endpoints

2. **Integration tests**
   - Test modal functionality
   - Test export workflows
   - Test file downloads

3. **UI/UX polish**
   - Ensure modal matches existing design
   - Add proper loading states
   - Handle error cases gracefully

## 7. File Structure

```
src/
├── lib/
│   ├── word-generator.ts      # Word document generation
│   ├── text-generator.ts      # Text document generation
│   └── pdf-generator.tsx      # Existing (no changes)
├── components/
│   └── resume-builder/
│       ├── ExportOptionsModal.tsx  # New modal component
│       └── ReviewStep.tsx          # Updated with new export
├── app/
│   └── api/
│       └── resumes/
│           └── [id]/
│               └── export/
│                   ├── word/
│                   │   └── route.ts    # New endpoint
│                   ├── text/
│                   │   └── route.ts    # New endpoint
│                   └── pdf/
│                       └── route.ts    # Existing (no changes)
└── hooks/
    └── useResumeWizard.ts     # Updated with new export functions
```

## 8. Error Handling

### 8.1 Export Failures
- Graceful fallback messages
- Retry functionality
- Clear error descriptions

### 8.2 Template Compatibility
- Handle unsupported template features
- Fallback to basic formatting
- Warning messages for complex templates

### 8.3 File Size Limits
- Check file size before download
- Compress if necessary
- Warn users of large files

## 9. Performance Considerations

### 9.1 Generation Time
- Word documents: ~2-5 seconds
- Text documents: <1 second
- PDF documents: Existing performance

### 9.2 Memory Usage
- Stream large documents
- Clean up temporary files
- Monitor memory usage

### 9.3 Caching
- Cache generated documents temporarily
- Avoid regenerating identical content
- Clear cache on resume updates

## 10. Testing Strategy

### 10.1 Unit Tests
```typescript
// Test Word generation
describe('Word Generator', () => {
  it('generates Word document with template styling')
  it('handles missing template gracefully')
  it('preserves all resume sections')
})

// Test Text generation
describe('Text Generator', () => {
  it('generates readable plain text')
  it('maintains section structure')
  it('handles special characters')
})
```

### 10.2 Integration Tests
```typescript
// Test export workflow
describe('Export Workflow', () => {
  it('opens modal with three options')
  it('downloads Word document correctly')
  it('downloads Text document correctly')
  it('preserves existing PDF functionality')
})
```

### 10.3 Manual Testing
- Test with different templates
- Test with various resume content
- Test file compatibility across applications

## 11. Success Metrics

### 11.1 Technical Metrics
- Export success rate > 95%
- Average generation time < 5 seconds
- File size optimization (Word < 2MB, Text < 100KB)

### 11.2 User Metrics
- Export modal usage rate
- User preference for different formats
- Download completion rate

## 12. Future Enhancements

### 12.1 Additional Formats
- RTF (Rich Text Format)
- HTML export
- LaTeX export for academic CVs

### 12.2 Advanced Features
- Custom filename input
- Batch export (multiple formats)
- Email export functionality

### 12.3 Template Enhancements
- Template-specific export optimizations
- Custom export styling per template
- Export preview functionality

## 13. Risk Assessment

### 13.1 Technical Risks
- **Word compatibility issues**: Test across different Word versions
- **Template rendering differences**: Implement fallback styling
- **File size limitations**: Implement compression and size checks

### 13.2 User Experience Risks
- **Confusion with multiple options**: Clear labeling and descriptions
- **Export time expectations**: Loading indicators and progress feedback
- **File format confusion**: Helpful tooltips and format descriptions

## 14. Rollout Plan

### 14.1 Development Phase
- Week 1: Backend implementation
- Week 2: Frontend integration
- Week 3: Testing and polish

### 14.2 Deployment Phase
- Deploy to staging environment
- Internal testing with various templates
- User acceptance testing
- Gradual rollout to production

### 14.3 Monitoring Phase
- Monitor export success rates
- Track user adoption of new formats
- Collect feedback for improvements
- Plan future enhancements based on usage data 