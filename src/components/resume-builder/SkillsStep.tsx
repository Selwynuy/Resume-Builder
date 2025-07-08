import React, { useState } from 'react'

import { SkillInputRow } from '@/components/resume-builder/SkillInputRow'
import { Skill, ResumeData } from '@/components/resume-builder/types'
import { validateSkillField } from '@/components/resume-builder/validateSkillField'
import { Button } from '@/components/ui/button'
import AISuggestionModal from '@/components/resume-builder/AISuggestionModal'

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
  addSkill: (name?: string) => void
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
  const [aiModalOpen, setAiModalOpen] = useState(false)
  // Track format per skill
  const [skillFormats, setSkillFormats] = useState<SkillFormat[]>(skills.map(() => 'name'));
  const [errors, setErrors] = useState<{ [key: number]: string }>({})

  const openAIModal = () => {
    setAiModalOpen(true)
  }

  const closeAIModal = () => {
    setAiModalOpen(false)
  }

  const handleApplySuggestion = (suggestion: string) => {
    // Add the suggested skill to the skills list and set its name
    addSkill(suggestion)
  }

  const handleApplyAllSuggestions = (suggestions: string[]) => {
    suggestions.forEach(suggestion => addSkill(suggestion))
  }

  const getAIContext = (): Record<string, unknown> => {
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
    return context
  }
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-primary-600 hover:text-primary-800 border-primary-200"
          onClick={openAIModal}
        >
          AI Suggest
        </Button>
      </div>
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-xl p-6">
            <SkillInputRow
              name={skill.name}
              onNameChange={value => handleNameChange(index, value)}
              formatValue={skillFormats[index]}
              onFormatChange={value => handleFormatChange(index, value as SkillFormat)}
              onRemove={skills.length > 1 ? () => removeSkill(index) : undefined}
              showRemove={skills.length > 1}
            />
            {errors[index] && <p className="text-red-500 text-xs mt-1">{errors[index]}</p>}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <Button
          type="button"
          onClick={() => addSkill()}
        >
          Add Skill
        </Button>
      </div>
      {/* AI Suggestion Modal */}
      {aiModalOpen && (
        <AISuggestionModal
          isOpen={aiModalOpen}
          onClose={closeAIModal}
          featureType="skills"
          currentText=""
          onApplySuggestion={handleApplySuggestion}
          onApplyAllSuggestions={handleApplyAllSuggestions}
          context={getAIContext()}
          existingSkillNames={skills.map(s => s.name.toLowerCase())}
        />
      )}
    </div>
  )
} 