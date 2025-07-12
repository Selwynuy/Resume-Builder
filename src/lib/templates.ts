import type { DocumentStructure } from '@/types';

export interface Template {
  id: string
  _id?: string // MongoDB document ID (optional for compatibility)
  name: string
  description: string
  preview?: string
  category?: string
  colors?: {
    primary: string
    secondary: string
    text: string
    accent: string
  }
  // Community template specific fields
  htmlTemplate?: string
  cssStyles?: string
  creator?: string
  downloads?: number
  rating?: number
  isApproved?: boolean
  // Document structure support
  documentStructure?: DocumentStructure
}

// Remove built-in templates - now using only community templates
export const templates: Template[] = []

 