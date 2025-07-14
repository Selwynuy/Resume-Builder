import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TemplatesPageClient from '@/app/templates/TemplatesPageClient';
import { DocumentType } from '@/components/ui';

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null }),
}));

// Mock useSearchParams from next/navigation
const mockGet = jest.fn();
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: mockGet }),
  useRouter: () => ({ push: jest.fn() }),
}));

const mockTemplates = [
  {
    _id: '1',
    name: 'Resume Template',
    description: 'A professional resume template',
    category: 'resume',
    price: 0,
    createdBy: 'user1',
    creatorName: 'User One',
    htmlTemplate: '',
    cssStyles: '',
    placeholders: [],
    layout: '',
    downloads: 10,
    rating: 4.5,
    ratingCount: 2,
    isApproved: true,
    supportedDocumentTypes: ['resume'] as DocumentType[],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: '2',
    name: 'CV Template',
    description: 'A detailed CV template',
    category: 'cv',
    price: 0,
    createdBy: 'user2',
    creatorName: 'User Two',
    htmlTemplate: '',
    cssStyles: '',
    placeholders: [],
    layout: '',
    downloads: 5,
    rating: 4.0,
    ratingCount: 1,
    isApproved: true,
    supportedDocumentTypes: ['cv'] as DocumentType[],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: '3',
    name: 'Biodata Template',
    description: 'A biodata template',
    category: 'biodata',
    price: 0,
    createdBy: 'user3',
    creatorName: 'User Three',
    htmlTemplate: '',
    cssStyles: '',
    placeholders: [],
    layout: '',
    downloads: 2,
    rating: 5.0,
    ratingCount: 1,
    isApproved: true,
    supportedDocumentTypes: ['biodata'] as DocumentType[],
    createdAt: '2024-01-01T00:00:00Z',
  },
];

describe('TemplatesPageClient', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('renders all templates by default', () => {
    render(<TemplatesPageClient templates={mockTemplates} />);
    expect(screen.getByText('Resume Template')).toBeInTheDocument();
    expect(screen.getByText('CV Template')).toBeInTheDocument();
    expect(screen.getByText('Biodata Template')).toBeInTheDocument();
  });

  it('filters templates by Resume', () => {
    render(<TemplatesPageClient templates={mockTemplates} />);
    const resumeButton = screen.getAllByText('Resume').find(el => el.tagName === 'BUTTON');
    fireEvent.click(resumeButton);
    expect(screen.getByText('Resume Template')).toBeInTheDocument();
    expect(screen.queryByText('CV Template')).not.toBeInTheDocument();
    expect(screen.queryByText('Biodata Template')).not.toBeInTheDocument();
  });

  it('filters templates by CV', () => {
    render(<TemplatesPageClient templates={mockTemplates} />);
    const cvButton = screen.getAllByText('CV').find(el => el.tagName === 'BUTTON');
    fireEvent.click(cvButton);
    expect(screen.getByText('CV Template')).toBeInTheDocument();
    expect(screen.queryByText('Resume Template')).not.toBeInTheDocument();
    expect(screen.queryByText('Biodata Template')).not.toBeInTheDocument();
  });

  it('filters templates by Biodata', () => {
    render(<TemplatesPageClient templates={mockTemplates} />);
    const biodataButton = screen.getAllByText('Biodata').find(el => el.tagName === 'BUTTON');
    fireEvent.click(biodataButton);
    expect(screen.getByText('Biodata Template')).toBeInTheDocument();
    expect(screen.queryByText('Resume Template')).not.toBeInTheDocument();
    expect(screen.queryByText('CV Template')).not.toBeInTheDocument();
  });

  it('clears filter and shows all templates again', () => {
    render(<TemplatesPageClient templates={mockTemplates} />);
    const resumeButton = screen.getAllByText('Resume').find(el => el.tagName === 'BUTTON');
    fireEvent.click(resumeButton);
    expect(screen.getByText('Resume Template')).toBeInTheDocument();
    expect(screen.queryByText('CV Template')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Clear filter'));
    expect(screen.getByText('Resume Template')).toBeInTheDocument();
    expect(screen.getByText('CV Template')).toBeInTheDocument();
    expect(screen.getByText('Biodata Template')).toBeInTheDocument();
  });

  it('shows badges for supported document types', () => {
    render(<TemplatesPageClient templates={mockTemplates} />);
    expect(screen.getAllByText('Resume')[0]).toBeInTheDocument();
    expect(screen.getAllByText('CV')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Biodata')[0]).toBeInTheDocument();
  });
}); 