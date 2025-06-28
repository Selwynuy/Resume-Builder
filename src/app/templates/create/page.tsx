'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { renderTemplate, extractPlaceholders, validateTemplate, getSampleResumeData, getBuiltInTemplates } from '@/lib/template-renderer'
import { useSafeHtml } from '@/hooks/useSafeHtml'

interface TemplateMetadata {
  name: string
  description: string
  category: string
  price: number
}

export default function CreateTemplatePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [htmlTemplate, setHtmlTemplate] = useState('')
  const [cssStyles, setCssStyles] = useState('')
  const [metadata, setMetadata] = useState<TemplateMetadata>({
    name: '',
    description: '',
    category: 'professional',
    price: 0
  })
  
  const [showPreview, setShowPreview] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'preview'>('html')

  const [isEditing, setIsEditing] = useState(false)
  const [templateId, setTemplateId] = useState<string | null>(null)

  const sampleData = getSampleResumeData()
  const builtInTemplates = getBuiltInTemplates()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const editId = urlParams.get('edit')
    
    if (editId) {
      setIsEditing(true)
      setTemplateId(editId)
      fetchTemplateForEdit(editId)
    }
  }, [])

  const fetchTemplateForEdit = async (id: string) => {
    try {
      const response = await fetch(`/api/templates/${id}`)
      if (response.ok) {
        const template = await response.json()
        
        setHtmlTemplate(template.htmlTemplate)
        setCssStyles(template.cssStyles || '')
        setMetadata({
          name: template.name,
          description: template.description,
          category: template.category,
          price: template.price || 0
        })
      } else {
        alert('Template not found')
        router.push('/dashboard')
      }
    } catch (error) {
      alert('Error loading template')
      router.push('/dashboard')
    }
  }

  const handleLoadTemplate = (templateData: any) => {
    setHtmlTemplate(templateData.htmlTemplate)
    setCssStyles(templateData.cssStyles)
    setMetadata(prev => ({
      ...prev,
      name: templateData.name,
      description: templateData.description
    }))
  }

  const handlePublishTemplate = async () => {
    if (!htmlTemplate.trim() || !metadata.name || !metadata.description) {
      alert('Please fill in all required fields')
      return
    }

    const validation = validateTemplate(htmlTemplate, cssStyles)
    if (!validation.isValid) {
      alert(`Template validation failed: ${validation.errors.join(', ')}`)
      return
    }

    setIsPublishing(true)
    try {
      const placeholders = extractPlaceholders(htmlTemplate)
      
      const url = isEditing ? `/api/templates/${templateId}` : '/api/templates'
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...metadata,
          htmlTemplate,
          cssStyles,
          placeholders,
          layout: 'custom'
        })
      })

      if (response.ok) {
        alert(`Template ${isEditing ? 'updated' : 'published'} successfully!`)
        router.push('/templates')
      } else {
        const errorData = await response.json()
        alert(`Error ${isEditing ? 'updating' : 'publishing'} template: ${errorData.error}`)
      }
    } catch (error) {
      alert(`Error ${isEditing ? 'updating' : 'publishing'} template`)
    } finally {
      setIsPublishing(false)
    }
  }

  const getPreviewHtml = () => {
    try {
      return renderTemplate(htmlTemplate, cssStyles, sampleData)
    } catch (error) {
      return `<div style="color: red; padding: 1rem;">Template Error: ${error}</div>`
    }
  }

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen pt-32 pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-4">
              {isEditing ? 'Edit HTML/CSS Template' : 'Create HTML/CSS Template'}
            </h1>
            <p className="text-slate-600 text-lg">
              Create beautiful resume templates using HTML and CSS
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Editor & Settings */}
            <div className="space-y-6">
              {/* Template Examples */}
              <div className="glass-card p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Quick Start Templates</h2>
                <div className="grid gap-3">
                  {builtInTemplates.map((template) => (
                      <button
                      key={template.id}
                      onClick={() => handleLoadTemplate(template)}
                      className="text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                      >
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                      </button>
                  ))}
                </div>
              </div>

              {/* Code Editor */}
                <div className="glass-card p-6 rounded-2xl">
                <div className="flex space-x-1 mb-4">
                  <button
                    onClick={() => setActiveTab('html')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'html' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    HTML Template
                  </button>
                  <button
                    onClick={() => setActiveTab('css')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'css' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    CSS Styles
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'preview' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Preview
                  </button>
                </div>

                {activeTab === 'html' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HTML Template *
                    </label>
                    <textarea
                      value={htmlTemplate}
                      onChange={(e) => setHtmlTemplate(e.target.value)}
                      rows={20}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                      placeholder="Enter your HTML template with Handlebars placeholders..."
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      Use Handlebars syntax like: <code>{'{{personalInfo.name}}'}</code>, <code>{'{{#each experiences}}'}</code>
                    </div>
                        </div>
                      )}
                      
                {activeTab === 'css' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CSS Styles
                    </label>
                    <textarea
                      value={cssStyles}
                      onChange={(e) => setCssStyles(e.target.value)}
                      rows={20}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                      placeholder="Enter your CSS styles..."
                    />
                    </div>
                  )}

                {activeTab === 'preview' && (
                  <div>
                    <div className="border border-gray-200 rounded-lg p-4 bg-white min-h-[500px] max-h-[500px] overflow-auto">
                      <div dangerouslySetInnerHTML={{ __html: useSafeHtml(getPreviewHtml()) }} />
                    </div>
                  </div>
                )}
                </div>

              {/* Template Metadata */}
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-semibold mb-4">Template Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template Name *
                      </label>
                      <input
                        type="text"
                        value={metadata.name}
                        onChange={(e) => setMetadata(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Modern Professional Template"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={metadata.description}
                        onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="A clean, professional template perfect for corporate positions..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={metadata.category}
                          onChange={(e) => setMetadata(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="professional">Professional</option>
                          <option value="creative">Creative</option>
                          <option value="modern">Modern</option>
                          <option value="minimal">Minimal</option>
                          <option value="academic">Academic</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                        step="1"
                          value={metadata.price}
                          onChange={(e) => setMetadata(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                  </div>

                  <button
                    onClick={handlePublishTemplate}
                    disabled={isPublishing}
                    className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPublishing ? (isEditing ? 'Updating...' : 'Publishing...') : (isEditing ? 'Update Template' : 'Publish Template')}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Documentation */}
            <div className="space-y-6">
              {/* Handlebars Guide */}
                <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4">Available Placeholders</h3>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Personal Information:</h4>
                    <div className="space-y-1 font-mono text-xs bg-gray-50 p-3 rounded">
                      <div>{'{{personalInfo.name}}'}</div>
                      <div>{'{{personalInfo.email}}'}</div>
                      <div>{'{{personalInfo.phone}}'}</div>
                      <div>{'{{personalInfo.location}}'}</div>
                      <div>{'{{personalInfo.summary}}'}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Experience Loop:</h4>
                    <div className="font-mono text-xs bg-gray-50 p-3 rounded">
                      <div>{'{{#each experiences}}'}</div>
                      <div className="ml-4">{'{{position}}'}</div>
                      <div className="ml-4">{'{{company}}'}</div>
                      <div className="ml-4">{'{{startDate}}'}</div>
                      <div className="ml-4">{'{{endDate}}'}</div>
                      <div className="ml-4">{'{{description}}'}</div>
                      <div>{'{{/each}}'}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Education Loop:</h4>
                    <div className="font-mono text-xs bg-gray-50 p-3 rounded">
                      <div>{'{{#each education}}'}</div>
                      <div className="ml-4">{'{{school}}'}</div>
                      <div className="ml-4">{'{{degree}}'}</div>
                      <div className="ml-4">{'{{field}}'}</div>
                      <div className="ml-4">{'{{graduationDate}}'}</div>
                      <div className="ml-4">{'{{gpa}}'}</div>
                      <div>{'{{/each}}'}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Skills Loop:</h4>
                    <div className="font-mono text-xs bg-gray-50 p-3 rounded">
                      <div>{'{{#each skills}}'}</div>
                      <div className="ml-4">{'{{name}}'}</div>
                      <div className="ml-4">{'{{level}}'}</div>
                      <div>{'{{/each}}'}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Conditionals:</h4>
                    <div className="font-mono text-xs bg-gray-50 p-3 rounded">
                      <div>{'{{#if personalInfo.summary}}'}</div>
                      <div className="ml-4">Show content if summary exists</div>
                      <div>{'{{/if}}'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CSS Tips */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4">CSS Tips</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800">Use .resume-template as root:</h4>
                    <div className="font-mono text-xs bg-gray-50 p-2 rounded mt-1">
                      .resume-template {'{ /* your styles */ }'}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800">Make it responsive:</h4>
                    <div className="font-mono text-xs bg-gray-50 p-2 rounded mt-1">
                      @media (max-width: 768px) {'{ /* mobile styles */ }'}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800">Print-friendly:</h4>
                    <div className="font-mono text-xs bg-gray-50 p-2 rounded mt-1">
                      @media print {'{ /* print styles */ }'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 