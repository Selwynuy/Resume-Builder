import React from 'react'

interface EducationInputRowProps {
  school: string
  degree: string
  field: string
  graduationDate: string
  gpa: string
  onSchoolChange: (value: string) => void
  onDegreeChange: (value: string) => void
  onFieldChange: (value: string) => void
  onGraduationDateChange: (value: string) => void
  onGpaChange: (value: string) => void
  onRemove?: () => void
  showRemove: boolean
  index: number
}

export const EducationInputRow: React.FC<EducationInputRowProps> = ({
  school,
  degree,
  field,
  graduationDate,
  gpa,
  onSchoolChange,
  onDegreeChange,
  onFieldChange,
  onGraduationDateChange,
  onGpaChange,
  onRemove,
  showRemove,
  index
}) => (
  <div className="bg-white border border-slate-200 rounded-xl p-6">
    <div className="flex justify-between items-center mb-4">
      <h4 className="font-semibold text-slate-800">
        {degree || `Education ${index + 1}`}
      </h4>
      {showRemove && (
        <button
          onClick={onRemove}
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
          value={school}
          onChange={(e) => onSchoolChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Degree *</label>
        <input
          type="text"
          placeholder="e.g. Bachelor of Science"
          value={degree}
          onChange={(e) => onDegreeChange(e.target.value)}
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
          value={field}
          onChange={(e) => onFieldChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Graduation Date</label>
        <input
          type="month"
          value={graduationDate}
          onChange={(e) => onGraduationDateChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">GPA (Optional)</label>
      <input
        type="text"
        placeholder="e.g. 3.8/4.0"
        value={gpa}
        onChange={(e) => onGpaChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
      />
    </div>
  </div>
) 