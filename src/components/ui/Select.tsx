'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  variant?: 'default' | 'glass';
  selectSize?: 'sm' | 'md' | 'lg';
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      variant = 'default',
      selectSize = 'md',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || props.name;

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
      sm: 'px-3 py-2 text-sm pr-9',
      md: 'px-4 py-3 text-base pr-10',
      lg: 'px-5 py-4 text-lg pr-12',
    };

    const iconSizes = {
      sm: 'w-4 h-4 right-2.5',
      md: 'w-5 h-5 right-3',
      lg: 'w-6 h-6 right-4',
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[#f0f4f8] mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full border rounded-xl text-[#f0f4f8]
              appearance-none cursor-pointer
              transition-all duration-200
              focus:outline-none focus:ring-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${variants[variant]}
              ${sizes[selectSize]}
              ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-[#151f2e] text-[#f0f4f8]"
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className={`
              absolute top-1/2 -translate-y-1/2 pointer-events-none
              text-[#7a8fa6] transition-colors
              ${iconSizes[selectSize]}
            `}
          />
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

Select.displayName = 'Select';

export default Select;

// Sort Select variant with built-in styling
export function SortSelect({
  value,
  onChange,
  options,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          appearance-none cursor-pointer
          pl-4 pr-10 py-3
          bg-[#151f2e] border border-[rgba(255,255,255,0.06)] rounded-xl
          text-[#f0f4f8] text-sm font-medium
          transition-all duration-200
          hover:border-[rgba(255,255,255,0.1)]
          focus:outline-none focus:border-[#d4a033] focus:ring-2 focus:ring-[#d4a033]/20
        `}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#151f2e] text-[#f0f4f8]"
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a8fa6] pointer-events-none" />
    </div>
  );
}
