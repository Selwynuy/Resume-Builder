'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

import { sanitizeTemplateContent } from '@/lib/security'
import { renderTemplate, getSampleResumeData } from '@/lib/template-renderer'

interface Template {
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
  isApproved: boolean
  previewImage?: string
  createdAt: string
}

export default function TemplateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchTemplate(params.id as string)
    }
  }, [params.id])

  const fetchTemplate = async (id: string) => {
    try {
      const response = await fetch(`/api/templates/${id}`)
      if (response.ok) {
        const data = await response.json()
        setTemplate(data.template)
      } else {
        router.push('/templates')
      }
    } catch (error) {
      console.error('Error fetching template:', error)
      router.push('/templates')
    } finally {
      setLoading(false)
    }
  }

  const handleUseTemplate = () => {
    if (!session) {
      router.push('/login')
      return
    }
    router.push(`/resume/new?customTemplate=${template?._id}`)
  }

  // Get consistent sample data for preview
  const sampleData = getSampleResumeData()

  let previewResult: { html: string; css: string } = { html: '', css: '' }
  if (template) {
    try {
      previewResult = renderTemplate(
        template.htmlTemplate || '',
        template.cssStyles || '',
        sampleData,
        true
      )
    } catch (error) {
      previewResult = {
        html: `<div style="color: red; padding: 1rem;">Template Error: ${error}</div>`,
        css: ''
      }
    }
  }
  const previewHtml = sanitizeTemplateContent(previewResult.html, true)
  const previewCss = previewResult.css

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!template) {
    return <div className="flex justify-center items-center min-h-screen">Template not found</div>
  }

  return (
    <div className="min-h-screen pt-32 pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h1 className="text-2xl font-bold mb-4">{template.name}</h1>
              <p className="text-gray-600 mb-6">{template.description}</p>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-medium">Creator:</span>
                  <span>{template.creatorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Category:</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm capitalize">
                    {template.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Downloads:</span>
                  <span>{template.downloads}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleUseTemplate}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Use This Template
                </button>
                
                <button
                  onClick={() => router.push('/templates')}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back to Templates
                </button>
              </div>

              {!template.isApproved && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ This template is pending approval and not yet available.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Template Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Template Preview</h2>
              <div className="border border-gray-200 rounded-lg bg-white shadow-lg mx-auto overflow-hidden">
                <style>{previewCss}</style>
                <div 
                  className="transform scale-75 origin-top-left"
                  style={{ 
                    width: '133.33%', // Compensate for scale-75 (100/75 = 133.33)
                    height: 'auto'
                  }}
                >
                  <div
                    style={{ 
                      width: '612px', // 8.5 inches at 72 DPI
                      minHeight: '792px', // 11 inches at 72 DPI
                      padding: '36px', // 0.5 inch margins
                      fontSize: '12px',
                      lineHeight: '1.4',
                      fontFamily: 'Arial, sans-serif'
                    }}
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 