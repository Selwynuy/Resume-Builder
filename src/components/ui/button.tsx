import * as React from 'react'

import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'default', size = 'default', ...props },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
    const variants: Record<string, string> = {
      default: 'bg-blue-600 hover:bg-blue-700 text-white',
      outline: 'border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50',
      ghost: 'bg-transparent text-blue-600 hover:bg-blue-50',
    }
    const sizes: Record<string, string> = {
      default: 'px-4 py-2 text-base',
      sm: 'px-3 py-1.5 text-sm',
      lg: 'px-8 py-4 text-lg',
    }
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button' 