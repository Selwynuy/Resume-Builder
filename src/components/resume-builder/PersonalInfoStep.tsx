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

  // 1. Add state for multi-style summaries
  const [multiSummaries, setMultiSummaries] = useState<null | {
    professional: string;
    creative: string;
    friendly: string;
    technical: string;
  }>(null);
  const [multiLoading, setMultiLoading] = useState(false);
  const [multiError, setMultiError] = useState<string | null>(null);
  const [showMultiModal, setShowMultiModal] = useState(false);

  // Helper to get/set multi-summaries in localStorage
  const MULTI_SUMMARY_KEY = 'ai_summary_multi_suggestions';
  function saveMultiSummariesToStorage(summaries: any) {
    try { localStorage.setItem(MULTI_SUMMARY_KEY, JSON.stringify(summaries)); } catch {}
  }
  function getMultiSummariesFromStorage() {
    try {
      const raw = localStorage.getItem(MULTI_SUMMARY_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }

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

  const saveEditPair = (ai: string, user: string) => {
    if (!ai || !user || ai === user) return
    const key = 'ai_summary_edits'
    const prev = JSON.parse(localStorage.getItem(key) || '[]')
    prev.push({ ai, user })
    localStorage.setItem(key, JSON.stringify(prev.slice(-3)))
  }

  const handleAISuggest = async (mode: 'generate' | 'improve') => {
    setAiLoading(true)
    setAiError('')
    setAiSuggestion('')
    try {
      let editPairs = []
      try {
        editPairs = JSON.parse(localStorage.getItem('ai_summary_edits') || '[]')
      } catch {}
      let stylePrompt = ''
      if (editPairs.length) {
        stylePrompt = '\nHere are some examples of how the user edits AI suggestions. Please match their style.\n' +
          editPairs.map((p: { ai: string; user: string }) => `AI: ${p.ai}\nUser: ${p.user}`).join('\n')
      }
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: personalInfo.summary,
          mode: personalInfo.summary ? 'improve' : 'generate',
          stylePrompt
        })
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`API error: ${res.status} - ${errorText}`)
      }
      const data = await res.json()
      if (data.suggestion) setAiSuggestion(data.suggestion)
      else setAiError(data.error || 'No suggestion returned')
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
    setAiSuggestion('')
    setAiError('')
    handleAISuggest(personalInfo.summary ? 'improve' : 'generate')
  }

  const closeModal = () => setAiModal(false)

  const applySuggestion = () => {
    if (aiSuggestion) {
      saveEditPair(aiSuggestion, personalInfo.summary)
      updatePersonalInfo('summary', aiSuggestion)
      closeModal()
    }
  }

  const regenerate = () => handleAISuggest(personalInfo.summary ? 'improve' : 'generate')

  // 2. Update AI Suggest button to open multi-style modal
  const handleMultiSuggest = async (force = false) => {
    let cached = !force && getMultiSummariesFromStorage();
    setShowMultiModal(true);
    setMultiError(null);
    if (cached) {
      setMultiSummaries(cached);
      setMultiLoading(false);
      return;
    }
    setMultiSummaries(null);
    setMultiLoading(true);
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: personalInfo.summary ? 'improve' : 'generate', text: personalInfo.summary }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error: ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      if (data.summaries) {
        setMultiSummaries(data.summaries);
        saveMultiSummariesToStorage(data.summaries);
      } else setMultiError(data.error || 'AI error');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setMultiError(e.message || 'AI error');
      } else {
        setMultiError('An unexpected error occurred');
      }
    } finally {
      setMultiLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Tell Us About Yourself</h3>
        <p className="text-slate-600">Let&apos;s start with your basic information</p>
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
            pattern="[a-zA-Z .']*-"
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
              onClick={() => handleMultiSuggest()}
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
            <button className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-full p-1" onClick={closeModal} aria-label="Close">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
                className="px-4 py-2 h-10 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors duration-200"
                onClick={regenerate}
                disabled={aiLoading}
              >Regenerate</button>
              <button
                className="px-4 py-2 h-10 rounded bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-200"
                onClick={applySuggestion}
                disabled={!aiSuggestion || aiLoading}
              >Apply</button>
              <button
                className="px-4 py-2 h-10 rounded bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors duration-200"
                onClick={closeModal}
              >Dismiss</button>
              <button
                className="px-4 py-2 h-10 rounded bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors duration-200"
                onClick={() => aiSuggestion && navigator.clipboard.writeText(aiSuggestion)}
                disabled={!aiSuggestion}
              >Copy</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal UI for multi-style summaries */}
      {showMultiModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-60 transition-all z-40"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg sm:max-w-xl min-w-[280px] max-h-[80vh] p-3 sm:p-5 md:p-6 flex flex-col justify-center relative"
              style={{ boxSizing: 'border-box' }}
              tabIndex={-1}
            >
              <button
                className="absolute -top-3 -right-3 p-2 bg-white rounded-full shadow focus:outline-none"
                style={{ zIndex: 10 }}
                onClick={() => setShowMultiModal(false)}
                aria-label="Close"
                autoFocus
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M6 6l12 12m0-12l-12 12"/></svg>
              </button>
              <div className="flex-1 overflow-y-auto h-[65vh]">
                <h2 className="font-semibold mb-6 text-center text-lg sm:text-xl md:text-2xl">AI Summary Suggestions</h2>
                <button
                  className="mb-6 self-center px-5 py-2 rounded bg-primary-100 text-primary-700 font-semibold hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors duration-200"
                  onClick={() => handleMultiSuggest(true)}
                  disabled={multiLoading}
                >Regenerate Suggestions</button>
                {multiLoading && <div className="text-center py-12 text-lg">Loading...</div>}
                {multiError && <div className="text-red-500 text-center py-6">{multiError}</div>}
                {multiSummaries && (
                  <div className="space-y-4 sm:space-y-6">
                    {(['professional','creative','friendly','technical'] as const).map(style => (
                      <div key={style} className={`border rounded-lg p-3 sm:p-5 md:p-8 bg-slate-50 ${personalInfo.summary === multiSummaries[style] ? 'ring-2 ring-primary-500 bg-primary-50' : ''}`}
                        aria-selected={personalInfo.summary === multiSummaries[style]}
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            updatePersonalInfo('summary', multiSummaries[style]);
                            setShowMultiModal(false);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium capitalize text-base">{style}</span>
                          <div className="flex gap-2">
                            <button
                              className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors duration-200 ${personalInfo.summary === multiSummaries[style] ? 'ring-2 ring-primary-400' : ''}`}
                              onClick={() => {
                                updatePersonalInfo('summary', multiSummaries[style]);
                                setShowMultiModal(false);
                              }}
                              aria-label={`Use ${style} summary`}
                            >Use</button>
                            <button
                              className="px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors duration-200"
                              onClick={() => navigator.clipboard.writeText(multiSummaries[style])}
                              aria-label={`Copy ${style} summary`}
                            >Copy</button>
                          </div>
                        </div>
                        <div className="text-base whitespace-pre-line leading-relaxed">{multiSummaries[style]}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {/* TODO: Update onboarding/docs to explain multi-style summary modal */}
    </div>
  )
} 