import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

interface AutoSaveData {
  personalInfo: any
  experiences: any[]
  education: any[]
  skills: any[]
  template: string
}

export const useAutoSave = (data: AutoSaveData, resumeId?: string) => {
  const { data: session } = useSession()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastSavedRef = useRef<string>('')

  useEffect(() => {
    if (!session) return

    const currentData = JSON.stringify(data)
    
    // Don't save if data hasn't changed
    if (currentData === lastSavedRef.current) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for 3 seconds
    timeoutRef.current = setTimeout(async () => {
      try {
        const endpoint = resumeId ? `/api/resumes/${resumeId}` : '/api/resumes/autosave'
        const method = resumeId ? 'PUT' : 'POST'

        const response = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        if (response.ok) {
          lastSavedRef.current = currentData
          // Show subtle save indicator
          const saveIndicator = document.getElementById('save-indicator')
          if (saveIndicator) {
            saveIndicator.textContent = '✓ Saved'
            saveIndicator.className = 'text-green-600 text-sm'
            setTimeout(() => {
              saveIndicator.textContent = ''
            }, 2000)
          }
        }
      } catch (error) {
        console.error('Auto-save failed:', error)
      }
    }, 3000)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, session, resumeId])
} 