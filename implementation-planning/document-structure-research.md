# Document Structure Research: Resume vs CV vs Biodata

## Research Summary

Based on industry standards and professional practices, here are the typical document structures:

### Resume (US/Canada Style)
**Standard Steps: 5-6**
1. Personal Information (Name, Contact, Location)
2. Professional Summary/Objective
3. Work Experience
4. Education
5. Skills
6. Additional Sections (Optional: Certifications, Projects, Languages, etc.)

### CV (Curriculum Vitae - Academic/International)
**Standard Steps: 8-10**
1. Personal Information
2. Professional Summary
3. Education (Detailed)
4. Research Experience
5. Work Experience
6. Publications
7. Presentations/Conferences
8. Skills & Technical Competencies
9. Awards & Honors
10. References

### Biodata (South Asian/Indian Style)
**Standard Steps: 6-8**
1. Personal Information (including family details)
2. Educational Qualifications
3. Work Experience
4. Skills & Competencies
5. Languages Known
6. Personal Details (Marital status, etc.)
7. References
8. Declaration

## Implementation Recommendations

### 1. Dynamic Step Configuration
- Create a configuration system that defines steps per document type
- Allow for flexible step ordering and optional steps
- Support custom step definitions for different regions/industries

### 2. Document Type Selection
- Add document type selector at the beginning of the wizard
- Default to "Resume" for US/Canada users
- Support "CV" for academic/international users
- Support "Biodata" for South Asian markets

### 3. Step Validation Rules
- Different validation rules per document type
- CV requires more detailed education and research sections
- Biodata requires personal details and family information
- Resume focuses on concise, achievement-oriented content

### 4. Template Compatibility
- Templates should be tagged with supported document types
- Some templates work for multiple document types
- Custom templates can define their own step requirements

## Next Steps
1. Implement document type selection UI
2. Create step configuration system
3. Update validation rules per document type
4. Modify templates to support different document types
5. Add region-specific default settings 