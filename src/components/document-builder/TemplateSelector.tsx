import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import type { Template } from '@/lib/templates';
import { DocumentType } from './types';

interface TemplateSelectorProps {
  selectedTemplate: Template | null;
  selectedDocumentType: DocumentType;
  onChangeTemplate: () => void;
  onDocumentTypeChange: (documentType: DocumentType) => void;
  autoOpenModal?: boolean;
}

const DOCUMENT_TYPE_CONFIG = {
  [DocumentType.RESUME]: {
    name: 'Resume',
    icon: '📄',
    description: 'Professional summary for job applications',
    color: 'from-blue-500 to-blue-600'
  },
  [DocumentType.CV]: {
    name: 'CV',
    icon: '📋',
    description: 'Comprehensive academic and professional record',
    color: 'from-purple-500 to-purple-600'
  },
  [DocumentType.BIODATA]: {
    name: 'Biodata',
    icon: '👤',
    description: 'Personal and family information document',
    color: 'from-green-500 to-green-600'
  }
};

export const TemplateSelector = ({ 
  selectedTemplate, 
  selectedDocumentType,
  onChangeTemplate, 
  onDocumentTypeChange,
  autoOpenModal = false
}: TemplateSelectorProps) => {
  const router = useRouter();

  const handleBackToTemplates = () => {
    router.push('/templates');
  };

  useEffect(() => {
    if (autoOpenModal) {
      // TODO: trigger modal open logic here
      // e.g., setModalOpen(true)
    }
  }, [autoOpenModal]);

  return (
    <div className="space-y-6">
      {/* Back to Templates Button */}
      <div className="flex justify-start">
            <button
          onClick={handleBackToTemplates}
          className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 border border-slate-300 hover:border-slate-400 rounded-lg transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
          <span>Back to Templates</span>
            </button>
      </div>

      {/* Template Selection */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm" role="region" aria-label="Template Selection">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center mr-3 text-sm">🎨</span>
            <div>
              <h4 className="font-semibold text-slate-800">Template</h4>
              <p className="text-slate-600 text-sm">
                {selectedTemplate?.name || 'No Template Selected'}
              </p>
                {selectedTemplate && (
                <div className="mt-1">
                  <span className="inline-block px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded font-medium">
                    {selectedTemplate.documentStructure?.documentType || 'Resume'}
                  </span>
                </div>
                )}
            </div>
          </div>
          <button
            onClick={onChangeTemplate}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <span>Change Template</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 