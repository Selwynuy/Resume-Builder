'use client'

import React, { useState } from 'react'

import { ValidatedInput, validatePersonalInfoField } from '@/components/resume-builder'
import AISuggestionModal from '@/components/resume-builder/AISuggestionModal'
import { PersonalInfo } from '@/components/resume-builder/types'
import { INPUT_LIMITS } from '@/lib/security'

interface PersonalInfoStepProps {
  personalInfo: PersonalInfo
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void
}

export const PersonalInfoStep = ({ 
  personalInfo,
  updatePersonalInfo 
}: PersonalInfoStepProps) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [aiModalOpen, setAiModalOpen] = useState(false)

  const validateAndUpdate = (field: keyof PersonalInfo, value: string) => {
    const newErrors = { ...errors }
    try {
      const error = validatePersonalInfoField(field, value);
      
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
    } catch { /* ignore errors from validatePersonalInfoField */ }

    setErrors(newErrors)
    updatePersonalInfo(field, value)
  }

  const openAIModal = () => {
    setAiModalOpen(true)
  }

  const closeAIModal = () => {
    setAiModalOpen(false)
  }

  const handleApplySuggestion = (suggestion: string) => {
    updatePersonalInfo('summary', suggestion)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-6">
        <ValidatedInput
          label="Full Name"
          type="text"
          placeholder="e.g. John Doe"
          value={personalInfo.name}
          onChange={(value) => validateAndUpdate('name', value)}
          error={errors.name}
          maxLength={INPUT_LIMITS.NAME}
          pattern="[a-zA-Z .']*-"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ValidatedInput
            label="Email Address"
            type="email"
            placeholder="e.g. john@example.com"
            value={personalInfo.email}
            onChange={(value) => validateAndUpdate('email', value)}
            error={errors.email}
            maxLength={INPUT_LIMITS.EMAIL}
            required
          />

          <ValidatedInput
            label="Phone Number"
            type="tel"
            placeholder="e.g. (555) 123-4567"
            value={personalInfo.phone}
            onChange={(value) => validateAndUpdate('phone', value)}
            error={errors.phone}
            maxLength={INPUT_LIMITS.PHONE}
            pattern="[\+]?[\d\s\-\(\)]*"
          />
        </div>

        <ValidatedInput
          label="Location"
          type="text"
          placeholder="e.g. New York, NY"
          value={personalInfo.location}
          onChange={(value) => validateAndUpdate('location', value)}
          error={errors.location}
          maxLength={INPUT_LIMITS.LOCATION}
          pattern="[a-zA-Z0-9 ,.'-]*"
        />

        <ValidatedInput
          label="Professional Summary"
          type="textarea"
          placeholder="Briefly describe your professional background and goals..."
          value={personalInfo.summary}
          onChange={(value) => validateAndUpdate('summary', value)}
          error={errors.summary}
          maxLength={INPUT_LIMITS.SUMMARY}
          rows={4}
        >
          <button
            type="button"
            className="ml-2 text-primary-600 hover:text-primary-800 text-xs font-semibold border border-primary-200 rounded px-2 py-1 transition-all duration-200"
            onClick={openAIModal}
          >
            AI Suggest
          </button>
        </ValidatedInput>
        
        <p className="text-sm text-slate-500 mt-2">
          2-3 sentences highlighting your key strengths and career objectives 
          ({personalInfo.summary.length}/{INPUT_LIMITS.SUMMARY} characters)
        </p>
      </div>

      {/* AI Suggestion Modal */}
      {aiModalOpen && (
        <AISuggestionModal
          isOpen={aiModalOpen}
          onClose={closeAIModal}
          featureType="summary"
          currentText={personalInfo.summary}
          onApplySuggestion={handleApplySuggestion}
        />
      )}
    </div>
  )
} 