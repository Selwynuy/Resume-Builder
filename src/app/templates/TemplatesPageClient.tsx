'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DocumentTypeSelector, DocumentType } from '@/components/ui';
import TemplatePreview from '@/components/TemplatePreview';

interface CustomTemplate {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  createdBy: string;
  creatorName: string;
  htmlTemplate: string;
  cssStyles: string;
  placeholders: string[];
  layout: string;
  downloads: number;
  rating: number;
  ratingCount: number;
  previewImage?: string;
  createdAt: string;
  tags?: string[];
  isApproved: boolean;
  supportedDocumentTypes?: DocumentType[];
}

interface TemplatesPageClientProps {
  templates: CustomTemplate[];
}

export default function TemplatesPageClient({ templates }: TemplatesPageClientProps) {
  const { data: session } = useSession();
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | null>(null);
  const [showDocumentTypeModal, setShowDocumentTypeModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams && searchParams.get('modal') === 'open') {
      setShowDocumentTypeModal(true);
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        params.delete('modal');
        const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [searchParams]);

  const filteredTemplates = selectedDocumentType
    ? templates.filter(template => 
        !template.supportedDocumentTypes || 
        template.supportedDocumentTypes.includes(selectedDocumentType)
      )
    : templates;

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    
    const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className={`${starSize} text-yellow-400 fill-current`} viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }
    
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className={`${starSize} text-gray-300 fill-current`} viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }
    
    return stars;
  };

  const getDocumentTypeBadge = (documentType: DocumentType) => {
    const badges = {
      resume: { label: 'Resume', color: 'bg-blue-100 text-blue-800' },
      cv: { label: 'CV', color: 'bg-purple-100 text-purple-800' },
      biodata: { label: 'Biodata', color: 'bg-green-100 text-green-800' }
    };
    
    const badge = badges[documentType];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen pt-32 pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Document Templates
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Choose from our collection of professionally designed templates. 
            All templates are optimized for ATS systems and easy to customize.
          </p>
          {/* Document Type Filter UI */}
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center items-center mb-4">
            {['resume', 'cv', 'biodata'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedDocumentType(type as DocumentType)}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full border text-xs sm:text-sm font-medium transition-colors duration-150 mb-1 ${selectedDocumentType === type ?
                  (type === 'resume' ? 'bg-blue-600 text-white border-blue-600' : type === 'cv' ? 'bg-purple-600 text-white border-purple-600' : 'bg-green-600 text-white border-green-600') :
                  (type === 'resume' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' : type === 'cv' ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100')}`}
              >
                {type === 'resume' ? 'Resume' : type === 'cv' ? 'CV' : 'Biodata'}
              </button>
            ))}
            {selectedDocumentType && (
              <button
                onClick={() => setSelectedDocumentType(null)}
                className="ml-0 sm:ml-2 text-gray-500 hover:text-gray-700 text-xs sm:text-sm underline mb-1"
              >
                Clear filter
              </button>
            )}
          </div>
          {/* Document Type Filter Badge (old) */}
          {/*
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {selectedDocumentType && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Filtered by:</span>
                {getDocumentTypeBadge(selectedDocumentType)}
                <button
                  onClick={() => setSelectedDocumentType(null)}
                  className="text-gray-500 hover:text-gray-700 text-sm underline"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
          */}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
          {filteredTemplates.map((template) => (
            <div key={template._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Template Preview */}
              <div className="p-4 bg-gray-50">
                <TemplatePreview template={template} />
              </div>
              
              {/* Template Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {template.name}
                  </h3>
                  {/* Document Type Badges */}
                  {template.supportedDocumentTypes && template.supportedDocumentTypes.length > 0 && (
                    <div className="flex gap-1">
                      {template.supportedDocumentTypes.map((docType) => (
                        <div key={docType}>
                          {getDocumentTypeBadge(docType)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
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
                    href={session ? `/resume/new?customTemplate=${template._id}${selectedDocumentType ? `&documentType=${selectedDocumentType}` : ''}` : '/login'}
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
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedDocumentType ? `No ${selectedDocumentType} templates available` : 'No templates available'}
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedDocumentType 
                ? `Check back later for new ${selectedDocumentType} templates or create your own!`
                : 'Check back later for new templates or create your own!'
              }
            </p>
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
      {/* Document Type Selection Modal (only opens on redirect) */}
      <DocumentTypeSelector
        isOpen={showDocumentTypeModal}
        onClose={() => setShowDocumentTypeModal(false)}
        onSelect={docType => {
          setSelectedDocumentType(docType);
          setShowDocumentTypeModal(false);
        }}
      />
    </div>
  );
} 