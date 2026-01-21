'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'gold-outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
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
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center font-semibold
      transition-all duration-200 ease-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f16]
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      active:scale-[0.98]
    `;

    const variants = {
      primary: `
        bg-gradient-to-r from-[#d4a033] to-[#a67c20] text-white
        shadow-[0_2px_8px_rgba(212,160,51,0.3)]
        hover:shadow-[0_0_30px_rgba(212,160,51,0.25)]
        hover:-translate-y-0.5
        focus-visible:ring-[#d4a033]
        relative overflow-hidden
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
        before:opacity-0 hover:before:opacity-100 before:transition-opacity
      `,
      secondary: `
        bg-[#151f2e] text-[#f0f4f8]
        border border-[rgba(255,255,255,0.06)]
        hover:border-[#d4a033] hover:bg-[#1a2942]
        hover:shadow-[0_0_0_1px_#d4a033]
        focus-visible:ring-[#d4a033]
      `,
      ghost: `
        bg-transparent text-[#7a8fa6]
        hover:text-[#f0f4f8] hover:bg-[rgba(26,41,66,0.5)]
        focus-visible:ring-[#d4a033]
      `,
      danger: `
        bg-gradient-to-r from-red-600 to-red-700 text-white
        shadow-[0_2px_8px_rgba(239,68,68,0.3)]
        hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]
        hover:-translate-y-0.5
        focus-visible:ring-red-500
      `,
      outline: `
        bg-transparent text-[#f0f4f8]
        border border-[rgba(255,255,255,0.1)]
        hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.03)]
        focus-visible:ring-[#d4a033]
      `,
      'gold-outline': `
        bg-transparent text-[#d4a033]
        border border-[#d4a033]/40
        hover:border-[#d4a033] hover:bg-[#d4a033]/10
        hover:shadow-[0_0_20px_rgba(212,160,51,0.15)]
        focus-visible:ring-[#d4a033]
      `,
    };

    const sizes = {
      xs: 'px-2.5 py-1 text-xs gap-1 rounded-md',
      sm: 'px-3.5 py-2 text-sm gap-1.5 rounded-lg',
      md: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
      lg: 'px-6 py-3 text-base gap-2.5 rounded-xl',
      xl: 'px-8 py-4 text-lg gap-3 rounded-2xl',
    };

    const iconSizes = {
      xs: 'w-3 h-3',
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
    };

    return (
      <button
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : (
          leftIcon && <span className={iconSizes[size]}>{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className={iconSizes[size]}>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

// Icon-only button variant
export function IconButton({
  children,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}: Omit<ButtonProps, 'leftIcon' | 'rightIcon'>) {
  const sizeStyles = {
    xs: 'w-7 h-7',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  const variants = {
    primary: `
      bg-gradient-to-r from-[#d4a033] to-[#a67c20] text-white
      shadow-[0_2px_8px_rgba(212,160,51,0.3)]
      hover:shadow-[0_0_20px_rgba(212,160,51,0.25)]
    `,
    secondary: `
      bg-[#151f2e] text-[#f0f4f8]
      border border-[rgba(255,255,255,0.06)]
      hover:border-[#d4a033] hover:bg-[#1a2942]
    `,
    ghost: `
      bg-transparent text-[#7a8fa6]
      hover:text-[#f0f4f8] hover:bg-[rgba(26,41,66,0.5)]
    `,
    danger: `bg-red-600/20 text-red-400 hover:bg-red-600/30`,
    outline: `
      bg-transparent text-[#f0f4f8]
      border border-[rgba(255,255,255,0.1)]
      hover:border-[rgba(255,255,255,0.2)]
    `,
    'gold-outline': `
      bg-transparent text-[#d4a033]
      border border-[#d4a033]/40
      hover:border-[#d4a033] hover:bg-[#d4a033]/10
    `,
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-xl
        transition-all duration-200 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a033]
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        ${variants[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
