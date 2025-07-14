import React from 'react';
import { render, screen } from '@testing-library/react';
import TemplatePreview from './TemplatePreview';

describe('TemplatePreview', () => {
  it('renders Resume badge with blue color', () => {
    render(<TemplatePreview template={{ _id: '1', name: '', description: '', category: '', price: 0, createdBy: '', creatorName: '', htmlTemplate: '', cssStyles: '', placeholders: [], layout: '', downloads: 0, rating: 0, ratingCount: 0, isApproved: true, createdAt: '', supportedDocumentTypes: ['resume'] }} />);
    expect(screen.getByText('Resume')).toHaveClass('bg-blue-100');
  });
  it('renders CV badge with purple color', () => {
    render(<TemplatePreview template={{ _id: '2', name: '', description: '', category: '', price: 0, createdBy: '', creatorName: '', htmlTemplate: '', cssStyles: '', placeholders: [], layout: '', downloads: 0, rating: 0, ratingCount: 0, isApproved: true, createdAt: '', supportedDocumentTypes: ['cv'] }} />);
    expect(screen.getByText('CV')).toHaveClass('bg-purple-100');
  });
  it('renders Biodata badge with green color', () => {
    render(<TemplatePreview template={{ _id: '3', name: '', description: '', category: '', price: 0, createdBy: '', creatorName: '', htmlTemplate: '', cssStyles: '', placeholders: [], layout: '', downloads: 0, rating: 0, ratingCount: 0, isApproved: true, createdAt: '', supportedDocumentTypes: ['biodata'] }} />);
    expect(screen.getByText('Biodata')).toHaveClass('bg-green-100');
  });
  it('renders multiple badges if multiple document types', () => {
    render(<TemplatePreview template={{ _id: '4', name: '', description: '', category: '', price: 0, createdBy: '', creatorName: '', htmlTemplate: '', cssStyles: '', placeholders: [], layout: '', downloads: 0, rating: 0, ratingCount: 0, isApproved: true, createdAt: '', supportedDocumentTypes: ['resume', 'cv'] }} />);
    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('CV')).toBeInTheDocument();
  });
}); 