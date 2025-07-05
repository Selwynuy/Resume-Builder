import React from 'react'

interface SkillFormatSelectorProps {
  value: string
  onChange: (value: string) => void
}

export const SkillFormatSelector: React.FC<SkillFormatSelectorProps> = ({ value, onChange }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
  >
    <option value="name">Skill Only</option>
    <option value="level">Proficiency</option>
    <option value="years">Years of Experience</option>
    <option value="certification">Certification</option>
    <option value="context">Context/Example</option>
  </select>
) 