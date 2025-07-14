import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import { ResumeData, PersonalInfo, Experience, Education, Skill } from '@/components/document-builder/types'
import ConfirmModal from '@/components/ui/ConfirmModal'
import type { Template } from '@/lib/templates'

import EditableSection from './EditableSection'
import ResumePreview from './ResumePreview'

import { 
  CompletionStatus, 
  TemplateSelector, 
  AIFeedbackModal 
} from './'

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
  removeSkill,
  onChangeTemplate
}: ReviewStepProps) => {
  const _router = useRouter();
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [aiModal, setAiModal] = useState<{ open: boolean; type: string }>({ open: false, type: '' })
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [aiResult, setAiResult] = useState('')
  const FEEDBACK_STORAGE_KEY = 'resumeAI_feedback';
  const [removeIdx, setRemoveIdx] = useState<number | null>(null)
  const [removeType, setRemoveType] = useState<'experience' | 'education' | 'skill' | null>(null)
  const [removing, setRemoving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

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

  const completionPercentage = getCompletionPercentage()

  const handleAI = async (type: string, forceRegenerate = false) => {
    setAiLoading(true)
    setAiError('')
    setAiResult('')
    let url = ''
    let body: Record<string, unknown> = {}
    if (type === 'feedback') {
      url = '/api/ai/feedback'
      body = { sectionText: JSON.stringify(resumeData) }
    } else {
      setAiLoading(false)
      return
    }
    try {
      // Use cached feedback unless forceRegenerate is true
      if (!forceRegenerate) {
        const cached = localStorage.getItem(FEEDBACK_STORAGE_KEY)
        if (cached) {
          setAiResult(cached)
          setAiLoading(false)
          return
        }
      }
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      setAiResult(data.feedback || data.result || data.suggestion || data.error || '')
      if (data.feedback) {
        localStorage.setItem(FEEDBACK_STORAGE_KEY, data.feedback)
      }
      if (data.error) setAiError(data.error)
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'AI error'
      setAiError(errorMessage)
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
  const regenerate = () => handleAI(aiModal.type, true)

  const handleRemove = async () => {
    if (removeIdx === null || !removeType) return
    setRemoving(true)
    try {
      if (removeType === 'experience') await removeExperience(removeIdx)
      if (removeType === 'education') await removeEducation(removeIdx)
      if (removeType === 'skill') await removeSkill(removeIdx)
      setToast({ message: `${removeType.charAt(0).toUpperCase() + removeType.slice(1)} removed`, type: 'success' })
    } catch (e) {
      setToast({ message: 'Failed to remove', type: 'error' })
    } finally {
      setRemoving(false)
      setRemoveIdx(null)
      setRemoveType(null)
      setTimeout(() => setToast(null), 2000)
    }
  }

  return (
    <>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.message}</div>
      )}
      <ConfirmModal
        isOpen={removeIdx !== null}
        title={`Remove ${removeType ? removeType.charAt(0).toUpperCase() + removeType.slice(1) : ''}?`}
        message={`Are you sure you want to remove this ${removeType}? This cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleRemove}
        onCancel={() => { setRemoveIdx(null); setRemoveType(null) }}
        loading={removing}
      />
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
            onClick={() => openModal('feedback')}
          >
            AI Feedback
          </button>
        </div>

        <TemplateSelector 
          selectedTemplate={selectedTemplate} 
          onChangeTemplate={onChangeTemplate} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Resume Data with Inline Editing */}
          <div className="order-2 lg:order-1 space-y-6 overflow-y-auto pr-2">
            <CompletionStatus completionPercentage={completionPercentage} />

            {/* Personal Information Section */}
            <EditableSection
              title="Personal Information"
              isEditing={editingSection === 'personal'}
              onEdit={() => setEditingSection('personal')}
              onSave={() => setEditingSection(null)}
              onCancel={() => setEditingSection(null)}
            >
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
            </EditableSection>

            {/* Work Experience Section */}
            <EditableSection
              title="Work Experience"
              isEditing={editingSection === 'experience'}
              onEdit={() => setEditingSection('experience')}
              onSave={() => setEditingSection(null)}
              onCancel={() => setEditingSection(null)}
            >
              {editingSection === 'experience' ? (
                <div className="space-y-4">
                  {resumeData.experiences.map((exp, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Experience {index + 1}</span>
                        {resumeData.experiences.length > 1 && (
                          <button
                            onClick={() => { setRemoveIdx(index); setRemoveType('experience') }}
                            className="text-red-500 hover:text-red-700 text-sm"
                            disabled={removing}
                          >
                            {removing && removeIdx === index ? 'Removing...' : 'Remove'}
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
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addExperience}
                    className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-slate-400 hover:text-slate-600 transition-colors"
                  >
                    + Add Experience
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumeData.experiences.filter(exp => exp.company && exp.position).map((exp, index) => (
                    <div key={index} className="p-3 border border-slate-200 rounded-lg">
                      <div className="font-medium text-slate-800">{exp.position}</div>
                      <div className="text-slate-600 text-sm">{exp.company}</div>
                      <div className="text-slate-500 text-xs">{exp.startDate} - {exp.endDate}</div>
                      {exp.description && (
                        <div className="mt-2 text-sm text-slate-600">{exp.description}</div>
                      )}
                    </div>
                  ))}
                  {resumeData.experiences.filter(exp => exp.company && exp.position).length === 0 && (
                    <div className="text-center py-4 text-slate-500 text-sm">
                      No work experience added yet
                    </div>
                  )}
                </div>
              )}
            </EditableSection>

            {/* Education Section */}
            <EditableSection
              title="Education"
              isEditing={editingSection === 'education'}
              onEdit={() => setEditingSection('education')}
              onSave={() => setEditingSection(null)}
              onCancel={() => setEditingSection(null)}
            >
              {editingSection === 'education' ? (
                <div className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Education {index + 1}</span>
                        {resumeData.education.length > 1 && (
                          <button
                            onClick={() => { setRemoveIdx(index); setRemoveType('education') }}
                            className="text-red-500 hover:text-red-700 text-sm"
                            disabled={removing}
                          >
                            {removing && removeIdx === index ? 'Removing...' : 'Remove'}
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="text"
                        placeholder="School"
                        value={edu.school}
                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Field of Study"
                        value={edu.field}
                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Graduation Date"
                        value={edu.graduationDate}
                        onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="text"
                        placeholder="GPA (optional)"
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addEducation}
                    className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-slate-400 hover:text-slate-600 transition-colors"
                  >
                    + Add Education
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumeData.education.filter(edu => edu.school && edu.degree).map((edu, index) => (
                    <div key={index} className="p-3 border border-slate-200 rounded-lg">
                      <div className="font-medium text-slate-800">{edu.degree}</div>
                      <div className="text-slate-600 text-sm">{edu.school}</div>
                      <div className="text-slate-500 text-xs">{edu.field && `${edu.field} • `}{edu.graduationDate}</div>
                      {edu.gpa && (
                        <div className="mt-2 text-sm text-slate-600">GPA: {edu.gpa}</div>
                      )}
                    </div>
                  ))}
                  {resumeData.education.filter(edu => edu.school && edu.degree).length === 0 && (
                    <div className="text-center py-4 text-slate-500 text-sm">
                      No education added yet
                    </div>
                  )}
                </div>
              )}
            </EditableSection>

            {/* Skills Section */}
            <EditableSection
              title="Skills"
              isEditing={editingSection === 'skills'}
              onEdit={() => setEditingSection('skills')}
              onSave={() => setEditingSection(null)}
              onCancel={() => setEditingSection(null)}
            >
              {editingSection === 'skills' ? (
                <div className="space-y-4">
                  {resumeData.skills.map((skill, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Skill {index + 1}</span>
                        {resumeData.skills.length > 1 && (
                          <button
                            onClick={() => { setRemoveIdx(index); setRemoveType('skill') }}
                            className="text-red-500 hover:text-red-700 text-sm"
                            disabled={removing}
                          >
                            {removing && removeIdx === index ? 'Removing...' : 'Remove'}
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Skill Name"
                        value={skill.name}
                        onChange={(e) => updateSkill(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <select
                        value={skill.format}
                        onChange={(e) => updateSkill(index, 'format', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      >
                        <option value="text">Text</option>
                        <option value="progress">Progress Bar</option>
                        <option value="stars">Stars</option>
                      </select>
                    </div>
                  ))}
                  <button
                    onClick={addSkill}
                    className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-slate-400 hover:text-slate-600 transition-colors"
                  >
                    + Add Skill
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumeData.skills.filter(skill => skill.name).map((skill, index) => (
                    <div key={index} className="p-3 border border-slate-200 rounded-lg">
                      {/* Assuming SkillDisplay is defined elsewhere or will be added */}
                      {/* For now, just display the skill name */}
                      <div className="font-medium text-slate-800">{skill.name}</div>
                      {skill.format === 'progress' && (
                        <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-primary-500 h-2 rounded-full" 
                            style={{ width: `${skill.level || 0}%` }}
                          ></div>
                        </div>
                      )}
                      {skill.format === 'stars' && (
                        <div className="flex items-center text-yellow-500 text-sm">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < (Number(skill.level) || 0) ? 'fill-yellow-500' : 'fill-slate-300'}`} viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                            </svg>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {resumeData.skills.filter(skill => skill.name).length === 0 && (
                    <div className="text-center py-4 text-slate-500 text-sm">
                      No skills added yet
                    </div>
                  )}
                </div>
              )}
            </EditableSection>
          </div>

          {/* Right Column - Resume Preview */}
          <ResumePreview 
            resumeData={resumeData} 
            template={selectedTemplate} 
            onEdit={() => setEditingSection('personal')}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label={isLoading ? 'Saving resume...' : 'Save resume to your account'}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" aria-hidden="true"></div>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Resume
              </>
            )}
          </button>
          
          <button
            onClick={onExport}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Export resume as PDF"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </button>
        </div>

        {saveMessage && (
          <div className="text-center">
            <p className="text-green-600 font-medium">{saveMessage}</p>
          </div>
        )}

        {/* AI Feedback Modal */}
        <AIFeedbackModal
          isOpen={aiModal.open}
          onClose={closeModal}
          onOpen={openModal}
          onRegenerate={regenerate}
          aiLoading={aiLoading}
          aiError={aiError}
          aiResult={aiResult}
        />
      </div>
    </>
  )
} 