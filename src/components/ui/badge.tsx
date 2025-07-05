import * as React from 'react'

import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700', className)}
      {...props}
    />
  )
)
Badge.displayName = 'Badge' 