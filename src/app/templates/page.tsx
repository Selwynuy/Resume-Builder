'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { renderTemplate, getSampleResumeData } from '@/lib/template-renderer'
import { sanitizeTemplateContent } from '@/lib/security'

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

function ensureWrapper(html: string) {
  return html.includes('resume-document')
    ? html
    : `<div class="resume-document">${html}</div>`;
}

function TemplatePreview({ html, css }: { html: string; css: string }) {
  const sampleData = getSampleResumeData();
  const { html: renderedHtml, css: renderedCss } = renderTemplate(ensureWrapper(html), css, sampleData, true);
  const scale = 0.355;
  return (
    <div
      className="bg-white shadow-lg rounded-md border w-full max-w-[320px] aspect-[8.5/11] overflow-hidden flex items-center justify-center"
      style={{ position: "relative" }}
    >
      <style>{renderedCss}</style>
      <div
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
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
  );
}

export default function TemplatesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')

  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<CustomTemplate | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [showSuccessMessage, setShowSuccessMessage] = useState('')

  useEffect(() => {
    fetchCustomTemplates()
    if (session) {
      fetchUserFavorites()
    }
  }, [session])

  const fetchCustomTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      if (response.ok) {
        const data = await response.json()
        setCustomTemplates(data.templates?.filter((t: CustomTemplate) => t.isApproved) || [])
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserFavorites = async () => {
    try {
      const response = await fetch('/api/user/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites || [])
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const handleSelectCustomTemplate = async (template: CustomTemplate) => {
    if (!session) {
      alert('Please log in to use templates')
      return
    }

    // No more download tracking here
    router.push(`/resume/new?customTemplate=${template._id}`)
  }

  const handleSubmitReview = async () => {
    if (!selectedTemplate || !session) return
    
    setSubmittingReview(true)
    try {
      const response = await fetch(`/api/templates/${selectedTemplate._id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      })
      
      if (response.ok) {
        alert('Review submitted successfully!')
        setShowReviewForm(false)
        setNewReview({ rating: 5, comment: '' })
        // Refresh templates to show updated rating
        fetchCustomTemplates()
      } else {
        const error = await response.json()
        alert(error.error || 'Error submitting review')
      }
    } catch (error) {
      alert('Error submitting review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const toggleFavorite = async (templateId: string) => {
    if (!session) return
    
    const isCurrentlyFavorited = favorites.includes(templateId)
    const action = isCurrentlyFavorited ? 'remove' : 'add'
    
    // Optimistic update
    setFavorites(prev => 
      isCurrentlyFavorited 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    )
    
    try {
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, action })
      })
      
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites)
        
        // Show success message
        const actionText = action === 'add' ? 'added to' : 'removed from'
        setShowSuccessMessage(`Template ${actionText} favorites!`)
        setTimeout(() => setShowSuccessMessage(''), 3000)
      } else {
        // Revert optimistic update on error
        setFavorites(prev => 
          isCurrentlyFavorited 
            ? [...prev, templateId]
            : prev.filter(id => id !== templateId)
        )
      }
    } catch (error) {
      console.error('Error updating favorites:', error)
      // Revert optimistic update on error
      setFavorites(prev => 
        isCurrentlyFavorited 
          ? [...prev, templateId]
          : prev.filter(id => id !== templateId)
      )
    }
  }

  const filteredCustomTemplates = customTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const sortedCustomTemplates = [...filteredCustomTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return 0
    }
  })

  const getTemplatePreview = (template: CustomTemplate) => {
    try {
      const sampleData = getSampleResumeData()
      return renderTemplate(template.htmlTemplate, template.cssStyles, sampleData, true)
    } catch (error) {
      console.error('Template preview error:', error)
      return `<div style="padding: 20px; text-align: center; color: #666; font-family: Arial;">
        <div style="font-size: 24px; margin-bottom: 8px;">📄</div>
        <div>Preview unavailable</div>
      </div>`
    }
  }

  function getSanitizedPreviewAndCss(template: CustomTemplate) {
    const preview = getTemplatePreview(template)
    if (typeof preview === 'string') {
      return { html: sanitizeTemplateContent(preview, true), css: '' }
    }
    return {
      html: sanitizeTemplateContent(preview.html, true),
      css: preview.css || ''
    }
  }

  // Precompute sanitized preview and CSS for modal
  const selectedTemplatePreview = selectedTemplate ? getSanitizedPreviewAndCss(selectedTemplate) : { html: '', css: '' }

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const stars = []
    const fullStars = Math.floor(rating)
    const emptyStars = 5 - fullStars
    
    const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className={`${starSize} text-yellow-400 fill-current`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      )
    }
    
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className={`${starSize} text-gray-300 fill-current`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      )
    }
    
    return <div className="flex items-center">{stars}</div>
  }

  const categories = [
    { value: 'all', label: 'All Categories', count: customTemplates.length },
    { value: 'professional', label: 'Professional', count: customTemplates.filter(t => t.category === 'professional').length },
    { value: 'creative', label: 'Creative', count: customTemplates.filter(t => t.category === 'creative').length },
    { value: 'modern', label: 'Modern', count: customTemplates.filter(t => t.category === 'modern').length },
    { value: 'minimal', label: 'Minimal', count: customTemplates.filter(t => t.category === 'minimal').length },
    { value: 'academic', label: 'Academic', count: customTemplates.filter(t => t.category === 'academic').length }
  ]

  console.log('First template htmlTemplate:', sortedCustomTemplates[0]?.htmlTemplate);
  console.log('First template cssStyles:', sortedCustomTemplates[0]?.cssStyles);
  console.log('First communityPreview:', getSanitizedPreviewAndCss(sortedCustomTemplates[0]).html);

  return (
    <div className="min-h-screen pt-12 pb-12 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
              {showSuccessMessage}
            </div>
          )}

          {/* Small heading and Build Resume button above filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Browse Templates</h1>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                <input
                  type="text"
                    placeholder="Search templates, creators, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                </div>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label} ({cat.count})
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popular">🔥 Most Popular</option>
                <option value="rating">⭐ Highest Rated</option>
                <option value="newest">🆕 Newest</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Community Templates */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                    Available Templates ({sortedCustomTemplates.length})
                  </h2>
                </div>

                {sortedCustomTemplates.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-xl font-medium text-gray-600 mb-2">No templates found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your filters or be the first to create a template!</p>
                <Link
                  href="/templates/create"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                      Create First Template
                </Link>
              </div>
            ) : (
                  <div className="px-4 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
                      {sortedCustomTemplates.map((template, idx) => (
                        <div key={template._id} className="flex flex-col items-center w-full h-full">
                          <TemplatePreview html={template.htmlTemplate} css={template.cssStyles} />
                          <div className="w-full mt-2 bg-white shadow rounded-md p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-lg">{template.name}</span>
                              {template.price === 0 ? (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Free</span>
                              ) : (
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Premium</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{template.description}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <span>★ {template.rating.toFixed(1)} ({template.ratingCount} reviews)</span>
                              <span className="ml-auto flex items-center gap-1"><svg width="16" height="16" fill="currentColor" className="inline"><path d="M8 8a3 3 0 100-6 3 3 0 000 6zm0 1c-2.33 0-7 1.17-7 3.5V15h14v-2.5C15 10.17 10.33 9 8 9z"/></svg>{template.downloads}</span>
                            </div>
                            <button
                              onClick={() => handleSelectCustomTemplate(template)}
                              className="mt-2 w-full bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700 transition"
                            >
                              Use Template
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Template Preview Modal */}
          {selectedTemplate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedTemplate.name}</h3>
                    <p className="text-gray-600">by {selectedTemplate.creatorName}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTemplate(null)
                      setShowReviewForm(false)
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1">
                  <div className="border rounded-lg overflow-hidden" style={{ position: 'relative' }}>
                    <style>{selectedTemplatePreview.css}</style>
                    <div dangerouslySetInnerHTML={{ __html: selectedTemplatePreview.html }} />
                  </div>
                </div>
                
                <div className="p-6 border-t bg-gray-50 flex-shrink-0">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 space-y-4 lg:space-y-0">
                    <div className="flex flex-wrap items-center gap-4">
                      {renderStars(selectedTemplate.rating, 'md')}
                      <span className="text-gray-600 text-sm">
                        {selectedTemplate.rating.toFixed(1)} ({selectedTemplate.ratingCount} reviews)
                      </span>
                      <span className="text-gray-600 text-sm">
                        {selectedTemplate.downloads} downloads
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {session && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setShowReviewForm(!showReviewForm)
                          }}
                          className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                            showReviewForm 
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          ⭐ {showReviewForm ? 'Hide Review Form' : 'Write Review'}
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          handleSelectCustomTemplate(selectedTemplate)
                          setSelectedTemplate(null)
                        }}
                        className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                  
                  {/* Review Form */}
                  {showReviewForm && session && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold mb-3">Write a Review</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Rating</label>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  setNewReview(prev => ({ ...prev, rating: star }))
                                }}
                                className={`w-8 h-8 text-xl ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'} hover:scale-110 transition-transform`}
                              >
                                ⭐
                              </button>
                            ))}
                            <span className="ml-2 text-sm text-gray-600 self-center">
                              {newReview.rating} out of 5 stars
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Comment (optional)</label>
                          <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                            placeholder="Share your thoughts about this template..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            maxLength={1000}
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            {newReview.comment.length}/1000 characters
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 pt-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleSubmitReview()
                            }}
                            disabled={submittingReview}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
                          >
                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setShowReviewForm(false)
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
} 