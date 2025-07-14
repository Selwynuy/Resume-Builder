import { DocumentType, StepConfig, DocumentStepConfiguration, ResumeData } from './types'

describe('DocumentType Enum', () => {
  it('should have the correct values', () => {
    expect(DocumentType.RESUME).toBe('resume')
    expect(DocumentType.CV).toBe('cv')
    expect(DocumentType.BIODATA).toBe('biodata')
  })

  it('should have exactly three document types', () => {
    const documentTypes = Object.values(DocumentType)
    expect(documentTypes).toHaveLength(3)
    expect(documentTypes).toContain('resume')
    expect(documentTypes).toContain('cv')
    expect(documentTypes).toContain('biodata')
  })
})

describe('StepConfig Interface', () => {
  it('should allow valid step configuration', () => {
    const validStepConfig: StepConfig = {
      id: 1,
      title: 'Personal Info',
      icon: '👤',
      description: 'Tell us about yourself',
      required: true,
      component: 'PersonalInfoStep'
    }

    expect(validStepConfig.id).toBe(1)
    expect(validStepConfig.title).toBe('Personal Info')
    expect(validStepConfig.required).toBe(true)
  })

  it('should allow optional step configuration', () => {
    const optionalStepConfig: StepConfig = {
      id: 6,
      title: 'Certifications',
      icon: '🏆',
      description: 'Add your certifications',
      required: false,
      component: 'CertificationsStep'
    }

    expect(optionalStepConfig.required).toBe(false)
  })
})

describe('DocumentStepConfiguration Interface', () => {
  it('should allow valid document step configuration', () => {
    const validConfig: DocumentStepConfiguration = {
      documentType: DocumentType.RESUME,
      steps: [
        {
          id: 1,
          title: 'Personal Info',
          icon: '👤',
          description: 'Tell us about yourself',
          required: true,
          component: 'PersonalInfoStep'
        },
        {
          id: 2,
          title: 'Experience',
          icon: '💼',
          description: 'Add your work history',
          required: true,
          component: 'ExperienceStep'
        }
      ],
      maxSteps: 6,
      minSteps: 5
    }

    expect(validConfig.documentType).toBe(DocumentType.RESUME)
    expect(validConfig.steps).toHaveLength(2)
    expect(validConfig.maxSteps).toBe(6)
    expect(validConfig.minSteps).toBe(5)
  })

  it('should allow CV configuration with more steps', () => {
    const cvConfig: DocumentStepConfiguration = {
      documentType: DocumentType.CV,
      steps: [
        {
          id: 1,
          title: 'Personal Info',
          icon: '👤',
          description: 'Tell us about yourself',
          required: true,
          component: 'PersonalInfoStep'
        },
        {
          id: 2,
          title: 'Education',
          icon: '🎓',
          description: 'Add your education',
          required: true,
          component: 'EducationStep'
        },
        {
          id: 3,
          title: 'Research',
          icon: '🔬',
          description: 'Add your research experience',
          required: false,
          component: 'ResearchStep'
        }
      ],
      maxSteps: 10,
      minSteps: 8
    }

    expect(cvConfig.documentType).toBe(DocumentType.CV)
    expect(cvConfig.maxSteps).toBe(10)
    expect(cvConfig.minSteps).toBe(8)
  })
})

describe('ResumeData Interface', () => {
  it('should allow valid resume data with document type', () => {
    const validResumeData: ResumeData = {
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
      template: 'modern-template',
      documentType: DocumentType.RESUME
    }

    expect(validResumeData.documentType).toBe(DocumentType.RESUME)
    expect(validResumeData.personalInfo.name).toBe('John Doe')
    expect(validResumeData.experiences).toHaveLength(1)
    expect(validResumeData.education).toHaveLength(1)
    expect(validResumeData.skills).toHaveLength(1)
  })

  it('should allow CV data with document type', () => {
    const validCVData: ResumeData = {
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
      skills: [
        {
          name: 'Machine Learning',
          level: 'Expert',
          years: 8
        }
      ],
      template: 'academic-template',
      documentType: DocumentType.CV
    }

    expect(validCVData.documentType).toBe(DocumentType.CV)
    expect(validCVData.personalInfo.name).toBe('Dr. Jane Smith')
  })

  it('should allow Biodata with document type', () => {
    const validBiodata: ResumeData = {
      personalInfo: {
        name: 'Raj Patel',
        email: 'raj@example.com',
        phone: '+919876543210',
        location: 'Mumbai, India',
        summary: 'Experienced professional seeking opportunities'
      },
      experiences: [
        {
          company: 'Global Solutions Ltd',
          position: 'Project Manager',
          startDate: '2019-03',
          endDate: 'Present',
          description: 'Managed international projects'
        }
      ],
      education: [
        {
          school: 'Mumbai University',
          degree: 'Master of Business Administration',
          field: 'Business Administration',
          graduationDate: '2018-04',
          gpa: '3.9'
        }
      ],
      skills: [
        {
          name: 'Project Management',
          level: 'Advanced',
          years: 6
        }
      ],
      template: 'professional-template',
      documentType: DocumentType.BIODATA
    }

    expect(validBiodata.documentType).toBe(DocumentType.BIODATA)
    expect(validBiodata.personalInfo.name).toBe('Raj Patel')
  })
})

describe('STEPS Constant', () => {
  it('should maintain backward compatibility with existing STEPS', () => {
    const { STEPS } = require('./types')
    
    expect(STEPS).toHaveLength(5)
    expect(STEPS[0].title).toBe('Personal Info')
    expect(STEPS[1].title).toBe('Work Experience')
    expect(STEPS[2].title).toBe('Education')
    expect(STEPS[3].title).toBe('Skills')
    expect(STEPS[4].title).toBe('Review')
  })

  it('should have correct step properties', () => {
    const { STEPS } = require('./types')
    
    STEPS.forEach((step: any, index: number) => {
      expect(step).toHaveProperty('id')
      expect(step).toHaveProperty('title')
      expect(step).toHaveProperty('icon')
      expect(step).toHaveProperty('description')
      expect(step.id).toBe(index + 1)
    })
  })
}) 