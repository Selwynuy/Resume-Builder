import { useSession } from 'next-auth/react'
import { useEffect, useRef } from 'react'

interface AutoSaveData {
  personalInfo: Record<string, unknown>
  experiences: Record<string, unknown>[]
  education: Record<string, unknown>[]
  skills: Record<string, unknown>[]
  template: string
  resumeId?: string
}

export const useAutoSave = (data: AutoSaveData) => {
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
        const response = await fetch('/api/resumes/autosave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            resumeId: data.resumeId
          })
        })

        if (response.ok) {
          lastSavedRef.current = currentData
          // Show save indicator
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
        // All console.error statements removed for production
      }
    }, 3000)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, session])
} 