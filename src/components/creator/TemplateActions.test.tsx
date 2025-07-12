import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TemplateActions from './TemplateActions'
import { TemplateTableRow } from './TemplateTable'

describe('TemplateActions', () => {
  const template: TemplateTableRow = {
    _id: '1',
    name: 'Modern',
    description: 'Modern template',
    category: 'professional',
    price: 0,
    createdAt: new Date().toISOString(),
    approvalStatus: 'approved',
  }

  it('calls onAction for each button', () => {
    const onAction = jest.fn()
    render(<TemplateActions template={template} onAction={onAction} />)
    fireEvent.click(screen.getByText('Edit'))
    expect(onAction).toHaveBeenCalledWith('edit', template)
    fireEvent.click(screen.getByText('Preview'))
    expect(onAction).toHaveBeenCalledWith('preview', template)
    fireEvent.click(screen.getByText('Duplicate'))
    expect(onAction).toHaveBeenCalledWith('duplicate', template)
    fireEvent.click(screen.getByText('Delete'))
    expect(onAction).toHaveBeenCalledWith('delete', template)
  })
}) 