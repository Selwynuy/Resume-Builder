'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, useEffect, useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { sanitizeTemplateContent } from '@/lib/security'
import { renderTemplate, extractPlaceholders, validateTemplate, getSampleResumeData } from '@/lib/template-renderer'

const DOCUMENT_TYPE_OPTIONS = [
  { value: 'resume', label: 'Resume' },
  { value: 'cv', label: 'CV' },
  { value: 'biodata', label: 'Biodata' }
]

interface TemplateMetadata {
  name: string
  description: string
  category: string
  price: number
}

function SettingsModal({ open, onClose, metadata, setMetadata, selectedDocumentTypes, setSelectedDocumentTypes }: { open: boolean, onClose: () => void, metadata: TemplateMetadata, setMetadata: (v: TemplateMetadata) => void, selectedDocumentTypes: string[], setSelectedDocumentTypes: React.Dispatch<React.SetStateAction<string[]>> }) {
  const [localMeta, setLocalMeta] = useState(metadata)
  useEffect(() => { setLocalMeta(metadata) }, [metadata])
  if (!open) return null

  const handleDocumentTypeChange = (type: string) => {
    setSelectedDocumentTypes((prev: string[]) =>
      prev.includes(type)
        ? prev.filter((t: string) => t !== type)
        : [...prev, type]
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Settings</h2>
        <Label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Category</Label>
        <select
          value={localMeta.category}
          onChange={e => setLocalMeta(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select category...</option>
          <option value="professional">Professional</option>
          <option value="creative">Creative</option>
          <option value="minimalist">Minimalist</option>
          <option value="academic">Academic</option>
        </select>
        <Label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Description</Label>
        <textarea
          value={localMeta.description}
          onChange={e => setLocalMeta(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          maxLength={300}
          rows={3}
          placeholder="A clean, professional template perfect for corporate positions..."
        />
        <Label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Supported Document Types</Label>
        <div className="flex gap-4 mb-4">
          {DOCUMENT_TYPE_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedDocumentTypes.includes(opt.value)}
                onChange={() => handleDocumentTypeChange(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
        <div className="flex justify-end mt-6 gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => { setMetadata(localMeta); onClose(); }}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!localMeta.category || !localMeta.description.trim() || !selectedDocumentTypes.length}
          >Save</Button>
        </div>
      </div>
    </div>
  )
}

export default function CreateTemplateClient() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [_activeTab, _setActiveTab] = useState<'html' | 'css' | 'preview'>('html')
  const [htmlTemplate, setHtmlTemplate] = useState('<div class="resume-document">\n  <h1>{{personalInfo.name}}</h1>\n  <p>{{personalInfo.email}} | {{personalInfo.phone}}</p>\n  <p>{{personalInfo.location}}</p>\n  <h2>Summary</h2>\n  <p>{{personalInfo.summary}}</p>\n</div>')
  const [cssStyles, setCssStyles] = useState('.resume-document { font-family: Arial, sans-serif; padding: 2rem; background: #fff; }')
  const [metadata, setMetadata] = useState<TemplateMetadata>({
    name: '',
    description: '',
    category: '',
    price: 0
  })
  
  const [_showPreview, _setShowPreview] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [templateId, setTemplateId] = useState<string | null>(null)
  const [_scale, setScale] = useState(0.5)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState<string[]>(['resume'])

  const sampleData = getSampleResumeData()

  let previewResult: { html: string; css: string }
  try {
    previewResult = renderTemplate(htmlTemplate, cssStyles, sampleData, true)
  } catch (err) {
    previewResult = {
      html: `<div style="color: red; padding: 1rem;">Template Error: ${err}</div>`,
      css: ''
    }
  }
      const previewHtml = sanitizeTemplateContent(previewResult.html)
  const previewCss = previewResult.css

  // Responsive preview scaling
  const PREVIEW_WIDTH = 816
  const PREVIEW_HEIGHT = 1056
  
  // Calculate responsive scale on mount and window resize
  useEffect(() => {
    const calculateScale = () => {
      if (typeof window !== 'undefined') {
        const maxW = window.innerWidth * 0.4 // 40% of viewport width
        const maxH = window.innerHeight * 0.7 // 70% of viewport height
        const newScale = Math.min(maxW / PREVIEW_WIDTH, maxH / PREVIEW_HEIGHT, 1)
        setScale(Math.max(newScale, 0.3)) // Minimum 30% scale
      }
    }
    
    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  const fetchTemplateForEdit = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/templates/${id}`)
      if (response.ok) {
        const template = await response.json()
        setHtmlTemplate(template.htmlTemplate)
        setCssStyles(template.cssStyles)
        setMetadata(template.metadata)
        setTemplateId(id)
        setIsEditing(true)
      } else {
        alert('Template not found')
        router.push('/dashboard')
      }
    } catch (error) {
      // All console.error statements removed for production
      alert('Error loading template')
      router.push('/dashboard')
    }
  }, [router])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const editId = urlParams.get('edit')
    
    if (editId) {
      setIsEditing(true)
      setTemplateId(editId)
      fetchTemplateForEdit(editId)
    }
  }, [fetchTemplateForEdit])

  const _handleLoadTemplate = (templateData: unknown) => {
    const data = templateData as { htmlTemplate: string; cssStyles: string; name: string; description: string }
    setHtmlTemplate(data.htmlTemplate)
    setCssStyles(data.cssStyles)
    setMetadata(prev => ({
      ...prev,
      name: data.name,
      description: data.description
    }))
  }

  const handlePublish = async () => {
    setError('')
    if (!metadata.name.trim() || !metadata.category || !metadata.description.trim() || !htmlTemplate.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    if (!selectedDocumentTypes.length) {
      setError('Please select at least one document type.')
      return
    }
    setIsPublishing(true)
    try {
      const validation = validateTemplate(htmlTemplate)
      if (!validation.isValid) {
        alert(`Template validation failed: ${validation.errors.join(', ')}`)
        return
      }

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
          layout: 'custom',
          supportedDocumentTypes: selectedDocumentTypes
        })
      })

      if (response.ok) {
        alert(`Template ${isEditing ? 'updated' : 'published'} successfully!`)
        router.push('/creator')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to publish template.')
      }
    } catch (err) {
      setError('Failed to publish template.')
    } finally {
      setIsPublishing(false)
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
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 mt-16">
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-1">
            <Label htmlFor="template-name-input" className="text-xs text-gray-500 font-medium mb-0.5">Template Name</Label>
            <Input
              id="template-name-input"
              type="text"
              value={metadata.name}
              onChange={e => setMetadata(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Untitled"
              className="text-lg font-semibold text-gray-900 w-64 placeholder-gray-400"
              maxLength={100}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded hover:bg-gray-200 transition-colors flex items-center justify-center"
            aria-label="Template settings"
            title="Settings"
          >
            {/* Heroicons Cog6Tooth (settings/gear) icon */}
            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.01c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.01 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.01 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.01c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.01c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.01-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.01-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.01z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <Button
            onClick={handlePublish}
            disabled={isPublishing || !metadata.name.trim() || !metadata.category || !metadata.description.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isPublishing ? 'Saving...' : 'Save Template'}
          </Button>
        </div>
      </div>
      {/* Code Editor Panels */}
      <div className="flex w-full bg-gray-50 border-b border-gray-200" style={{ minHeight: '260px' }}>
        {/* HTML Panel */}
        <div className="flex-1 border-r border-gray-200">
          <div className="flex items-center px-4 py-2 bg-gray-100 border-b border-gray-200">
            <span className="text-red-500 font-semibold mr-2">●</span>
            <span className="text-sm font-medium">HTML</span>
          </div>
          <textarea
            value={htmlTemplate}
            onChange={e => setHtmlTemplate(e.target.value)}
            className="w-full h-56 bg-gray-50 text-gray-900 font-mono text-sm p-4 focus:outline-none resize-none border-none"
            placeholder="<!-- Write your HTML template here -->"
            spellCheck={false}
          />
        </div>
        {/* CSS Panel */}
        <div className="flex-1">
          <div className="flex items-center px-4 py-2 bg-gray-100 border-b border-gray-200">
            <span className="text-blue-500 font-semibold mr-2">★</span>
            <span className="text-sm font-medium">CSS</span>
          </div>
          <textarea
            value={cssStyles}
            onChange={e => setCssStyles(e.target.value)}
            className="w-full h-56 bg-gray-50 text-gray-900 font-mono text-sm p-4 focus:outline-none resize-none border-none"
            placeholder="/* Write your CSS here */"
            spellCheck={false}
          />
        </div>
      </div>
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 text-sm text-center">{error}</div>
      )}
      {/* Preview Area */}
      <div className="w-full flex flex-col items-center py-8 bg-gray-100 min-h-[1100px]">
        <div
          className="bg-white rounded-lg shadow-lg border border-gray-200"
          style={{
            width: '816px',   // 8.5in * 96dpi
            height: '1056px', // 11in * 96dpi
            overflow: 'hidden',
            margin: '0 auto',
          }}
        >
          <style>{previewCss}</style>
          <div
            dangerouslySetInnerHTML={{ __html: previewHtml }}
            style={{
              width: '100%',
              height: '100%',
              background: 'white',
            }}
          />
        </div>
      </div>
      {/* Settings Modal */}
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} metadata={metadata} setMetadata={setMetadata} selectedDocumentTypes={selectedDocumentTypes} setSelectedDocumentTypes={setSelectedDocumentTypes} />
    </div>
  )
} 