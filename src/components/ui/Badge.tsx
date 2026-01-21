'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gold' | 'cyan' | 'purple' | 'outline';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  dot?: boolean;
  pulse?: boolean;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  dot = false,
  pulse = false,
}: BadgeProps) {
  const variants = {
    default: `
      bg-[#1a2942] text-[#7a8fa6]
      border border-[rgba(255,255,255,0.06)]
    `,
    success: `
      bg-emerald-500/15 text-emerald-400
      border border-emerald-500/20
    `,
    warning: `
      bg-amber-500/15 text-amber-400
      border border-amber-500/20
    `,
    error: `
      bg-red-500/15 text-red-400
      border border-red-500/20
    `,
    gold: `
      bg-[#d4a033]/15 text-[#f0c35a]
      border border-[#d4a033]/30
    `,
    cyan: `
      bg-cyan-500/15 text-cyan-400
      border border-cyan-500/20
    `,
    purple: `
      bg-purple-500/15 text-purple-400
      border border-purple-500/20
    `,
    outline: `
      bg-transparent text-[#7a8fa6]
      border border-[rgba(255,255,255,0.1)]
    `,
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const dotColors = {
    default: 'bg-[#7a8fa6]',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    error: 'bg-red-400',
    gold: 'bg-[#f0c35a]',
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-400',
    outline: 'bg-[#7a8fa6]',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-semibold rounded-full
        uppercase tracking-wide
        transition-colors duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full flex-shrink-0
            ${dotColors[variant]}
            ${pulse ? 'animate-pulse' : ''}
          `}
        />
      )}
      {children}
    </span>
  );
}

// Status badge with built-in dot
export function StatusBadge({
  status,
  className = '',
}: {
  status: 'online' | 'offline' | 'pending' | 'maintenance';
  className?: string;
}) {
  const config = {
    online: { variant: 'success' as const, label: 'Online', pulse: true },
    offline: { variant: 'error' as const, label: 'Offline', pulse: false },
    pending: { variant: 'warning' as const, label: 'Pending', pulse: true },
    maintenance: { variant: 'purple' as const, label: 'Maintenance', pulse: false },
  };

  const { variant, label, pulse } = config[status];

  return (
    <Badge variant={variant} size="sm" dot pulse={pulse} className={className}>
      {label}
    </Badge>
  );
}

// Tag badge for categories/game modes
export function TagBadge({
  children,
  active = false,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const baseStyles = `
    inline-flex items-center
    px-3 py-1.5 rounded-full
    text-xs font-semibold uppercase tracking-wide
    transition-all duration-200 ease-out
    cursor-pointer select-none
  `;

  const activeStyles = active
    ? `
      bg-gradient-to-r from-[#d4a033] to-[#a67c20] text-white
      shadow-[0_2px_8px_rgba(212,160,51,0.3)]
    `
    : `
      bg-[#1a2942] text-[#7a8fa6]
      border border-[rgba(255,255,255,0.06)]
      hover:bg-[#1a2942]/80 hover:text-[#f0f4f8]
      hover:border-[rgba(255,255,255,0.1)]
    `;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseStyles} ${activeStyles} ${className}`}
    >
      {children}
    </button>
  );
}
