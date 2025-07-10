'use client'

import { useCallback, useEffect } from 'react'

import { useLoading } from '@/components/providers/LoadingProvider'

interface UseLoadingStateOptions {
  type?: 'page' | 'form' | 'api' | 'file'
  autoStop?: boolean
  timeout?: number
}

export function useLoadingState(options: UseLoadingStateOptions = {}) {
  const { startLoading, stopLoading, setLoadingMessage } = useLoading()
  const { type = 'api', autoStop = true, timeout = 30000 } = options

  const withLoading = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    startLoading(message, type)
    
    try {
      const result = await asyncFn()
      return result
    } finally {
      if (autoStop) {
        stopLoading()
      }
    }
  }, [startLoading, stopLoading, type, autoStop])

  const withLoadingMessage = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    messages: {
      start: string
      success?: string
      error?: string
    }
  ): Promise<T> => {
    startLoading(messages.start, type)
    
    try {
      const result = await asyncFn()
      if (messages.success) {
        setLoadingMessage(messages.success)
        // Auto-stop after success message
        setTimeout(() => stopLoading(), 2000)
      } else if (autoStop) {
        stopLoading()
      }
      return result
    } catch (error) {
      if (messages.error) {
        setLoadingMessage(messages.error)
        // Auto-stop after error message
        setTimeout(() => stopLoading(), 3000)
      } else if (autoStop) {
        stopLoading()
      }
      throw error
    }
  }, [startLoading, stopLoading, setLoadingMessage, type, autoStop])

  // Auto-stop loading after timeout
  useEffect(() => {
    if (timeout && timeout > 0) {
      const timer = setTimeout(() => {
        stopLoading()
      }, timeout)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [timeout, stopLoading])

  return {
    withLoading,
    withLoadingMessage,
    startLoading: (message?: string) => startLoading(message, type),
    stopLoading,
    setLoadingMessage
  }
} 