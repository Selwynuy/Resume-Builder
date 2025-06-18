export interface Template {
  id: string
  name: string
  description: string
  preview: string
  category: 'modern' | 'classic' | 'creative' | 'minimal'
  colors: {
    primary: string
    secondary: string
    text: string
    accent: string
  }
}

export const templates: Template[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Traditional, clean design perfect for corporate roles',
    preview: '/templates/classic-preview.png',
    category: 'classic',
    colors: {
      primary: '#000000',
      secondary: '#666666',
      text: '#000000',
      accent: '#cccccc'
    }
  },
  {
    id: 'modern',
    name: 'Modern Blue',
    description: 'Contemporary design with blue accents',
    preview: '/templates/modern-preview.png',
    category: 'modern',
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      text: '#1f2937',
      accent: '#3b82f6'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Simple, elegant design focusing on content',
    preview: '/templates/minimal-preview.png',
    category: 'minimal',
    colors: {
      primary: '#374151',
      secondary: '#6b7280',
      text: '#111827',
      accent: '#e5e7eb'
    }
  },
  {
    id: 'creative',
    name: 'Creative Purple',
    description: 'Bold design for creative professionals',
    preview: '/templates/creative-preview.png',
    category: 'creative',
    colors: {
      primary: '#7c3aed',
      secondary: '#5b21b6',
      text: '#1f2937',
      accent: '#a855f7'
    }
  }
]

export const getTemplate = (id: string): Template => {
  return templates.find(t => t.id === id) || templates[0]
} 