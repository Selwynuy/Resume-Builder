/**
 * ValidatedInput - A reusable form input component with built-in validation.
 * 
 * This component provides a consistent, accessible input field with validation
 * support, error display, and character counting. It supports both text inputs
 * and textareas with customizable validation rules and styling.
 * 
 * Features:
 * - Built-in error display and styling
 * - Character count display
 * - Required field indicators
 * - Pattern validation support
 * - Accessible labels and error messages
 * - Consistent styling with shadcn/ui components
 * 
 * @module ValidatedInput
 */

import { ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Props for the ValidatedInput component.
 */
interface ValidatedInputProps {
  /** The label text displayed above the input */
  label: string;
  /** The type of input field */
  type: 'text' | 'email' | 'tel' | 'textarea';
  /** Placeholder text shown when input is empty */
  placeholder: string;
  /** Current value of the input */
  value: string;
  /** Callback function called when input value changes */
  onChange: (value: string) => void;
  /** Error message to display below the input */
  error?: string;
  /** Maximum number of characters allowed */
  maxLength?: number;
  /** HTML pattern attribute for validation */
  pattern?: string;
  /** Number of rows for textarea (default: 4) */
  rows?: number;
  /** Whether the field is required (shows red asterisk) */
  required?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional content to display in the label area */
  children?: ReactNode;
}

/**
 * ValidatedInput component for form inputs with validation support.
 * 
 * This component renders either a text input or textarea with built-in
 * validation features including error display, character counting, and
 * required field indicators. It uses shadcn/ui components for consistent
 * styling and accessibility.
 * 
 * @param props - The component props
 * @param props.label - The label text displayed above the input
 * @param props.type - The type of input field ('text', 'email', 'tel', or 'textarea')
 * @param props.placeholder - Placeholder text shown when input is empty
 * @param props.value - Current value of the input
 * @param props.onChange - Callback function called when input value changes
 * @param props.error - Error message to display below the input
 * @param props.maxLength - Maximum number of characters allowed
 * @param props.pattern - HTML pattern attribute for validation
 * @param props.rows - Number of rows for textarea (default: 4)
 * @param props.required - Whether the field is required (shows red asterisk)
 * @param props.className - Additional CSS classes for the container
 * @param props.children - Additional content to display in the label area
 * 
 * @returns JSX element representing the validated input field
 * 
 * @example
 * ```tsx
 * // Basic text input
 * <ValidatedInput
 *   label="Full Name"
 *   type="text"
 *   placeholder="Enter your full name"
 *   value={name}
 *   onChange={setName}
 *   required
 *   maxLength={50}
 * />
 * 
 * // Email input with validation
 * <ValidatedInput
 *   label="Email Address"
 *   type="email"
 *   placeholder="Enter your email"
 *   value={email}
 *   onChange={setEmail}
 *   error={emailError}
 *   required
 * />
 * 
 * // Textarea with character count
 * <ValidatedInput
 *   label="Professional Summary"
 *   type="textarea"
 *   placeholder="Write a brief professional summary..."
 *   value={summary}
 *   onChange={setSummary}
 *   maxLength={500}
 *   rows={6}
 * />
 * ```
 */
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