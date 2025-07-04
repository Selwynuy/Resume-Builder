import { Experience } from './types'
import { useState } from 'react'

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

  const saveEditPair = (ai: string, user: string) => {
    if (!ai || !user || ai === user) return
    const key = 'ai_bullet_edits'
    const prev = JSON.parse(localStorage.getItem(key) || '[]')
    prev.push({ ai, user })
    localStorage.setItem(key, JSON.stringify(prev.slice(-3)))
  }

  const handleAISuggest = async (index: number) => {
    setAiLoading(true)
    setAiError('')
    setAiSuggestion('')
    try {
      let editPairs = []
      try {
        editPairs = JSON.parse(localStorage.getItem('ai_bullet_edits') || '[]')
      } catch {}
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

  const openModal = (index: number) => {
    setAiModal({ open: true, index })
    setAiSuggestion('')
    setAiError('')
    handleAISuggest(index)
  }
  const closeModal = () => setAiModal({ open: false, index: null })
  const applySuggestion = () => {
    if (aiModal.index !== null && aiSuggestion) {
      saveEditPair(aiSuggestion, experiences[aiModal.index].description)
      updateExperience(aiModal.index, 'description', aiSuggestion)
      closeModal()
    }
  }
  const regenerate = () => {
    if (aiModal.index !== null) handleAISuggest(aiModal.index)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Your Work Experience</h3>
        <p className="text-slate-600">Add your work history, starting with your most recent position</p>
      </div>
      
      <div className="space-y-6">
        {experiences.map((experience, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-slate-800">
                {experience.position || `Position ${index + 1}`}
              </h4>
              {experiences.length > 1 && (
                <button
                  onClick={() => removeExperience(index)}
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
                  value={experience.position}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Company *</label>
                <input
                  type="text"
                  placeholder="e.g. Tech Corp"
                  value={experience.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                <input
                  type="month"
                  value={experience.startDate}
                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                <input
                  type="month"
                  value={experience.endDate}
                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
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
                  onClick={() => openModal(index)}
                >
                  AI Suggest
                </button>
              </label>
              <textarea
                placeholder="Describe your key responsibilities and achievements..."
                value={experience.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300 resize-none"
              />
            </div>
          </div>
        ))}

        <button
          onClick={addExperience}
          className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 text-slate-600 hover:border-primary-400 hover:text-primary-600 transition-all duration-300"
        >
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Another Position
        </button>
      </div>

      {/* AI Suggestion Modal */}
      {aiModal.open && (
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
    </div>
  )
} 