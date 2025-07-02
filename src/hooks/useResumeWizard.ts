import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ResumeData, PersonalInfo, Experience, Education, Skill, STEPS } from '@/components/resume-builder'
import { fetchTemplateData, loadResumeData, saveResume, exportPDF } from '@/lib/resume-api'
import { useResumeStepNavigation } from './useResumeStepNavigation'

export function useResumeWizard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  // State Management
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingResumeId, setEditingResumeId] = useState<string | null>(null)
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const initialTemplate = searchParams.get('template') || searchParams.get('customTemplate') || ''
    return {
      personalInfo: { name: '', email: '', phone: '', location: '', summary: '' },
      experiences: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
      education: [{ school: '', degree: '', field: '', graduationDate: '', gpa: '' }],
      skills: [{ name: '', level: 'Intermediate' }],
      template: initialTemplate
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [isLoadingResume, setIsLoadingResume] = useState(false)
  const [selectedTemplateData, setSelectedTemplateData] = useState<any>(null)
  const [returnToStep, setReturnToStep] = useState<number | null>(null)

  // Helper Functions
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }))
  }

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { company: '', position: '', startDate: '', endDate: '', description: '' }]
    }))
  }

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }))
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', field: '', graduationDate: '', gpa: '' }]
    }))
  }

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }))
  }

  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 'Intermediate' }]
    }))
  }

  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  // Fetch template data
  const handleFetchTemplateData = async (templateId: string) => {
    const template = await fetchTemplateData(templateId)
    setSelectedTemplateData(template)
  }

  // Load resume data if editing
  const handleLoadResumeData = async (resumeId: string) => {
    setIsLoadingResume(true)
    setSaveMessage('')
    try {
      const data = await loadResumeData(resumeId, searchParams)
      setResumeData(data)
    } catch (error: any) {
      setSaveMessage(`❌ Error: ${error.message || 'Failed to load resume data'}`)
    } finally {
      setIsLoadingResume(false)
    }
  }

  // Save resume
  const handleSaveResume = async () => {
    await saveResume({
      session,
      resumeData,
      isEditMode,
      editingResumeId,
      router,
      setIsEditMode,
      setEditingResumeId,
      setSaveMessage,
      setIsLoading
    })
  }

  // Export PDF
  const handleExportPDF = async () => {
    await exportPDF({
      session,
      resumeData,
      isEditMode,
      editingResumeId,
      setIsEditMode,
      setEditingResumeId,
      setSaveMessage,
      setIsLoading,
      router
    })
  }

  // Initialize template data when component mounts
  useEffect(() => {
    const initialTemplate = searchParams.get('template') || searchParams.get('customTemplate') || resumeData.template
    if (initialTemplate) {
      handleFetchTemplateData(initialTemplate)
    } else {
      setSelectedTemplateData(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load template data when template changes
  useEffect(() => {
    if (resumeData.template) {
      handleFetchTemplateData(resumeData.template)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData.template])

  // Load existing resume data if editing
  useEffect(() => {
    const resumeId = searchParams.get('id') || searchParams.get('edit')
    if (resumeId && session?.user && status === 'authenticated') {
      setIsEditMode(true)
      setEditingResumeId(resumeId)
      handleLoadResumeData(resumeId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, session, status])

  // Step navigation
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    canProceed,
    canAccessStep,
    handleStepClick
  } = useResumeStepNavigation(resumeData, STEPS)

  const handleTemplateChange = (templateId: string) => {
    setResumeData(prev => ({ ...prev, template: templateId }))
    handleFetchTemplateData(templateId)
    if (returnToStep && returnToStep !== currentStep) {
      setCurrentStep(returnToStep)
      setReturnToStep(null)
    }
  }

  const handleChangeTemplate = () => {
    setReturnToStep(currentStep)
    setCurrentStep(1)
  }

  return {
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
  }
} 