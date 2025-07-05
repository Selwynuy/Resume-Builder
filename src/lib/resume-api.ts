// Resume API utility functions

export async function fetchTemplateData(templateId: string): Promise<any> {
  if (!templateId || templateId === 'undefined') {
    return null
  }
  try {
    const response = await fetch(`/api/templates/${templateId}`)
    if (response.ok) {
      const data = await response.json()
      const template = data.template
      
      // Normalize the template data structure to ensure both _id and id fields exist
      if (template) {
        return {
          ...template,
          id: template._id || template.id, // Ensure id field exists
          _id: template._id || template.id // Ensure _id field exists
        }
      }
      return template
    } else {
      return null
    }
  } catch (error) {
    return null
  }
}

export async function loadResumeData(resumeId: string, searchParams: URLSearchParams): Promise<any> {
  try {
    const response = await fetch(`/api/resumes/${resumeId}`)
    if (response.ok) {
      const text = await response.text()
      if (!text) throw new Error('Empty response from server')
      let resume
      try {
        resume = JSON.parse(text)
      } catch {
        throw new Error('Invalid JSON response from server')
      }
      const templateToUse = searchParams.get('template') || searchParams.get('customTemplate') || resume.template || ''
      return {
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
      }
    } else {
      const errorText = await response.text()
      let errorMessage = 'Failed to load resume data'
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      throw new Error(errorMessage)
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to load resume data')
  }
}

export async function saveResume({
  session,
  resumeData,
  isEditMode,
  editingResumeId,
  router,
  setIsEditMode,
  setEditingResumeId,
  setSaveMessage,
  setIsLoading
}: any): Promise<void> {
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
                          resumeData.experiences.some((exp: any) => exp.position && exp.company && exp.startDate && exp.endDate && exp.description)
    const payload = {
      title: `${resumeData.personalInfo.name || 'Untitled'} - Resume`,
      personalInfo: resumeData.personalInfo,
      experiences: resumeData.experiences.filter((exp: any) => 
        exp.position?.trim() && 
        exp.company?.trim() && 
        exp.startDate?.trim() && 
        exp.endDate?.trim() && 
        exp.description?.trim()
      ),
      education: resumeData.education.filter((edu: any) => 
        edu.school?.trim() && 
        edu.degree?.trim() && 
        edu.graduationDate?.trim()
      ),
      skills: resumeData.skills.filter((skill: any) => 
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
      throw new Error(errorData.error || 'Failed to save resume')
    }
  } catch (error: any) {
    console.log('🔍 Export PDF Final Error:', error)
    const errorMessage = error.message || error.toString() || 'Unknown error occurred'
    console.log('🔍 Final Error Message:', errorMessage)
    setSaveMessage(`❌ Error: ${errorMessage}`)
  } finally {
    setIsLoading(false)
  }
}

export async function exportPDF({
  session,
  resumeData,
  isEditMode,
  editingResumeId,
  setIsEditMode,
  setEditingResumeId,
  setSaveMessage,
  setIsLoading,
  router
}: any): Promise<void> {
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
                           resumeData.experiences.some((exp: any) => exp.position && exp.company && exp.startDate && exp.endDate && exp.description)
    if (!hasRequiredData) {
      throw new Error('Please complete all required fields (personal info and at least one complete work experience) before exporting PDF')
    }
    const payload = {
      title: `${resumeData.personalInfo.name || 'Untitled'} - Resume`,
      personalInfo: resumeData.personalInfo,
      experiences: resumeData.experiences.filter((exp: any) => 
        exp.position?.trim() && 
        exp.company?.trim() && 
        exp.startDate?.trim() && 
        exp.endDate?.trim() && 
        exp.description?.trim()
      ),
      education: resumeData.education.filter((edu: any) => 
        edu.school?.trim() && 
        edu.degree?.trim() && 
        edu.graduationDate?.trim()
      ),
      skills: resumeData.skills.filter((skill: any) => 
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
      const errorMessage = typeof errorData.error === 'string' ? errorData.error : 
                          typeof errorData.error === 'object' ? JSON.stringify(errorData.error) :
                          'Failed to save resume before export'
      throw new Error(errorMessage)
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
      if (contentType?.includes('application/pdf')) {
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
      } else {
        throw new Error('Unexpected response type from server (expected PDF)')
      }
    } else {
      try {
        const errorData = await pdfResponse.json()
        const errorMessage = typeof errorData.error === 'string' ? errorData.error : 
                            typeof errorData.error === 'object' ? JSON.stringify(errorData.error) :
                            'Failed to export PDF'
        throw new Error(errorMessage)
      } catch (parseError) {
        throw new Error(`Failed to export PDF: ${pdfResponse.statusText}`)
      }
    }
  } catch (error: any) {
    const errorMessage = error.message || error.toString() || 'Unknown error occurred'
    setSaveMessage(`❌ Error: ${errorMessage}`)
  } finally {
    setIsLoading(false)
  }
} 