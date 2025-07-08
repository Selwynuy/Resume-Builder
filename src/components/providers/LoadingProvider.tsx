'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface LoadingState {
  isLoading: boolean
  message?: string
  type?: 'page' | 'form' | 'api' | 'file'
}

interface LoadingContextType {
  loadingState: LoadingState
  startLoading: (message?: string, type?: LoadingState['type']) => void
  stopLoading: () => void
  setLoadingMessage: (message: string) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

interface LoadingProviderProps {
  children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: '',
    type: 'page'
  })

  const startLoading = useCallback((message?: string, type: LoadingState['type'] = 'page') => {
    setLoadingState({
      isLoading: true,
      message: message || 'Loading...',
      type
    })
  }, [])

  const stopLoading = useCallback(() => {
    setLoadingState({
      isLoading: false,
      message: '',
      type: 'page'
    })
  }, [])

  const setLoadingMessage = useCallback((message: string) => {
    setLoadingState(prev => ({
      ...prev,
      message
    }))
  }, [])

  const value: LoadingContextType = {
    loadingState,
    startLoading,
    stopLoading,
    setLoadingMessage
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
} 