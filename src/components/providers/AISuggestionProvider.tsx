'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

import { AIFeatureType } from '@/components/document-builder/AISuggestionModal'

interface AISuggestionState {
  isOpen: boolean
  featureType: AIFeatureType | null
  currentText: string
  context: Record<string, unknown>
  index?: number
}

interface AISuggestionContextType {
  modalState: AISuggestionState
  openModal: (featureType: AIFeatureType, currentText: string, context?: Record<string, unknown>, index?: number) => void
  closeModal: () => void
  updateContext: (context: Record<string, unknown>) => void
}

const AISuggestionContext = createContext<AISuggestionContextType | undefined>(undefined)

const initialState: AISuggestionState = {
  isOpen: false,
  featureType: null,
  currentText: '',
  context: {},
  index: undefined
}

export function AISuggestionProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<AISuggestionState>(initialState)

  const openModal = (
    featureType: AIFeatureType, 
    currentText: string, 
    context: Record<string, unknown> = {}, 
    index?: number
  ) => {
    setModalState({
      isOpen: true,
      featureType,
      currentText,
      context,
      index
    })
  }

  const closeModal = () => {
    setModalState(initialState)
  }

  const updateContext = (context: Record<string, unknown>) => {
    setModalState(prev => ({
      ...prev,
      context: { ...prev.context, ...context }
    }))
  }

  const value: AISuggestionContextType = {
    modalState,
    openModal,
    closeModal,
    updateContext
  }

  return (
    <AISuggestionContext.Provider value={value}>
      {children}
    </AISuggestionContext.Provider>
  )
}

export function useAISuggestion() {
  const context = useContext(AISuggestionContext)
  if (context === undefined) {
    throw new Error('useAISuggestion must be used within an AISuggestionProvider')
  }
  return context
} 