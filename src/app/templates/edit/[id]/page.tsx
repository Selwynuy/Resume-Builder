'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { renderTemplate, validateTemplate, extractPlaceholders } from '@/lib/template-renderer'
import { sanitizeTemplateContent } from '@/lib/security'

// Sample data for previews
const sampleData = {
  personalInfo: {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    location: "New York, NY",
    summary: "Experienced software developer with 5+ years of expertise in full-stack development"
  },
  experiences: [
    {
      position: "Senior Software Engineer",
      company: "Tech Corp",
      startDate: "2021",
      endDate: "Present",
      description: "Led development of microservices architecture serving 1M+ users"
    },
    {
      position: "Full Stack Developer",
      company: "StartupXYZ",
      startDate: "2019",
      endDate: "2021",
      description: "Built responsive web applications using React and Node.js"
    }
  ],
  education: [
    {
      school: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      graduationDate: "2019",
      gpa: "3.8"
    }
  ],
  skills: [
    { name: "JavaScript", level: "Expert" },
    { name: "React", level: "Expert" },
    { name: "Node.js", level: "Advanced" },
    { name: "Python", level: "Intermediate" }
  ]
}

interface TemplateMetadata {
  name: string
  description: string
  category: string
  price: number
}

export default function EditTemplatePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [htmlTemplate, setHtmlTemplate] = useState('')
  const [cssStyles, setCssStyles] = useState('')
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'preview'>('html')
  
  const [metadata, setMetadata] = useState<TemplateMetadata>({
    name: '',
    description: '',
    category: 'professional',
    price: 0
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    fetchTemplate()
  }, [session, status, router, params.id])

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/templates/${params.id}`)
      if (response.ok) {
        const template = await response.json()
        
        // Check if user owns this template
        if (template.createdBy !== session?.user?.id) {
          alert('You can only edit your own templates')
          router.push('/dashboard')
          return
        }
        
        setMetadata({
          name: template.name,
          description: template.description,
          category: template.category,
          price: template.price
        })
        setHtmlTemplate(template.htmlTemplate)
        setCssStyles(template.cssStyles || '')
      } else if (response.status === 404) {
        alert('Template not found')
        router.push('/dashboard')
      } else {
        alert('Error loading template')
        router.push('/dashboard')
      }
    } catch (error) {
      alert('Error loading template')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const saveTemplate = async () => {
    if (!htmlTemplate.trim() || !metadata.name || !metadata.description) {
      alert('Please fill in all required fields')
      return
    }

    const validation = validateTemplate(htmlTemplate, cssStyles)
    if (!validation.isValid) {
      alert(`Template validation failed: ${validation.errors.join(', ')}`)
      return
    }

    setSaving(true)
    try {
      const placeholders = extractPlaceholders(htmlTemplate)
      
      const response = await fetch(`/api/templates/${params.id}`, {
        method: 'PUT',
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
        alert('Template updated successfully!')
        router.push('/dashboard?tab=templates')
      } else {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        alert(`Error updating template: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Request Error:', error)
      alert(`Error updating template: ${error}`)
    } finally {
      setSaving(false)
    }
  }

  let previewResult: { html: string; css: string }
  try {
    previewResult = renderTemplate(htmlTemplate, cssStyles, sampleData)
  } catch (error) {
    previewResult = {
      html: `<div style=\"color: red; padding: 1rem;\">Template Error: ${error}</div>`,
      css: ''
    }
  }
  const previewHtml = sanitizeTemplateContent(previewResult.html, true)
  const previewCss = previewResult.css

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="glass-card p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p>Loading template...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen pt-32 pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-4">Edit Template</h1>
              <p className="text-slate-600 text-lg">
                Modify your HTML/CSS template
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard?tab=templates"
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Back to Dashboard
              </Link>
              
              <button
                onClick={saveTemplate}
                disabled={saving}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {saving ? 'Updating...' : 'Update Template'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Editor & Settings */}
            <div className="space-y-6">
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
                    <style>{previewCss}</style>
                    <div className="border border-gray-200 rounded-lg p-4 bg-white min-h-[500px] max-h-[500px] overflow-auto">
                      <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
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

              {/* Template Info */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4">Template Information</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                      Pending Approval
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Last Updated:</span>
                    <span className="ml-2 text-gray-600">{new Date().toLocaleDateString()}</span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">
                      Templates are reviewed before being made public. Updates will reset the approval status.
                    </p>
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