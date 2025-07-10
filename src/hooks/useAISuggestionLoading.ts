'use client'

import { useState, useCallback } from 'react'

import { AIFeatureType } from '@/components/resume-builder/AISuggestionModal'

interface UseAISuggestionLoadingReturn {
  loading: boolean
  error: string | null
  generateSuggestions: (
    featureType: AIFeatureType,
    currentText: string,
    context?: Record<string, unknown>
  ) => Promise<any>
  clearError: () => void
}

export function useAISuggestionLoading(): UseAISuggestionLoadingReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSuggestions = useCallback(async (
    featureType: AIFeatureType,
    currentText: string,
    context: Record<string, unknown> = {}
  ) => {
    setLoading(true)
    setError(null)

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
          body = { ...context }
          break
        case 'summary':
          url = '/api/ai/summary'
          body = { 
            mode: currentText ? 'improve' : 'generate', 
            text: currentText 
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

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

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

  return {
    loading,
    error,
    generateSuggestions,
    clearError
  }
} 