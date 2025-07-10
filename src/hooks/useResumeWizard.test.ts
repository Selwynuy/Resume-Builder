import { renderHook, act } from '@testing-library/react'

import { useResumeWizard } from './useResumeWizard'

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn()
  }),
  useSearchParams: () => new URLSearchParams()
}))

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { email: 'test@example.com' } },
    status: 'authenticated'
  })
}))

// Mock the resume API functions
jest.mock('@/lib/resume-api', () => ({
  fetchTemplateData: jest.fn(),
  loadResumeData: jest.fn(),
  saveResume: jest.fn(),
  exportPDF: jest.fn()
}))

// Mock the step navigation hook
jest.mock('./useResumeStepNavigation', () => ({
  useResumeStepNavigation: () => ({
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    canProceed: jest.fn(() => true),
    handleStepClick: jest.fn()
  })
}))

describe('useResumeWizard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with default resume data', () => {
    const { result } = renderHook(() => useResumeWizard())
    
    expect(result.current.resumeData).toEqual({
      personalInfo: { name: '', email: '', phone: '', location: '', summary: '' },
      experiences: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
      education: [{ school: '', degree: '', field: '', graduationDate: '', gpa: '' }],
      skills: [{ name: '', level: 'Intermediate' }],
      template: ''
    })
  })

  it('should update personal info correctly', () => {
    const { result } = renderHook(() => useResumeWizard())
    
    act(() => {
      result.current.updatePersonalInfo('name', 'John Doe')
    })
    
    expect(result.current.resumeData.personalInfo.name).toBe('John Doe')
  })

  it('should add experience correctly', () => {
    const { result } = renderHook(() => useResumeWizard())
    
    act(() => {
      result.current.addExperience()
    })
    
    expect(result.current.resumeData.experiences).toHaveLength(2)
  })

  it('should remove experience correctly', () => {
    const { result } = renderHook(() => useResumeWizard())
    
    // Add an experience first
    act(() => {
      result.current.addExperience()
    })
    
    // Remove the first experience
    act(() => {
      result.current.removeExperience(0)
    })
    
    expect(result.current.resumeData.experiences).toHaveLength(1)
  })

  it('should update experience correctly', () => {
    const { result } = renderHook(() => useResumeWizard())
    
    act(() => {
      result.current.updateExperience(0, 'company', 'Test Company')
    })
    
    expect(result.current.resumeData.experiences[0].company).toBe('Test Company')
  })

  it('should add education correctly', () => {
    const { result } = renderHook(() => useResumeWizard())
    
    act(() => {
      result.current.addEducation()
    })
    
    expect(result.current.resumeData.education).toHaveLength(2)
  })

  it('should remove education correctly', () => {
    const { result } = renderHook(() => useResumeWizard())
    
    // Add an education first
    act(() => {
      result.current.addEducation()
    })
    
    // Remove the first education
    act(() => {
      result.current.removeEducation(0)
    })
    
    expect(result.current.resumeData.education).toHaveLength(1)
  })

  it('should update education correctly', () => {
    const { result } = renderHook(() => useResumeWizard())
    
    act(() => {
      result.current.updateEducation(0, 'school', 'Test University')
    })
    
    expect(result.current.resumeData.education[0].school).toBe('Test University')
  })

  it('should add skill correctly', () => {
    const { result } = renderHook(() => useResumeWizard())
    
    act(() => {
      result.current.addSkill()
    })
    
    expect(result.current.resumeData.skills).toHaveLength(2)
  })

  it('should remove skill correctly', () => {
    const { result } = renderHook(() => useResumeWizard())
    
    // Add a skill first
    act(() => {
      result.current.addSkill()
    })
    
    // Remove the first skill
    act(() => {
      result.current.removeSkill(0)
    })
    
    expect(result.current.resumeData.skills).toHaveLength(1)
  })

  it('should update skill correctly', () => {
    const { result } = renderHook(() => useResumeWizard())
    
    act(() => {
      result.current.updateSkill(0, 'name', 'JavaScript')
    })
    
    expect(result.current.resumeData.skills[0].name).toBe('JavaScript')
  })
}) 