import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { TemplateSelector } from './TemplateSelector';
import { DocumentType } from './types';

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

  describe('Document Type Selection', () => {
    it('should render document type selection section', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      expect(screen.getByText('Document Type')).toBeInTheDocument();
      expect(screen.getByText('Resume')).toBeInTheDocument();
      expect(screen.getByText('CV')).toBeInTheDocument();
      expect(screen.getByText('Biodata')).toBeInTheDocument();
    });

    it('should display correct descriptions for each document type', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      expect(screen.getByText('Professional summary for job applications')).toBeInTheDocument();
      expect(screen.getByText('Comprehensive academic and professional record')).toBeInTheDocument();
      expect(screen.getByText('Personal and family information document')).toBeInTheDocument();
    });

    it('should highlight selected document type', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const resumeButton = screen.getByText('Resume').closest('button');
      expect(resumeButton).toHaveClass('border-primary-500');
      expect(resumeButton).toHaveClass('bg-gradient-to-r');
    });

    it('should call onDocumentTypeChange when document type is clicked', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const cvButton = screen.getByText('CV').closest('button');
      fireEvent.click(cvButton!);
      
      expect(defaultProps.onDocumentTypeChange).toHaveBeenCalledWith(DocumentType.CV);
    });

    it('should show checkmark icon for selected document type', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const resumeButton = screen.getByText('Resume').closest('button');
      const checkmark = resumeButton?.querySelector('svg');
      expect(checkmark).toBeInTheDocument();
    });

    it('should not show checkmark for unselected document types', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const cvButton = screen.getByText('CV').closest('button');
      const checkmark = cvButton?.querySelector('svg');
      expect(checkmark).not.toBeInTheDocument();
    });

    it('should apply correct color schemes for each document type', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const resumeButton = screen.getByText('Resume').closest('button');
      const cvButton = screen.getByText('CV').closest('button');
      const biodataButton = screen.getByText('Biodata').closest('button');
      
      expect(resumeButton).toHaveClass('from-blue-500', 'to-blue-600');
      expect(cvButton).toHaveClass('from-purple-500', 'to-purple-600');
      expect(biodataButton).toHaveClass('from-green-500', 'to-green-600');
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

    it('should show document type badge when template has document structure', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      expect(screen.getByText('Resume')).toBeInTheDocument();
      const badge = screen.getByText('Resume').closest('span');
      expect(badge).toHaveClass('bg-slate-100', 'text-slate-600');
    });

    it('should not show document type badge when template has no document structure', () => {
      const templateWithoutStructure = { ...mockTemplate, documentStructure: undefined };
      render(<TemplateSelector {...defaultProps} selectedTemplate={templateWithoutStructure} />);
      
      const badges = screen.getAllByText('Resume');
      expect(badges).toHaveLength(1); // Only the document type selection, not a badge
    });

    it('should call onChangeTemplate when change template button is clicked', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const changeButton = screen.getByText('Change Template');
      fireEvent.click(changeButton);
      
      expect(defaultProps.onChangeTemplate).toHaveBeenCalled();
    });

    it('should render change template button with correct styling', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const changeButton = screen.getByText('Change Template');
      expect(changeButton).toHaveClass('bg-gradient-to-r', 'from-primary-500', 'to-primary-600');
      expect(changeButton).toHaveClass('text-white');
    });
  });

  describe('Layout and Styling', () => {
    it('should render both sections in correct order', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const sections = screen.getAllByRole('region', { hidden: true });
      expect(sections).toHaveLength(2);
    });

    it('should apply correct spacing between sections', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const container = screen.getByText('Document Type').closest('div');
      expect(container?.parentElement).toHaveClass('space-y-6');
    });

    it('should render document type grid correctly', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const grid = screen.getByText('Document Type').closest('div')?.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-3');
    });

    it('should apply hover effects to document type buttons', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const cvButton = screen.getByText('CV').closest('button');
      expect(cvButton).toHaveClass('hover:border-slate-300', 'hover:shadow-md');
    });

    it('should apply transition effects', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const resumeButton = screen.getByText('Resume').closest('button');
      expect(resumeButton).toHaveClass('transition-all', 'duration-300');
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles for document type selection', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(4); // 3 document types + 1 change template
    });

    it('should have proper heading structure', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });

    it('should have proper text contrast for selected state', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const resumeButton = screen.getByText('Resume').closest('button');
      expect(resumeButton).toHaveClass('text-white');
    });

    it('should have proper text contrast for unselected state', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const cvButton = screen.getByText('CV').closest('button');
      expect(cvButton).toHaveClass('text-slate-800');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid layout', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const grid = screen.getByText('Document Type').closest('div')?.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-3');
    });

    it('should maintain proper spacing on mobile', () => {
      render(<TemplateSelector {...defaultProps} />);
      
      const container = screen.getByText('Document Type').closest('div');
      expect(container).toHaveClass('p-6');
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
    });

    it('should handle different document types correctly', () => {
      const cvTemplate = {
        ...mockTemplate,
        documentStructure: {
          documentType: DocumentType.CV,
          steps: [],
          maxSteps: 6,
          minSteps: 6
        }
      };
      
      render(<TemplateSelector {...defaultProps} selectedTemplate={cvTemplate} />);
      
      expect(screen.getByText('CV')).toBeInTheDocument();
    });
  });
}); 