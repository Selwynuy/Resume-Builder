import { 
  ResumeValidationSchema, 
  CVValidationSchema, 
  BiodataValidationSchema,
  getValidationSchema,
  validateDocumentData
} from './document-validation'
import { DocumentType } from '@/components/resume-builder/types'

describe('ResumeValidationSchema', () => {
  const validResumeData = {
    documentType: DocumentType.RESUME,
    personalInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      location: 'New York, NY',
      summary: 'Experienced software developer'
    },
    experiences: [
      {
        company: 'Tech Corp',
        position: 'Software Engineer',
        startDate: '2020-01',
        endDate: 'Present',
        description: 'Developed web applications'
      }
    ],
    education: [
      {
        school: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        graduationDate: '2019-05',
        gpa: '3.8'
      }
    ],
    skills: [
      {
        name: 'JavaScript',
        level: 'Advanced',
        years: 5
      }
    ],
    template: 'modern-template'
  }

  it('should validate correct resume data', () => {
    const result = ResumeValidationSchema.safeParse(validResumeData)
    expect(result.success).toBe(true)
  })

  it('should reject resume data with missing required fields', () => {
    const invalidData = { 
      ...validResumeData,
      personalInfo: { ...validResumeData.personalInfo, name: undefined as any }
    }
    
    const result = ResumeValidationSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name is required')
    }
  })

  it('should reject resume data with too many experiences', () => {
    const invalidData = {
      ...validResumeData,
      experiences: Array(11).fill(validResumeData.experiences[0])
    }
    
    const result = ResumeValidationSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Too many experience entries')
    }
  })

  it('should reject resume data with invalid email', () => {
    const invalidData = {
      ...validResumeData,
      personalInfo: { ...validResumeData.personalInfo, email: 'invalid-email' }
    }
    
    const result = ResumeValidationSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email address')
    }
  })
})

describe('CVValidationSchema', () => {
  const validCVData = {
    documentType: DocumentType.CV,
    personalInfo: {
      name: 'Dr. Jane Smith',
      email: 'jane@university.edu',
      phone: '+1234567890',
      location: 'Boston, MA',
      summary: 'Research scientist with 10+ years experience'
    },
    experiences: [
      {
        company: 'University Research Lab',
        position: 'Senior Research Scientist',
        startDate: '2018-09',
        endDate: 'Present',
        description: 'Leading research in machine learning'
      }
    ],
    education: [
      {
        school: 'MIT',
        degree: 'PhD',
        field: 'Computer Science',
        graduationDate: '2018-05',
        gpa: '4.0'
      }
    ],
    research: [
      {
        title: 'Machine Learning Applications',
        institution: 'MIT',
        startDate: '2015-09',
        endDate: '2018-05',
        description: 'Research on ML applications in healthcare'
      }
    ],
    publications: [
      {
        title: 'Advanced ML Techniques',
        authors: 'Smith, J., Johnson, A.',
        journal: 'Nature',
        year: 2022,
        doi: '10.1038/s41586-022-00000-0'
      }
    ],
    presentations: [
      {
        title: 'ML in Healthcare',
        conference: 'ICML',
        date: '2022-07',
        type: 'Oral'
      }
    ],
    skills: [
      {
        name: 'Machine Learning',
        level: 'Expert',
        years: 8
      }
    ],
    awards: [
      {
        name: 'Best Paper Award',
        organization: 'ICML',
        year: 2022,
        description: 'Outstanding contribution to ML research'
      }
    ],
    references: [
      {
        name: 'Dr. Robert Johnson',
        title: 'Professor',
        organization: 'MIT',
        email: 'robert@mit.edu'
      }
    ],
    template: 'academic-template'
  }

  it('should validate correct CV data', () => {
    const result = CVValidationSchema.safeParse(validCVData)
    expect(result.success).toBe(true)
  })

  it('should validate CV data without optional sections', () => {
    const minimalCVData = {
      documentType: DocumentType.CV,
      personalInfo: validCVData.personalInfo,
      experiences: validCVData.experiences,
      education: validCVData.education,
      skills: validCVData.skills,
      references: validCVData.references,
      template: validCVData.template
    }
    
    const result = CVValidationSchema.safeParse(minimalCVData)
    expect(result.success).toBe(true)
  })

  it('should reject CV data with invalid publication year', () => {
    const invalidData = {
      ...validCVData,
      publications: [
        {
          ...validCVData.publications[0],
          year: 2030 // Future year
        }
      ]
    }
    
    const result = CVValidationSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Year cannot be in the future')
    }
  })
})

describe('BiodataValidationSchema', () => {
  const validBiodataData = {
    documentType: DocumentType.BIODATA,
    personalInfo: {
      name: 'Raj Patel',
      email: 'raj@example.com',
      phone: '+919876543210',
      location: 'Mumbai, India',
      summary: 'Experienced professional seeking opportunities'
    },
    education: [
      {
        school: 'Mumbai University',
        degree: 'Master of Business Administration',
        field: 'Business Administration',
        graduationDate: '2018-04',
        gpa: '3.9'
      }
    ],
    experiences: [
      {
        company: 'Global Solutions Ltd',
        position: 'Project Manager',
        startDate: '2019-03',
        endDate: 'Present',
        description: 'Managed international projects'
      }
    ],
    skills: [
      {
        name: 'Project Management',
        level: 'Advanced',
        years: 6
      }
    ],
    languages: [
      {
        name: 'English',
        proficiency: 'Fluent',
        reading: 'Native',
        writing: 'Native',
        speaking: 'Native'
      },
      {
        name: 'Hindi',
        proficiency: 'Native',
        reading: 'Native',
        writing: 'Native',
        speaking: 'Native'
      }
    ],
    personalDetails: {
      dateOfBirth: '1990-05-15',
      maritalStatus: 'Married',
      nationality: 'Indian',
      gender: 'Male',
      address: '123 Main Street, Mumbai, Maharashtra, India'
    },
    references: [
      {
        name: 'Dr. Amit Kumar',
        title: 'Senior Manager',
        organization: 'Global Solutions Ltd',
        email: 'amit@globalsolutions.com',
        phone: '+919876543211'
      }
    ],
    declaration: 'I hereby declare that all the information provided is true to the best of my knowledge.',
    template: 'professional-template'
  }

  it('should validate correct biodata', () => {
    const result = BiodataValidationSchema.safeParse(validBiodataData)
    expect(result.success).toBe(true)
  })

  it('should validate biodata without optional personal details', () => {
    const minimalBiodataData = {
      documentType: DocumentType.BIODATA,
      personalInfo: validBiodataData.personalInfo,
      education: validBiodataData.education,
      experiences: validBiodataData.experiences,
      skills: validBiodataData.skills,
      languages: validBiodataData.languages,
      references: validBiodataData.references,
      template: validBiodataData.template
    }
    
    const result = BiodataValidationSchema.safeParse(minimalBiodataData)
    expect(result.success).toBe(true)
  })

  it('should reject biodata with invalid date of birth format', () => {
    const invalidData = {
      ...validBiodataData,
      personalDetails: {
        ...validBiodataData.personalDetails,
        dateOfBirth: '15-05-1990' // Wrong format
      }
    }
    
    const result = BiodataValidationSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Date of birth must be in YYYY-MM-DD format')
    }
  })

  it('should reject biodata with too many languages', () => {
    const invalidData = {
      ...validBiodataData,
      languages: Array(11).fill(validBiodataData.languages[0])
    }
    
    const result = BiodataValidationSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Too many languages')
    }
  })
})

describe('getValidationSchema', () => {
  it('should return ResumeValidationSchema for RESUME document type', () => {
    const schema = getValidationSchema(DocumentType.RESUME)
    expect(schema).toBe(ResumeValidationSchema)
  })

  it('should return CVValidationSchema for CV document type', () => {
    const schema = getValidationSchema(DocumentType.CV)
    expect(schema).toBe(CVValidationSchema)
  })

  it('should return BiodataValidationSchema for BIODATA document type', () => {
    const schema = getValidationSchema(DocumentType.BIODATA)
    expect(schema).toBe(BiodataValidationSchema)
  })

  it('should return ResumeValidationSchema as default fallback', () => {
    const schema = getValidationSchema('unknown' as DocumentType)
    expect(schema).toBe(ResumeValidationSchema)
  })
})

describe('validateDocumentData', () => {
  const validResumeData = {
    documentType: DocumentType.RESUME,
    personalInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      location: 'New York, NY',
      summary: 'Experienced software developer'
    },
    experiences: [
      {
        company: 'Tech Corp',
        position: 'Software Engineer',
        startDate: '2020-01',
        endDate: 'Present',
        description: 'Developed web applications'
      }
    ],
    education: [
      {
        school: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        graduationDate: '2019-05',
        gpa: '3.8'
      }
    ],
    skills: [
      {
        name: 'JavaScript',
        level: 'Advanced',
        years: 5
      }
    ],
    template: 'modern-template'
  }

  it('should validate correct resume data', () => {
    const result = validateDocumentData(validResumeData, DocumentType.RESUME)
    expect(result.success).toBe(true)
  })

  it('should reject invalid resume data', () => {
    const invalidData = { 
      ...validResumeData,
      personalInfo: { ...validResumeData.personalInfo, name: undefined as any }
    }
    
    const result = validateDocumentData(invalidData, DocumentType.RESUME)
    expect(result.success).toBe(false)
  })

  it('should handle different document types correctly', () => {
    const cvData = {
      documentType: DocumentType.CV,
      personalInfo: validResumeData.personalInfo,
      experiences: validResumeData.experiences,
      education: validResumeData.education,
      skills: validResumeData.skills,
      references: [
        {
          name: 'Dr. Robert Johnson',
          title: 'Professor',
          organization: 'MIT',
          email: 'robert@mit.edu'
        }
      ],
      template: 'academic-template'
    }
    
    const result = validateDocumentData(cvData, DocumentType.CV)
    expect(result.success).toBe(true)
  })
}) 