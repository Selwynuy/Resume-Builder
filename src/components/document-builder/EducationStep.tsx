import React, { useState } from 'react'

import { EducationInputRow } from '@/components/document-builder/EducationInputRow'
import { Education } from '@/components/document-builder/types'
import { validateEducationField } from '@/components/document-builder/validateEducationField'
import { Button } from '@/components/ui/button'

interface EducationStepProps {
  education: Education[]
  updateEducation: (index: number, field: keyof Education, value: string) => void
  addEducation: () => void
  removeEducation: (index: number) => void
}

export const EducationStep = ({ 
  education, 
  updateEducation,
  addEducation,
  removeEducation
}: EducationStepProps) => {
  const [errors, setErrors] = useState<{ [key: number]: { [field: string]: string } }>({})

  const validateAndUpdate = (index: number, field: keyof Education, value: string) => {
    const error = validateEducationField(field, value)
    setErrors(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: error
      }
    }))
    updateEducation(index, field, value)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index}>
            <EducationInputRow
              school={edu.school || ''}
              degree={edu.degree || ''}
              field={edu.field || ''}
              graduationDate={edu.graduationDate || ''}
              gpa={edu.gpa || ''}
              onSchoolChange={(value) => validateAndUpdate(index, 'school', value)}
              onDegreeChange={(value) => validateAndUpdate(index, 'degree', value)}
              onFieldChange={(value) => validateAndUpdate(index, 'field', value)}
              onGraduationDateChange={(value) => validateAndUpdate(index, 'graduationDate', value)}
              onGpaChange={(value) => validateAndUpdate(index, 'gpa', value)}
              onRemove={education.length > 1 ? () => removeEducation(index) : undefined}
              showRemove={education.length > 1}
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
          onClick={addEducation}
        >
          Add Education
        </Button>
      </div>
    </div>
  )
} 