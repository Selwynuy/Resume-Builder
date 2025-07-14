'use client'

import React from 'react'
import { useEffect, useState } from 'react'

import { sanitizeTemplateContent } from '@/lib/security'
import { renderTemplate, getSampleResumeData } from '@/lib/template-renderer'

interface CustomTemplate {
  _id: string
  name: string
  description: string
  category: string
  price: number
  createdBy: string
  creatorName: string
  htmlTemplate: string
  cssStyles: string
  placeholders: string[]
  layout: string
  downloads: number
  rating: number
  ratingCount: number
  previewImage?: string
  createdAt: string
  tags?: string[]
  isApproved: boolean
}

export default function TemplatePreview({ template }: { template: CustomTemplate & { supportedDocumentTypes?: string[] } }) {
  const [preview, setPreview] = useState<{ html: string; css: string }>({ html: '', css: '' })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const generatePreview = () => {
      try {
        const sampleData = getSampleResumeData()
        const result = renderTemplate(template.htmlTemplate, template.cssStyles, sampleData, true)
        
        if (typeof result === 'string') {
          setPreview({ html: sanitizeTemplateContent(result), css: '' })
        } else {
          setPreview({
            html: sanitizeTemplateContent(result.html),
            css: result.css || ''
          })
        }
      } catch (error) {
        setPreview({
          html: `<div style="padding: 20px; text-align: center; color: #666; font-family: Arial;">
            <div style="font-size: 24px; margin-bottom: 8px;">📄</div>
            <div>Preview unavailable</div>
          </div>`,
          css: ''
        })
      } finally {
        setIsLoading(false)
      }
    }

    generatePreview()
  }, [template])

  const scale = 0.35

  if (isLoading) {
    return (
      <div className="bg-white shadow-lg rounded-md border w-full max-w-[320px] aspect-[8.5/11] overflow-hidden flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 w-full h-full"></div>
      </div>
    )
  }

  return (
    <div
      className="bg-white shadow-lg rounded-md border w-full max-w-[320px] aspect-[8.5/11] overflow-hidden flex items-center justify-center"
      style={{ position: "relative" }}
    >
      {/* Document Type Badges */}
      {template.supportedDocumentTypes && template.supportedDocumentTypes.length > 0 && (
        <div className="absolute top-2 left-2 flex gap-1 z-10">
          {template.supportedDocumentTypes.map((type) => (
            <span
              key={type}
              className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm
                ${type === 'resume' ? 'bg-blue-100 text-blue-800' :
                  type === 'cv' ? 'bg-purple-100 text-purple-800' :
                  type === 'biodata' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'}`}
            >
              {type === 'resume' ? 'Resume' : type === 'cv' ? 'CV' : type === 'biodata' ? 'Biodata' : type}
            </span>
          ))}
        </div>
      )}
      <style>{preview.css}</style>
      <div
        dangerouslySetInnerHTML={{ __html: preview.html }}
        style={{
          width: 816,
          height: 1056,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          pointerEvents: "none",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </div>
  )
} 