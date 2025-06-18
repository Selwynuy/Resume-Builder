'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getTemplate, templates } from '@/lib/templates'
import { useAutoSave } from '@/hooks/useAutoSave'

interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  summary: string
}

interface Experience {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

interface Education {
  school: string
  degree: string
  field: string
  graduationDate: string
  gpa?: string
}

interface Skill {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

export default function NewResumePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTemplate = searchParams.get('template') || 'classic'
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: ''
  })

  const [experiences, setExperiences] = useState<Experience[]>([
    { company: '', position: '', startDate: '', endDate: '', description: '' }
  ])

  const [education, setEducation] = useState<Education[]>([
    { school: '', degree: '', field: '', graduationDate: '', gpa: '' }
  ])

  const [skills, setSkills] = useState<Skill[]>([
    { name: '', level: 'Intermediate' }
  ])

  const [currentTemplate, setCurrentTemplate] = useState(initialTemplate)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  const template = getTemplate(currentTemplate)

  // Auto-save hook
  useAutoSave({
    personalInfo,
    experiences,
    education,
    skills,
    template: currentTemplate
  })

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const addExperience = () => {
    setExperiences([...experiences, { company: '', position: '', startDate: '', endDate: '', description: '' }])
  }

  const addEducation = () => {
    setEducation([...education, { school: '', degree: '', field: '', graduationDate: '', gpa: '' }])
  }

  const addSkill = () => {
    setSkills([...skills, { name: '', level: 'Intermediate' }])
  }

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }))
  }

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const newExperiences = [...experiences]
    newExperiences[index] = { ...newExperiences[index], [field]: value }
    setExperiences(newExperiences)
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    setEducation(newEducation)
  }

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    const newSkills = [...skills]
    newSkills[index] = { ...newSkills[index], [field]: value }
    setSkills(newSkills)
  }

  const removeItem = (index: number, type: 'experience' | 'education' | 'skill') => {
    if (type === 'experience' && experiences.length > 1) {
      setExperiences(experiences.filter((_, i) => i !== index))
    } else if (type === 'education' && education.length > 1) {
      setEducation(education.filter((_, i) => i !== index))
    } else if (type === 'skill' && skills.length > 1) {
      setSkills(skills.filter((_, i) => i !== index))
    }
  }

  const switchTemplate = (templateId: string) => {
    setCurrentTemplate(templateId)
    setShowTemplateSelector(false)
  }

  useEffect(() => {
    if (status === 'loading') return
    if (!session) router.push('/login')
  }, [session, status, router])

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session) {
    return null
  }

  const saveResume = async () => {
    const resumeData = {
      personalInfo,
      experiences: experiences.filter(exp => exp.company || exp.position),
      education: education.filter(edu => edu.school || edu.degree),
      skills: skills.filter(skill => skill.name),
      template: currentTemplate
    }
    
    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData)
      })

      if (response.ok) {
        alert('Resume saved successfully!')
        router.push('/dashboard')
      } else {
        alert('Error saving resume')
      }
    } catch (error) {
      alert('Error saving resume')
    }
  }

  const exportPDF = async () => {
    const resumeData = {
      personalInfo,
      experiences: experiences.filter(exp => exp.company || exp.position),
      education: education.filter(edu => edu.school || edu.degree),
      skills: skills.filter(skill => skill.name),
      template: currentTemplate
    }

    try {
      const response = await fetch('/api/resumes/export-temp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData)
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${personalInfo.name || 'resume'}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      alert('Error exporting PDF')
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-12">
      <div className="container mx-auto px-4 py-4 lg:py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold gradient-text mb-2">Create Your Resume</h1>
            <p className="text-slate-600 text-sm lg:text-base">
              Using template: <span className="font-medium" style={{ color: template.colors.primary }}>{template.name}</span>
            </p>
            <div id="save-indicator" className="text-sm mt-1"></div>
          </div>
          
          <div className="flex flex-wrap gap-2 lg:space-x-3 lg:flex-nowrap">
            {/* Mobile preview toggle */}
            {isMobile && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 lg:hidden"
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            )}
            
            <button
              onClick={() => setShowTemplateSelector(!showTemplateSelector)}
              className="bg-white/80 backdrop-blur-sm text-slate-700 px-4 py-2 rounded-xl text-sm hover:bg-white/90 transition-all duration-300"
            >
              Change Template
            </button>
            <button
              onClick={saveResume}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl text-sm hover:scale-105 transition-all duration-300"
            >
              Save Resume
            </button>
            <button 
              onClick={exportPDF}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm hover:scale-105 transition-all duration-300"
            >
              Export PDF
            </button>
          </div>
        </div>
        
        {/* Template Selector Dropdown */}
        {showTemplateSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Choose Template</h2>
                <button 
                  onClick={() => setShowTemplateSelector(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((tmpl) => (
                  <div 
                    key={tmpl.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      currentTemplate === tmpl.id 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => switchTemplate(tmpl.id)}
                  >
                    {/* Mini Preview */}
                    <div className="h-32 bg-gray-100 rounded mb-3 relative overflow-hidden">
                      <div className="absolute inset-0 p-2" style={{ backgroundColor: tmpl.colors.primary + '10' }}>
                        <div className="bg-white p-2 rounded shadow-sm h-full">
                          <div className="border-b pb-1 mb-1" style={{ borderColor: tmpl.colors.accent }}>
                            <div className="h-2 rounded mb-1" style={{ backgroundColor: tmpl.colors.primary, width: '60%' }}></div>
                            <div className="h-1 rounded" style={{ backgroundColor: tmpl.colors.secondary, width: '40%' }}></div>
                          </div>
                          <div className="space-y-1">
                            <div className="h-1 rounded" style={{ backgroundColor: tmpl.colors.accent, width: '80%' }}></div>
                            <div className="h-1 rounded" style={{ backgroundColor: tmpl.colors.accent, width: '65%' }}></div>
                            <div className="h-1 rounded" style={{ backgroundColor: tmpl.colors.accent, width: '75%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-sm mb-1">{tmpl.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{tmpl.description}</p>
                    
                    {/* Color dots */}
                    <div className="flex space-x-1">
                      {Object.values(tmpl.colors).slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                    
                    {currentTemplate === tmpl.id && (
                      <div className="mt-2 text-primary-600 text-xs font-medium">✓ Selected</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Template info card */}
        <div className="mb-6 glass-card p-4 rounded-2xl" style={{ backgroundColor: template.colors.primary + '08' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <h3 className="font-semibold text-lg" style={{ color: template.colors.primary }}>{template.name} Template</h3>
              <p className="text-sm text-slate-600">{template.description}</p>
            </div>
            <div className="flex space-x-2">
              {Object.values(template.colors).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-slate-200"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-1 gap-8 ${isMobile ? '' : 'lg:grid-cols-2'}`}>
          {/* Form Section */}
          <div className={`space-y-6 ${isMobile && showPreview ? 'hidden' : ''} ${isMobile ? '' : 'max-h-screen overflow-y-auto'}`}>
            {/* Personal Information */}
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-4 text-slate-800">Personal Information</h2>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={personalInfo.name}
                  onChange={(e) => updatePersonalInfo('name', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <textarea
                  placeholder="Professional Summary"
                  value={personalInfo.summary}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300 resize-none"
                />
              </div>
            </div>

            {/* Experience Section */}
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold mb-3 text-slate-800">Experience</h2>
                <button
                  onClick={addExperience}
                  className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700"
                >
                  Add Experience
                </button>
              </div>
              
              {experiences.map((exp, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Experience {index + 1}</h3>
                    {experiences.length > 1 && (
                      <button
                        onClick={() => removeItem(index, 'experience')}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="text"
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="text"
                      placeholder="Start Date"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="text"
                      placeholder="End Date"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <textarea
                    placeholder="Job description and achievements"
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              ))}
            </div>

            {/* Education Section */}
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold mb-3 text-slate-800">Education</h2>
                <button
                  onClick={addEducation}
                  className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700"
                >
                  Add Education
                </button>
              </div>
              
              {education.map((edu, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Education {index + 1}</h3>
                    {education.length > 1 && (
                      <button
                        onClick={() => removeItem(index, 'education')}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="School/University"
                      value={edu.school}
                      onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="text"
                      placeholder="Field of Study"
                      value={edu.field}
                      onChange={(e) => updateEducation(index, 'field', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="text"
                      placeholder="Graduation Date"
                      value={edu.graduationDate}
                      onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="text"
                      placeholder="GPA (optional)"
                      value={edu.gpa}
                      onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Skills Section */}
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold mb-3 text-slate-800">Skills</h2>
                <button
                  onClick={addSkill}
                  className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700"
                >
                  Add Skill
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Skill name"
                      value={skill.name}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <select
                      value={skill.level}
                      onChange={(e) => updateSkill(index, 'level', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    {skills.length > 1 && (
                      <button
                        onClick={() => removeItem(index, 'skill')}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className={`glass-card p-6 rounded-2xl h-fit sticky top-24 {isMobile && !showPreview ? 'hidden' : ''}`}>
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Resume Preview</h2>
            <div 
              className="border border-slate-200 p-6 rounded-xl min-h-[700px] bg-white" 
              style={{ 
                borderLeft: template.id === 'minimal' ? `4px solid ${template.colors.primary}` : undefined
              }}
            >
              {/* Personal Info */}
              {personalInfo.name && (
                <div className="mb-6" style={{ 
                  backgroundColor: template.id === 'creative' ? template.colors.primary : 'transparent',
                  color: template.id === 'creative' ? '#ffffff' : template.colors.text,
                  padding: template.id === 'creative' ? '15px' : '0',
                  margin: template.id === 'creative' ? '-24px -24px 24px -24px' : '0'
                }}>
                  <h1 
                    className={`text-3xl font-bold ${template.id === 'modern' ? 'text-center' : ''}`}
                    style={{ 
                      color: template.id === 'creative' ? '#ffffff' : template.colors.primary,
                      marginBottom: '8px'
                    }}
                  >
                    {personalInfo.name}
                  </h1>
                  <div className={`text-gray-600 space-y-1 mt-2 ${template.id === 'modern' ? 'text-center' : ''}`}>
                    {personalInfo.email && <p style={{ color: template.id === 'creative' ? '#ffffff' : template.colors.secondary }}>{personalInfo.email}</p>}
                    {personalInfo.phone && <p style={{ color: template.id === 'creative' ? '#ffffff' : template.colors.secondary }}>{personalInfo.phone}</p>}
                    {personalInfo.location && <p style={{ color: template.id === 'creative' ? '#ffffff' : template.colors.secondary }}>{personalInfo.location}</p>}
                  </div>
                  {personalInfo.summary && (
                    <div className="mt-4">
                      <h3 
                        className="font-semibold mb-2 text-lg"
                        style={{ 
                          backgroundColor: template.id === 'modern' ? template.colors.primary : 'transparent',
                          color: template.id === 'modern' ? '#ffffff' : (template.id === 'creative' ? '#ffffff' : template.colors.primary),
                          padding: template.id === 'modern' ? '5px 10px' : '0'
                        }}
                      >
                        {template.id === 'creative' ? '✦ Professional Summary' : 'Professional Summary'}
                      </h3>
                      <p 
                        className="text-gray-700"
                        style={{ 
                          backgroundColor: template.id === 'minimal' ? '#f0f0f0' : 'transparent',
                          padding: template.id === 'minimal' ? '10px' : '0',
                          borderLeft: template.id === 'minimal' ? `3px solid ${template.colors.primary}` : 'none',
                          paddingLeft: template.id === 'minimal' ? '15px' : '0',
                          fontStyle: template.id === 'creative' ? 'italic' : 'normal'
                        }}
                      >
                        {personalInfo.summary}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Experience */}
              {experiences.some(exp => exp.company || exp.position) && (
                <div className="mb-6">
                  <h3 
                    className="font-semibold mb-3 text-lg"
                    style={{ 
                      borderBottom: template.id === 'classic' ? `1px solid ${template.colors.accent}` : 'none',
                      paddingBottom: template.id === 'classic' ? '2px' : '0',
                      backgroundColor: template.id === 'modern' ? template.colors.primary : 'transparent',
                      color: template.id === 'modern' ? '#ffffff' : template.colors.primary,
                      padding: template.id === 'modern' ? '5px 10px' : '0'
                    }}
                  >
                    {template.id === 'creative' ? '✦ Experience' : 'Experience'}
                  </h3>
                  {experiences.map((exp, index) => (
                    (exp.company || exp.position) && (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium" style={{ color: template.colors.primary }}>{exp.position}</h4>
                            <p 
                              className="text-gray-600"
                              style={{ 
                                fontStyle: template.id === 'creative' ? 'italic' : 'normal',
                                color: template.colors.secondary
                              }}
                            >
                              {exp.company}
                            </p>
                          </div>
                          {(exp.startDate || exp.endDate) && (
                            <p className="text-gray-500 text-sm" style={{ color: template.colors.secondary }}>
                              {exp.startDate} - {exp.endDate}
                            </p>
                          )}
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
                        )}
                      </div>
                    )
                  ))}
                </div>
              )}

              {/* Education */}
              {education.some(edu => edu.school || edu.degree) && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg border-b border-gray-300 pb-1">Education</h3>
                  {education.map((edu, index) => (
                    (edu.school || edu.degree) && (
                      <div key={index} className="mb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                            <p className="text-gray-600">{edu.school}</p>
                            {edu.gpa && <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>}
                          </div>
                          {edu.graduationDate && (
                            <p className="text-gray-500 text-sm">{edu.graduationDate}</p>
                          )}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}

              {/* Skills */}
              {skills.some(skill => skill.name) && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg border-b border-gray-300 pb-1">Skills</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {skills.map((skill, index) => (
                      skill.name && (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-700">{skill.name}</span>
                          <span className="text-gray-500 text-sm">{skill.level}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 