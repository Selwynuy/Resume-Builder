'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import {
  ProgressBar,
  PersonalInfoStep,
  ExperienceStep,
  EducationStep,
  SkillsStep,
  ReviewStep,
  STEPS
} from '@/components/resume-builder'
import { useResumeWizard } from '@/hooks/useResumeWizard'


// Client-side rendering for resume builder - highly interactive
export const dynamic = 'force-dynamic'

// Main Component
export default function NewResumePage() {
  const {
    isLoadingResume,
    resumeData,
    selectedTemplateData,
    saveMessage,
    isLoading,
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
    handleChangeTemplate,
    currentStep,
    nextStep,
    prevStep,
    canProceed
  } = useResumeWizard()
  const { status: authStatus } = useSession()
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
      return null
    }
  }

  // Initialize template data when component mounts
  useEffect(() => {
    const initialTemplate = searchParams?.get('template') || searchParams?.get('customTemplate') || resumeData.template
    if (initialTemplate) {
      fetchTemplateData(initialTemplate)
    }
  }, [searchParams, resumeData.template])

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
          <PersonalInfoStep 
            personalInfo={resumeData.personalInfo}
            updatePersonalInfo={updatePersonalInfo}
          />
        )
      case 2:
        return (
          <ExperienceStep 
            experiences={resumeData.experiences}
            updateExperience={updateExperience}
            addExperience={addExperience}
            removeExperience={removeExperience}
          />
        )
      case 3:
        return (
          <EducationStep 
            education={resumeData.education}
            updateEducation={updateEducation}
            addEducation={addEducation}
            removeEducation={removeEducation}
          />
        )
      case 4:
        return (
          <SkillsStep 
            skills={resumeData.skills}
            updateSkill={updateSkill}
            addSkill={addSkill}
            removeSkill={removeSkill}
            resumeData={resumeData}
          />
        )
      case 5:
        return (
          <ReviewStep 
            resumeData={resumeData}
            selectedTemplate={selectedTemplateData as { id: string; name: string; description: string; htmlTemplate: string; cssStyles: string } | null}
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
              onClick={() => {
                if (canProceed()) nextStep()
              }}
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