import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentTypeSelector, { DocumentType } from './DocumentTypeSelector';

describe('DocumentTypeSelector', () => {
  const mockOnClose = jest.fn();
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <DocumentTypeSelector
        isOpen={false}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.queryByText('Choose Your Document Type')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <DocumentTypeSelector
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Choose Your Document Type')).toBeInTheDocument();
    expect(screen.getByText('Select the type of document you want to create')).toBeInTheDocument();
  });

  it('should display all three document types', () => {
    render(
      <DocumentTypeSelector
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Curriculum Vitae')).toBeInTheDocument();
    expect(screen.getByText('Biodata')).toBeInTheDocument();
  });

  it('should display document type descriptions', () => {
    render(
      <DocumentTypeSelector
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Professional resume for job applications')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive academic and research profile')).toBeInTheDocument();
    expect(screen.getByText('Personal and family information document')).toBeInTheDocument();
  });

  it('should display document type features', () => {
    render(
      <DocumentTypeSelector
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    // Resume features
    expect(screen.getByText('Focused on work experience and skills')).toBeInTheDocument();
    expect(screen.getByText('Optimized for ATS systems')).toBeInTheDocument();

    // CV features
    expect(screen.getByText('Detailed academic background')).toBeInTheDocument();
    expect(screen.getByText('Research publications and presentations')).toBeInTheDocument();

    // Biodata features
    expect(screen.getByText('Personal and family details')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive personal information')).toBeInTheDocument();
  });

  it('should call onSelect with correct document type when Resume is clicked', () => {
    render(
      <DocumentTypeSelector
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    const resumeButton = screen.getByText('Create Resume');
    fireEvent.click(resumeButton);

    expect(mockOnSelect).toHaveBeenCalledWith('resume');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onSelect with correct document type when CV is clicked', () => {
    render(
      <DocumentTypeSelector
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    const cvButton = screen.getByText('Create Curriculum Vitae');
    fireEvent.click(cvButton);

    expect(mockOnSelect).toHaveBeenCalledWith('cv');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onSelect with correct document type when Biodata is clicked', () => {
    render(
      <DocumentTypeSelector
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    const biodataButton = screen.getByText('Create Biodata');
    fireEvent.click(biodataButton);

    expect(mockOnSelect).toHaveBeenCalledWith('biodata');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <DocumentTypeSelector
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('should handle keyboard navigation for document type selection', () => {
    render(
      <DocumentTypeSelector
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    const resumeCard = screen.getByText('Resume').closest('div[role="button"]');
    expect(resumeCard).toBeInTheDocument();

    if (resumeCard) {
      fireEvent.keyDown(resumeCard, { key: 'Enter' });
      expect(mockOnSelect).toHaveBeenCalledWith('resume');
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('should display the footer message', () => {
    render(
      <DocumentTypeSelector
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('You can change your document type later from the templates page')).toBeInTheDocument();
  });
}); 