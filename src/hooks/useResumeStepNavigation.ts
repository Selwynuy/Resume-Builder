import { ResumeData } from '@/components/resume-builder'

const TOTAL_STEPS = 5;

export const useResumeStepNavigation = (
  resumeData: ResumeData,
  currentStep: number,
  setCurrentStep: (step: number) => void
) => {
  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!(resumeData.personalInfo.name && resumeData.personalInfo.email)
      case 2: return resumeData.experiences.some(exp => exp.position && exp.company)
      case 3: return resumeData.education.some(edu => edu.school && edu.degree)
      case 4: return resumeData.skills.some(skill => skill.name)
      case 5: return true
      default: return true
    }
  }

  const canAccessStep = (_stepNumber: number) => {
    return true // Allow skipping to any step
  }

  const handleStepClick = (stepNumber: number) => {
    if (canAccessStep(stepNumber)) {
      setCurrentStep(stepNumber)
    }
  }

  return {
    nextStep,
    prevStep,
    canProceed,
    canAccessStep,
    handleStepClick
  }
} 