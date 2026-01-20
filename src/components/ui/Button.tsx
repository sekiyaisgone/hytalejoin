'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1923] disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-gradient-to-r from-[#d29f32] to-[#b59553] text-white hover:from-[#e5b343] hover:to-[#d29f32] hover:shadow-[0_0_20px_rgba(210,159,50,0.3)] focus-visible:ring-[#d29f32]',
      secondary:
        'bg-[#1a2f4a] text-[#e8f0f8] border border-[rgba(255,255,255,0.08)] hover:border-[#d29f32] hover:bg-[#15243a] focus-visible:ring-[#d29f32]',
      ghost:
        'bg-transparent text-[#8fa3b8] hover:text-[#e8f0f8] hover:bg-[#1a2f4a] focus-visible:ring-[#d29f32]',
      danger:
        'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
