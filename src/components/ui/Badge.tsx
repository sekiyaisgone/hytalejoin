'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gold';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}: BadgeProps) {
  const variants = {
    default: 'bg-[#1a2f4a] text-[#8fa3b8]',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
    gold: 'bg-[#d29f32]/20 text-[#d29f32]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full uppercase tracking-wide
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
