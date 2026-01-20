'use client';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className = '',
  hover = true,
  padding = 'md',
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div
      className={`
        bg-[rgba(26,47,74,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)]
        rounded-xl transition-all duration-300
        ${hover ? 'hover:bg-[rgba(26,47,74,0.8)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
