import { Education } from './types'

interface EducationStepProps {
  education: Education[]
  updateEducation: (index: number, field: keyof Education, value: string) => void
  addEducation: () => void
  removeEducation: (index: number) => void
}

export const EducationStep = ({ 
  education, 
  updateEducation,
  addEducation,
  removeEducation
}: EducationStepProps) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
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