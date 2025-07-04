import { useState } from 'react'

import { ResumeData } from '@/components/resume-builder'

export function useResumeStepNavigation(resumeData: ResumeData, STEPS: any[]) {
  const [currentStep, setCurrentStep] = useState(1)

  const nextStep = () => {
    if (currentStep < STEPS.length) {
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
      case 1: return resumeData.template !== ''
      case 2: return resumeData.personalInfo.name && resumeData.personalInfo.email
      case 3: return resumeData.experiences.some(exp => exp.position && exp.company)
      case 4: return resumeData.education.some(edu => edu.school && edu.degree)
      case 5: return resumeData.skills.some(skill => skill.name)
      case 6: return true
      default: return true
    }
  }

  const canAccessStep = (stepNumber: number) => {
    return true // Allow skipping to any step
  }

  const handleStepClick = (stepNumber: number) => {
    if (canAccessStep(stepNumber)) {
      setCurrentStep(stepNumber)
    }
  }

  return {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    canProceed,
    canAccessStep,
    handleStepClick
  }
} 