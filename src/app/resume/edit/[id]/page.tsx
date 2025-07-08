'use client'

import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { useResumeWizard } from '@/hooks/useResumeWizard'
import { 
  PersonalInfoStep, 
  ExperienceStep, 
  EducationStep, 
  SkillsStep, 
  ReviewStep,
  ProgressBar 
} from '@/components/resume-builder'

const STEPS = [
  'Personal Info',
  'Experience', 
  'Education',
  'Skills',
  'Review & Export'
]

export default function EditResumePage({ params }: { params: { id: string } }) {
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
          <p className="text-slate-600 mb-6">You need to be signed in to edit a resume.</p>
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Edit Resume</h1>
            <p className="text-slate-600">Update your resume information and preview changes</p>
          </div>

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