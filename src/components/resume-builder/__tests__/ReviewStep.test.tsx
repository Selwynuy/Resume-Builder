import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ReviewStep } from '../ReviewStep'
import { ToastProvider } from '@/components/providers/ToastProvider'

const renderWithToast = (component: React.ReactElement) => {
  return render(
    <ToastProvider>
      {component}
    </ToastProvider>
  )
}

describe('ReviewStep delete actions', () => {
  const baseProps = {
    resumeData: {
      personalInfo: { name: '', email: '', phone: '', location: '', summary: '' },
      experiences: [
        { company: 'A', position: 'Dev', startDate: '', endDate: '', description: '' },
        { company: 'B', position: 'Eng', startDate: '', endDate: '', description: '' }
      ],
      education: [
        { school: 'X', degree: 'BS', field: '', graduationDate: '', gpa: '' },
        { school: 'Y', degree: 'MS', field: '', graduationDate: '', gpa: '' }
      ],
      skills: [
        { name: 'JS', format: 'text' },
        { name: 'TS', format: 'text' }
      ],
      template: ''
    },
    selectedTemplate: null,
    onSave: jest.fn(),
    onExport: jest.fn(),
    onChangeTemplate: jest.fn(),
    isLoading: false,
    saveMessage: '',
    updatePersonalInfo: jest.fn(),
    updateExperience: jest.fn(),
    addExperience: jest.fn(),
    removeExperience: jest.fn(),
    updateEducation: jest.fn(),
    addEducation: jest.fn(),
    removeEducation: jest.fn(),
    updateSkill: jest.fn(),
    addSkill: jest.fn(),
    removeSkill: jest.fn()
  }

  it('shows confirmation modal and calls removeExperience', async () => {
    renderWithToast(<ReviewStep {...baseProps} />)
    fireEvent.click(screen.getAllByText('Edit')[1])
    fireEvent.click(screen.getAllByText('Remove')[0])
    expect(screen.getByText('Remove Experience?')).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0])
    await waitFor(() => expect(baseProps.removeExperience).toHaveBeenCalled())
    expect(screen.getByText('Experience removed')).toBeInTheDocument()
  })

  it('shows confirmation modal and calls removeEducation', async () => {
    renderWithToast(<ReviewStep {...baseProps} />)
    fireEvent.click(screen.getAllByText('Edit')[2])
    fireEvent.click(screen.getAllByText('Remove')[0])
    expect(screen.getByText('Remove Education?')).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0])
    await waitFor(() => expect(baseProps.removeEducation).toHaveBeenCalled())
    expect(screen.getByText('Education removed')).toBeInTheDocument()
  })

  it('shows confirmation modal and calls removeSkill', async () => {
    renderWithToast(<ReviewStep {...baseProps} />)
    fireEvent.click(screen.getAllByText('Edit')[3])
    fireEvent.click(screen.getAllByText('Remove')[0])
    expect(screen.getByText('Remove Skill?')).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0])
    await waitFor(() => expect(baseProps.removeSkill).toHaveBeenCalled())
    expect(screen.getByText('Skill removed')).toBeInTheDocument()
  })

  it('shows loading state on remove', async () => {
    let resolvePromise: () => void
    const removePromise = new Promise<void>(resolve => {
      resolvePromise = resolve
    })
    
    const asyncProps = {
      ...baseProps,
      removeExperience: jest.fn(() => removePromise)
    }
    
    renderWithToast(<ReviewStep {...asyncProps} />)
    fireEvent.click(screen.getAllByText('Edit')[1])
    fireEvent.click(screen.getAllByText('Remove')[0])
    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0])
    
    // Wait for the loading state to appear
    await waitFor(() => {
      expect(screen.getByText('Removing...')).toBeInTheDocument()
    })
    
    // Verify the function was called
    expect(asyncProps.removeExperience).toHaveBeenCalled()
    
    // Resolve the promise to complete the test
    resolvePromise!()
  })
}) 