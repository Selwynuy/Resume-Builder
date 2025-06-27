import { PersonalInfo } from './types'

interface PersonalInfoStepProps {
  personalInfo: PersonalInfo
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void
}

export const PersonalInfoStep = ({ 
  personalInfo,
  updatePersonalInfo 
}: PersonalInfoStepProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Tell Us About Yourself</h3>
        <p className="text-slate-600">Let's start with your basic information</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
          <input
            type="text"
            placeholder="e.g. John Doe"
            value={personalInfo.name}
            onChange={(e) => updatePersonalInfo('name', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
            <input
              type="email"
              placeholder="e.g. john@example.com"
              value={personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. (555) 123-4567"
              value={personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
          <input
            type="text"
            placeholder="e.g. New York, NY"
            value={personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Professional Summary</label>
          <textarea
            placeholder="Briefly describe your professional background and goals..."
            value={personalInfo.summary}
            onChange={(e) => updatePersonalInfo('summary', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300 resize-none"
          />
          <p className="text-sm text-slate-500 mt-2">2-3 sentences highlighting your key strengths and career objectives</p>
        </div>
      </div>
    </div>
  )
} 