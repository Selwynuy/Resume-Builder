'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ProgressBar,
  TemplateStep,
  PersonalInfoStep,
  ExperienceStep,
  EducationStep,
  SkillsStep,
  ReviewStep,
  ResumeData,
  PersonalInfo,
  Experience,
  Education,
  Skill,
  STEPS
} from '@/components/resume-builder'
import { useResumeWizard } from '@/hooks/useResumeWizard'

// Main Component
export default function NewResumePage() {
  const {
    status,
    isLoadingResume,
    isEditMode,
    resumeData,
    selectedTemplateData,
    saveMessage,
    isLoading,
    returnToStep,
    updatePersonalInfo,
    updateExperience,
    addExperience,
    removeExperience,
    updateEducation,
    addEducation,
    removeEducation,
    updateSkill,
    addSkill,
    removeSkill,
    handleSaveResume,
    handleExportPDF,
    handleStepClick,
    handleTemplateChange,
    handleChangeTemplate,
    currentStep,
    nextStep,
    prevStep,
    canProceed
  } = useResumeWizard()
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Helper Functions
  const fetchTemplateData = async (templateId: string) => {
    if (!templateId || templateId === 'undefined') {
      return
    }
    
    try {
      const response = await fetch(`/api/templates/${templateId}`)
      if (response.ok) {
        const data = await response.json()
        const template = data.template
        return template
      }
    } catch (error) {
      console.error('Error fetching template:', error)
      return null
    }
  }

  // Initialize template data when component mounts
  useEffect(() => {
    const initialTemplate = searchParams.get('template') || searchParams.get('customTemplate') || resumeData.template
    if (initialTemplate) {
      fetchTemplateData(initialTemplate)
    }
  }, [])

  // Load template data when template changes
  useEffect(() => {
    if (resumeData.template) {
      fetchTemplateData(resumeData.template)
    }
  }, [resumeData.template])

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TemplateStep 
            selectedTemplate={resumeData.template}
            onTemplateSelect={handleTemplateChange}
            returnToStep={returnToStep}
          />
        )
      case 2:
        return (
          <PersonalInfoStep 
            personalInfo={resumeData.personalInfo}
            updatePersonalInfo={updatePersonalInfo}
          />
        )
      case 3:
        return (
          <ExperienceStep 
            experiences={resumeData.experiences}
            updateExperience={updateExperience}
            addExperience={addExperience}
            removeExperience={removeExperience}
          />
        )
      case 4:
        return (
          <EducationStep 
            education={resumeData.education}
            updateEducation={updateEducation}
            addEducation={addEducation}
            removeEducation={removeEducation}
          />
        )
      case 5:
        return (
          <SkillsStep 
            skills={resumeData.skills}
            updateSkill={updateSkill}
            addSkill={addSkill}
            removeSkill={removeSkill}
          />
        )
      case 6:
        return (
          <ReviewStep 
            resumeData={resumeData}
            selectedTemplate={selectedTemplateData}
            onSave={handleSaveResume}
            onExport={handleExportPDF}
            onChangeTemplate={handleChangeTemplate}
            isLoading={isLoading}
            saveMessage={saveMessage}
            updatePersonalInfo={updatePersonalInfo}
            updateExperience={updateExperience}
            addExperience={addExperience}
            removeExperience={removeExperience}
            updateEducation={updateEducation}
            addEducation={addEducation}
            removeEducation={removeEducation}
            updateSkill={updateSkill}
            addSkill={addSkill}
            removeSkill={removeSkill}
          />
        )
      default:
        return <div>Step {currentStep} - Coming Soon!</div>
    }
  }

  if (authStatus === 'loading' || isLoadingResume) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600">
            {authStatus === 'loading' ? 'Loading...' : 'Loading resume data...'}
          </p>
        </div>
      </div>
    )
  }

  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Please Sign In</h1>
          <p className="text-slate-600 mb-6">You need to be signed in to create a resume.</p>
          <Link href="/login" className="btn-gradient">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen pt-32 pb-12">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <ProgressBar currentStep={currentStep} onStepClick={handleStepClick} />

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {renderCurrentStep()}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`
                px-6 py-3 rounded-xl font-medium transition-all duration-300
                ${currentStep === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }
              `}
            >
              ← Previous
            </button>

            <div className="text-center">
              <span className="text-sm text-slate-500">
                Step {currentStep} of {STEPS.length}
              </span>
            </div>

            {currentStep < STEPS.length ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all duration-300
                  ${!canProceed()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:scale-105'
                  }
                `}
              >
                Next →
              </button>
            ) : (
              <div className="px-6 py-3 text-slate-500 text-sm">
                ✨ All steps completed! Use the buttons above to save or export.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
} 