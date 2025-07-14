import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { TemplateSelector } from './TemplateSelector';
import { DocumentType } from './types';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock template data
const mockTemplate = {
  id: 'test-template',
  name: 'Test Template',
  description: 'A test template',
  documentStructure: {
    documentType: DocumentType.RESUME,
    steps: [],
    maxSteps: 5,
    minSteps: 5
  }
};

describe('TemplateSelector', () => {
  const defaultProps = {
    selectedTemplate: mockTemplate,
    selectedDocumentType: DocumentType.RESUME,
    onChangeTemplate: jest.fn(),
    onDocumentTypeChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Back to Templates Button', () => {
    it('should render back to templates button', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      expect(screen.getByText('Back to Templates')).toBeInTheDocument();
    });

    it('should have correct styling for back button', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const backButton = screen.getByText('Back to Templates').closest('button');
      expect(backButton).toHaveClass('text-slate-600', 'hover:text-slate-800', 'border-slate-300');
    });

    it('should have back arrow icon', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const backButton = screen.getByText('Back to Templates').closest('button');
      const arrowIcon = backButton?.querySelector('svg');
      expect(arrowIcon).toBeInTheDocument();
    });
  });

  describe('Template Selection', () => {
    it('should render template selection section', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      expect(screen.getByText('Template')).toBeInTheDocument();
      expect(screen.getByText('Test Template')).toBeInTheDocument();
    });

    it('should display template name correctly', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      expect(screen.getByText('Test Template')).toBeInTheDocument();
    });

    it('should display "No Template Selected" when no template is provided', () => {
      render(<TemplateSelector {...defaultProps} selectedTemplate={null} />);
      
      expect(screen.getByText('No Template Selected')).toBeInTheDocument();
    });

    it('should show document type badge below template name', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const badge = screen.getByText('resume');
      expect(badge).toHaveClass('bg-slate-100', 'text-slate-500');
    });

    it('should not show document type badge when template has no document structure', () => {
      const templateWithoutStructure = { ...mockTemplate, documentStructure: undefined };
      render(<TemplateSelector {...defaultProps} selectedTemplate={templateWithoutStructure} />);
      
      // Should show default 'Resume' text
      expect(screen.getByText('Resume')).toBeInTheDocument();
    });

    it('should call onChangeTemplate when change template button is clicked', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const changeButton = screen.getByText('Change Template');
      fireEvent.click(changeButton);
      
      expect(defaultProps.onChangeTemplate).toHaveBeenCalled();
    });

    it('should render change template button with correct styling', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const changeButton = screen.getByText('Change Template').closest('button');
      expect(changeButton).toBeInTheDocument();
      expect(changeButton).toHaveClass('text-white');
    });
  });

  describe('Document Type Display', () => {
    it('should display document type as read-only label', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const badge = screen.getByText('resume');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-slate-100', 'text-slate-500');
    });

    it('should display document type below template name', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const templateName = screen.getByText('Test Template');
      const documentType = screen.getByText('resume');
      
      // The document type should be in a separate div below the template name
      expect(templateName.closest('p')).toBeInTheDocument();
      expect(documentType.closest('div')).toBeInTheDocument();
    });

    it('should handle different document types correctly', () => {
      const cvTemplate = {
        ...mockTemplate,
        documentStructure: {
          ...mockTemplate.documentStructure,
          documentType: DocumentType.CV
        }
      };
      
      render(<TemplateSelector {...defaultProps} selectedTemplate={cvTemplate} />);
      
      expect(screen.getByText('cv')).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should render sections in correct order', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const sections = screen.getAllByRole('region', { hidden: true });
      expect(sections).toHaveLength(1); // Only template selection section
    });

    it('should apply correct spacing between sections', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const container = screen.getByText('Back to Templates').closest('div')?.parentElement;
      expect(container).toHaveClass('space-y-6');
    });

    it('should apply transition effects', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const changeButton = screen.getByText('Change Template').closest('button');
      expect(changeButton).toHaveClass('transition-all', 'duration-300');
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2); // Back button + change template
    });

    it('should have proper heading structure', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      expect(screen.getByText('Template')).toBeInTheDocument();
    });

    it('should have proper text contrast for buttons', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const changeButton = screen.getByText('Change Template').closest('button');
      expect(changeButton).toHaveClass('text-white');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null template gracefully', () => {
      render(<TemplateSelector {...defaultProps} selectedTemplate={null} />);
      
      expect(screen.getByText('No Template Selected')).toBeInTheDocument();
      expect(screen.queryByText('Test Template')).not.toBeInTheDocument();
    });

    it('should handle template without document structure', () => {
      const templateWithoutStructure = { ...mockTemplate, documentStructure: undefined };
      render(<TemplateSelector {...defaultProps} selectedTemplate={templateWithoutStructure} />);
      
      expect(screen.getByText('Test Template')).toBeInTheDocument();
      expect(screen.getByText('Resume')).toBeInTheDocument(); // Default fallback
    });
  });
}); 