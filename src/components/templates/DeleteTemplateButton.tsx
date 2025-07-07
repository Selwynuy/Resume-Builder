"use client"

interface DeleteTemplateButtonProps {
  templateId: string
}

export default function DeleteTemplateButton({ templateId }: DeleteTemplateButtonProps) {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return
    }

    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Failed to delete template')
      }
    } catch (error) {
      alert('Error deleting template')
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-900"
    >
      Delete
    </button>
  )
} 