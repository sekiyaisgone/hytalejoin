'use client';

import { forwardRef } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  glow?: 'none' | 'gold' | 'cyan';
  /** @deprecated Use variant="interactive" instead */
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className = '',
      variant = 'default',
      padding = 'md',
      rounded = 'xl',
      glow = 'none',
      hover = true,
      ...props
    },
    ref
  ) => {
    // Handle deprecated hover prop
    const effectiveVariant = hover === false ? 'default' : variant;
    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-6',
      xl: 'p-8',
    };

    const roundedStyles = {
      sm: 'rounded-lg',
      md: 'rounded-xl',
      lg: 'rounded-2xl',
      xl: 'rounded-3xl',
      '2xl': 'rounded-[2rem]',
    };

    const variants = {
      default: `
        bg-[rgba(15,23,32,0.75)] backdrop-blur-xl
        border border-[rgba(255,255,255,0.06)]
        shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
      `,
      glass: `
        bg-[rgba(26,41,66,0.5)] backdrop-blur-2xl
        border border-[rgba(255,255,255,0.1)]
        shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]
      `,
      elevated: `
        bg-[#151f2e]
        border border-[rgba(255,255,255,0.06)]
        shadow-[0_8px_32px_rgba(0,0,0,0.5)]
      `,
      interactive: `
        bg-[rgba(15,23,32,0.75)] backdrop-blur-xl
        border border-[rgba(255,255,255,0.06)]
        shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
        transition-all duration-300 ease-out cursor-pointer
        hover:border-[rgba(255,255,255,0.1)]
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]
        hover:-translate-y-1
      `,
    };

    const glowStyles = {
      none: '',
      gold: 'ring-1 ring-[#d4a033]/20 shadow-[0_0_30px_rgba(212,160,51,0.15)]',
      cyan: 'ring-1 ring-[#38bdf8]/20 shadow-[0_0_30px_rgba(56,189,248,0.15)]',
    };

    return (
      <div
        ref={ref}
        className={`
          relative overflow-hidden
          ${variants[effectiveVariant]}
          ${paddingStyles[padding]}
          ${roundedStyles[rounded]}
          ${glowStyles[glow]}
          ${className}
        `}
        {...props}
      >
        {/* Subtle gradient overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 50%, transparent 100%)',
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;

// Card Header component
export function CardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

// Card Title component
export function CardTitle({
  children,
  className = '',
  as: Component = 'h3',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}) {
  return (
    <Component className={`text-lg font-semibold text-[#f0f4f8] ${className}`}>
      {children}
    </Component>
  );
}

// Card Description component
export function CardDescription({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-sm text-[#7a8fa6] mt-1 ${className}`}>
      {children}
    </p>
  );
}

// Card Content component
export function CardContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

// Card Footer component
export function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)] ${className}`}>
      {children}
    </div>
  );
}
