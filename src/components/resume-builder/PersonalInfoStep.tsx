import { PersonalInfo } from './types'
import { phoneRegex, nameRegex, locationRegex, INPUT_LIMITS } from '@/lib/security'
import { useState } from 'react'

interface PersonalInfoStepProps {
  personalInfo: PersonalInfo
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void
}

export const PersonalInfoStep = ({ 
  personalInfo,
  updatePersonalInfo 
}: PersonalInfoStepProps) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateAndUpdate = (field: keyof PersonalInfo, value: string) => {
    const newErrors = { ...errors }

    // Validate based on field
    switch (field) {
      case 'name':
        if (value && !nameRegex.test(value)) {
          newErrors[field] = 'Name contains invalid characters'
        } else if (value.length > INPUT_LIMITS.NAME) {
          newErrors[field] = `Name must be less than ${INPUT_LIMITS.NAME} characters`
        } else {
          delete newErrors[field]
        }
        break
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field] = 'Invalid email format'
        } else if (value.length > INPUT_LIMITS.EMAIL) {
          newErrors[field] = `Email must be less than ${INPUT_LIMITS.EMAIL} characters`
        } else {
          delete newErrors[field]
        }
        break
      case 'phone':
        if (value && !phoneRegex.test(value)) {
          newErrors[field] = 'Invalid phone number format'
        } else if (value.length > INPUT_LIMITS.PHONE) {
          newErrors[field] = `Phone must be less than ${INPUT_LIMITS.PHONE} characters`
        } else {
          delete newErrors[field]
        }
        break
      case 'location':
        if (value && !locationRegex.test(value)) {
          newErrors[field] = 'Location contains invalid characters'
        } else if (value.length > INPUT_LIMITS.LOCATION) {
          newErrors[field] = `Location must be less than ${INPUT_LIMITS.LOCATION} characters`
        } else {
          delete newErrors[field]
        }
        break
      case 'summary':
        if (value.length > INPUT_LIMITS.SUMMARY) {
          newErrors[field] = `Summary must be less than ${INPUT_LIMITS.SUMMARY} characters`
        } else {
          delete newErrors[field]
        }
        break
    }

    setErrors(newErrors)
    updatePersonalInfo(field, value)
  }
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
            onChange={(e) => validateAndUpdate('name', e.target.value)}
            maxLength={INPUT_LIMITS.NAME}
            pattern="[a-zA-Z\s\-\.\']*"
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
              errors.name 
                ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                : 'border-slate-200 focus:ring-primary-400 focus:border-transparent'
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
            <input
              type="email"
              placeholder="e.g. john@example.com"
              value={personalInfo.email}
              onChange={(e) => validateAndUpdate('email', e.target.value)}
              maxLength={INPUT_LIMITS.EMAIL}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
                errors.email 
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                  : 'border-slate-200 focus:ring-primary-400 focus:border-transparent'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. (555) 123-4567"
              value={personalInfo.phone}
              onChange={(e) => validateAndUpdate('phone', e.target.value)}
              maxLength={INPUT_LIMITS.PHONE}
              pattern="[\+]?[\d\s\-\(\)]*"
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
                errors.phone 
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                  : 'border-slate-200 focus:ring-primary-400 focus:border-transparent'
              }`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
          <input
            type="text"
            placeholder="e.g. New York, NY"
            value={personalInfo.location}
            onChange={(e) => validateAndUpdate('location', e.target.value)}
            maxLength={INPUT_LIMITS.LOCATION}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
              errors.location 
                ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                : 'border-slate-200 focus:ring-primary-400 focus:border-transparent'
            }`}
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Professional Summary</label>
          <textarea
            placeholder="Briefly describe your professional background and goals..."
            value={personalInfo.summary}
            onChange={(e) => validateAndUpdate('summary', e.target.value)}
            rows={4}
            maxLength={INPUT_LIMITS.SUMMARY}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 resize-none ${
              errors.summary 
                ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                : 'border-slate-200 focus:ring-primary-400 focus:border-transparent'
            }`}
          />
          {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary}</p>}
          <p className="text-sm text-slate-500 mt-2">
            2-3 sentences highlighting your key strengths and career objectives 
            ({personalInfo.summary.length}/{INPUT_LIMITS.SUMMARY} characters)
          </p>
        </div>
      </div>
    </div>
  )
} 