'use client';

import React from 'react';
import { X, FileText, GraduationCap, User } from 'lucide-react';

export type DocumentType = 'resume' | 'cv' | 'biodata';

interface DocumentTypeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (documentType: DocumentType) => void;
}

const documentTypes = [
  {
    type: 'resume' as DocumentType,
    title: 'Resume',
    description: 'Professional resume for job applications',
    icon: FileText,
    features: [
      'Focused on work experience and skills',
      'Optimized for ATS systems',
      '1-2 pages maximum',
      'Professional and concise format'
    ],
    color: 'blue'
  },
  {
    type: 'cv' as DocumentType,
    title: 'Curriculum Vitae',
    description: 'Comprehensive academic and research profile',
    icon: GraduationCap,
    features: [
      'Detailed academic background',
      'Research publications and presentations',
      'Teaching experience and grants',
      'Can be 3-10 pages long'
    ],
    color: 'purple'
  },
  {
    type: 'biodata' as DocumentType,
    title: 'Biodata',
    description: 'Personal and family information document',
    icon: User,
    features: [
      'Personal and family details',
      'Comprehensive personal information',
      'Often used for official purposes',
      'Includes hobbies and languages'
    ],
    color: 'green'
  }
];

export default function DocumentTypeSelector({ isOpen, onClose, onSelect }: DocumentTypeSelectorProps) {
  if (!isOpen) return null;

  const handleSelect = (documentType: DocumentType) => {
    onSelect(documentType);
    onClose();
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100';
      case 'purple':
        return 'border-purple-200 hover:border-purple-300 bg-purple-50 hover:bg-purple-100';
      case 'green':
        return 'border-green-200 hover:border-green-300 bg-green-50 hover:bg-green-100';
      default:
        return 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'text-blue-600';
      case 'purple':
        return 'text-purple-600';
      case 'green':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Choose Your Document Type
            </h2>
            <p className="text-gray-600">
              Select the type of document you want to create
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documentTypes.map((docType) => {
              const IconComponent = docType.icon;
              return (
                <div
                  key={docType.type}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${getColorClasses(docType.color)}`}
                  onClick={() => handleSelect(docType.type)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(docType.type);
                    }
                  }}
                >
                  <div className="text-center mb-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-current mb-4 ${getIconColor(docType.color)}`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {docType.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {docType.description}
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {docType.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="text-green-500 mr-2 mt-0.5">•</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <button
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                        docType.color === 'blue'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : docType.color === 'purple'
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      Create {docType.title}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              You can change your document type later from the templates page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 