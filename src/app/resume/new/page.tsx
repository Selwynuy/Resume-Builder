'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getTemplate, templates } from '@/lib/templates'
import { renderTemplate, getSampleResumeData } from '@/lib/template-renderer'

// Resume Data Interfaces
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

interface ResumeData {
  personalInfo: PersonalInfo
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  template: string
}

// Step Configuration
const STEPS = [
  { id: 1, title: 'Choose Template', icon: '🎨', description: 'Pick your perfect design' },
  { id: 2, title: 'Personal Info', icon: '👤', description: 'Tell us about yourself' },
  { id: 3, title: 'Work Experience', icon: '💼', description: 'Add your work history' },
  { id: 4, title: 'Education', icon: '🎓', description: 'Add your education' },
  { id: 5, title: 'Skills', icon: '⚡', description: 'Showcase your abilities' },
  { id: 6, title: 'Review', icon: '✨', description: 'Finalize your resume' }
]

// Progress Bar Component
const ProgressBar = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-center mb-4">
        <div className="relative flex items-center">
          {/* Background line */}
          <div className="absolute left-5 right-5 h-0.5 bg-gray-200 top-1/2 transform -translate-y-1/2"></div>
          
          {/* Progress line */}
          <div 
            className="absolute left-5 h-0.5 bg-primary-600 top-1/2 transform -translate-y-1/2 transition-all duration-500"
            style={{ 
              width: `${Math.min(((currentStep - 1) / (STEPS.length - 1)) * 80, 80)}%`
            }}
          ></div>
          
          {/* Step circles */}
          <div className="relative flex items-center space-x-16">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm relative z-10 transition-all duration-300
                  ${currentStep >= step.id 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : currentStep === step.id - 1
                    ? 'bg-primary-100 border-primary-300 text-primary-600'
                    : 'bg-white border-gray-300 text-gray-500'
                  }
                `}
              >
                {currentStep > step.id ? '✓' : step.id}
        </div>
            ))}
        </div>
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {STEPS[currentStep - 1]?.icon} {STEPS[currentStep - 1]?.title}
        </h2>
        <p className="text-slate-600">{STEPS[currentStep - 1]?.description}</p>
      </div>
    </div>
  )
}

// Step 1: Template Selection
const TemplateStep = ({ 
  selectedTemplate, 
  onTemplateSelect 
}: { 
  selectedTemplate: string
  onTemplateSelect: (templateId: string) => void 
}) => {
  const [allTemplates, setAllTemplates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAllTemplates = async () => {
      try {
        setIsLoading(true)
        
        // Get built-in templates
        const builtInTemplates = templates
        
        // Fetch community templates
        const response = await fetch('/api/templates')
        let communityTemplates = []
        
        if (response.ok) {
          const data = await response.json()
          communityTemplates = (data.templates || []).map((template: any) => ({
            ...template,
            id: template.id || template._id // Ensure we have an id field
          }))
          console.log('🌐 Community templates:', communityTemplates.map((t: any) => ({ id: t.id, name: t.name })))
        }
        
        const combinedTemplates = [...builtInTemplates, ...communityTemplates]
        console.log('📋 All fetched templates:', combinedTemplates.map((t: any) => ({ id: t.id, name: t.name })))
        setAllTemplates(combinedTemplates)
      } catch (error) {
        console.error('Error fetching templates:', error)
        setAllTemplates(templates) // Fallback to built-in only
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllTemplates()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Choose Your Perfect Template</h3>
          <p className="text-slate-600">Loading available templates...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4].map((i) => (
            <div key={i} className="border-2 border-gray-200 rounded-xl p-6 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Choose Your Perfect Template</h3>
        <p className="text-slate-600">Select a design that represents your professional style</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTemplates.map((template) => (
          <div 
            key={template.id}
            className={`
              border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg
              ${selectedTemplate === template.id 
                ? 'border-primary-500 bg-primary-50 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => {
              console.log('🖱️ Template clicked:', template.id, template.name)
              if (template.id) {
                onTemplateSelect(template.id)
              } else {
                console.error('❌ Template has no ID:', template)
              }
            }}
          >
            {/* Mini Preview */}
            <div className="h-64 bg-gray-50 rounded-lg mb-4 relative overflow-hidden">
              {template.htmlTemplate ? (
                // Community Template Preview
                <div 
                  className="w-full h-full transform scale-[0.4] origin-top-left"
                  style={{ width: '250%', height: '250%' }}
                  dangerouslySetInnerHTML={{
                    __html: (() => {
                      try {
                        const sampleData = getSampleResumeData()
                        return renderTemplate(template.htmlTemplate, template.cssStyles || '', sampleData, true)
    } catch (error) {
                        console.error('Template preview error:', error)
                        return `<div style="padding: 20px; text-align: center; color: #666; font-family: Arial;">
                          <div style="font-size: 24px; margin-bottom: 8px;">📄</div>
                          <div>Preview unavailable</div>
                        </div>`
                      }
                    })()
                  }}
                />
              ) : (
                // Built-in Template Preview
                <div className="absolute inset-0 p-3" style={{ backgroundColor: (template.colors?.primary || '#000') + '10' }}>
                  <div className="bg-white p-3 rounded shadow-sm h-full">
                    <div className="border-b pb-2 mb-2" style={{ borderColor: template.colors?.accent || '#ccc' }}>
                      <div className="h-3 rounded mb-2" style={{ backgroundColor: template.colors?.primary || '#000', width: '70%' }}></div>
                      <div className="h-2 rounded" style={{ backgroundColor: template.colors?.secondary || '#666', width: '50%' }}></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 rounded" style={{ backgroundColor: template.colors?.accent || '#ccc', width: '90%' }}></div>
                      <div className="h-2 rounded" style={{ backgroundColor: template.colors?.accent || '#ccc', width: '75%' }}></div>
                      <div className="h-2 rounded" style={{ backgroundColor: template.colors?.accent || '#ccc', width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
            <p className="text-slate-600 text-sm mb-3">{template.description}</p>
            
            {template.colors && (
              <div className="flex space-x-2 mb-3">
                {Object.values(template.colors).slice(0, 4).map((color: any, index: number) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
            )}
            
            {selectedTemplate === template.id && (
              <div className="flex items-center text-primary-600 font-medium text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Selected
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Step 2: Personal Information
const PersonalInfoStep = ({ 
    personalInfo,
  updatePersonalInfo 
}: { 
  personalInfo: PersonalInfo
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void 
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Tell Us About Yourself</h3>
        <p className="text-slate-600">Let's start with your basic information</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
          <input
            type="text"
            placeholder="e.g. John Doe"
            value={personalInfo.name}
            onChange={(e) => updatePersonalInfo('name', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
            <input
              type="email"
              placeholder="e.g. john@example.com"
              value={personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. (555) 123-4567"
              value={personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
          <input
            type="text"
            placeholder="e.g. New York, NY"
            value={personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Professional Summary</label>
          <textarea
            placeholder="Briefly describe your professional background and goals..."
            value={personalInfo.summary}
            onChange={(e) => updatePersonalInfo('summary', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300 resize-none"
          />
          <p className="text-sm text-slate-500 mt-2">2-3 sentences highlighting your key strengths and career objectives</p>
        </div>
      </div>
    </div>
  )
}

// Step 3: Work Experience
const ExperienceStep = ({ 
  experiences, 
  updateExperience,
  addExperience,
  removeExperience
}: { 
  experiences: Experience[]
  updateExperience: (index: number, field: keyof Experience, value: string) => void
  addExperience: () => void
  removeExperience: (index: number) => void
}) => {
        return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Your Work Experience</h3>
        <p className="text-slate-600">Add your work history, starting with your most recent position</p>
              </div>
              
      <div className="space-y-6">
        {experiences.map((experience, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-slate-800">
                {experience.position || `Position ${index + 1}`}
              </h4>
                    {experiences.length > 1 && (
                      <button
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                      >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                      </button>
                    )}
                  </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Job Title *</label>
                    <input
                      type="text"
                  placeholder="e.g. Software Engineer"
                  value={experience.position}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Company *</label>
                    <input
                      type="text"
                  placeholder="e.g. Tech Corp"
                  value={experience.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                    <input
                  type="month"
                  value={experience.startDate}
                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                    <input
                  type="month"
                  value={experience.endDate}
                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                  placeholder="Leave blank if current"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                    />
                  </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Job Description</label>
                  <textarea
                placeholder="Describe your key responsibilities and achievements..."
                value={experience.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>
            </div>
        ))}

                <button
          onClick={addExperience}
          className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 text-slate-600 hover:border-primary-400 hover:text-primary-600 transition-all duration-300"
                >
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Another Position
                </button>
              </div>
    </div>
  )
}

// Step 4: Education
const EducationStep = ({ 
  education, 
  updateEducation,
  addEducation,
  removeEducation
}: { 
  education: Education[]
  updateEducation: (index: number, field: keyof Education, value: string) => void
  addEducation: () => void
  removeEducation: (index: number) => void
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Your Education</h3>
        <p className="text-slate-600">Add your educational background and qualifications</p>
      </div>

      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-slate-800">
                {edu.degree || `Education ${index + 1}`}
              </h4>
                    {education.length > 1 && (
                      <button
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                      >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                      </button>
                    )}
                  </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">School/University *</label>
                    <input
                      type="text"
                  placeholder="e.g. University of Technology"
                      value={edu.school}
                  onChange={(e) => updateEducation(index, 'school', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                    />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Degree *</label>
                    <input
                      type="text"
                  placeholder="e.g. Bachelor of Science"
                      value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Field of Study</label>
                    <input
                      type="text"
                  placeholder="e.g. Computer Science"
                      value={edu.field}
                  onChange={(e) => updateEducation(index, 'field', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                    />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Graduation Date</label>
                    <input
                  type="month"
                      value={edu.graduationDate}
                  onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                    />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">GPA (Optional)</label>
                    <input
                      type="text"
                placeholder="e.g. 3.8/4.0"
                      value={edu.gpa}
                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
              ))}

                <button
          onClick={addEducation}
          className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 text-slate-600 hover:border-primary-400 hover:text-primary-600 transition-all duration-300"
                >
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Another Education
                </button>
              </div>
    </div>
  )
}

// Step 5: Skills
const SkillsStep = ({ 
  skills, 
  updateSkill,
  addSkill,
  removeSkill
}: { 
  skills: Skill[]
  updateSkill: (index: number, field: keyof Skill, value: string) => void
  addSkill: () => void
  removeSkill: (index: number) => void
}) => {
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Your Skills</h3>
        <p className="text-slate-600">Showcase your technical and soft skills</p>
      </div>

      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                    <input
                      type="text"
                  placeholder="e.g. JavaScript, Project Management, Communication"
                      value={skill.name}
                  onChange={(e) => updateSkill(index, 'name', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                    />
              </div>

              <div className="w-40">
                    <select
                      value={skill.level}
                  onChange={(e) => updateSkill(index, 'level', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                >
                  {skillLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                    </select>
              </div>

                    {skills.length > 1 && (
                      <button
                  onClick={() => removeSkill(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                      >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                      </button>
                    )}
            </div>

            {/* Skill level visual indicator */}
            <div className="mt-3 flex items-center space-x-3">
              <span className="text-sm font-medium text-slate-700 w-24 flex-shrink-0">{skill.level}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${
                      skill.level === 'Beginner' ? '25%' :
                      skill.level === 'Intermediate' ? '50%' :
                      skill.level === 'Advanced' ? '75%' : '100%'
                    }` 
                  }}
                ></div>
              </div>
            </div>
                  </div>
                ))}

        <button
          onClick={addSkill}
          className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 text-slate-600 hover:border-primary-400 hover:text-primary-600 transition-all duration-300"
        >
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Another Skill
        </button>
              </div>
            </div>
  )
}

// Template Selection Modal Component
const TemplateSelectionModal = ({
  isOpen,
  onClose,
  resumeData,
  currentTemplate,
  onTemplateChange,
  previewTemplate,
  setPreviewTemplate
}: {
  isOpen: boolean
  onClose: () => void
  resumeData: ResumeData
  currentTemplate: string
  onTemplateChange: (templateId: string) => void
  previewTemplate: string | null
  setPreviewTemplate: (template: string | null) => void
}) => {
  const [allTemplates, setAllTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Fetch all templates when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAllTemplates()
    }
  }, [isOpen])

  const fetchAllTemplates = async () => {
    setLoading(true)
    try {
      // Start with built-in templates
      let allTemplatesList = [...templates]
      
      // Fetch marketplace/custom templates
      try {
        console.log('Fetching community templates...')
        const response = await fetch('/api/templates?limit=100')
      if (response.ok) {
          const data = await response.json()
          console.log('API Response:', data)
          
          // Extract templates from the nested structure
          const marketplaceTemplates = data.templates || []
          console.log('Found marketplace templates:', marketplaceTemplates.length)
          
          // Transform marketplace templates to match our template interface
          const transformedTemplates = marketplaceTemplates.map((template: any) => ({
            id: template._id,
            name: template.name,
            description: template.description,
            category: template.category,
            colors: template.colors || {
              primary: '#2563eb',
              secondary: '#1e40af', 
              text: '#1f2937',
              accent: '#3b82f6'
            },
            htmlTemplate: template.htmlTemplate,
            cssStyles: template.cssStyles,
            isPremium: template.price > 0,
            price: template.price,
            creatorName: template.creatorName,
            downloads: template.downloads,
            rating: template.rating
          }))
          
          allTemplatesList = [...allTemplatesList, ...transformedTemplates]
          console.log('Total templates loaded:', allTemplatesList.length)
      } else {
          console.error('Failed to fetch templates:', response.status)
      }
    } catch (error) {
        console.error('Error fetching marketplace templates:', error)
      }
      
      setAllTemplates(allTemplatesList)
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', 'classic', 'modern', 'creative', 'minimal']

  const getPreviewData = () => {
    const templateToPreview = previewTemplate || currentTemplate
    return { ...resumeData, template: templateToPreview }
  }

  const getPreviewTemplate = () => {
    const templateToPreview = previewTemplate || currentTemplate
    // First check if it's a community template
    const communityTemplate = allTemplates.find(t => t.id === templateToPreview)
    if (communityTemplate && communityTemplate.htmlTemplate) {
      return communityTemplate
    }
    // Fall back to built-in template
    return getTemplate(templateToPreview)
  }

  const renderCommunityTemplate = (template: any, data: any) => {
    if (!template.htmlTemplate) return null

    try {
      // Use the same renderTemplate function that's used everywhere else
      return renderTemplate(template.htmlTemplate, template.cssStyles || '', data, true)
    } catch (error) {
      console.error('Error rendering community template:', error)
      return '<p>Error rendering template</p>'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Choose Your Template</h3>
            <p className="text-gray-600">Select a template and see how your resume looks</p>
          </div>
              <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
              </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {categories.map(category => (
            <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    selectedCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
            </button>
              ))}
          </div>
        </div>
              </div>
              
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Templates List */}
          <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-200">
                         {loading ? (
               <div className="flex items-center justify-center h-64">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
               </div>
             ) : filteredTemplates.length === 0 ? (
               <div className="flex items-center justify-center h-64 text-center">
                 <div>
                   <p className="text-gray-500 mb-2">No templates found</p>
                   <p className="text-sm text-gray-400">
                     {searchTerm || selectedCategory !== 'all' 
                       ? 'Try adjusting your search or filters'
                       : `Total templates loaded: ${allTemplates.length}`
                     }
                   </p>
                 </div>
               </div>
             ) : (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      (previewTemplate || currentTemplate) === template.id
                        ? 'border-primary-500 bg-primary-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onMouseEnter={() => setPreviewTemplate(template.id)}
                    onMouseLeave={() => setPreviewTemplate(null)}
                    onClick={() => {
                      onTemplateChange(template.id)
                      setPreviewTemplate(null)
                      onClose()
                    }}
                  >
                    {/* Template Preview */}
                    <div className="h-32 bg-gray-50 rounded-lg mb-3 relative overflow-hidden">
                      <div className="absolute inset-0 p-2" style={{ backgroundColor: template.colors.primary + '10' }}>
                        <div className="bg-white p-2 rounded shadow-sm h-full">
                          <div className="border-b pb-1 mb-1" style={{ borderColor: template.colors.accent }}>
                            <div className="h-2 rounded mb-1" style={{ backgroundColor: template.colors.primary, width: '70%' }}></div>
                            <div className="h-1 rounded" style={{ backgroundColor: template.colors.secondary, width: '50%' }}></div>
                          </div>
                          <div className="space-y-1">
                            <div className="h-1 rounded" style={{ backgroundColor: template.colors.accent, width: '90%' }}></div>
                            <div className="h-1 rounded" style={{ backgroundColor: template.colors.accent, width: '75%' }}></div>
                            <div className="h-1 rounded" style={{ backgroundColor: template.colors.accent, width: '85%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-lg mb-1">{template.name}</h4>
                    <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                    
                    {/* Color Swatches */}
                    <div className="flex space-x-2 mb-3">
                      {Object.values(template.colors).slice(0, 4).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: color as string }}
                        ></div>
                      ))}
                    </div>
                    
                    {/* Status Indicators */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {template.category && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">
                            {template.category}
                          </span>
                        )}
                        {template.isPremium && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                            Premium
                          </span>
                        )}
                      </div>
                      
                      {(previewTemplate || currentTemplate) === template.id && (
                        <div className="flex items-center text-primary-600 font-medium text-sm">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {currentTemplate === template.id ? 'Current' : 'Preview'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>

          {/* Live Preview */}
          <div className="w-1/2 p-6 bg-gray-50">
            <div className="h-full flex flex-col">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Live Preview</h4>
                <p className="text-gray-600 text-sm">
                  {previewTemplate ? 'Hover preview' : 'Current template'} • {getPreviewTemplate()?.name}
                </p>
              </div>
              
              <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 h-[700px]">
                <div className="transform scale-75 origin-top-left w-[133%]">
                  {/* Live Resume Preview */}
                  {getPreviewTemplate()?.htmlTemplate ? (
                    // Community Template Preview
                    <div 
                      className="bg-white"
                      dangerouslySetInnerHTML={{
                        __html: `
                          <style>${getPreviewTemplate()?.cssStyles || ''}</style>
                          ${renderCommunityTemplate(getPreviewTemplate(), getPreviewData())}
                        `
                      }}
                    />
                  ) : (
                    // Built-in Template Preview
                    <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                      {/* Header Section */}
                      <div className="border-b pb-4 mb-4" style={{ borderColor: getPreviewTemplate()?.colors?.accent }}>
                        <h1 className="text-3xl font-bold mb-2" style={{ color: getPreviewTemplate()?.colors?.primary }}>
                          {getPreviewData().personalInfo.name || 'Your Name'}
                        </h1>
                        <div className="text-sm space-y-1" style={{ color: getPreviewTemplate()?.colors?.text }}>
                          {getPreviewData().personalInfo.email && (
                            <p>📧 {getPreviewData().personalInfo.email}</p>
                          )}
                          {getPreviewData().personalInfo.phone && (
                            <p>📱 {getPreviewData().personalInfo.phone}</p>
                          )}
                          {getPreviewData().personalInfo.location && (
                            <p>📍 {getPreviewData().personalInfo.location}</p>
                          )}
                        </div>
                        </div>
                        
                      {/* Summary */}
                      {getPreviewData().personalInfo.summary && (
                        <div className="mb-4">
                          <h2 className="text-xl font-semibold mb-2" style={{ color: getPreviewTemplate()?.colors?.primary }}>
                            Professional Summary
                          </h2>
                          <p className="text-sm leading-relaxed" style={{ color: getPreviewTemplate()?.colors?.text }}>
                            {getPreviewData().personalInfo.summary.length > 150 
                              ? getPreviewData().personalInfo.summary.substring(0, 150) + '...'
                              : getPreviewData().personalInfo.summary
                            }
                          </p>
                        </div>
                      )}

                      {/* Experience */}
                      {getPreviewData().experiences.filter(exp => exp.position).length > 0 && (
                        <div className="mb-4">
                          <h2 className="text-xl font-semibold mb-3" style={{ color: getPreviewTemplate()?.colors?.primary }}>
                            Work Experience
                          </h2>
                          <div className="space-y-3">
                            {getPreviewData().experiences.filter(exp => exp.position).slice(0, 2).map((exp, index) => (
                              <div key={index} className="text-sm">
                                <div className="font-semibold text-lg" style={{ color: getPreviewTemplate()?.colors?.secondary }}>
                                  {exp.position}
                                </div>
                                <div className="font-medium text-gray-700">{exp.company}</div>
                                <div className="text-gray-500 text-xs mb-1">
                                  {exp.startDate} - {exp.endDate || 'Present'}
                                </div>
                                {exp.description && (
                                  <div className="text-gray-600 text-xs">
                                    {exp.description.length > 100 
                                      ? exp.description.substring(0, 100) + '...'
                                      : exp.description
                                    }
                                  </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

                      {/* Education */}
                      {getPreviewData().education.filter(edu => edu.degree).length > 0 && (
                        <div className="mb-4">
                          <h2 className="text-xl font-semibold mb-3" style={{ color: getPreviewTemplate()?.colors?.primary }}>
                            Education
                          </h2>
                          <div className="space-y-2">
                            {getPreviewData().education.filter(edu => edu.degree).slice(0, 2).map((edu, index) => (
                              <div key={index} className="text-sm">
                                <div className="font-semibold" style={{ color: getPreviewTemplate()?.colors?.secondary }}>
                                  {edu.degree} {edu.field && `in ${edu.field}`}
                                </div>
                                <div className="text-gray-700">{edu.school}</div>
                                {edu.graduationDate && <div className="text-gray-500 text-xs">{edu.graduationDate}</div>}
                              </div>
                            ))}
            </div>
          </div>
        )}

                      {/* Skills */}
                      {getPreviewData().skills.filter(skill => skill.name).length > 0 && (
                        <div>
                          <h2 className="text-xl font-semibold mb-3" style={{ color: getPreviewTemplate()?.colors?.primary }}>
                            Skills
                          </h2>
                          <div className="grid grid-cols-2 gap-2">
                            {getPreviewData().skills.filter(skill => skill.name).slice(0, 6).map((skill, index) => (
                              <div key={index} className="text-sm">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium" style={{ color: getPreviewTemplate()?.colors?.text }}>
                                    {skill.name}
                                  </span>
                                  <span className="text-xs text-gray-500">{skill.level}</span>
            </div>
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                  <div 
                                    className="h-1 rounded-full"
                                    style={{ 
                                      backgroundColor: getPreviewTemplate()?.colors?.accent,
                                      width: `${
                                        skill.level === 'Beginner' ? '25%' :
                                        skill.level === 'Intermediate' ? '50%' :
                                        skill.level === 'Advanced' ? '75%' : '100%'
                                      }` 
                                    }}
                ></div>
                                </div>
                              </div>
              ))}
            </div>
          </div>
                      )}
        </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 6: Review & Complete
const ReviewStep = ({ 
  resumeData,
  selectedTemplate,
  onSave,
  onExport,
  onTemplateChange,
  showTemplateModal,
  setShowTemplateModal,
  previewTemplate,
  setPreviewTemplate,
  isLoading = false,
  saveMessage = ''
}: { 
  resumeData: ResumeData
  selectedTemplate: any
  onSave: () => Promise<void>
  onExport: () => Promise<void>
  onTemplateChange: (templateId: string) => void
  showTemplateModal: boolean
  setShowTemplateModal: (show: boolean) => void
  previewTemplate: string | null
  setPreviewTemplate: (template: string | null) => void
  isLoading?: boolean
  saveMessage?: string
}) => {
  
  console.log('🎨 ReviewStep received template:', selectedTemplate)
  console.log('🎨 Template has htmlTemplate?', !!selectedTemplate?.htmlTemplate)
  console.log('🎨 Template has colors?', !!selectedTemplate?.colors)
  const getCompletionPercentage = () => {
    let totalFields = 0
    let filledFields = 0

    // Personal Info (5 fields, 3 required)
    totalFields += 5
    filledFields += Object.values(resumeData.personalInfo).filter(Boolean).length

    // Experience
    resumeData.experiences.forEach(exp => {
      totalFields += 5
      filledFields += Object.values(exp).filter(Boolean).length
    })

    // Education
    resumeData.education.forEach(edu => {
      totalFields += 5
      filledFields += Object.values(edu).filter(Boolean).length
    })

    // Skills
    resumeData.skills.forEach(skill => {
      totalFields += 2
      filledFields += skill.name ? 2 : 0 // Count both name and level if name exists
    })

    return Math.min(Math.round((filledFields / totalFields) * 100), 100)
  }

  const completionPercentage = getCompletionPercentage()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Review Your Resume</h3>
        <p className="text-slate-600">Take a final look and make sure everything looks perfect</p>
                </div>

      {/* Completion Status */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-primary-800">Resume Completion</h4>
          <span className="text-2xl font-bold text-primary-600">{completionPercentage}%</span>
              </div>
        <div className="w-full bg-primary-200 rounded-full h-3">
          <div 
            className="bg-primary-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-primary-700 mt-2">
          {completionPercentage === 100 
            ? "Perfect! Your resume is complete and ready to download." 
            : "Consider filling in more details to make your resume stand out."
          }
        </p>
            </div>

            {/* Template Selector */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center mr-3 text-sm">🎨</span>
            <div>
              <h4 className="text-lg font-semibold text-slate-800">Current Template</h4>
              <p className="text-slate-600 text-sm">{selectedTemplate?.name || selectedTemplate?.template?.name || 'Classic Professional'}</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowTemplateModal(true)}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
            <span>Change Template</span>
          </button>
        </div>
        
                 {/* Current Template Preview */}
         <div className="flex justify-center space-x-2 mt-2">
           {selectedTemplate?.colors && Object.values(selectedTemplate.colors).slice(0, 4).map((color, index) => (
             <div
               key={index}
               className="w-4 h-4 rounded-full border border-gray-200"
               style={{ backgroundColor: color as string }}
             ></div>
           ))}
              </div>
            </div>

      {/* Resume Preview Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column - Summary */}
        <div className="space-y-6">
          {/* Personal Info Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 text-sm">👤</span>
              Personal Information
            </h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {resumeData.personalInfo.name || 'Not provided'}</p>
              <p><span className="font-medium">Email:</span> {resumeData.personalInfo.email || 'Not provided'}</p>
              <p><span className="font-medium">Phone:</span> {resumeData.personalInfo.phone || 'Not provided'}</p>
              <p><span className="font-medium">Location:</span> {resumeData.personalInfo.location || 'Not provided'}</p>
              {resumeData.personalInfo.summary && (
                <p><span className="font-medium">Summary:</span> {resumeData.personalInfo.summary.substring(0, 100)}...</p>
              )}
            </div>
          </div>

          {/* Experience Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3 text-sm">💼</span>
              Work Experience ({resumeData.experiences.filter(exp => exp.position).length})
            </h4>
            <div className="space-y-3">
              {resumeData.experiences.filter(exp => exp.position).slice(0, 3).map((exp, index) => (
                <div key={index} className="text-sm">
                  <p className="font-medium">{exp.position} at {exp.company}</p>
                  <p className="text-slate-600">{exp.startDate} - {exp.endDate || 'Present'}</p>
              </div>
            ))}
              {resumeData.experiences.filter(exp => exp.position).length > 3 && (
                <p className="text-sm text-slate-500">...and {resumeData.experiences.filter(exp => exp.position).length - 3} more</p>
              )}
            </div>
          </div>

          {/* Education Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-3 text-sm">🎓</span>
              Education ({resumeData.education.filter(edu => edu.degree).length})
            </h4>
            <div className="space-y-3">
              {resumeData.education.filter(edu => edu.degree).map((edu, index) => (
                <div key={index} className="text-sm">
                  <p className="font-medium">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                  <p className="text-slate-600">{edu.school}</p>
                  {edu.graduationDate && <p className="text-slate-500">{edu.graduationDate}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Skills Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mr-3 text-sm">⚡</span>
              Skills ({resumeData.skills.filter(skill => skill.name).length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.filter(skill => skill.name).map((skill, index) => (
                <span key={index} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                  {skill.name} - {skill.level}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Live Template Preview */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
            <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center mr-3 text-sm">🎨</span>
            Live Preview
          </h4>
          
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            {/* A4 Page Container with proper aspect ratio */}
            <div className="space-y-4">
                            <div 
                className="bg-white border-2 border-gray-300 shadow-lg mx-auto relative overflow-hidden"
                style={{ 
                  width: '318px',  // A4 width scaled to 40% (794 * 0.4)
                  height: '449px', // A4 height scaled to 40% (1123 * 0.4)
                  aspectRatio: '210 / 297' // Exact A4 aspect ratio
                }}
              >
                              {(selectedTemplate?.htmlTemplate || selectedTemplate?.template?.htmlTemplate) ? (
                  // Community Template Preview - A4 Scale
                  <div 
                    className="w-full h-full transform scale-[0.4] origin-top-left overflow-hidden"
                    style={{ 
                      width: '250%',  // 100% / 0.4 scale
                      height: '250%'  // 100% / 0.4 scale
                    }}
                    dangerouslySetInnerHTML={{
                  __html: (() => {
                          const htmlTemplate = selectedTemplate?.htmlTemplate || selectedTemplate?.template?.htmlTemplate
                          const cssStyles = selectedTemplate?.cssStyles || selectedTemplate?.template?.cssStyles || ''
                          
                          if (!htmlTemplate) return '<p>Template not available</p>'
                          
                          try {
                            // Use the same renderTemplate function that's used everywhere else
                            return renderTemplate(htmlTemplate, cssStyles, resumeData, false)
                        } catch (error) {
                            console.error('Error rendering community template:', error)
                            return '<p>Error rendering template</p>'
                          }
                        })()
                    }}
                  />
                ) : (
                  // Built-in Template Preview
                  <div className="absolute inset-0 p-6" style={{ backgroundColor: (selectedTemplate?.colors?.primary || '#000') + '10' }}>
                    <div className="bg-white p-4 rounded shadow-sm h-full">
                      <div className="border-b pb-3 mb-3" style={{ borderColor: selectedTemplate?.colors?.accent || '#ccc' }}>
                        <div className="h-4 rounded mb-3" style={{ backgroundColor: selectedTemplate?.colors?.primary || '#000', width: '70%' }}></div>
                        <div className="h-3 rounded" style={{ backgroundColor: selectedTemplate?.colors?.secondary || '#666', width: '50%' }}></div>
                  </div>
                      <div className="space-y-3">
                        <div className="h-3 rounded" style={{ backgroundColor: selectedTemplate?.colors?.accent || '#ccc', width: '90%' }}></div>
                        <div className="h-3 rounded" style={{ backgroundColor: selectedTemplate?.colors?.accent || '#ccc', width: '75%' }}></div>
                        <div className="h-3 rounded" style={{ backgroundColor: selectedTemplate?.colors?.accent || '#ccc', width: '85%' }}></div>
                        <div className="h-3 rounded" style={{ backgroundColor: selectedTemplate?.colors?.accent || '#ccc', width: '60%' }}></div>
                        <div className="h-3 rounded" style={{ backgroundColor: selectedTemplate?.colors?.accent || '#ccc', width: '80%' }}></div>
                    </div>
                    </div>
                </div>
              )}
              </div>
              
              {/* A4 Page Label */}
                            <div className="text-center text-sm text-gray-500 flex items-center justify-center space-x-2">
                <span>📄 A4 Size (210 × 297 mm)</span>
                <span>•</span>
                <span className="text-blue-600 font-medium">40% Scale</span>
              </div>
                              </div>
                            </div>
          
          <div className="mt-3 text-center">
            {selectedTemplate?.colors && (
              <div className="flex justify-center space-x-2">
                {Object.values(selectedTemplate.colors).slice(0, 4).map((color: any, index: number) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                  ></div>
                        ))}
                      </div>
                                )}
                              </div>
                            </div>
                      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`text-center rounded-lg p-4 mb-4 ${
          saveMessage.includes('✅') 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <p className="font-medium">{saveMessage}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={onSave}
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            'Save Resume'
          )}
        </button>

        <button
          onClick={onExport}
          disabled={isLoading || completionPercentage < 50}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Downloading...
            </span>
          ) : (
            'Download PDF'
          )}
        </button>
                              </div>

      {completionPercentage < 50 && (
        <div className="text-center text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm">⚠️ Complete at least 50% of your resume to enable PDF download</p>
                            </div>
      )}
                      </div>
                    )
}

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
    const initialTemplate = searchParams.get('template') || searchParams.get('customTemplate') || 'classic'
    console.log('📄 Initializing with template:', initialTemplate)
    
    return {
      personalInfo: { name: '', email: '', phone: '', location: '', summary: '' },
      experiences: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
      education: [{ school: '', degree: '', field: '', graduationDate: '', gpa: '' }],
      skills: [{ name: '', level: 'Intermediate' }],
      template: initialTemplate
    }
  })
  
  console.log('📄 Current resumeData.template:', resumeData.template)

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

  const [isLoading, setIsLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [isLoadingResume, setIsLoadingResume] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)
  const [selectedTemplateData, setSelectedTemplateData] = useState<any>(null)

  // Function to fetch full template data
  const fetchTemplateData = async (templateId: string) => {
    if (!templateId || templateId === 'undefined') {
      console.log('❌ Invalid templateId:', templateId)
      setSelectedTemplateData(getTemplate('classic'))
      return
    }
    
    console.log('🔍 Fetching template data for:', templateId)
    try {
      // First check if it's a built-in template
      const builtInTemplate = getTemplate(templateId)
      console.log('📦 Built-in template check:', builtInTemplate)
      
      if (builtInTemplate && builtInTemplate.id === templateId) {
        console.log('✅ Using built-in template:', builtInTemplate)
        setSelectedTemplateData(builtInTemplate)
        return
      }

      // If not built-in, fetch from API
      console.log('🌐 Fetching community template from API...')
      const response = await fetch(`/api/templates/${templateId}`)
      if (response.ok) {
        const data = await response.json()
        const template = data.template // Extract template from wrapped response
        console.log('✅ Community template fetched:', template)
        console.log('✅ Has htmlTemplate?', !!template.htmlTemplate)
        console.log('✅ Has cssStyles?', !!template.cssStyles)
        setSelectedTemplateData(template)
      } else {
        console.log('❌ API fetch failed, using fallback')
        // Fallback to built-in template
        setSelectedTemplateData(getTemplate('classic'))
      }
    } catch (error) {
      console.error('Error fetching template data:', error)
      setSelectedTemplateData(getTemplate('classic'))
    }
  }

  // Initialize template data when component mounts
  useEffect(() => {
    const initialTemplate = searchParams.get('template') || searchParams.get('customTemplate') || resumeData.template || 'classic'
    console.log('🚀 Component mounted, fetching template:', initialTemplate)
    fetchTemplateData(initialTemplate)
  }, []) // Only run once on mount

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
    setSaveMessage('') // Clear any previous messages
    try {
      console.log('Loading resume with ID:', resumeId)
      const response = await fetch(`/api/resumes/${resumeId}`)
      
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers.get('content-type'))

      if (response.ok) {
        const text = await response.text()
        console.log('Raw response text:', text)
        
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
        
        console.log('Loaded resume data:', resume)
        
        // Preserve template from URL params if present, otherwise use resume template
        const templateToUse = searchParams.get('template') || searchParams.get('customTemplate') || resume.template || 'classic'
        console.log('🔄 Loading resume, using template:', templateToUse)
        
        // Populate the form with existing data
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
        
        console.log('Form populated successfully')
      } else {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        
        let errorMessage = 'Failed to load resume data'
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.error || errorMessage
        } catch {
          // If error response isn't JSON, use the text
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
      // Check if we have minimum required data
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
        isDraft: !hasMinimumData // Save as draft if not complete enough
      }

      console.log('Saving resume with payload:', payload)

      // Use PUT for updates, POST for new resumes
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
        
        // If this was a new resume, set edit mode for future saves
        if (!isEditMode && result._id) {
          setIsEditMode(true)
          setEditingResumeId(result._id)
          // Update URL to include the ID for future saves
          const newUrl = new URL(window.location.href)
          newUrl.searchParams.set('id', result._id)
          window.history.replaceState({}, '', newUrl.toString())
        }
        
        // Redirect to dashboard after 2 seconds
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
      // Check if we have minimum required data for PDF export
      const hasRequiredData = resumeData.personalInfo.name && 
                             resumeData.personalInfo.email && 
                             resumeData.personalInfo.phone && 
                             resumeData.personalInfo.location &&
                             resumeData.experiences.some(exp => exp.position && exp.company && exp.startDate && exp.endDate && exp.description)

      if (!hasRequiredData) {
        throw new Error('Please complete all required fields (personal info and at least one complete work experience) before exporting PDF')
      }

      // First save the resume
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
        isDraft: false // Always publish when exporting PDF
      }

      console.log('Saving resume for PDF export:', payload)

      // Use PUT for updates, POST for new resumes
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
      
      // Use existing resume ID if in edit mode, otherwise use the newly created one
      const resumeIdForPdf = isEditMode && editingResumeId ? editingResumeId : savedResume._id
      
      // Generate PDF
      const pdfResponse = await fetch(`/api/resumes/${resumeIdForPdf}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (pdfResponse.ok) {
        const contentType = pdfResponse.headers.get('Content-Type')
        
        if (contentType?.includes('text/html')) {
          // Community template - HTML response that needs to be converted to PDF
          console.log('🔍 Received HTML for community template PDF')
          const htmlContent = await pdfResponse.text()
          const resumeTitle = pdfResponse.headers.get('X-Resume-Title') || 'Resume'
          
          // Create a new window/iframe for PDF generation
          const printWindow = window.open('', '_blank')
          if (printWindow) {
            // Add enhanced HTML with auto-configuration
            const enhancedHtml = htmlContent.replace(
              '</head>',
              `
              <script>
                window.onload = function() {
                  // Auto-configure print settings for A4
                  setTimeout(() => {
                    // Trigger print with optimal settings
                    if (window.print) {
                      window.print();
                    }
                    // Close window after print dialog
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
            
            setSaveMessage('✅ PDF print dialog opened! Settings automatically configured:\n• Paper size: A4\n• Margins: None\n• Select "Save as PDF" as destination')
          } else {
            // Fallback: create a downloadable HTML file
            const blob = new Blob([htmlContent], { type: 'text/html' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${resumeTitle}.html`
            document.body.appendChild(link)
            link.click()
            
            window.URL.revokeObjectURL(url)
            document.body.removeChild(link)
            
            setSaveMessage('✅ HTML file downloaded! Open it in your browser and use Ctrl+P to save as PDF.')
          }
        } else {
          // Built-in template - Direct PDF blob
          console.log('🔍 Received PDF blob for built-in template')
          const blob = await pdfResponse.blob()
          
          // Create download link
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${resumeData.personalInfo.name || 'Resume'}.pdf`
          document.body.appendChild(link)
          link.click()
          
          // Cleanup
          window.URL.revokeObjectURL(url)
          document.body.removeChild(link)
          
          setSaveMessage('✅ PDF downloaded successfully!')
        }
      } else {
        // Handle error response
        try {
          const errorData = await pdfResponse.json()
          console.error('PDF Error:', errorData)
          throw new Error(errorData.error || 'Failed to export PDF')
        } catch (jsonError) {
          // If JSON parsing fails, use response status text
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

  // Handle template change
  const handleTemplateChange = (templateId: string) => {
    console.log('🎯 Manually changing template to:', templateId)
    setResumeData(prev => ({ ...prev, template: templateId }))
    fetchTemplateData(templateId)
  }

  // Render Current Step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TemplateStep 
            selectedTemplate={resumeData.template}
            onTemplateSelect={handleTemplateChange}
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
            selectedTemplate={selectedTemplateData || getTemplate(resumeData.template || 'classic')}
            onSave={saveResume}
            onExport={exportPDF}
            onTemplateChange={handleTemplateChange}
            showTemplateModal={showTemplateModal}
            setShowTemplateModal={setShowTemplateModal}
            previewTemplate={previewTemplate}
            setPreviewTemplate={setPreviewTemplate}
            isLoading={isLoading}
            saveMessage={saveMessage}
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
          {/* Progress Bar */}
          <ProgressBar currentStep={currentStep} />

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {renderCurrentStep()}
          </div>

        {/* Navigation */}
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

        {/* Template Selection Modal */}
        <TemplateSelectionModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          resumeData={resumeData}
          currentTemplate={resumeData.template}
          onTemplateChange={handleTemplateChange}
          previewTemplate={previewTemplate}
          setPreviewTemplate={setPreviewTemplate}
        />
      </>
  )
} 