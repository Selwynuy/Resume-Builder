import { ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ValidatedInputProps {
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  maxLength?: number;
  pattern?: string;
  rows?: number;
  required?: boolean;
  className?: string;
  children?: ReactNode;
}

export const ValidatedInput = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  maxLength,
  pattern,
  rows = 4,
  required = false,
  className = '',
  children
}: ValidatedInputProps) => {
  return (
    <div className={className}>
      <Label className="flex items-center justify-between mb-2">
        <span>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
        {children}
      </Label>
      
      {type === 'textarea' ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          maxLength={maxLength}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
            error && "border-red-300 focus-visible:ring-red-400"
          )}
        />
      ) : (
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          pattern={pattern}
          className={cn(
            error && "border-red-300 focus-visible:ring-red-400"
          )}
        />
      )}
      
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      
      {maxLength && (
        <p className="text-sm text-muted-foreground mt-2">
          {value.length}/{maxLength} characters
        </p>
      )}
    </div>
  );
}; 