'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-[#e8f0f8] mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full bg-[#1a2f4a] border rounded-lg px-4 py-3 text-[#e8f0f8]
            placeholder:text-[#8fa3b8] transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[#d29f32] focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[120px]
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-[rgba(255,255,255,0.08)]'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-[#8fa3b8]">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
