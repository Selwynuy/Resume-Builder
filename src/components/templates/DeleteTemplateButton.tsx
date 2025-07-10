'use client'

import { useState } from 'react'

import { useToast } from '@/components/providers/ToastProvider'
import { Button } from '@/components/ui/button'

interface DeleteTemplateButtonProps {
  templateId: string
  templateName: string
  onDelete: () => void
}

export default function DeleteTemplateButton({ 
  templateId, 
  templateName, 
  onDelete 
}: DeleteTemplateButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { showToast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error('Failed to delete template')
      }

      showToast('Template deleted successfully!', 'success')
      onDelete()
    } catch (error) {
      showToast('Failed to delete template. Please try again.', 'error')
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <Button 
          onClick={handleDelete} 
          variant="destructive" 
          size="sm"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Confirm Delete'}
        </Button>
        <Button 
          onClick={() => setShowConfirm(false)} 
          variant="outline" 
          size="sm"
          disabled={isDeleting}
        >
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <Button 
      onClick={() => setShowConfirm(true)} 
      variant="destructive" 
      size="sm"
      title={`Delete ${templateName}`}
    >
      Delete
    </Button>
  )
} 