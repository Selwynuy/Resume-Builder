import React from 'react';

import type { Template } from '@/lib/templates';
import { DocumentType } from './types';

interface TemplateSelectorProps {
  selectedTemplate: Template | null;
  selectedDocumentType: DocumentType;
  onChangeTemplate: () => void;
  onDocumentTypeChange: (documentType: DocumentType) => void;
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
  onDocumentTypeChange 
}: TemplateSelectorProps) => {
  return (
    <div className="space-y-6">
      {/* Document Type Selection */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4">Document Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(DOCUMENT_TYPE_CONFIG).map(([type, config]) => (
            <button
              key={type}
              onClick={() => onDocumentTypeChange(type as DocumentType)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300 text-left
                ${selectedDocumentType === type
                  ? `border-primary-500 bg-gradient-to-r ${config.color} text-white shadow-lg`
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <h4 className={`font-semibold ${selectedDocumentType === type ? 'text-white' : 'text-slate-800'}`}>
                    {config.name}
                  </h4>
                  <p className={`text-sm ${selectedDocumentType === type ? 'text-white/90' : 'text-slate-600'}`}>
                    {config.description}
                  </p>
                </div>
              </div>
              {selectedDocumentType === type && (
                <div className="absolute top-2 right-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Template Selection */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center mr-3 text-sm">🎨</span>
            <div>
              <h4 className="font-semibold text-slate-800">Template</h4>
              <p className="text-slate-600 text-sm">
                {selectedTemplate?.name || 'No Template Selected'}
                {selectedTemplate && (
                  <span className="ml-2 px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                    {selectedTemplate.documentStructure?.documentType || 'Resume'}
                  </span>
                )}
              </p>
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