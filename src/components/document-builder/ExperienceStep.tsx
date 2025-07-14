import React, { useState } from 'react'

import AISuggestionModal from '@/components/document-builder/AISuggestionModal'
import { ExperienceInputRow } from '@/components/document-builder/ExperienceInputRow'
import { Experience } from '@/components/document-builder/types'
import { validateExperienceField } from '@/components/document-builder/validateExperienceField'
import { Button } from '@/components/ui/button'

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
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [currentExperienceIndex, setCurrentExperienceIndex] = useState<number | null>(null)
  const [errors, setErrors] = useState<{ [key: number]: { [field: string]: string } }>({})

  const openAIModal = (index: number) => {
    setCurrentExperienceIndex(index)
    setAiModalOpen(true)
  }

  const closeAIModal = () => {
    setAiModalOpen(false)
    setCurrentExperienceIndex(null)
  }

  const handleApplySuggestion = (suggestion: string) => {
    if (currentExperienceIndex !== null) {
      updateExperience(currentExperienceIndex, 'description', suggestion)
    }
  }

  const validateAndUpdate = (index: number, field: keyof Experience, value: string) => {
    const error = validateExperienceField(field, value)
    setErrors(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: error
      }
    }))
    updateExperience(index, field, value)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-6">
        {experiences.map((experience, index) => (
          <div key={index}>
            <ExperienceInputRow
              position={experience.position}
              company={experience.company}
              startDate={experience.startDate}
              endDate={experience.endDate}
              description={experience.description}
              onPositionChange={(value) => validateAndUpdate(index, 'position', value)}
              onCompanyChange={(value) => validateAndUpdate(index, 'company', value)}
              onStartDateChange={(value) => validateAndUpdate(index, 'startDate', value)}
              onEndDateChange={(value) => validateAndUpdate(index, 'endDate', value)}
              onDescriptionChange={(value) => validateAndUpdate(index, 'description', value)}
              onRemove={experiences.length > 1 ? () => removeExperience(index) : undefined}
              onAISuggest={() => openAIModal(index)}
              showRemove={experiences.length > 1}
              index={index}
            />
            {errors[index] && Object.keys(errors[index]).length > 0 && (
              <div className="mt-2 space-y-1">
                {Object.entries(errors[index]).map(([field, error]) => (
                  error && <p key={field} className="text-red-500 text-xs">{error}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button
          type="button"
          onClick={addExperience}
        >
          Add Experience
        </Button>
      </div>

      {/* AI Suggestion Modal */}
      {aiModalOpen && currentExperienceIndex !== null && (
        <AISuggestionModal
          isOpen={aiModalOpen}
          onClose={closeAIModal}
          featureType="experience"
          currentText={experiences[currentExperienceIndex].description}
          onApplySuggestion={handleApplySuggestion}
          index={currentExperienceIndex}
        />
      )}
    </div>
  )
} 