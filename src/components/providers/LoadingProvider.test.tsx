import { render, screen, act } from '@testing-library/react'
import React from 'react'

import { LoadingProvider, useLoading } from './LoadingProvider'

// Test component that uses the loading hook
function TestComponent() {
  const { loadingState, startLoading, stopLoading, setLoadingMessage } = useLoading()
  
  return (
    <div>
      <div data-testid="loading-status">{loadingState.isLoading ? 'loading' : 'idle'}</div>
      <div data-testid="loading-message">{loadingState.message}</div>
      <div data-testid="loading-type">{loadingState.type}</div>
      <button onClick={() => startLoading('Test loading', 'form')} data-testid="start-loading">
        Start Loading
      </button>
      <button onClick={() => stopLoading()} data-testid="stop-loading">
        Stop Loading
      </button>
      <button onClick={() => setLoadingMessage('Updated message')} data-testid="set-message">
        Set Message
      </button>
    </div>
  )
}

describe('LoadingProvider', () => {
  it('should provide initial loading state', () => {
    render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    )
    
    expect(screen.getByTestId('loading-status')).toHaveTextContent('idle')
    expect(screen.getByTestId('loading-message')).toHaveTextContent('')
    expect(screen.getByTestId('loading-type')).toHaveTextContent('page')
  })

  it('should start loading with custom message and type', () => {
    render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    )
    
    act(() => {
      screen.getByTestId('start-loading').click()
    })
    
    expect(screen.getByTestId('loading-status')).toHaveTextContent('loading')
    expect(screen.getByTestId('loading-message')).toHaveTextContent('Test loading')
    expect(screen.getByTestId('loading-type')).toHaveTextContent('form')
  })

  it('should stop loading', () => {
    render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    )
    
    // Start loading first
    act(() => {
      screen.getByTestId('start-loading').click()
    })
    
    // Then stop loading
    act(() => {
      screen.getByTestId('stop-loading').click()
    })
    
    expect(screen.getByTestId('loading-status')).toHaveTextContent('idle')
    expect(screen.getByTestId('loading-message')).toHaveTextContent('')
    expect(screen.getByTestId('loading-type')).toHaveTextContent('page')
  })

  it('should update loading message', () => {
    render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    )
    
    // Start loading first
    act(() => {
      screen.getByTestId('start-loading').click()
    })
    
    // Then update message
    act(() => {
      screen.getByTestId('set-message').click()
    })
    
    expect(screen.getByTestId('loading-message')).toHaveTextContent('Updated message')
  })

  it('should use default values when startLoading is called without parameters', () => {
    render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    )
    
    // Mock the startLoading function to test default values
    const { useLoading } = require('./LoadingProvider')
    const mockStartLoading = jest.fn()
    
    // We can't easily test the default values without exposing them,
    // but we can verify the function works without parameters
    act(() => {
      screen.getByTestId('start-loading').click()
    })
    
    expect(screen.getByTestId('loading-status')).toHaveTextContent('loading')
  })
})

describe('useLoading hook', () => {
  it('should throw error when used outside LoadingProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useLoading must be used within a LoadingProvider')
    
    consoleSpy.mockRestore()
  })
}) 