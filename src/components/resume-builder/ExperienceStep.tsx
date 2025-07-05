import { Experience } from '@/components/resume-builder/types'
import { useState, useEffect } from 'react'
import { ExperienceInputRow } from '@/components/resume-builder/ExperienceInputRow'
import { validateExperienceField } from '@/components/resume-builder/validateExperienceField'

interface ExperienceStepProps {
  experiences: Experience[]
  updateExperience: (index: number, field: keyof Experience, value: string) => void
  addExperience: () => void
  removeExperience: (index: number) => void
}

export const ExperienceStep = ({ 
  experiences, 
  updateExperience,
  addExperience,
  removeExperience
}: ExperienceStepProps) => {
  const [aiModal, setAiModal] = useState<{ open: boolean; index: number | null }>({ open: false, index: null })
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [multiSummaries, setMultiSummaries] = useState<null | {
    resultsOriented: string;
    teamPlayer: string;
    innovative: string;
    concise: string;
  }>(null);
  const [errors, setErrors] = useState<{ [key: number]: { [field: string]: string } }>({})

  const saveEditPair = (ai: string, user: string) => {
    if (!ai || !user || ai === user) return
    const key = 'ai_bullet_edits'
    try {
      const prev = JSON.parse(localStorage.getItem(key) || '[]')
      prev.push({ ai, user })
      localStorage.setItem(key, JSON.stringify(prev.slice(-3)))
    } catch { /* ignore localStorage errors */ }
  }

  const handleAISuggest = async (index: number) => {
    setAiLoading(true)
    setAiError('')
    setAiSuggestion('')
    try {
      let editPairs = []
      try {
        editPairs = JSON.parse(localStorage.getItem('ai_bullet_edits') || '[]')
      } catch { /* ignore localStorage errors */ }
      let stylePrompt = ''
      if (editPairs.length) {
        stylePrompt = '\nHere are some examples of how the user edits AI suggestions. Please match their style.\n' +
          editPairs.map((p: { ai: string; user: string }) => `AI: ${p.ai}\nUser: ${p.user}`).join('\n')
      }
      const res = await fetch('/api/ai/bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: experiences[index].description, mode: 'rewrite', stylePrompt })
      })
      const data = await res.json()
      if (data.suggestion) setAiSuggestion(data.suggestion)
      else setAiError(data.error || 'No suggestion returned')
    } catch (e: unknown) {
      setAiError((e as Error).message || 'AI error')
    } finally {
      setAiLoading(false)
    }
  }

  const handleMultiSuggest = async (index: number) => {
    setMultiSummaries(null);
    try {
      let editPairs = [];
      try {
        editPairs = JSON.parse(localStorage.getItem('ai_bullet_edits') || '[]');
      } catch { /* ignore localStorage errors */ }
      let stylePrompt = '';
      if (editPairs.length) {
        stylePrompt = '\nHere are some examples of how the user edits AI suggestions. Please match their style.\n' +
          editPairs.map((p: { ai: string; user: string }) => `AI: ${p.ai}\nUser: ${p.user}`).join('\n');
      }
      const res = await fetch('/api/ai/bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: experiences[index].description, mode: 'multi', stylePrompt })
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error: ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      if (data.summaries) setMultiSummaries(data.summaries);
    } catch (e: unknown) {
      // Handle error silently for now
    }
  };

  const openModal = (index: number) => {
    setAiModal({ open: true, index });
    setMultiSummaries(null);
    handleMultiSuggest(index);
  };
  const closeModal = () => setAiModal({ open: false, index: null })

  const validateAndUpdate = (index: number, field: keyof Experience, value: string) => {
    const error = validateExperienceField(field, value)
    setErrors(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: error
      }
    }))
    updateExperience(index, field, value)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-6">
        {experiences.map((experience, index) => (
          <div key={index}>
            <ExperienceInputRow
              position={experience.position}
              company={experience.company}
              startDate={experience.startDate}
              endDate={experience.endDate}
              description={experience.description}
              onPositionChange={(value) => validateAndUpdate(index, 'position', value)}
              onCompanyChange={(value) => validateAndUpdate(index, 'company', value)}
              onStartDateChange={(value) => validateAndUpdate(index, 'startDate', value)}
              onEndDateChange={(value) => validateAndUpdate(index, 'endDate', value)}
              onDescriptionChange={(value) => validateAndUpdate(index, 'description', value)}
              onRemove={experiences.length > 1 ? () => removeExperience(index) : undefined}
              onAISuggest={() => openModal(index)}
              showRemove={experiences.length > 1}
              index={index}
            />
            {errors[index] && Object.keys(errors[index]).length > 0 && (
              <div className="mt-2 space-y-1">
                {Object.entries(errors[index]).map(([field, error]) => (
                  error && <p key={field} className="text-red-500 text-xs">{error}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded px-6 py-3 transition-all duration-200"
          onClick={addExperience}
        >
          Add Experience
        </button>
      </div>

      {/* AI Modal */}
      {aiModal.open && aiModal.index !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <button className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-full p-1" onClick={closeModal} aria-label="Close">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h4 className="font-semibold text-lg mb-2 text-primary-700">AI Description Suggestions</h4>
            {aiLoading ? (
              <div className="text-center py-8 text-slate-500">Generating suggestions...</div>
            ) : aiError ? (
              <div className="text-red-500 mb-4">{aiError}</div>
            ) : multiSummaries ? (
              <div className="space-y-4">
                {Object.entries(multiSummaries).map(([style, suggestion]) => (
                  <div key={style} className="border border-slate-200 rounded-lg p-4">
                    <h5 className="font-medium text-slate-800 mb-2 capitalize">{style.replace(/([A-Z])/g, ' $1').trim()}</h5>
                    <p className="text-slate-600 text-sm mb-3">{suggestion}</p>
                    <button
                      onClick={() => {
                        if (aiModal.index !== null) {
                          saveEditPair(suggestion, experiences[aiModal.index].description)
                          updateExperience(aiModal.index, 'description', suggestion)
                          closeModal()
                        }
                      }}
                      className="text-primary-600 hover:text-primary-800 text-xs font-semibold border border-primary-200 rounded px-2 py-1 transition-all duration-200"
                    >
                      Use This
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="flex gap-2 justify-end mt-4">
              <button
                className="px-4 py-2 h-10 rounded bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
                onClick={closeModal}
              >Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 