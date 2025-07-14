'use client'

import React from 'react'

import { useToast } from '@/components/providers/ToastProvider'
import { Button } from '@/components/ui/button'

interface EditableSectionProps {
  title: string
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  children: React.ReactNode
  hasChanges?: boolean
  isSaving?: boolean
}

export default function EditableSection({
  title,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  children,
  hasChanges = false,
  isSaving = false
}: EditableSectionProps) {
  const { showToast } = useToast()

  const handleSave = async () => {
    try {
      await onSave()
      showToast(`${title} saved successfully!`, 'success')
    } catch (error) {
      showToast(`Failed to save ${title.toLowerCase()}. Please try again.`, 'error')
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {!isEditing ? (
          <Button onClick={onEdit} variant="outline" size="sm">
            Edit
          </Button>
        ) : (
          <div className="space-x-2">
            <Button 
              onClick={handleSave} 
              disabled={!hasChanges || isSaving}
              size="sm"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={onCancel} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        )}
      </div>
      {children}
    </div>
  )
} 