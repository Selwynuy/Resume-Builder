import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

import { ResumeData, PersonalInfo, Experience, Education, Skill, DocumentType, CVData, BiodataData, StepConfig } from '@/components/document-builder/types'
import { useResumeStepNavigation } from '@/hooks/useResumeStepNavigation'
import { fetchTemplateData, loadResumeData, saveResume, exportPDF } from '@/lib/resume-api'
import { StepConfigurationManager } from '@/lib/step-configuration'

export function useResumeWizard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  // State Management
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingResumeId, setEditingResumeId] = useState<string | null>(null)
  const [documentType, setDocumentType] = useState<DocumentType>(DocumentType.RESUME)
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const initialTemplate = searchParams?.get('template') || searchParams?.get('customTemplate') || ''
    return {
      personalInfo: { name: '', email: '', phone: '', location: '', summary: '' },
      experiences: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
      education: [{ school: '', degree: '', field: '', graduationDate: '', gpa: '' }],
      skills: [{ name: '', level: 'Intermediate' }],
      template: initialTemplate,
      documentType: DocumentType.RESUME
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [isLoadingResume, setIsLoadingResume] = useState(false)
  const [selectedTemplateData, setSelectedTemplateData] = useState<unknown>(null)
  const [returnToStep, setReturnToStep] = useState<number | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [customSteps, setCustomSteps] = useState<StepConfig[]>([])
  const [isStepCustomizationOpen, setIsStepCustomizationOpen] = useState(false)

  // Get current step configuration
  const getCurrentStepConfig = () => {
    return StepConfigurationManager.getConfiguration(documentType)
  }

  // Get current step details
  const getCurrentStepDetails = () => {
    return StepConfigurationManager.getStepConfig(documentType, currentStep)
  }

  // Check if current step is required
  const isCurrentStepRequired = () => {
    return StepConfigurationManager.isStepRequired(documentType, currentStep)
  }

  // Check if step can be accessed
  const canAccessStep = (stepId: number) => {
    return StepConfigurationManager.canAccessStep(documentType, stepId, completedSteps)
  }

  // Get next available step
  const getNextStep = () => {
    return StepConfigurationManager.getNextStep(documentType, currentStep, completedSteps)
  }

  // Get previous step
  const getPreviousStep = () => {
    return StepConfigurationManager.getPreviousStep(documentType, currentStep)
  }

  // Check if current step is the last step
  const isLastStep = () => {
    return StepConfigurationManager.isLastStep(documentType, currentStep)
  }

  // Check if current step is the first step
  const isFirstStep = () => {
    return StepConfigurationManager.isFirstStep(documentType, currentStep)
  }

  // Get completion percentage
  const getCompletionPercentage = () => {
    return StepConfigurationManager.getCompletionPercentage(documentType, completedSteps)
  }

  // Validate step completion
  const validateStepCompletion = () => {
    return StepConfigurationManager.validateStepCompletion(documentType, completedSteps)
  }

  // Navigation functions
  const goToStep = (stepId: number) => {
    if (canAccessStep(stepId)) {
      setCurrentStep(stepId)
    }
  }

  const goToNextStep = () => {
    const nextStep = getNextStep()
    if (nextStep) {
      setCurrentStep(nextStep)
    }
  }

  const goToPreviousStep = () => {
    const prevStep = getPreviousStep()
    if (prevStep) {
      setCurrentStep(prevStep)
    }
  }

  const markStepAsCompleted = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId])
    }
  }

  const markStepAsIncomplete = (stepId: number) => {
    setCompletedSteps(prev => prev.filter(id => id !== stepId))
  }

  // Document type management
  const handleDocumentTypeChange = (newDocumentType: DocumentType) => {
    setDocumentType(newDocumentType)
    setResumeData(prev => ({
      ...prev,
      documentType: newDocumentType
    }))
    
    // Reset to first step when document type changes
    setCurrentStep(1)
    setCompletedSteps([])
  }

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

  const updateSkill = (index: number, field: keyof Skill, value: string | number | undefined) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }))
  }

  const addSkill = (name?: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: name || '', level: 'Intermediate' }]
    }))
  }

  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  // CV data update functions
  const updateCVData = (data: Partial<CVData>) => {
    setResumeData(prev => ({
      ...prev,
      cvData: { 
        publications: [],
        researchExperience: [],
        academicAchievements: [],
        teachingExperience: [],
        grants: [],
        conferences: [],
        ...prev.cvData, 
        ...data 
      }
    }))
  }

  // Individual CV step update functions
  const updatePublications = (publications: any[]) => {
    updateCVData({ publications })
  }

  const updateResearchExperience = (researchExperience: any[]) => {
    updateCVData({ researchExperience })
  }

  const updateAcademicAchievements = (academicAchievements: any[]) => {
    updateCVData({ academicAchievements })
  }

  // Biodata data update functions
  const updateBiodataData = (data: Partial<BiodataData>) => {
    setResumeData(prev => ({
      ...prev,
      biodataData: { 
        personalDetails: [],
        familyMembers: [],
        hobbies: [],
        languages: [],
        references: [],
        ...prev.biodataData, 
        ...data 
      }
    }))
  }

  // Individual Biodata step update functions
  const updatePersonalDetails = (personalDetails: any[]) => {
    updateBiodataData({ personalDetails })
  }

  const updateLanguages = (languages: string[]) => {
    updateBiodataData({ languages })
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
      const data = await loadResumeData(resumeId, searchParams || new URLSearchParams())
      setResumeData(data)
      
      // Set document type from loaded data
      if (data.documentType) {
        setDocumentType(data.documentType)
      }
      
      // Determine completed steps based on loaded data
      const loadedCompletedSteps: number[] = []
      if (data.personalInfo?.name) loadedCompletedSteps.push(1)
      if (data.experiences?.length > 0 && data.experiences[0]?.company) loadedCompletedSteps.push(2)
      if (data.education?.length > 0 && data.education[0]?.school) loadedCompletedSteps.push(3)
      if (data.skills?.length > 0 && data.skills[0]?.name) loadedCompletedSteps.push(4)
      
      setCompletedSteps(loadedCompletedSteps)
    } catch (error: unknown) {
      setSaveMessage(`❌ Error: ${error instanceof Error ? error.message : 'Failed to load resume data'}`)
    } finally {
      setIsLoadingResume(false)
    }
  }

  // Save resume
  const handleSaveResume = async () => {
    await saveResume({
      session: session as { user: { email: string } } | null,
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
      session: session as { user: { email: string } } | null,
      resumeData,
      isEditMode,
      editingResumeId,
      _setIsEditMode: setIsEditMode,
      _setEditingResumeId: setEditingResumeId,
      setSaveMessage,
      setIsLoading,
      _router: router
    })
  }

  // Initialize template data when component mounts
  useEffect(() => {
    const initialTemplate = searchParams?.get('template') || searchParams?.get('customTemplate') || resumeData.template
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
    // Check for resume ID in search params (for backward compatibility)
    let resumeId = searchParams?.get('id') || searchParams?.get('edit')
    
    // If no resume ID in search params, check if we're on an edit page
    if (!resumeId && typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/')
      const editIndex = pathSegments.indexOf('edit')
      if (editIndex !== -1 && pathSegments[editIndex + 1]) {
        resumeId = pathSegments[editIndex + 1]
      }
    }
    
    if (resumeId && session?.user && status === 'authenticated') {
      setIsEditMode(true)
      setEditingResumeId(resumeId)
      handleLoadResumeData(resumeId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, session, status])

  // Step navigation
  const {
    nextStep,
    prevStep,
    canProceed,
    handleStepClick
  } = useResumeStepNavigation(resumeData, currentStep, setCurrentStep)

  const handleTemplateChange = (templateId: string) => {
    setResumeData(prev => ({ ...prev, template: templateId }))
    handleFetchTemplateData(templateId)
    if (returnToStep && returnToStep !== currentStep) {
      setCurrentStep(returnToStep)
      setReturnToStep(null)
    }
  }

  const handleChangeTemplate = () => {
    saveStateToLocalStorage();
    setReturnToStep(currentStep);
    // If editing, use /resume/edit/[id], else /resume/new
    const isEdit = !!editingResumeId;
    const redirectPath = isEdit ? `/resume/edit/${editingResumeId}` : '/resume/new';
    router.push(`/templates?redirect=${encodeURIComponent(redirectPath)}`);
  }

  // Save resume data and step to localStorage before redirecting to templates
  const saveStateToLocalStorage = () => {
    try {
      localStorage.setItem('resumeBuilderData', JSON.stringify({ resumeData, currentStep }))
    } catch (e) { /* ignore */ }
  }

  // Restore resume data and step from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('resumeBuilderData')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.resumeData) setResumeData(parsed.resumeData)
        if (parsed.currentStep) setCurrentStep(parsed.currentStep)
        localStorage.removeItem('resumeBuilderData') // clear after restore
      }
    } catch (e) { /* ignore */ }
  }, [setCurrentStep])

  // Step customization functions
  const openStepCustomization = () => {
    setIsStepCustomizationOpen(true)
  }

  const closeStepCustomization = () => {
    setIsStepCustomizationOpen(false)
  }

  const handleStepsChange = (newSteps: StepConfig[]) => {
    setCustomSteps(newSteps)
    // Reset to first step when steps change
    setCurrentStep(1)
    setCompletedSteps([])
  }

  const getCurrentSteps = (): StepConfig[] => {
    // Return custom steps if available, otherwise return default configuration
    if (customSteps.length > 0) {
      return customSteps
    }
    return getCurrentStepConfig().steps
  }

  const resetToDefaultSteps = () => {
    setCustomSteps([])
    setCurrentStep(1)
    setCompletedSteps([])
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
    completedSteps,
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
    canProceed,
    saveStateToLocalStorage,
    documentType,
    handleDocumentTypeChange,
    getCurrentStepConfig,
    getCurrentStepDetails,
    isCurrentStepRequired,
    canAccessStep,
    getNextStep,
    getPreviousStep,
    isLastStep,
    isFirstStep,
    getCompletionPercentage,
    validateStepCompletion,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    markStepAsCompleted,
    markStepAsIncomplete,
    updateCVData,
    updateBiodataData,
    updatePublications,
    updateResearchExperience,
    updateAcademicAchievements,
    updatePersonalDetails,
    updateLanguages,
    // Step customization
    customSteps,
    isStepCustomizationOpen,
    openStepCustomization,
    closeStepCustomization,
    handleStepsChange,
    getCurrentSteps,
    resetToDefaultSteps
  }
} 