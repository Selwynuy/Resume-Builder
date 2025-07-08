import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AISuggestionModal, { AIFeatureType, AISuggestionModalProps } from './AISuggestionModal'

// Mock fetch
global.fetch = jest.fn()

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

const mockProps: AISuggestionModalProps = {
  isOpen: true,
  onClose: jest.fn(),
  featureType: 'experience',
  currentText: 'Test experience description',
  onApplySuggestion: jest.fn(),
  context: {},
  index: 0
}

describe('AISuggestionModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('[]')
  })

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(<AISuggestionModal {...mockProps} isOpen={false} />)
      expect(screen.queryByText('AI Experience Description Suggestions')).not.toBeInTheDocument()
    })

    it('should render when isOpen is true', () => {
      render(<AISuggestionModal {...mockProps} />)
      expect(screen.getByText('AI Experience Description Suggestions')).toBeInTheDocument()
    })

    it('should display correct title for different feature types', () => {
      const { rerender } = render(<AISuggestionModal {...mockProps} featureType="skills" />)
      expect(screen.getByText('AI Skills Suggestions')).toBeInTheDocument()

      rerender(<AISuggestionModal {...mockProps} featureType="summary" />)
      expect(screen.getByText('AI Professional Summary Suggestions')).toBeInTheDocument()

      rerender(<AISuggestionModal {...mockProps} featureType="bullet" />)
      expect(screen.getByText('AI Bullet Point Suggestions')).toBeInTheDocument()
    })

    it('should show close button', () => {
      render(<AISuggestionModal {...mockProps} />)
      expect(screen.getByLabelText('Close')).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner when generating suggestions', async () => {
      ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {})) // Never resolves
      
      render(<AISuggestionModal {...mockProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('Generating suggestions...')).toBeInTheDocument()
        expect(screen.getByRole('status')).toBeInTheDocument() // Spinner
      })
    })
  })

  describe('API Integration', () => {
    it('should call correct API endpoint for experience suggestions', async () => {
      const mockResponse = {
        summaries: {
          resultsOriented: 'Test result 1',
          teamPlayer: 'Test result 2'
        }
      }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      render(<AISuggestionModal {...mockProps} featureType="experience" />)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/ai/bullet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: 'Test experience description',
            mode: 'multi',
            stylePrompt: ''
          }),
          signal: expect.any(AbortSignal)
        })
      })
    })

    it('should call correct API endpoint for skills suggestions', async () => {
      const mockResponse = { skills: ['JavaScript', 'React', 'TypeScript'] }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      render(<AISuggestionModal {...mockProps} featureType="skills" />)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/ai/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeContent: '',
            experienceDescriptions: '',
            jobTitle: '',
            industry: ''
          }),
          signal: expect.any(AbortSignal)
        })
      })
    })

    it('should call correct API endpoint for summary suggestions', async () => {
      const mockResponse = {
        summaries: {
          professional: 'Professional summary',
          creative: 'Creative summary'
        }
      }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      render(<AISuggestionModal {...mockProps} featureType="summary" currentText="Existing summary" />)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/ai/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'improve',
            text: 'Existing summary',
            context: ''
          }),
          signal: expect.any(AbortSignal)
        })
      })
    })
  })

  describe('Error Handling', () => {
    it('should display error message when API call fails', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      render(<AISuggestionModal {...mockProps} />)

      await waitFor(() => {
        expect(screen.getByText('Error generating suggestions')).toBeInTheDocument()
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })

    it('should display error message when API returns error response', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal server error'
      })

      render(<AISuggestionModal {...mockProps} />)

      await waitFor(() => {
        expect(screen.getByText('Error generating suggestions')).toBeInTheDocument()
        expect(screen.getByText(/API error: 500/)).toBeInTheDocument()
      })
    })

    it('should show retry button when error occurs', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      render(<AISuggestionModal {...mockProps} />)

      await waitFor(() => {
        expect(screen.getByText('Try Again (3 attempts left)')).toBeInTheDocument()
      })
    })

    it('should handle retry attempts correctly', async () => {
      ;(fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('First error'))
        .mockRejectedValueOnce(new Error('Second error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ summaries: { professional: 'Success' } })
        })

      render(<AISuggestionModal {...mockProps} />)

      // Wait for first error
      await waitFor(() => {
        expect(screen.getByText('Try Again (3 attempts left)')).toBeInTheDocument()
      })

      // Click retry
      fireEvent.click(screen.getByText('Try Again (3 attempts left)'))

      // Wait for second error
      await waitFor(() => {
        expect(screen.getByText('Try Again (2 attempts left)')).toBeInTheDocument()
      })

      // Click retry again
      fireEvent.click(screen.getByText('Try Again (2 attempts left)'))

      // Wait for success
      await waitFor(() => {
        expect(screen.getByText('professional')).toBeInTheDocument()
      })
    })

    it('should show refresh page button after max retries', async () => {
      ;(fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      render(<AISuggestionModal {...mockProps} />)

      // Retry 3 times
      for (let i = 0; i < 3; i++) {
        await waitFor(() => {
          expect(screen.getByText(`Try Again (${3 - i} attempts left)`)).toBeInTheDocument()
        })
        fireEvent.click(screen.getByText(`Try Again (${3 - i} attempts left)`))
      }

      await waitFor(() => {
        expect(screen.getByText('Refresh Page')).toBeInTheDocument()
      })
    })
  })

  describe('Suggestion Display', () => {
    it('should display multi-style suggestions for experience', async () => {
      const mockResponse = {
        summaries: {
          resultsOriented: 'Results-oriented suggestion',
          teamPlayer: 'Team player suggestion'
        }
      }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      render(<AISuggestionModal {...mockProps} featureType="experience" />)

      await waitFor(() => {
        expect(screen.getByText('results Oriented')).toBeInTheDocument()
        expect(screen.getByText('team Player')).toBeInTheDocument()
        expect(screen.getByText('Results-oriented suggestion')).toBeInTheDocument()
        expect(screen.getByText('Team player suggestion')).toBeInTheDocument()
      })
    })

    it('should display skills suggestions correctly', async () => {
      const mockResponse = { skills: ['JavaScript', 'React'] }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      render(<AISuggestionModal {...mockProps} featureType="skills" />)

      await waitFor(() => {
        expect(screen.getByText('JavaScript')).toBeInTheDocument()
        expect(screen.getByText('React')).toBeInTheDocument()
        expect(screen.getAllByText('Add Skill')).toHaveLength(2)
      })
    })

    it('should display single suggestion correctly', async () => {
      const mockResponse = { suggestion: 'Single suggestion text' }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      render(<AISuggestionModal {...mockProps} featureType="bullet" />)

      await waitFor(() => {
        expect(screen.getByText('Single suggestion text')).toBeInTheDocument()
        expect(screen.getByText('Use This')).toBeInTheDocument()
      })
    })
  })

  describe('User Interactions', () => {
    it('should call onClose when close button is clicked', () => {
      render(<AISuggestionModal {...mockProps} />)
      
      fireEvent.click(screen.getByLabelText('Close'))
      
      expect(mockProps.onClose).toHaveBeenCalled()
    })

    it('should call onApplySuggestion when suggestion is selected', async () => {
      const mockResponse = {
        summaries: {
          professional: 'Professional suggestion'
        }
      }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      render(<AISuggestionModal {...mockProps} featureType="experience" />)

      await waitFor(() => {
        expect(screen.getByText('Use This')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Use This'))

      expect(mockProps.onApplySuggestion).toHaveBeenCalledWith('Professional suggestion')
      expect(mockProps.onClose).toHaveBeenCalled()
    })

    it('should call onApplySuggestion for skills with Add Skill button', async () => {
      const mockResponse = { skills: ['JavaScript'] }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      render(<AISuggestionModal {...mockProps} featureType="skills" />)

      await waitFor(() => {
        expect(screen.getByText('Add Skill')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Add Skill'))

      expect(mockProps.onApplySuggestion).toHaveBeenCalledWith('JavaScript')
      expect(mockProps.onClose).toHaveBeenCalled()
    })
  })

  describe('Context Handling', () => {
    it('should pass context to API for skills suggestions', async () => {
      const mockResponse = { skills: ['Test'] }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const context = {
        resumeContent: 'Test resume content',
        jobTitle: 'Software Engineer',
        industry: 'Technology'
      }

      render(<AISuggestionModal {...mockProps} featureType="skills" context={context} />)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/ai/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeContent: 'Test resume content',
            jobTitle: 'Software Engineer',
            industry: 'Technology',
            experienceDescriptions: ''
          }),
          signal: expect.any(AbortSignal)
        })
      })
    })
  })

  describe('Timeout Handling', () => {
    it('should handle request timeout', async () => {
      jest.useFakeTimers()
      
      // Mock fetch to throw AbortError after timeout
      ;(fetch as jest.Mock).mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            const abortError = new Error('Request timed out. Please try again.')
            abortError.name = 'AbortError'
            reject(abortError)
          }, 30000)
        })
      })

      render(<AISuggestionModal {...mockProps} />)

      // Fast-forward time to trigger timeout
      jest.advanceTimersByTime(30000)

      await waitFor(() => {
        expect(screen.getByText('Request timed out. Please try again.')).toBeInTheDocument()
      })

      jest.useRealTimers()
    })
  })
}) 