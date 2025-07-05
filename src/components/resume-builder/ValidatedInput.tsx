import { ReactNode } from 'react';

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
  const inputClassName = `w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
    error 
      ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
      : 'border-slate-200 focus:ring-primary-400 focus:border-transparent'
  } ${type === 'textarea' ? 'resize-none' : ''} ${className}`;

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
        <span>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
        {children}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          maxLength={maxLength}
          className={inputClassName}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          pattern={pattern}
          className={inputClassName}
        />
      )}
      
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      
      {maxLength && (
        <p className="text-sm text-slate-500 mt-2">
          {value.length}/{maxLength} characters
        </p>
      )}
    </div>
  );
}; 