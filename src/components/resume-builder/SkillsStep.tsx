import { Skill } from './types'

interface SkillsStepProps {
  skills: Skill[]
  updateSkill: (index: number, field: keyof Skill, value: string) => void
  addSkill: () => void
  removeSkill: (index: number) => void
}

export const SkillsStep = ({ 
  skills, 
  updateSkill,
  addSkill,
  removeSkill
}: SkillsStepProps) => {
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