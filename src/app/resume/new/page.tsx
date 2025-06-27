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

// Main Component
export default function NewResumePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  // State Management
  const [currentStep, setCurrentStep] = useState(1)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingResumeId, setEditingResumeId] = useState<string | null>(null)
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const initialTemplate = searchParams.get('template') || searchParams.get('customTemplate') || ''
    console.log('📄 Initializing with template:', initialTemplate)
    
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

  // Function to fetch full template data
  const fetchTemplateData = async (templateId: string) => {
    if (!templateId || templateId === 'undefined') {
      console.log('❌ Invalid templateId:', templateId)
      setSelectedTemplateData(null)
      return
    }
    
    console.log('🔍 Fetching community template data for:', templateId)
    try {
      const response = await fetch(`/api/templates/${templateId}`)
      if (response.ok) {
        const data = await response.json()
        const template = data.template
        console.log('✅ Community template fetched:', template)
        setSelectedTemplateData(template)
      } else {
        console.log('❌ API fetch failed for template:', templateId)
        setSelectedTemplateData(null)
      }
    } catch (error) {
      console.error('Error fetching template data:', error)
      setSelectedTemplateData(null)
    }
  }

  // Initialize template data when component mounts
  useEffect(() => {
    const initialTemplate = searchParams.get('template') || searchParams.get('customTemplate') || resumeData.template
    if (initialTemplate) {
      console.log('🚀 Component mounted, fetching template:', initialTemplate)
      fetchTemplateData(initialTemplate)
    } else {
      console.log('🚀 Component mounted, no initial template specified')
      setSelectedTemplateData(null)
    }
  }, [])

  // Load template data when template changes
  useEffect(() => {
    if (resumeData.template) {
      console.log('📝 Template changed to:', resumeData.template)
      fetchTemplateData(resumeData.template)
    }
  }, [resumeData.template])

  // Load existing resume data if editing
  useEffect(() => {
    const resumeId = searchParams.get('id') || searchParams.get('edit')
    if (resumeId && session?.user && status === 'authenticated') {
      console.log('Session ready, loading resume data for ID:', resumeId)
      setIsEditMode(true)
      setEditingResumeId(resumeId)
      loadResumeData(resumeId)
    }
  }, [searchParams, session, status])

  const loadResumeData = async (resumeId: string) => {
    setIsLoadingResume(true)
    setSaveMessage('')
    try {
      const response = await fetch(`/api/resumes/${resumeId}`)

      if (response.ok) {
        const text = await response.text()
        if (!text) {
          throw new Error('Empty response from server')
        }
        
        let resume
        try {
          resume = JSON.parse(text)
        } catch (parseError) {
          console.error('JSON parse error:', parseError)
          throw new Error('Invalid JSON response from server')
        }
        
        const templateToUse = searchParams.get('template') || searchParams.get('customTemplate') || resume.template || 'classic'
        
        setResumeData({
          personalInfo: resume.personalInfo || {
            name: '', email: '', phone: '', location: '', summary: ''
          },
          experiences: resume.experiences?.length > 0 ? resume.experiences : [
            { company: '', position: '', startDate: '', endDate: '', description: '' }
          ],
          education: resume.education?.length > 0 ? resume.education : [
            { school: '', degree: '', field: '', graduationDate: '', gpa: '' }
          ],
          skills: resume.skills?.length > 0 ? resume.skills : [
            { name: '', level: 'Intermediate' }
          ],
          template: templateToUse
        })
      } else {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        
        let errorMessage = 'Failed to load resume data'
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.error || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        
        setSaveMessage(`❌ Error: ${errorMessage}`)
      }
    } catch (error: any) {
      console.error('Error loading resume:', error)
      setSaveMessage(`❌ Error: ${error.message || 'Failed to load resume data'}`)
    } finally {
      setIsLoadingResume(false)
    }
  }

  const saveResume = async () => {
    if (!session?.user?.email) {
      alert('Please sign in to save your resume')
      return
    }

    setIsLoading(true)
    setSaveMessage('')
    
    try {
      const hasMinimumData = resumeData.personalInfo.name && 
                            resumeData.personalInfo.email && 
                            resumeData.personalInfo.phone && 
                            resumeData.personalInfo.location &&
                            resumeData.experiences.some(exp => exp.position && exp.company && exp.startDate && exp.endDate && exp.description)

      const payload = {
        title: `${resumeData.personalInfo.name || 'Untitled'} - Resume`,
        personalInfo: resumeData.personalInfo,
        experiences: resumeData.experiences.filter(exp => 
          exp.position?.trim() && 
          exp.company?.trim() && 
          exp.startDate?.trim() && 
          exp.endDate?.trim() && 
          exp.description?.trim()
        ),
        education: resumeData.education.filter(edu => 
          edu.school?.trim() && 
          edu.degree?.trim() && 
          edu.graduationDate?.trim()
        ),
        skills: resumeData.skills.filter(skill => 
          skill.name?.trim() && 
          skill.level?.trim()
        ),
        template: resumeData.template,
        isDraft: !hasMinimumData
      }

      const url = isEditMode && editingResumeId 
        ? `/api/resumes/${editingResumeId}` 
        : '/api/resumes'
      const method = isEditMode && editingResumeId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const result = await response.json()
        const successMessage = isEditMode 
          ? (payload.isDraft ? '✅ Resume updated as draft!' : '✅ Resume updated successfully!')
          : (payload.isDraft ? '✅ Resume saved as draft!' : '✅ Resume saved successfully!')
        
        setSaveMessage(successMessage)
        
        if (!isEditMode && result._id) {
          setIsEditMode(true)
          setEditingResumeId(result._id)
          const newUrl = new URL(window.location.href)
          newUrl.searchParams.set('id', result._id)
          window.history.replaceState({}, '', newUrl.toString())
        }
        
        setTimeout(() => {
        router.push('/dashboard')
        }, 2000)
      } else {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error || 'Failed to save resume')
      }
    } catch (error: any) {
      console.error('Error saving resume:', error)
      setSaveMessage(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const exportPDF = async () => {
    if (!session?.user?.email) {
      alert('Please sign in to export your resume')
      return
    }

    setIsLoading(true)
    setSaveMessage('')
    
    try {
      const hasRequiredData = resumeData.personalInfo.name && 
                             resumeData.personalInfo.email && 
                             resumeData.personalInfo.phone && 
                             resumeData.personalInfo.location &&
                             resumeData.experiences.some(exp => exp.position && exp.company && exp.startDate && exp.endDate && exp.description)

      if (!hasRequiredData) {
        throw new Error('Please complete all required fields (personal info and at least one complete work experience) before exporting PDF')
      }

      const payload = {
        title: `${resumeData.personalInfo.name || 'Untitled'} - Resume`,
        personalInfo: resumeData.personalInfo,
        experiences: resumeData.experiences.filter(exp => 
          exp.position?.trim() && 
          exp.company?.trim() && 
          exp.startDate?.trim() && 
          exp.endDate?.trim() && 
          exp.description?.trim()
        ),
        education: resumeData.education.filter(edu => 
          edu.school?.trim() && 
          edu.degree?.trim() && 
          edu.graduationDate?.trim()
        ),
        skills: resumeData.skills.filter(skill => 
          skill.name?.trim() && 
          skill.level?.trim()
        ),
        template: resumeData.template,
        isDraft: false
      }

      const url = isEditMode && editingResumeId 
        ? `/api/resumes/${editingResumeId}` 
        : '/api/resumes'
      const method = isEditMode && editingResumeId ? 'PUT' : 'POST'

      const saveResponse = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json()
        console.error('Save Error:', errorData)
        throw new Error(errorData.error || 'Failed to save resume before export')
      }

      const savedResume = await saveResponse.json()
      const resumeIdForPdf = isEditMode && editingResumeId ? editingResumeId : savedResume._id
      
      const pdfResponse = await fetch(`/api/resumes/${resumeIdForPdf}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (pdfResponse.ok) {
        const contentType = pdfResponse.headers.get('Content-Type')
        
        if (contentType?.includes('text/html')) {
          const htmlContent = await pdfResponse.text()
          const resumeTitle = pdfResponse.headers.get('X-Resume-Title') || 'Resume'
          
          const printWindow = window.open('', '_blank')
          if (printWindow) {
            const enhancedHtml = htmlContent.replace(
              '</head>',
              `
              <script>
                window.onload = function() {
                  setTimeout(() => {
                    if (window.print) {
                      window.print();
                    }
                    setTimeout(() => {
                      window.close();
                    }, 1000);
                  }, 500);
                };
              </script>
              </head>`
            )
            
            printWindow.document.write(enhancedHtml)
            printWindow.document.close()
            
            setSaveMessage('✅ PDF print dialog opened!')
          } else {
            const blob = new Blob([htmlContent], { type: 'text/html' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${resumeTitle}.html`
            document.body.appendChild(link)
            link.click()
            
            window.URL.revokeObjectURL(url)
            document.body.removeChild(link)
            
            setSaveMessage('✅ HTML file downloaded!')
          }
        } else {
          const blob = await pdfResponse.blob()
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${resumeData.personalInfo.name || 'Resume'}.pdf`
          document.body.appendChild(link)
          link.click()
          
          window.URL.revokeObjectURL(url)
          document.body.removeChild(link)
          
          setSaveMessage('✅ PDF downloaded successfully!')
        }
      } else {
        try {
          const errorData = await pdfResponse.json()
          console.error('PDF Error:', errorData)
          throw new Error(errorData.error || 'Failed to export PDF')
        } catch (jsonError) {
          console.error('PDF Error - Non-JSON response:', pdfResponse.statusText)
          throw new Error(`Failed to export PDF: ${pdfResponse.statusText}`)
        }
      }
    } catch (error: any) {
      console.error('Error exporting PDF:', error)
      setSaveMessage(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleTemplateChange = (templateId: string) => {
    console.log('🎯 Manually changing template to:', templateId)
    setResumeData(prev => ({ ...prev, template: templateId }))
    fetchTemplateData(templateId)
    
    if (returnToStep && returnToStep !== currentStep) {
      setCurrentStep(returnToStep)
      setReturnToStep(null)
    }
  }

  const handleChangeTemplate = () => {
    setReturnToStep(currentStep)
    setCurrentStep(1)
  }

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
            onSave={saveResume}
            onExport={exportPDF}
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

  if (status === 'loading' || isLoadingResume) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600">
            {status === 'loading' ? 'Loading...' : 'Loading resume data...'}
                                  </p>
                              </div>
                            </div>
                          )
  }

  if (status === 'unauthenticated') {
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