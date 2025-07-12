// Resume Data Interfaces
export interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  summary: string
}

export interface Experience {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

export interface Education {
  school: string
  degree: string
  field: string
  graduationDate: string
  gpa?: string
}

export interface Skill {
  name: string
  level?: string
  years?: number
  certification?: string
  context?: string
  format?: string // display format: 'name', 'level', etc.
}

// Document Type Enum
export enum DocumentType {
  RESUME = 'resume',
  CV = 'cv',
  BIODATA = 'biodata'
}

export interface ResumeData {
  personalInfo: PersonalInfo
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  template: string
  documentType: DocumentType
}

// Step Configuration Interfaces
export interface StepConfig {
  id: number
  title: string
  icon: string
  description: string
  required: boolean
  component: string
}

export interface DocumentStepConfiguration {
  documentType: DocumentType
  steps: StepConfig[]
  maxSteps: number
  minSteps: number
}

// Default Resume Steps (for backward compatibility)
export const STEPS = [
  { id: 1, title: 'Personal Info', icon: '👤', description: 'Tell us about yourself' },
  { id: 2, title: 'Work Experience', icon: '💼', description: 'Add your work history' },
  { id: 3, title: 'Education', icon: '🎓', description: 'Add your education' },
  { id: 4, title: 'Skills', icon: '⚡', description: 'Showcase your abilities' },
  { id: 5, title: 'Review', icon: '✨', description: 'Finalize your resume' }
] 