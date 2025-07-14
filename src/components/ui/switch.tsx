'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(event.target.checked);
      }
    };

    return (
      <label className={cn('relative inline-flex items-center cursor-pointer', className)}>
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            'w-11 h-6 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out',
            'after:content-[""] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-200',
            checked && 'bg-blue-600 after:translate-x-full',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      </label>
    );
  }
);

Switch.displayName = 'Switch'; 