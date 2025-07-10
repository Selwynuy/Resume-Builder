'use client'

import React, { useState } from 'react'

import { useToast } from '@/components/providers/ToastProvider'
import { Button } from '@/components/ui/button'
import { renderTemplate } from '@/lib/template-renderer'

interface ResumePreviewProps {
  resumeData: any
  template: any
  onEdit: () => void
}

export default function ResumePreview({ resumeData, template, onEdit }: ResumePreviewProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { showToast } = useToast()

  const handleExport = async () => {
    if (!resumeData._id) {
      showToast('Please save your resume before exporting', 'error')
      return
    }

    setIsExporting(true)
    try {
      const response = await fetch(`/api/resumes/${resumeData._id}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${resumeData.personalInfo?.name || 'resume'}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      showToast('Resume exported successfully!', 'success')
    } catch (error) {
      showToast('Failed to export resume. Please try again.', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  if (!template || !resumeData) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No template or resume data available</p>
      </div>
    )
  }

  let previewHtml = ''
  let previewCss = ''

  try {
    const result = renderTemplate(
      template.htmlTemplate || '',
      template.cssStyles || '',
      resumeData,
      false
    )
    previewHtml = result.html
    previewCss = result.css
  } catch (error) {
    console.error('Template rendering error:', error)
    previewHtml = '<div style="color: red; padding: 1rem;">Error rendering template</div>'
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Preview</h3>
        <div className="space-x-2">
          <Button onClick={onEdit} variant="outline" size="sm">
            Edit
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting || !resumeData._id}
            size="sm"
          >
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg bg-white shadow-lg overflow-hidden">
        <style>{previewCss}</style>
        <div 
          className="transform scale-75 origin-top-left"
          style={{ 
            width: '133.33%',
          }}
        >
          <div
            style={{ 
              height: '792px',
              fontSize: '12px',
              lineHeight: '1.4',
              fontFamily: 'Arial, sans-serif'
            }}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </div>
    </div>
  )
} 