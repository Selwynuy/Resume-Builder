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
  const [multiSummaries, setMultiSummaries] = useState<null | {
    resultsOriented: string;
    teamPlayer: string;
    innovative: string;
    concise: string;
  }>(null);
  const [multiLoading, setMultiLoading] = useState(false);
  const [multiError, setMultiError] = useState<string | null>(null);

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

  const handleMultiSuggest = async (index: number) => {
    setMultiLoading(true);
    setMultiError(null);
    setMultiSummaries(null);
    try {
      let editPairs = [];
      try {
        editPairs = JSON.parse(localStorage.getItem('ai_bullet_edits') || '[]');
      } catch {}
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
      else setMultiError(data.error || 'AI error');
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

  const openModal = (index: number) => {
    setAiModal({ open: true, index });
    setMultiSummaries(null);
    setMultiError(null);
    setMultiLoading(true);
    handleMultiSuggest(index);
  };
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
                onClick={closeModal}
                aria-label="Close"
                autoFocus
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M6 6l12 12m0-12l-12 12"/></svg>
              </button>
              <div className="flex-1 overflow-y-auto h-[65vh]">
                <h2 className="font-semibold mb-6 text-center text-lg sm:text-xl md:text-2xl">AI Job Description Suggestions</h2>
                <button
                  className="mb-6 self-center px-5 py-2 rounded bg-primary-100 text-primary-700 font-semibold hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors duration-200"
                  onClick={() => aiModal.index !== null && handleMultiSuggest(aiModal.index)}
                  disabled={multiLoading}
                >Regenerate Suggestions</button>
                {multiLoading && <div className="text-center py-12 text-lg">Loading...</div>}
                {multiError && <div className="text-red-500 text-center py-6">{multiError}</div>}
                {multiSummaries && (
                  <div className="space-y-4 sm:space-y-6">
                    {([
                      { key: 'resultsOriented', label: 'Results-Oriented' },
                      { key: 'teamPlayer', label: 'Team Player' },
                      { key: 'innovative', label: 'Innovative' },
                      { key: 'concise', label: 'Concise' },
                    ] as const).map(({ key, label }) => (
                      <div key={key} className={`border rounded-lg p-3 sm:p-5 md:p-8 bg-slate-50 ${experiences[aiModal.index!]?.description === multiSummaries[key] ? 'ring-2 ring-primary-500 bg-primary-50' : ''}`}
                        aria-selected={experiences[aiModal.index!]?.description === multiSummaries[key]}
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            if (aiModal.index !== null) {
                              updateExperience(aiModal.index, 'description', multiSummaries[key]);
                              setAiModal({ open: false, index: null });
                            }
                          }
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium capitalize text-base">{label}</span>
                          <div className="flex gap-2">
                            <button
                              className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors duration-200 ${experiences[aiModal.index!]?.description === multiSummaries[key] ? 'ring-2 ring-primary-400' : ''}`}
                              onClick={() => {
                                if (aiModal.index !== null) {
                                  updateExperience(aiModal.index, 'description', multiSummaries[key]);
                                  setAiModal({ open: false, index: null });
                                }
                              }}
                              aria-label={`Use ${label} job description`}
                            >Use</button>
                            <button
                              className="px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors duration-200"
                              onClick={() => navigator.clipboard.writeText(multiSummaries[key])}
                              aria-label={`Copy ${label} job description`}
                            >Copy</button>
                          </div>
                        </div>
                        <div className="text-base whitespace-pre-line leading-relaxed">{multiSummaries[key]}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 