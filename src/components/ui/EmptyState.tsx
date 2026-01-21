'use client';

import Link from 'next/link';
import { Server, Search, Plus, Frown } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  variant?: 'no-servers' | 'no-results' | 'error';
  title?: string;
  description?: string;
  showCTA?: boolean;
  ctaText?: string;
  ctaHref?: string;
  onRetry?: () => void;
}

export default function EmptyState({
  variant = 'no-servers',
  title,
  description,
  showCTA = true,
  ctaText,
  ctaHref = '/servers/new',
  onRetry,
}: EmptyStateProps) {
  const configs = {
    'no-servers': {
      icon: Server,
      defaultTitle: 'No servers yet',
      defaultDescription: 'Be the first to add your Hytale server to our directory and connect with players worldwide.',
      defaultCtaText: 'Add Your Server',
    },
    'no-results': {
      icon: Search,
      defaultTitle: 'No servers found',
      defaultDescription: 'Try adjusting your search or filters to find what you\'re looking for.',
      defaultCtaText: 'Clear Filters',
    },
    error: {
      icon: Frown,
      defaultTitle: 'Something went wrong',
      defaultDescription: 'We couldn\'t load the servers. Please try again.',
      defaultCtaText: 'Try Again',
    },
  };

  const config = configs[variant];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Glowing icon container */}
      <div className="relative mb-8">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#d4a033]/20 rounded-full blur-2xl scale-150" />

        {/* Icon circle */}
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#1a2942] to-[#151f2e] border border-[rgba(255,255,255,0.06)] flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <Icon className="w-10 h-10 text-[#d4a033]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-[#f0f4f8] mb-3">
        {title || config.defaultTitle}
      </h3>
      <p className="text-[#7a8fa6] max-w-md mb-8 leading-relaxed">
        {description || config.defaultDescription}
      </p>

      {/* CTA Button */}
      {showCTA && (
        <>
          {variant === 'error' && onRetry ? (
            <Button
              variant="primary"
              size="lg"
              onClick={onRetry}
              leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
            >
              {ctaText || config.defaultCtaText}
            </Button>
          ) : (
            <Link href={ctaHref}>
              <Button
                variant="primary"
                size="lg"
                leftIcon={variant === 'no-servers' ? <Plus className="w-5 h-5" /> : undefined}
              >
                {ctaText || config.defaultCtaText}
              </Button>
            </Link>
          )}
        </>
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#d4a033]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#38bdf8]/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

// Compact empty state for smaller areas
export function CompactEmptyState({
  title = 'Nothing here yet',
  description,
  icon: Icon = Server,
}: {
  title?: string;
  description?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-xl bg-[#1a2942] border border-[rgba(255,255,255,0.06)] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-[#7a8fa6]" />
      </div>
      <h4 className="text-lg font-semibold text-[#f0f4f8] mb-1">{title}</h4>
      {description && (
        <p className="text-sm text-[#7a8fa6] max-w-xs">{description}</p>
      )}
    </div>
  );
}
