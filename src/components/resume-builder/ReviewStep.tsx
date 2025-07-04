import { useState } from 'react'
import { ResumeData, PersonalInfo, Experience, Education, Skill } from './types'
import { renderTemplate } from '@/lib/template-renderer'
import { sanitizeTemplateContent } from '@/lib/security'
import type { Template } from '@/lib/templates'
import { SkillDisplay } from './SkillDisplay'

interface ReviewStepProps {
  resumeData: ResumeData
  selectedTemplate: Template | null
  onSave: () => Promise<void>
  onExport: () => Promise<void>
  onChangeTemplate: () => void
  isLoading?: boolean
  saveMessage?: string
  // Add these new props for editing
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void
  updateExperience: (index: number, field: keyof Experience, value: string) => void
  addExperience: () => void
  removeExperience: (index: number) => void
  updateEducation: (index: number, field: keyof Education, value: string) => void
  addEducation: () => void
  removeEducation: (index: number) => void
  updateSkill: (index: number, field: keyof Skill, value: string) => void
  addSkill: () => void
  removeSkill: (index: number) => void
}

export const ReviewStep = ({ 
  resumeData,
  selectedTemplate,
  onSave,
  onExport,
  onChangeTemplate,
  isLoading = false,
  saveMessage = '',
  updatePersonalInfo,
  updateExperience,
  addExperience,
  removeExperience,
  updateEducation,
  addEducation,
  removeEducation,
  updateSkill,
  addSkill,
  removeSkill
}: ReviewStepProps) => {
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [aiModal, setAiModal] = useState<{ open: boolean; type: string }>({ open: false, type: '' })
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [aiResult, setAiResult] = useState('')

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
      filledFields += skill.name ? 2 : 0
    })

    return Math.min(Math.round((filledFields / totalFields) * 100), 100)
  }

  const getResumePreview = () => {
    try {
      if (selectedTemplate?.htmlTemplate && selectedTemplate?.cssStyles) {
        return renderTemplate(
          selectedTemplate.htmlTemplate, 
          selectedTemplate.cssStyles, 
          resumeData,
          true // Enable preview mode
        )
      }
      
      // Fallback to basic template if no template is selected
      const basicTemplate = `
        <div class="resume-document">
          <div class="header">
            <h1>{{personalInfo.name}}</h1>
            <div class="contact">
              <p>{{personalInfo.email}} | {{personalInfo.phone}} | {{personalInfo.location}}</p>
            </div>
            {{#if personalInfo.summary}}
            <div class="summary">
              <p>{{personalInfo.summary}}</p>
            </div>
            {{/if}}
          </div>
          
          {{#if experiences}}
          <div class="section">
            <h2>Experience</h2>
            {{#each experiences}}
            <div class="item">
              <div class="item-header">
                <h3>{{position}} at {{company}}</h3>
                <span class="dates">{{startDate}} - {{endDate}}</span>
              </div>
              <p>{{description}}</p>
            </div>
            {{/each}}
          </div>
          {{/if}}
          
          {{#if education}}
          <div class="section">
            <h2>Education</h2>
            {{#each education}}
            <div class="item">
              <h3>{{degree}}{{#if field}} in {{field}}{{/if}}</h3>
              <p>{{school}} | {{graduationDate}}{{#if gpa}} | GPA: {{gpa}}{{/if}}</p>
            </div>
            {{/each}}
          </div>
          {{/if}}
          
          {{#if skills}}
          <div class="section">
            <h2>Skills</h2>
            <div class="skills">
              {{#each skills}}
              <span class="skill">{{name}} ({{level}})</span>
              {{/each}}
            </div>
          </div>
          {{/if}}
        </div>
      `
      
      const basicCSS = `
        .resume-document {
          font-family: 'Times New Roman', serif;
          width: 210mm;  /* A4 width */
          height: 297mm; /* A4 height */
          margin: 0;
          padding: 20mm; /* Standard A4 margins */
          background: white;
          box-sizing: border-box;
          line-height: 1.4;
          overflow: hidden;
        }
        .header { text-align: center; margin-bottom: 1.5em; }
        .header h1 { margin: 0; font-size: 24px; }
        .contact { margin: 0.5em 0; }
        .summary { margin: 1em 0; font-style: italic; }
        .section { margin: 1.5em 0; }
        .section h2 { 
          font-size: 18px; 
          border-bottom: 2px solid #333; 
          padding-bottom: 0.25em;
          margin-bottom: 0.75em;
        }
        .item { margin: 1em 0; }
        .item-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: baseline;
          margin-bottom: 0.25em;
        }
        .item h3 { margin: 0; font-size: 16px; }
        .dates { font-style: italic; color: #666; }
        .skills { display: flex; flex-wrap: wrap; gap: 0.5em; }
        .skill { 
          background: #f0f0f0; 
          padding: 0.25em 0.5em; 
          border-radius: 4px;
          font-size: 14px;
        }
      `
      
      return renderTemplate(basicTemplate, basicCSS, resumeData, true)
    } catch (error) {
      console.error('Template preview error:', error)
      return '<div style="padding: 2rem; text-align: center; color: #666;"><h3>Preview Unavailable</h3><p>Unable to render resume preview</p></div>'
    }
  }

  const completionPercentage = getCompletionPercentage()

  const preview = getResumePreview()
  const previewHtml = typeof preview === 'string' ? sanitizeTemplateContent(preview, true) : sanitizeTemplateContent(preview.html, true)
  const previewCss = typeof preview === 'string' ? '' : preview.css || ''

  const handleAI = async (type: string) => {
    setAiLoading(true)
    setAiError('')
    setAiResult('')
    let url = ''
    let body: any = {}
    if (type === 'ats' || type === 'job-match') {
      url = '/api/ai/job-match'
      body = { resume: JSON.stringify(resumeData), jobDescription: '' } // Optionally allow user to paste job desc
    } else if (type === 'feedback') {
      url = '/api/ai/feedback'
      body = { sectionText: JSON.stringify(resumeData) }
    } else if (type === 'cover-letter') {
      url = '/api/ai/cover-letter'
      body = { resume: JSON.stringify(resumeData), jobDescription: '' }
    } else if (type === 'interview-prep') {
      url = '/api/ai/interview-prep'
      body = { resume: JSON.stringify(resumeData), jobDescription: '' }
    }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      setAiResult(data.result || data.coverLetter || data.feedback || data.suggestion || data.error || '')
      if (data.error) setAiError(data.error)
    } catch (e: any) {
      setAiError(e.message || 'AI error')
    } finally {
      setAiLoading(false)
    }
  }
  const openModal = (type: string) => {
    setAiModal({ open: true, type })
    setAiResult('')
    setAiError('')
    handleAI(type)
  }
  const closeModal = () => setAiModal({ open: false, type: '' })
  const regenerate = () => handleAI(aiModal.type)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center justify-center">
          <span className="text-2xl mr-2">✨</span>
          Review
        </h3>
        <p className="text-slate-600">Finalize your resume</p>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <button
            className="px-4 py-2 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700"
            onClick={() => openModal('ats')}
          >
            ATS Scan
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
            onClick={() => openModal('feedback')}
          >
            AI Feedback
          </button>
          <button
            className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700"
            onClick={() => openModal('cover-letter')}
          >
            Cover Letter
          </button>
          <button
            className="px-4 py-2 rounded bg-amber-600 text-white font-semibold hover:bg-amber-700"
            onClick={() => openModal('interview-prep')}
          >
            Interview Prep
          </button>
        </div>
      </div>

      {/* Template Selector */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center mr-3 text-sm">🎨</span>
            <div>
              <h4 className="font-semibold text-slate-800">Current Template</h4>
              <p className="text-slate-600 text-sm">{selectedTemplate?.name || 'Modern Professional'}</p>
            </div>
          </div>
          
          <button
            onClick={onChangeTemplate}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <span>Change Template</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Resume Data with Inline Editing */}
        <div className="order-2 lg:order-1 space-y-6 max-h-[800px] overflow-y-auto pr-2">
          {/* Completion Status */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-green-800">Resume Completion</h4>
              <span className="text-2xl text-green-600 font-bold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-3 mb-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-green-700 text-sm">
              {completionPercentage >= 80 
                ? "Excellent! Your resume is ready to export." 
                : completionPercentage >= 60 
                ? "Good progress! Consider adding more details." 
                : "Add more information to improve your resume."
              }
            </p>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-semibold text-slate-800 flex items-center">
                <span className="text-lg mr-2">👤</span>
                Personal Information
              </h4>
              <button
                onClick={() => setEditingSection(editingSection === 'personal' ? null : 'personal')}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Edit personal information"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              {editingSection === 'personal' ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={resumeData.personalInfo.name}
                    onChange={(e) => updatePersonalInfo('name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder="Professional Summary"
                    value={resumeData.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setEditingSection(null)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    ✓ Done editing
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium text-slate-800">{resumeData.personalInfo.name || 'Name not set'}</span>
                  </div>
                  <div className="text-slate-600 text-sm space-y-1">
                    <div>{resumeData.personalInfo.email || 'Email not set'}</div>
                    <div>{resumeData.personalInfo.phone || 'Phone not set'}</div>
                    <div>{resumeData.personalInfo.location || 'Location not set'}</div>
                    {resumeData.personalInfo.summary && (
                      <div className="mt-2 p-2 bg-slate-50 rounded text-sm">
                        {resumeData.personalInfo.summary}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-semibold text-slate-800 flex items-center">
                <span className="text-lg mr-2">💼</span>
                Work Experience ({resumeData.experiences.filter(exp => exp.company && exp.position).length})
              </h4>
              <button
                onClick={() => setEditingSection(editingSection === 'experience' ? null : 'experience')}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Edit work experience"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              {editingSection === 'experience' ? (
                <div className="space-y-4">
                  {resumeData.experiences.map((exp, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Experience {index + 1}</span>
                        {resumeData.experiences.length > 1 && (
                          <button
                            onClick={() => removeExperience(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Position"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Start Date"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                        <input
                          type="text"
                          placeholder="End Date"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <textarea
                        placeholder="Description"
                        value={exp.description}
                        onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addExperience}
                    className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-colors text-sm"
                  >
                    + Add Experience
                  </button>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    ✓ Done editing
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumeData.experiences.filter(exp => exp.company || exp.position).map((exp, index) => (
                    <div key={index} className="border-l-4 border-primary-200 pl-4">
                      <div className="font-medium text-slate-800">
                        {exp.position || 'Position not set'} {exp.company && `at ${exp.company}`}
                      </div>
                      <div className="text-sm text-slate-500">
                        {exp.startDate} - {exp.endDate}
                      </div>
                      {exp.description && (
                        <div className="text-sm text-slate-600 mt-1">{exp.description}</div>
                      )}
                    </div>
                  ))}
                  {!resumeData.experiences.some(exp => exp.company || exp.position) && (
                    <div className="text-slate-500 text-center py-4">No work experience added yet</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-semibold text-slate-800 flex items-center">
                <span className="text-lg mr-2">🎓</span>
                Education ({resumeData.education.filter(edu => edu.school && edu.degree).length})
              </h4>
              <button
                onClick={() => setEditingSection(editingSection === 'education' ? null : 'education')}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Edit education"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              {editingSection === 'education' ? (
                <div className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Education {index + 1}</span>
                        {resumeData.education.length > 1 && (
                          <button
                            onClick={() => removeEducation(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="School/University"
                        value={edu.school}
                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Field of Study"
                        value={edu.field}
                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Graduation Date"
                          value={edu.graduationDate}
                          onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                        <input
                          type="text"
                          placeholder="GPA (optional)"
                          value={edu.gpa}
                          onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addEducation}
                    className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-colors text-sm"
                  >
                    + Add Education
                  </button>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    ✓ Done editing
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumeData.education.filter(edu => edu.school || edu.degree).map((edu, index) => (
                    <div key={index} className="border-l-4 border-primary-200 pl-4">
                      <div className="font-medium text-slate-800">
                        {edu.degree || 'Degree not set'} {edu.field && `in ${edu.field}`}
                      </div>
                      <div className="text-sm text-slate-600">
                        {edu.school || 'School not set'}
                      </div>
                      <div className="text-sm text-slate-500">
                        {edu.graduationDate || 'Graduation date not set'} {edu.gpa && `| GPA: ${edu.gpa}`}
                      </div>
                    </div>
                  ))}
                  {!resumeData.education.some(edu => edu.school || edu.degree) && (
                    <div className="text-slate-500 text-center py-4">No education added yet</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-semibold text-slate-800 flex items-center">
                <span className="text-lg mr-2">⚡</span>
                Skills ({resumeData.skills.filter(skill => skill.name).length})
              </h4>
              <button
                onClick={() => setEditingSection(editingSection === 'skills' ? null : 'skills')}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Edit skills"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              {editingSection === 'skills' ? (
                <div className="space-y-4">
                  {resumeData.skills.map((skill, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Skill {index + 1}</span>
                        {resumeData.skills.length > 1 && (
                          <button
                            onClick={() => removeSkill(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Skill Name"
                          value={skill.name}
                          onChange={(e) => updateSkill(index, 'name', e.target.value)}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                        <select
                          value={skill.level}
                          onChange={(e) => updateSkill(index, 'level', e.target.value)}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addSkill}
                    className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-colors text-sm"
                  >
                    + Add Skill
                  </button>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    ✓ Done editing
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {resumeData.skills.filter(skill => skill.name).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill, index) => (
                        <span key={index} className="skill">
                          <SkillDisplay skill={skill} />
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-500 text-center py-4">No skills added yet</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onSave}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>{isLoading ? 'Saving...' : 'Save Resume'}</span>
            </button>

            <button
              onClick={onExport}
              disabled={isLoading || completionPercentage < 50}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{isLoading ? 'Downloading...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* Right Column - Live Preview */}
        <div className="order-1 lg:order-2">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden sticky top-4">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
              <h4 className="font-semibold text-slate-800 flex items-center">
                <span className="text-lg mr-2">📄</span>
                Live Preview
              </h4>
            </div>
            
            <div className="p-2 bg-gray-50 flex justify-center items-start min-h-0">
              <div 
                className="resume-container"
              >
                <div 
                  className="resume-preview bg-white border rounded-lg overflow-hidden shadow-lg w-full h-full"
                  style={{ 
                    width: '210mm',  // A4 width
                    height: '297mm', // A4 height
                    transform: 'scale(0.55)', // 65% scaling
                    transformOrigin: 'center top',
                  }}
                >
                  <style>{previewCss}</style>
                  <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {saveMessage && (
        <div className="text-center">
          <div className={`inline-block px-6 py-3 rounded-lg font-medium ${
            saveMessage.includes('❌') 
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {saveMessage}
          </div>
        </div>
      )}

      {/* AI Modal */}
      {aiModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <button className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-full p-1" onClick={closeModal} aria-label="Close">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h4 className="font-semibold text-lg mb-2 text-primary-700">
              {aiModal.type === 'ats' ? 'ATS Scan / Job Match' :
                aiModal.type === 'feedback' ? 'AI Feedback' :
                aiModal.type === 'cover-letter' ? 'AI Cover Letter' :
                aiModal.type === 'interview-prep' ? 'Interview Prep' : ''}
            </h4>
            {aiLoading ? (
              <div className="text-center py-8 text-slate-500">Generating...</div>
            ) : aiError ? (
              <div className="text-red-500 mb-4">{aiError}</div>
            ) : aiResult ? (
              <div className="mb-4 whitespace-pre-line text-slate-800 border border-slate-100 rounded p-3 bg-slate-50 max-h-96 overflow-y-auto">{aiResult}</div>
            ) : null}
            <div className="flex gap-2 justify-end mt-4">
              <button
                className="px-4 py-2 h-10 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors duration-200"
                onClick={regenerate}
                disabled={aiLoading}
              >Regenerate</button>
              <button
                className="px-4 py-2 h-10 rounded bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-200"
                onClick={closeModal}
              >Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 