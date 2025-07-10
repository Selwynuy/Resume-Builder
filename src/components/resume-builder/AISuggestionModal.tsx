'use client'

import React, { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'

export type AIFeatureType = 'experience' | 'skills' | 'summary' | 'bullet'

export interface AISuggestionModalProps {
  isOpen: boolean
  onClose: () => void
  featureType: AIFeatureType
  currentText: string
  onApplySuggestion: (suggestion: string) => void
  onApplyAllSuggestions?: (suggestions: string[]) => void
  context?: Record<string, unknown>
  index?: number // For experience items
  existingSkillNames?: string[]
}

export interface AISuggestion {
  text: string
  style?: string
  confidence?: number
}

export interface MultiStyleSuggestions {
  resultsOriented?: string
  teamPlayer?: string
  innovative?: string
  concise?: string
  professional?: string
  creative?: string
  friendly?: string
  technical?: string
}

export default function AISuggestionModal({
  isOpen,
  onClose,
  featureType,
  currentText,
  onApplySuggestion,
  onApplyAllSuggestions,
  context = {},
  index,
  existingSkillNames
}: AISuggestionModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [multiStyleSuggestions, setMultiStyleSuggestions] = useState<MultiStyleSuggestions | null>(null)

  const getStylePrompt = (): string => {
    try {
      const editPairs = JSON.parse(localStorage.getItem('ai_bullet_edits') || '[]')
      if (editPairs.length) {
        return '\nHere are some examples of how the user edits AI suggestions. Please match their style.\n' +
          editPairs.map((p: { ai: string; user: string }) => `AI: ${p.ai}\nUser: ${p.user}`).join('\n')
      }
    } catch {
      // Ignore localStorage errors
    }
    return ''
  }

  useEffect(() => {
    if (!isOpen) return;
    if (featureType === 'skills') {
      if (!loading) generateSuggestions();
    } else if (currentText.trim()) {
      if (!loading) generateSuggestions();
    }
  }, [isOpen, featureType, currentText]);

  const generateSuggestions = async (isRetry = false) => {
    if (isRetry) {
      setRetryCount(prev => prev + 1)
    } else {
      setRetryCount(0)
    }
    
    setLoading(true)
    setError(null)
    setSuggestions([])
    setMultiStyleSuggestions(null)

    // Outer try removed; only inner try/catch/finally remains
    try {
      let url = ''
      let body: Record<string, unknown> = {}

      switch (featureType) {
        case 'experience':
          url = '/api/ai/bullet'
          body = { 
            text: currentText, 
            mode: 'multi',
            stylePrompt: getStylePrompt()
          }
          break
        case 'skills':
          url = '/api/ai/skills'
          // Enhanced context for skills suggestions
          body = { 
            ...context,
            resumeContent: context.resumeContent || '',
            experienceDescriptions: context.experienceDescriptions || '',
            jobTitle: context.jobTitle || '',
            industry: context.industry || ''
          }
          break
        case 'summary':
          url = '/api/ai/summary'
          body = { 
            mode: currentText ? 'improve' : 'generate', 
            text: currentText,
            context: context.resumeContent || ''
          }
          break
        case 'bullet':
          url = '/api/ai/bullet'
          body = { 
            text: currentText, 
            mode: 'rewrite',
            stylePrompt: getStylePrompt()
          }
          break
        default:
          throw new Error(`Unsupported AI feature type: ${featureType}`)
      }

            const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorText = await response.text()
          let errorMessage = `API error: ${response.status}`
          
          try {
            const errorData = JSON.parse(errorText)
            errorMessage += ` - ${errorData.error || errorData.message || errorText}`
          } catch {
            errorMessage += ` - ${errorText}`
          }
          
          throw new Error(errorMessage)
        }

        const data = await response.json()

        if (featureType === 'experience' && data.summaries) {
          setMultiStyleSuggestions(data.summaries)
        } else if (featureType === 'skills' && data.skills) {
          // Handle skills suggestions with proper formatting
          const skillsList = Array.isArray(data.skills) ? data.skills : []
          setSuggestions(skillsList.map((skill: string) => ({ 
            text: skill.trim(),
            style: 'skill'
          })))
        } else if (featureType === 'summary' && data.summaries) {
          setMultiStyleSuggestions(data.summaries)
        } else if (featureType === 'bullet' && data.suggestion) {
          setSuggestions([{ text: data.suggestion }])
        } else if (data.suggestion) {
          setSuggestions([{ text: data.suggestion }])
        } else {
          throw new Error(data.error || 'No suggestions returned')
        }
      } catch (fetchError) {
        clearTimeout(timeoutId)
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          setError('Request timed out. Please try again.')
        } else {
          const errorMessage = fetchError instanceof Error ? fetchError.message : 'An unexpected error occurred'
          setError(errorMessage)
        }
        
        // Log error for debugging
        console.error('AI Suggestion Error:', {
          featureType,
          error: fetchError instanceof Error ? fetchError.message : 'Unknown error',
          retryCount: retryCount + (isRetry ? 1 : 0),
          currentText: currentText.substring(0, 100) + '...'
        })
      } finally {
        setLoading(false)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      setLoading(false)
    }
  } // closes generateSuggestions

  const saveEditPair = (ai: string, user: string) => {
      if (!ai || !user || ai === user) return
      const key = 'ai_bullet_edits'
      try {
        const prev = JSON.parse(localStorage.getItem(key) || '[]')
        prev.push({ ai, user })
        localStorage.setItem(key, JSON.stringify(prev.slice(-3)))
      } catch {
        // Ignore localStorage errors
      }
    }

    const handleApplySuggestion = (suggestion: string) => {
      if (featureType === 'experience' || featureType === 'bullet') {
        saveEditPair(suggestion, currentText)
      }
      onApplySuggestion(suggestion)
      // Do not close modal for skills
      if (featureType !== 'skills') onClose()
    }

    const handleApplyAll = () => {
      if (onApplyAllSuggestions && suggestions.length > 0) {
        const newSuggestions = suggestions
          .map(s => s.text)
          .filter(s => !existingSkillNames?.includes(s.toLowerCase()))
        if (newSuggestions.length > 0) {
          onApplyAllSuggestions(newSuggestions)
        }
        onClose()
      }
    }

    const handleRetry = () => {
      if (retryCount < 3) {
        generateSuggestions(true)
      } else {
        setError('Maximum retry attempts reached. Please try again later.')
      }
    }

    const getFeatureTypeDisplayName = (type: AIFeatureType): string => {
      switch (type) {
        case 'experience':
          return 'Experience Description'
        case 'skills':
          return 'Skills'
        case 'summary':
          return 'Professional Summary'
        case 'bullet':
          return 'Bullet Point'
        default:
          return 'Suggestions'
      }
    }

    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
          <button 
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-full p-1" 
            onClick={onClose} 
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h4 className="font-semibold text-lg mb-2 text-primary-700">
            AI {getFeatureTypeDisplayName(featureType)} Suggestions
          </h4>

          {loading ? (
            <div className="text-center py-8">
              <div 
                className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent mx-auto mb-4"
                role="status"
                aria-label="Loading suggestions"
              ></div>
              <p className="text-slate-500">Generating suggestions...</p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
                <div className="font-medium mb-2">Error generating suggestions</div>
                <div className="text-sm">{error}</div>
                {retryCount > 0 && (
                  <div className="text-xs text-red-600 mt-2">
                    Retry attempt: {retryCount}/3
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {retryCount < 3 ? (
                  <Button onClick={handleRetry} variant="outline">
                    Try Again ({3 - retryCount} attempts left)
                  </Button>
                ) : (
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Refresh Page
                  </Button>
                )}
                <Button onClick={onClose} variant="outline">
                  Dismiss
                </Button>
              </div>
            </div>
          ) : multiStyleSuggestions ? (
            <div className="space-y-4">
              {Object.entries(multiStyleSuggestions).map(([style, suggestion]) => (
                <div key={style} className="border border-slate-200 rounded-lg p-4">
                  <h5 className="font-medium text-slate-800 mb-2 capitalize">
                    {style.replace(/([A-Z])/g, ' $1').trim()}
                  </h5>
                  <p className="text-slate-600 text-sm mb-3">{suggestion}</p>
                  <Button
                    onClick={() => handleApplySuggestion(suggestion)}
                    variant="outline"
                    size="sm"
                    className="text-primary-600 hover:text-primary-800 border-primary-200"
                  >
                    Use This
                  </Button>
                </div>
              ))}
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-4">
              {suggestions.map((suggestion, idx) => {
                const alreadyAdded = existingSkillNames?.includes(suggestion.text.toLowerCase())
                return (
                  <div key={idx} className="border border-slate-200 rounded-lg p-4">
                    {featureType === 'skills' ? (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 text-sm font-medium">{suggestion.text}</span>
                        <Button
                          onClick={() => handleApplySuggestion(suggestion.text)}
                          variant="outline"
                          size="sm"
                          className="text-primary-600 hover:text-primary-800 border-primary-200"
                          disabled={alreadyAdded}
                          title={alreadyAdded ? 'Skill already added' : ''}
                        >
                          {alreadyAdded ? 'Added' : 'Add Skill'}
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="text-slate-600 text-sm mb-3">{suggestion.text}</p>
                        <Button
                          onClick={() => handleApplySuggestion(suggestion.text)}
                          variant="outline"
                          size="sm"
                          className="text-primary-600 hover:text-primary-800 border-primary-200"
                        >
                          Use This
                        </Button>
                      </>
                    )}
                  </div>
                )
              })}
              {featureType === 'skills' && suggestions.length > 1 && (
                <div className="flex justify-end mt-2">
                  <Button onClick={handleApplyAll} variant="default" size="sm">
                    Add All
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              No suggestions available
            </div>
          )}

          <div className="flex gap-2 justify-end mt-4">
            {(featureType === 'skills' || suggestions.length > 0 || error) && (
              <Button onClick={() => generateSuggestions(true)} disabled={loading} variant="outline">
                {loading ? 'Regenerating...' : 'Regenerate'}
              </Button>
            )}
            <Button onClick={onClose} variant="outline">
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    )
  }
