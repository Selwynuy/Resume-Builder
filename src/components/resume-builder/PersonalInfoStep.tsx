'use client'

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
  const [aiModal, setAiModal] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState('')

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

  const handleAISuggest = async (mode: 'generate' | 'improve') => {
    setAiLoading(true)
    setAiError('')
    setAiSuggestion('')
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: personalInfo.summary,
          mode: personalInfo.summary ? 'improve' : 'generate'
        })
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`API error: ${res.status} - ${errorText}`)
      }
      const data = await res.json()
      if (data.suggestion) setAiSuggestion(data.suggestion)
      else setAiError(data.error || 'No suggestion returned')
    } catch (e: any) {
      setAiError(e.message || 'AI error')
    } finally {
      setAiLoading(false)
    }
  }

  const openModal = () => {
    setAiModal(true)
    setAiSuggestion('')
    setAiError('')
    handleAISuggest(personalInfo.summary ? 'improve' : 'generate')
  }

  const closeModal = () => setAiModal(false)

  const applySuggestion = () => {
    if (aiSuggestion) {
      updatePersonalInfo('summary', aiSuggestion)
      closeModal()
    }
  }

  const regenerate = () => handleAISuggest(personalInfo.summary ? 'improve' : 'generate')

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
            pattern="[a-zA-Z .'-]*"
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
            pattern="[a-zA-Z0-9 ,.'-]*"
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
              errors.location 
                ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                : 'border-slate-200 focus:ring-primary-400 focus:border-transparent'
            }`}
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
            <span>Professional Summary</span>
            <button
              type="button"
              className="ml-2 text-primary-600 hover:text-primary-800 text-xs font-semibold border border-primary-200 rounded px-2 py-1 transition-all duration-200"
              onClick={openModal}
            >
              AI Suggest
            </button>
          </label>
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

      {/* AI Suggestion Modal */}
      {aiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <button className="absolute top-2 right-2 text-slate-400 hover:text-slate-600" onClick={closeModal}>&times;</button>
            <h4 className="font-semibold text-lg mb-2 text-primary-700">AI Suggestion</h4>
            {aiLoading ? (
              <div className="text-center py-8 text-slate-500">Generating suggestion...</div>
            ) : aiError ? (
              <div className="text-red-500 mb-4">{aiError}</div>
            ) : aiSuggestion ? (
              <div className="mb-4 whitespace-pre-line text-slate-800 border border-slate-100 rounded p-3 bg-slate-50">{aiSuggestion}</div>
            ) : null}
            <div className="flex gap-2 justify-end mt-4">
              <button
                className="px-4 py-2 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50"
                onClick={regenerate}
                disabled={aiLoading}
              >Regenerate</button>
              <button
                className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
                onClick={applySuggestion}
                disabled={!aiSuggestion || aiLoading}
              >Apply</button>
              <button
                className="px-4 py-2 rounded bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300"
                onClick={closeModal}
              >Dismiss</button>
              <button
                className="px-4 py-2 rounded bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 border border-slate-300"
                onClick={() => aiSuggestion && navigator.clipboard.writeText(aiSuggestion)}
                disabled={!aiSuggestion}
              >Copy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 