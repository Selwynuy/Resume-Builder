import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import { LoadingProvider, useLoading } from '@/components/providers/LoadingProvider'
import { useLoadingState } from './useLoadingState'

// Test component that uses the loading state hook and displays loading state
function TestComponent() {
  const { withLoading, withLoadingMessage, startLoading, stopLoading } = useLoadingState({
    type: 'api',
    autoStop: true,
    timeout: 5000
  })
  
  const { loadingState } = useLoading()
  
  const handleAsyncOperation = async () => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return 'success'
  }
  
  const handleAsyncOperationWithMessages = async () => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return 'success'
  }
  
  return (
    <div>
      <div data-testid="loading-status">
        {loadingState.isLoading ? 'loading' : 'idle'}
      </div>
      <div data-testid="loading-message">
        {loadingState.message}
      </div>
      <button 
        onClick={() => withLoading(handleAsyncOperation, 'Processing...')} 
        data-testid="with-loading"
      >
        With Loading
      </button>
      <button 
        onClick={() => withLoadingMessage(handleAsyncOperationWithMessages, {
          start: 'Starting...',
          success: 'Success!',
          error: 'Error occurred'
        })} 
        data-testid="with-messages"
      >
        With Messages
      </button>
      <button onClick={() => startLoading('Manual loading')} data-testid="start-manual">
        Start Manual
      </button>
      <button onClick={() => stopLoading()} data-testid="stop-manual">
        Stop Manual
      </button>
    </div>
  )
}

describe('useLoadingState', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should wrap async operations with loading state', async () => {
    render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    )
    
    act(() => {
      screen.getByTestId('with-loading').click()
    })
    
    // Should show loading state
    expect(screen.getByTestId('loading-status')).toHaveTextContent('loading')
    expect(screen.getByTestId('loading-message')).toHaveTextContent('Processing...')
    
    // Fast-forward time to complete the async operation
    act(() => {
      jest.advanceTimersByTime(100)
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('loading-status')).toHaveTextContent('idle')
    })
  })

  it('should handle loading with custom messages', async () => {
    render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    )
    
    act(() => {
      screen.getByTestId('with-messages').click()
    })
    
    // Should show start message
    expect(screen.getByTestId('loading-message')).toHaveTextContent('Starting...')
    
    // Fast-forward time to complete the async operation
    act(() => {
      jest.advanceTimersByTime(100)
    })
    
    // Should show success message
    await waitFor(() => {
      expect(screen.getByTestId('loading-message')).toHaveTextContent('Success!')
    })
    
    // Fast-forward time to auto-stop
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('loading-status')).toHaveTextContent('idle')
    })
  })

  it('should handle manual loading start and stop', () => {
    render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    )
    
    act(() => {
      screen.getByTestId('start-manual').click()
    })
    
    expect(screen.getByTestId('loading-status')).toHaveTextContent('loading')
    expect(screen.getByTestId('loading-message')).toHaveTextContent('Manual loading')
    
    act(() => {
      screen.getByTestId('stop-manual').click()
    })
    
    expect(screen.getByTestId('loading-status')).toHaveTextContent('idle')
  })

  it('should auto-stop loading after timeout', async () => {
    render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    )
    
    act(() => {
      screen.getByTestId('start-manual').click()
    })
    
    expect(screen.getByTestId('loading-status')).toHaveTextContent('loading')
    
    // Fast-forward time to trigger timeout
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('loading-status')).toHaveTextContent('idle')
    })
  })

  it('should handle errors in async operations', async () => {
    const errorAsyncFn = async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
      throw new Error('Test error')
    }
    
    function ErrorTestComponent() {
      const { withLoadingMessage } = useLoadingState()
      const { loadingState } = useLoading()
      
      const handleError = async () => {
        try {
          await withLoadingMessage(errorAsyncFn, {
            start: 'Starting...',
            error: 'Error occurred'
          })
        } catch (error) {
          // Error is expected and handled by the hook
        }
      }
      
      return (
        <div>
          <div data-testid="loading-status">
            {loadingState.isLoading ? 'loading' : 'idle'}
          </div>
          <div data-testid="loading-message">
            {loadingState.message}
          </div>
          <button onClick={handleError} data-testid="error-test">
            Test Error
          </button>
        </div>
      )
    }
    
    render(
      <LoadingProvider>
        <ErrorTestComponent />
      </LoadingProvider>
    )
    
    act(() => {
      screen.getByTestId('error-test').click()
    })
    
    // Should show start message
    expect(screen.getByTestId('loading-message')).toHaveTextContent('Starting...')
    
    // Fast-forward time to complete the async operation
    act(() => {
      jest.advanceTimersByTime(100)
    })
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByTestId('loading-message')).toHaveTextContent('Error occurred')
    })
    
    // Fast-forward time to auto-stop
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('loading-status')).toHaveTextContent('idle')
    })
  })
}) 