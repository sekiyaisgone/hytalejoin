'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'glass';
  inputSize?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      inputSize = 'md',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name;

    const variants = {
      default: `
        bg-[#151f2e] border-[rgba(255,255,255,0.06)]
        hover:border-[rgba(255,255,255,0.1)]
        focus:border-[#d4a033] focus:ring-[#d4a033]/20
      `,
      glass: `
        bg-[rgba(15,23,32,0.75)] backdrop-blur-xl
        border-[rgba(255,255,255,0.1)]
        hover:border-[rgba(255,255,255,0.15)]
        focus:border-[#d4a033] focus:ring-[#d4a033]/20
        shadow-[0_4px_16px_rgba(0,0,0,0.3)]
      `,
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#f0f4f8] mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8fa6] transition-colors group-focus-within:text-[#d4a033]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full border rounded-xl text-[#f0f4f8]
              placeholder:text-[#4a5d73]
              transition-all duration-200
              focus:outline-none focus:ring-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${variants[variant]}
              ${sizes[inputSize]}
              ${leftIcon ? 'pl-11' : ''}
              ${rightIcon ? 'pr-11' : ''}
              ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a8fa6]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-[#7a8fa6]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

// Search Input variant with built-in styling
export function SearchInput({
  placeholder = 'Search...',
  value,
  onChange,
  onClear,
  className = '',
  ...props
}: {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8fa6] transition-colors group-focus-within:text-[#d4a033]">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full pl-12 pr-12 py-3.5
          bg-[rgba(15,23,32,0.75)] backdrop-blur-xl
          border border-[rgba(255,255,255,0.1)] rounded-2xl
          text-[#f0f4f8] text-base
          placeholder:text-[#4a5d73]
          transition-all duration-200
          hover:border-[rgba(255,255,255,0.15)]
          focus:outline-none focus:border-[#d4a033] focus:ring-2 focus:ring-[#d4a033]/20
          shadow-[0_4px_16px_rgba(0,0,0,0.3)]
        `}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a8fa6] hover:text-[#f0f4f8] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
