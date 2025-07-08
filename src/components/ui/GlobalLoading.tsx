'use client'

import { useLoading } from '@/components/providers/LoadingProvider'

export function GlobalLoading() {
  const { loadingState } = useLoading()

  if (!loadingState.isLoading) {
    return null
  }

  const getLoadingContent = () => {
    switch (loadingState.type) {
      case 'page':
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full mx-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Loading</h3>
                <p className="text-slate-600">{loadingState.message}</p>
              </div>
            </div>
          </div>
        )
      
      case 'form':
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full mx-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent mx-auto mb-3"></div>
                <p className="text-sm text-slate-600">{loadingState.message}</p>
              </div>
            </div>
          </div>
        )
      
      case 'api':
        return (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"></div>
                <span className="text-sm text-slate-600">{loadingState.message}</span>
              </div>
            </div>
          </div>
        )
      
      case 'file':
        return (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"></div>
                <span className="text-sm text-slate-600">{loadingState.message}</span>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full mx-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-slate-600">{loadingState.message}</p>
              </div>
            </div>
          </div>
        )
    }
  }

  return getLoadingContent()
} 