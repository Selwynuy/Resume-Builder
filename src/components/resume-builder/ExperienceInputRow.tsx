import React from 'react'

interface ExperienceInputRowProps {
  position: string
  company: string
  startDate: string
  endDate: string
  description: string
  onPositionChange: (value: string) => void
  onCompanyChange: (value: string) => void
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onRemove?: () => void
  onAISuggest: () => void
  showRemove: boolean
  index: number
}

export const ExperienceInputRow: React.FC<ExperienceInputRowProps> = ({
  position,
  company,
  startDate,
  endDate,
  description,
  onPositionChange,
  onCompanyChange,
  onStartDateChange,
  onEndDateChange,
  onDescriptionChange,
  onRemove,
  onAISuggest,
  showRemove,
  index
}) => (
  <div className="bg-white border border-slate-200 rounded-xl p-6">
    <div className="flex justify-between items-center mb-4">
      <h4 className="font-semibold text-slate-800">
        {position || `Position ${index + 1}`}
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
        <label className="block text-sm font-medium text-slate-700 mb-2">Job Title *</label>
        <input
          type="text"
          placeholder="e.g. Software Engineer"
          value={position}
          onChange={(e) => onPositionChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Company *</label>
        <input
          type="text"
          placeholder="e.g. Tech Corp"
          value={company}
          onChange={(e) => onCompanyChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
        <input
          type="month"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
        <input
          type="month"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          placeholder="Leave blank if current"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
        <span>Job Description</span>
        <button
          type="button"
          className="ml-2 text-primary-600 hover:text-primary-800 text-xs font-semibold border border-primary-200 rounded px-2 py-1 transition-all duration-200"
          onClick={onAISuggest}
        >
          AI Suggest
        </button>
      </label>
      <textarea
        placeholder="Describe your responsibilities, achievements, and impact..."
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        rows={4}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300 resize-none"
      />
    </div>
  </div>
) 