import { Skill, ResumeData } from './types'
import { useState } from 'react'

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

  const handleAISuggest = async () => {
    setAiLoading(true)
    setAiError('')
    setAiSkills([])
    setSelected(new Set())
    try {
      // Build context from available resume data
      const context: Record<string, any> = {}
      
      if (resumeData) {
        // Priority 1: Full resume content (most comprehensive)
        context.resumeContent = `
Personal Info: ${resumeData.personalInfo.name ? `${resumeData.personalInfo.name}, ` : ''}${resumeData.personalInfo.summary || ''}

Experience: ${resumeData.experiences.map(exp => 
  `${exp.position} at ${exp.company}: ${exp.description}`
).filter(exp => exp.trim() !== ' at : ').join('\n')}

Education: ${resumeData.education.map(edu => 
  `${edu.degree} in ${edu.field} from ${edu.school}`
).filter(edu => edu.trim() !== ' in  from ').join('\n')}
        `.trim()

        // Priority 2: Experience descriptions (good for role-specific skills)
        const experienceDescriptions = resumeData.experiences
          .map(exp => exp.description)
          .filter(desc => desc.trim())
          .join(' ')
        if (experienceDescriptions) {
          context.experienceDescriptions = experienceDescriptions
        }

        // Priority 3: Job title from most recent experience
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
  const toggleSkill = (skill: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(skill)) next.delete(skill)
      else next.add(skill)
      return next
    })
  }
  const addSelected = () => {
    let currentIndex = skills.length
    Array.from(selected).forEach(skill => {
      // Only add if not already present
      if (!skills.some(s => s.name.toLowerCase() === skill.toLowerCase())) {
        addSkill()
        updateSkill(currentIndex, 'name', skill)
        updateSkill(currentIndex, 'level', 'Intermediate')
        currentIndex++
      }
    })
    closeModal()
  }
  const addAll = () => {
    let currentIndex = skills.length
    aiSkills.forEach(skill => {
      if (!skills.some(s => s.name.toLowerCase() === skill.toLowerCase())) {
        addSkill()
        updateSkill(currentIndex, 'name', skill)
        updateSkill(currentIndex, 'level', 'Intermediate')
        currentIndex++
      }
    })
    closeModal()
  }

  // Update skillFormats if skills array changes
  // (e.g. when adding/removing skills)
  if (skillFormats.length !== skills.length) {
    setSkillFormats(Array(skills.length).fill('name'));
  }

  const handleFormatChange = (index: number, format: SkillFormat) => {
    setSkillFormats(prev => prev.map((f, i) => (i === index ? format : f)));
    updateSkill(index, 'format', format); // <-- persist format in skill
    // Clear other fields except name
    if (format !== 'level') updateSkill(index, 'level', undefined);
    if (format !== 'years') updateSkill(index, 'years', undefined);
    if (format !== 'certification') updateSkill(index, 'certification', undefined);
    if (format !== 'context') updateSkill(index, 'context', undefined);
  };

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
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="e.g. JavaScript, Project Management, Communication"
                  value={skill.name}
                  onChange={(e) => updateSkill(index, 'name', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="w-48">
                <select
                  value={skillFormats[index]}
                  onChange={e => handleFormatChange(index, e.target.value as SkillFormat)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                >
                  {SKILL_FORMATS.map(f => (
                    <option key={f.key} value={f.key}>{f.label}</option>
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
            {/* Dynamic fields based on format */}
            {skillFormats[index] === 'level' && (
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
                <select
                  value={skill.level || ''}
                  onChange={e => updateSkill(index, 'level', e.target.value)}
                  className="ml-4 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Level</option>
                  {skillLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            )}
            {skillFormats[index] === 'years' && (
              <div className="mt-3 flex items-center space-x-3">
                <label className="text-sm font-medium text-slate-700 w-32">Years of Experience</label>
                <input
                  type="number"
                  min={0}
                  value={skill.years || ''}
                  onChange={e => updateSkill(index, 'years', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-24 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                />
              </div>
            )}
            {skillFormats[index] === 'certification' && (
              <div className="mt-3 flex items-center space-x-3">
                <label className="text-sm font-medium text-slate-700 w-32">Certification</label>
                <input
                  type="text"
                  value={skill.certification || ''}
                  onChange={e => updateSkill(index, 'certification', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                />
              </div>
            )}
            {skillFormats[index] === 'context' && (
              <div className="mt-3 flex items-center space-x-3">
                <label className="text-sm font-medium text-slate-700 w-32">Context/Example</label>
                <input
                  type="text"
                  value={skill.context || ''}
                  onChange={e => updateSkill(index, 'context', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                />
              </div>
            )}
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

      {/* AI Suggestion Modal */}
      {aiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <button className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-full p-1" onClick={closeModal} aria-label="Close">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h4 className="font-semibold text-lg mb-2 text-primary-700">AI Skill Suggestions</h4>
            {aiLoading ? (
              <div className="text-center py-8 text-slate-500">Generating suggestions...</div>
            ) : aiError ? (
              <div className="text-red-500 mb-4">{aiError}</div>
            ) : aiSkills.length ? (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {aiSkills.map(skill => (
                    <button
                      key={skill}
                      className={`px-3 py-1 rounded-full border text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 ${selected.has(skill) ? 'bg-primary-600 text-white border-primary-600' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-primary-50'}`}
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="flex gap-2 justify-end mt-4">
              <button
                className="px-4 py-2 h-10 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-400"
                onClick={addAll}
                disabled={aiLoading || !aiSkills.length}
              >Add All</button>
              <button
                className="px-4 py-2 h-10 rounded bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-400"
                onClick={addSelected}
                disabled={aiLoading || !selected.size}
              >Add Selected</button>
              <button
                className="px-4 py-2 h-10 rounded bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
                onClick={closeModal}
              >Dismiss</button>
              <button
                className="px-4 py-2 h-10 rounded bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
                onClick={() => aiSkills.length > 0 && navigator.clipboard.writeText(aiSkills.join(', '))}
                disabled={aiLoading || aiSkills.length === 0}
              >Copy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 