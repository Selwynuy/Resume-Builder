'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { templates } from '@/lib/templates'
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

export default function TemplatesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')

  const [loading, setLoading] = useState(true)
  const [showBuiltIn, setShowBuiltIn] = useState(true)
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

  const handleSelectBuiltInTemplate = (templateId: string) => {
    router.push(`/resume/new?template=${templateId}`)
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

  const filteredBuiltInTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
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
      return `<div style="padding: 2rem; color: #666; text-align: center; font-family: Arial, sans-serif;">
        <div style="font-size: 48px; margin-bottom: 1rem;">📄</div>
        <div>Preview not available</div>
        <div style="font-size: 12px; margin-top: 1rem; opacity: 0.7;">${error instanceof Error ? error.message : 'Unknown error'}</div>
      </div>`
    }
  }

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

  return (
    <div className="min-h-screen pt-32 pb-12 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
              {showSuccessMessage}
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-text mb-6">Template Marketplace</h1>
            <p className="text-slate-600 text-xl mb-8 max-w-3xl mx-auto">
              Discover professional resume templates crafted by our community. 
              Choose from free and premium options or create your own.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/resume/new"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 font-semibold shadow-lg"
              >
                📝 Build Resume
              </Link>
            </div>
          </div>



          {/* Quick Filter Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => {setSortBy('popular'); setSelectedCategory('all')}}
              className={`px-4 py-2 rounded-full transition-colors ${sortBy === 'popular' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              🔥 Most Popular
            </button>
            <button
              onClick={() => {setSortBy('rating'); setSelectedCategory('all')}}
              className={`px-4 py-2 rounded-full transition-colors ${sortBy === 'rating' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              ⭐ Top Rated
            </button>
            <button
              onClick={() => {setSortBy('newest'); setSelectedCategory('all')}}
              className={`px-4 py-2 rounded-full transition-colors ${sortBy === 'newest' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              🆕 Recently Added
            </button>
            <button
              onClick={() => {setSelectedCategory('professional')}}
              className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === 'professional' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              💼 Professional
            </button>
            <button
              onClick={() => {setSelectedCategory('creative')}}
              className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === 'creative' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              🎨 Creative
            </button>
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
              {/* Featured/Trending Templates */}
              {customTemplates.length > 0 && (
                <section>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">🔥 Trending Templates</h2>
                    <p className="text-gray-600">Most popular templates this week</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sortedCustomTemplates.slice(0, 4).map((template, index) => (
                      <div key={template._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative border-2 border-yellow-200">
                        {/* Trending Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                            #{index + 1} Trending
                </span>
                        </div>
                        
                        {/* Preview */}
                        <div className="bg-gray-50 h-48 relative">
                          {template.previewImage ? (
                            <img 
                              src={template.previewImage} 
                              alt={template.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div 
                              className="w-full h-full overflow-hidden"
                              dangerouslySetInnerHTML={{ __html: getTemplatePreview(template) }}
                              style={{ transform: 'scale(0.15)', transformOrigin: 'top left', width: '666%', height: '666%' }}
                            />
                          )}
                          
                          {/* Favorite Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(template._id)
                            }}
                            className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-sm hover:bg-opacity-100 transition-all"
                          >
                            {favorites.includes(template._id) ? '❤️' : '🤍'}
                          </button>
                          
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                            <button
                              onClick={() => setSelectedTemplate(template)}
                              className="bg-white bg-opacity-90 text-gray-800 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 font-medium text-sm"
                            >
                              👁 Preview
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1 line-clamp-1">
                                {template.name}
                              </h3>
                              <p className="text-xs text-gray-500">by {template.creatorName}</p>
                            </div>
                            <div className="text-right">
                              {template.price === 0 ? (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                                  Free
                                </span>
                              ) : (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                                  ${template.price}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {renderStars(template.rating, 'sm')}
                              <span className="ml-1 text-xs text-gray-600">
                                ({template.ratingCount})
                              </span>
                            </div>
                            
                            <div className="flex items-center text-xs text-gray-500">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              {template.downloads}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {/* Built-in Templates */}
              {showBuiltIn && filteredBuiltInTemplates.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm mr-3">Built-in</span>
                      Professional Templates
                    </h2>
                      </div>
                      
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBuiltInTemplates.map((template) => (
                      <div key={template.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
                          <div className="text-6xl">📄</div>
                      </div>
                        
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                              {template.name}
                            </h3>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-sm font-medium">
                              Free
                            </span>
                    </div>

                          <p className="text-gray-600 mb-4">{template.description}</p>
                      
                      <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
                          {template.category}
                        </span>
                            
                            <button
                              onClick={() => handleSelectBuiltInTemplate(template.id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              Use Template
                            </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
                </section>
              )}

              {/* Community Templates */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg text-sm mr-3">Community</span>
                    Premium Templates ({sortedCustomTemplates.length})
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedCustomTemplates.map((template) => (
                      <div key={template._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative">
                    {/* Preview */}
                        <div className="bg-gray-50 h-80 relative">
                      {template.previewImage ? (
                        <img
                          src={template.previewImage}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                            <div 
                              className="w-full h-full overflow-hidden"
                              dangerouslySetInnerHTML={{ __html: getTemplatePreview(template) }}
                              style={{ transform: 'scale(0.35)', transformOrigin: 'top left', width: '285%', height: '285%' }}
                            />
                          )}
                          
                          {/* Favorite Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(template._id)
                            }}
                            className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-sm hover:bg-opacity-100 transition-all"
                          >
                            {favorites.includes(template._id) ? '❤️' : '🤍'}
                          </button>
                          
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                            <button
                              onClick={() => setSelectedTemplate(template)}
                              className="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 font-medium"
                            >
                              👁 Preview
                        </button>
                      </div>
                    </div>

                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                                {template.name}
                              </h3>
                              <p className="text-sm text-gray-500">by {template.creatorName}</p>
                            </div>
                            <div className="text-right">
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-semibold">
                                Free
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-4">{template.description}</p>
                          
                          <div className="flex items-center mb-4">
                            {renderStars(template.rating)}
                            <span className="ml-2 text-sm text-gray-600">
                              {template.rating.toFixed(1)} ({template.ratingCount} reviews)
                        </span>
                      </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            {template.downloads}
                            </div>
                            
                            <button
                              onClick={() => handleSelectCustomTemplate(template)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              Use Template
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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
                  <div 
                    className="border rounded-lg overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: getTemplatePreview(selectedTemplate) }}
                  />
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