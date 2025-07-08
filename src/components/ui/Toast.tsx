'use client'

import React, { useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
  duration?: number
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  let bg = 'bg-slate-800 text-white'
  if (type === 'success') bg = 'bg-green-600 text-white'
  if (type === 'error') bg = 'bg-red-600 text-white'

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg ${bg} flex items-center gap-3 animate-fade-in`}
      style={{ minWidth: 240 }}
    >
      {type === 'success' && (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      )}
      {type === 'error' && (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      )}
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white/80 hover:text-white focus:outline-none"
        aria-label="Dismiss notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  )
}

// Add fade-in animation
// In your global CSS:
// .animate-fade-in { animation: fadeIn 0.3s ease; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } } 