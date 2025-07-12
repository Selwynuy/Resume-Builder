import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TemplateTable from './TemplateTable'

const mockTemplates = [
  {
    _id: '1',
    name: 'Professional Template',
    description: 'A professional template for business use',
    category: 'professional' as const,
    price: 0,
    approvalStatus: 'approved' as const,
    downloads: 150,
    rating: 4.5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    _id: '2',
    name: 'Creative Template',
    description: 'A creative template for artistic portfolios',
    category: 'creative' as const,
    price: 10,
    approvalStatus: 'pending' as const,
    downloads: 75,
    rating: 4.2,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  }
]

describe('TemplateTable', () => {
  const mockOnAction = jest.fn()
  const mockOnSort = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders templates correctly', () => {
    render(
      <TemplateTable
        templates={mockTemplates}
        onAction={mockOnAction}
        onSort={mockOnSort}
        sortBy="name"
        sortDir="asc"
      />
    )

    expect(screen.getByText('Professional Template')).toBeInTheDocument()
    expect(screen.getByText('Creative Template')).toBeInTheDocument()
    expect(screen.getByText('professional')).toBeInTheDocument()
    expect(screen.getByText('creative')).toBeInTheDocument()
  })

  it('displays approval status with correct colors', () => {
    render(
      <TemplateTable
        templates={mockTemplates}
        onAction={mockOnAction}
        onSort={mockOnSort}
        sortBy="name"
        sortDir="asc"
      />
    )

    const approvedStatus = screen.getByText('Approved')
    const pendingStatus = screen.getByText('Pending')

    expect(approvedStatus).toHaveClass('bg-green-100', 'text-green-700')
    expect(pendingStatus).toHaveClass('bg-yellow-100', 'text-yellow-700')
  })

  it('calls onSort when header is clicked', () => {
    render(
      <TemplateTable
        templates={mockTemplates}
        onAction={mockOnAction}
        onSort={mockOnSort}
        sortBy="name"
        sortDir="asc"
      />
    )

    fireEvent.click(screen.getByText('Name'))
    expect(mockOnSort).toHaveBeenCalledWith('name')
  })

  it('shows sort indicators', () => {
    render(
      <TemplateTable
        templates={mockTemplates}
        onAction={mockOnAction}
        onSort={mockOnSort}
        sortBy="name"
        sortDir="asc"
      />
    )

    const nameHeader = screen.getByText('Name')
    expect(nameHeader).toHaveClass('font-semibold')
  })

  it('calls onAction when action buttons are clicked', () => {
    render(
      <TemplateTable
        templates={mockTemplates}
        onAction={mockOnAction}
        onSort={mockOnSort}
        sortBy="name"
        sortDir="asc"
      />
    )

    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])
    expect(mockOnAction).toHaveBeenCalledWith('edit', mockTemplates[0])

    const deleteButtons = screen.getAllByText('Delete')
    fireEvent.click(deleteButtons[0])
    expect(mockOnAction).toHaveBeenCalledWith('delete', mockTemplates[0])
  })

  it('displays download count and rating', () => {
    render(
      <TemplateTable
        templates={mockTemplates}
        onAction={mockOnAction}
        onSort={mockOnSort}
        sortBy="name"
        sortDir="asc"
      />
    )

    expect(screen.getByText('150')).toBeInTheDocument()
    expect(screen.getByText('75')).toBeInTheDocument()
    expect(screen.getByText('★★★★★')).toBeInTheDocument()
    expect(screen.getByText('★★★★☆')).toBeInTheDocument()
  })

  // Remove the empty state test, as TemplateTable does not render it
}) 