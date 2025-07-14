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

// CV-specific interfaces
export interface Publication {
  title: string
  authors: string
  journal: string
  year: string
  doi?: string
}

export interface ResearchExperience {
  institution: string
  position: string
  startDate: string
  endDate: string
  description: string
  funding?: string
}

export interface AcademicAchievement {
  title: string
  institution: string
  year: string
  description?: string
}

export interface CVData {
  publications: Publication[]
  researchExperience: ResearchExperience[]
  academicAchievements: AcademicAchievement[]
  teachingExperience: any[]
  grants: any[]
  conferences: any[]
}

// Biodata-specific interfaces
export interface FamilyMember {
  name: string
  relationship: string
  age?: string
  occupation?: string
  education?: string
}

export interface PersonalDetail {
  field: string
  value: string
}

export interface BiodataData {
  personalDetails: PersonalDetail[]
  familyMembers: FamilyMember[]
  hobbies: string[]
  languages: string[]
  references: any[]
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
  cvData?: CVData
  biodataData?: BiodataData
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

export interface DocumentStructure {
  documentType: DocumentType
  steps: StepConfig[]
  maxSteps: number
  minSteps: number
}

export interface DocumentStepConfiguration {
  documentType: DocumentType
  steps: StepConfig[]
  maxSteps: number
  minSteps: number
}

// Default Resume Steps (for backward compatibility)
export const STEPS: StepConfig[] = [
  { id: 1, title: 'Personal Info', icon: '👤', description: 'Tell us about yourself', required: true, component: 'PersonalInfoStep' },
  { id: 2, title: 'Work Experience', icon: '💼', description: 'Add your work history', required: true, component: 'ExperienceStep' },
  { id: 3, title: 'Education', icon: '🎓', description: 'Add your education', required: true, component: 'EducationStep' },
  { id: 4, title: 'Skills', icon: '⚡', description: 'Showcase your abilities', required: true, component: 'SkillsStep' },
  { id: 5, title: 'Review', icon: '✨', description: 'Finalize your resume', required: true, component: 'ReviewStep' }
] 