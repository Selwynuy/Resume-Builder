'use client'

import { useState, useEffect } from 'react'
import { renderTemplate, getSampleResumeData } from '@/lib/template-renderer'

interface TemplateStepProps {
  selectedTemplate: string
  onTemplateSelect: (templateId: string) => void
  returnToStep?: number | null
}

export const TemplateStep = ({ 
  selectedTemplate, 
  onTemplateSelect,
  returnToStep 
}: TemplateStepProps) => {
  const [allTemplates, setAllTemplates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAllTemplates = async () => {
      try {
        setIsLoading(true)
        
        // Fetch only community templates (no more built-in templates)
        const response = await fetch('/api/templates')
        let communityTemplates = []
        
        if (response.ok) {
          const data = await response.json()
          communityTemplates = (data.templates || []).map((template: any) => ({
            ...template,
            id: template.id || template._id // Ensure we have an id field
          }))
          console.log('🌐 Community templates loaded:', communityTemplates.map((t: any) => ({ id: t.id, name: t.name })))
        } else {
          console.error('Failed to fetch community templates')
        }
        
        setAllTemplates(communityTemplates)
        console.log('📋 Total templates available:', communityTemplates.length)
      } catch (error) {
        console.error('Error fetching templates:', error)
        setAllTemplates([]) // No fallback - encourage using community templates only
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllTemplates()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Choose Your Perfect Template</h3>
          <p className="text-slate-600">Loading available templates...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4].map((i) => (
            <div key={i} className="border-2 border-gray-200 rounded-xl p-6 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Choose Your Perfect Template</h3>
        <p className="text-slate-600">Select a design that represents your professional style</p>
        {/* Show navigation hint if coming from another step */}
        {returnToStep && returnToStep > 1 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-center text-blue-700">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">
                Select a template and you'll return to step {returnToStep} automatically
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTemplates.map((template) => (
          <div 
            key={template.id}
            className={`
              border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg
              ${selectedTemplate === template.id 
                ? 'border-primary-500 bg-primary-50 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => {
              console.log('🖱️ Template clicked:', template.id, template.name)
              if (template.id) {
                onTemplateSelect(template.id)
              } else {
                console.error('❌ Template has no ID:', template)
              }
            }}
          >
            {/* Mini Preview */}
            <div className="h-64 bg-gray-50 rounded-lg mb-4 relative overflow-hidden">
              {/* All templates are now community templates */}
              <div 
                className="w-full h-full transform scale-[0.4] origin-top-left"
                style={{ width: '250%', height: '250%' }}
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    try {
                      const sampleData = getSampleResumeData()
                      return renderTemplate(
                        template.htmlTemplate || '', 
                        template.cssStyles || '', 
                        sampleData, 
                        true
                      )
                    } catch (error) {
                      console.error('Template preview error:', error)
                      return `<div style="padding: 20px; text-align: center; color: #666; font-family: Arial;">
                        <div style="font-size: 24px; margin-bottom: 8px;">📄</div>
                        <div>Preview unavailable</div>
                      </div>`
                    }
                  })()
                }}
              />
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
            <p className="text-slate-600 text-sm mb-3">{template.description}</p>
            
            {template.colors && (
              <div className="flex space-x-2 mb-3">
                {Object.values(template.colors).slice(0, 4).map((color: any, index: number) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
            )}
            
            {selectedTemplate === template.id && (
              <div className="flex items-center text-primary-600 font-medium text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Selected
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 