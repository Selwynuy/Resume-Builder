import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/options'
import TemplatePreview from '@/components/TemplatePreview'

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

// Server-side rendering for templates - dynamic content with user-specific data
export const dynamic = 'force-dynamic'

async function getTemplates(): Promise<CustomTemplate[]> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/templates`, {
      cache: 'no-store'
    })
    if (response.ok) {
      const data = await response.json()
      return data.templates?.filter((t: CustomTemplate) => t.isApproved) || []
    }
  } catch (error) {
    // All console.error statements removed for production
  }
  return []
}

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions)
  const customTemplates = await getTemplates()

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const stars = []
    const fullStars = Math.floor(rating)
    const emptyStars = 5 - fullStars
    
    const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className={`${starSize} text-yellow-400 fill-current`} viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      )
    }
    
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className={`${starSize} text-gray-300 fill-current`} viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      )
    }
    
    return stars
  }

  return (
    <div className="min-h-screen pt-32 pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Resume Templates
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates. 
            All templates are optimized for ATS systems and easy to customize.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {customTemplates.map((template) => (
            <div key={template._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Template Preview */}
              <div className="p-4 bg-gray-50">
                <TemplatePreview template={template} />
              </div>
              
              {/* Template Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {template.description}
                </p>
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-2">
                    {renderStars(template.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({template.ratingCount} reviews)
                  </span>
                </div>
                
                {/* Stats */}
                <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                  <span>{template.downloads} downloads</span>
                  <span className="capitalize">{template.category}</span>
                </div>
                
                {/* Price and Action */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    {template.price === 0 ? 'Free' : `$${template.price}`}
                  </span>
                  <Link 
                    href={session ? `/resume/new?customTemplate=${template._id}` : '/login'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Use Template
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {customTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates available</h3>
            <p className="text-gray-600 mb-6">Check back later for new templates or create your own!</p>
            {session && (
              <Link 
                href="/templates/create"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Template
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 