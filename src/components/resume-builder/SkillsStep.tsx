import { useState } from 'react'

import { SkillInputRow } from '@/components/resume-builder/SkillInputRow'
import { Skill, ResumeData } from '@/components/resume-builder/types'
import { validateSkillField } from '@/components/resume-builder/validateSkillField'

const SKILL_FORMATS = [
  { key: 'name', label: 'Skill Only' },
  { key: 'level', label: 'Proficiency' },
  { key: 'years', label: 'Years of Experience' },
  { key: 'certification', label: 'Certification' },
  { key: 'context', label: 'Context/Example' },
] as const;

type SkillFormat = typeof SKILL_FORMATS[number]['key'];

interface SkillsStepProps {
  skills: Skill[]
  updateSkill: (index: number, field: keyof Skill, value: string | number | undefined) => void
  addSkill: () => void
  removeSkill: (index: number) => void
  resumeData?: ResumeData // Add optional resume data for AI context
}

export const SkillsStep = ({ 
  skills, 
  updateSkill,
  addSkill,
  removeSkill,
  resumeData
}: SkillsStepProps) => {
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const
  const [aiModal, setAiModal] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [aiSkills, setAiSkills] = useState<string[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  // Track format per skill
  const [skillFormats, setSkillFormats] = useState<SkillFormat[]>(skills.map(() => 'name'));
  const [errors, setErrors] = useState<{ [key: number]: string }>({})

  const handleAISuggest = async () => {
    setAiLoading(true)
    setAiError('')
    setAiSkills([])
    setSelected(new Set())
    try {
      const context: Record<string, unknown> = {}
      if (resumeData) {
        context.resumeContent = `
Personal Info: ${resumeData.personalInfo.name ? `${resumeData.personalInfo.name}, ` : ''}${resumeData.personalInfo.summary || ''}
Experience: ${resumeData.experiences.map(exp => `${exp.position} at ${exp.company}: ${exp.description}`).filter(exp => exp.trim() !== ' at : ').join('\n')}
Education: ${resumeData.education.map(edu => `${edu.degree} in ${edu.field} from ${edu.school}`).filter(edu => edu.trim() !== ' in  from ').join('\n')}
        `.trim()
        const experienceDescriptions = resumeData.experiences.map(exp => exp.description).filter(desc => desc.trim()).join(' ')
        if (experienceDescriptions) {
          context.experienceDescriptions = experienceDescriptions
        }
        const recentExp = resumeData.experiences.find(exp => exp.position && exp.company)
        if (recentExp) {
          context.jobTitle = recentExp.position
          context.industry = recentExp.company
        }
      }
      const res = await fetch('/api/ai/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context)
      })
      const data = await res.json()
      if (data.skills) setAiSkills(data.skills)
      else setAiError(data.error || 'No skills returned')
    } catch (e: unknown) {
      if (e instanceof Error) {
        setAiError(e.message || 'AI error')
      } else {
        setAiError('An unexpected error occurred')
      }
    } finally {
      setAiLoading(false)
    }
  }
  const openModal = () => {
    setAiModal(true)
    setAiSkills([])
    setAiError('')
    setSelected(new Set())
    handleAISuggest()
  }
  const closeModal = () => setAiModal(false)
  if (skillFormats.length !== skills.length) {
    setSkillFormats(Array(skills.length).fill('name'));
  }
  const handleFormatChange = (index: number, format: SkillFormat) => {
    setSkillFormats(prev => prev.map((f, i) => (i === index ? format : f)));
    updateSkill(index, 'format', format);
    if (format !== 'level') updateSkill(index, 'level', undefined);
    if (format !== 'years') updateSkill(index, 'years', undefined);
    if (format !== 'certification') updateSkill(index, 'certification', undefined);
    if (format !== 'context') updateSkill(index, 'context', undefined);
  };
  const handleNameChange = (index: number, value: string) => {
    const error = validateSkillField('name', value)
    setErrors(prev => ({ ...prev, [index]: error }))
    updateSkill(index, 'name', value)
  }
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-end mb-4">
        <button
          type="button"
          className="text-primary-600 hover:text-primary-800 text-xs font-semibold border border-primary-200 rounded px-3 py-2 transition-all duration-200"
          onClick={openModal}
        >
          AI Suggest
        </button>
      </div>
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-xl p-6">
            <SkillInputRow
              name={skill.name}
              format={skillFormats[index]}
              onNameChange={value => handleNameChange(index, value)}
              formatValue={skillFormats[index]}
              onFormatChange={value => handleFormatChange(index, value as SkillFormat)}
              onRemove={skills.length > 1 ? () => removeSkill(index) : undefined}
              skillLevels={skillLevels as unknown as string[]}
              showRemove={skills.length > 1}
            />
            {errors[index] && <p className="text-red-500 text-xs mt-1">{errors[index]}</p>}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded px-6 py-3 transition-all duration-200"
          onClick={addSkill}
        >
          Add Skill
        </button>
      </div>
      {/* AI Modal logic/UI remains unchanged for now */}
    </div>
  )
} 