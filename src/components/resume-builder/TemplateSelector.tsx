import React from 'react';
import type { Template } from '@/lib/templates';

interface TemplateSelectorProps {
  selectedTemplate: Template | null;
  onChangeTemplate: () => void;
}

export const TemplateSelector = ({ selectedTemplate, onChangeTemplate }: TemplateSelectorProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center mr-3 text-sm">🎨</span>
          <div>
            <h4 className="font-semibold text-slate-800">Current Template</h4>
            <p className="text-slate-600 text-sm">{selectedTemplate?.name || 'No Template Selected'}</p>
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
  );
}; 