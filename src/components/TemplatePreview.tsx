'use client'

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

export default function TemplatePreview({ template }: { template: CustomTemplate }) {
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