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

export interface ResumeData {
  personalInfo: PersonalInfo
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  template: string
}

// Step Configuration
export const STEPS = [
  { id: 1, title: 'Personal Info', icon: '👤', description: 'Tell us about yourself' },
  { id: 2, title: 'Work Experience', icon: '💼', description: 'Add your work history' },
  { id: 3, title: 'Education', icon: '🎓', description: 'Add your education' },
  { id: 4, title: 'Skills', icon: '⚡', description: 'Showcase your abilities' },
  { id: 5, title: 'Review', icon: '✨', description: 'Finalize your resume' }
] 