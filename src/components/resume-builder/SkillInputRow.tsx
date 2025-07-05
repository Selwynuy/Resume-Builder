import React from 'react'

interface SkillInputRowProps {
  name: string
  format: string
  onNameChange: (value: string) => void
  formatValue: string
  onFormatChange: (value: string) => void
  onRemove?: () => void
  skillLevels: string[]
  showRemove: boolean
}

export const SkillInputRow: React.FC<SkillInputRowProps> = ({
  name,
  format,
  onNameChange,
  formatValue,
  onFormatChange,
  onRemove,
  skillLevels,
  showRemove
}) => (
  <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
    <div className="flex-1">
      <input
        type="text"
        placeholder="e.g. JavaScript, Project Management, Communication"
        value={name}
        onChange={e => onNameChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
      />
    </div>
    <div className="w-48">
      <select
        value={formatValue}
        onChange={e => onFormatChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
      >
        <option value="name">Skill Only</option>
        <option value="level">Proficiency</option>
        <option value="years">Years of Experience</option>
        <option value="certification">Certification</option>
        <option value="context">Context/Example</option>
      </select>
    </div>
    {showRemove && (
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 p-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    )}
  </div>
) 