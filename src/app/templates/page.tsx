import TemplatesPageClient from './TemplatesPageClient'
import { DocumentType } from '@/components/ui'

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
  supportedDocumentTypes?: DocumentType[]
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
      // Cast supportedDocumentTypes to DocumentType[] if present
      return (data.templates?.filter((t: any) => t.isApproved).map((t: any) => ({
        ...t,
        supportedDocumentTypes: t.supportedDocumentTypes as DocumentType[] | undefined
      })) || []) as CustomTemplate[]
    }
  } catch (error) {
    // All console.error statements removed for production
  }
  return []
}

export default async function TemplatesPage() {
  const customTemplates = await getTemplates()
  return <TemplatesPageClient templates={customTemplates} />
} 