'use client'

import React, { useState } from 'react'

import { useToast } from '@/components/providers/ToastProvider'
import { Button } from '@/components/ui/button'
import { renderTemplate } from '@/lib/template-renderer'
import { DocumentType } from './types'

interface ResumePreviewProps {
  resumeData: any
  template: any
  onEdit: () => void
  documentType?: DocumentType
}

const DOCUMENT_TYPE_LABELS = {
  [DocumentType.RESUME]: 'Resume',
  [DocumentType.CV]: 'CV',
  [DocumentType.BIODATA]: 'Biodata'
};

export default function ResumePreview({ resumeData, template, onEdit, documentType = DocumentType.RESUME }: ResumePreviewProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { showToast } = useToast()

  const handleExport = async (format: 'pdf' | 'docx' | 'txt' = 'pdf') => {
    if (!resumeData._id) {
      showToast('Please save your document before exporting', 'error')
      return
    }

    setIsExporting(true)
    try {
      const response = await fetch(`/api/resumes/${resumeData._id}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format })
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const documentLabel = DOCUMENT_TYPE_LABELS[documentType];
      a.download = `${resumeData.personalInfo?.name || documentLabel.toLowerCase()}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      showToast(`${documentLabel} exported successfully!`, 'success')
    } catch (error) {
      showToast(`Failed to export ${DOCUMENT_TYPE_LABELS[documentType].toLowerCase()}. Please try again.`, 'error')
    } finally {
      setIsExporting(false)
    }
  }

  if (!template || !resumeData) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No template or document data available</p>
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

  const documentLabel = DOCUMENT_TYPE_LABELS[documentType];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{documentLabel} Preview</h3>
          <p className="text-sm text-gray-600">Review your {documentLabel.toLowerCase()} before finalizing</p>
        </div>
        <div className="space-x-2">
          <Button onClick={onEdit} variant="outline" size="sm">
            Edit
          </Button>
          <div className="relative inline-block">
            <Button 
              onClick={() => handleExport('pdf')} 
              disabled={isExporting || !resumeData._id}
              size="sm"
            >
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
            {/* TODO: Add dropdown for other export formats when implemented */}
          </div>
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