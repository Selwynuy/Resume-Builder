'use client'

import { useState } from 'react'
import Link from 'next/link'
import { templates, Template } from '@/lib/templates'

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  const categories = ['all', 'classic', 'modern', 'minimal', 'creative']

  return (
    <div className="min-h-screen pt-28">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">Choose Your Template</h1>
          <p className="text-slate-600 text-lg">Select a professional template to get started</p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-2 glass-card rounded-2xl p-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'btn-gradient text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TemplateCard({ template }: { template: Template }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 group">
      {/* Template Preview */}
      <div className="h-64 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 p-6" style={{ backgroundColor: template.colors.primary + '08' }}>
          <div className="bg-white p-4 rounded-lg shadow-sm h-full">
            <div className="border-b pb-3 mb-3" style={{ borderColor: template.colors.accent }}>
              <div className="h-4 rounded mb-2" style={{ backgroundColor: template.colors.primary, width: '60%' }}></div>
              <div className="h-2 rounded" style={{ backgroundColor: template.colors.secondary, width: '40%' }}></div>
            </div>
            <div className="space-y-2">
              <div className="h-2 rounded" style={{ backgroundColor: template.colors.accent, width: '80%' }}></div>
              <div className="h-2 rounded" style={{ backgroundColor: template.colors.accent, width: '65%' }}></div>
              <div className="h-2 rounded" style={{ backgroundColor: template.colors.accent, width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-800">{template.name}</h3>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
            {template.category}
          </span>
        </div>
        <p className="text-slate-600 text-sm mb-4">{template.description}</p>
        
        {/* Color Palette */}
        <div className="flex space-x-2 mb-6">
          {Object.values(template.colors).map((color, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-full border border-slate-200"
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>

        <Link
          href={`/resume/new?template=${template.id}`}
          className="btn-gradient w-full text-center block"
        >
          Use This Template
        </Link>
      </div>
    </div>
  )
} 