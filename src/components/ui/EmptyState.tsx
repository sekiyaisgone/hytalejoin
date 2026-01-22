'use client';

import Link from 'next/link';
import { Server, Search, Frown } from 'lucide-react';

interface EmptyStateProps {
  variant?: 'no-servers' | 'no-results' | 'error';
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  isLoggedIn?: boolean;
  onRetry?: () => void;
}

export default function EmptyState({
  variant = 'no-servers',
  title,
  description,
  onClearFilters,
  hasActiveFilters = false,
  isLoggedIn = false,
  onRetry,
}: EmptyStateProps) {
  const configs = {
    'no-servers': {
      icon: Server,
      defaultTitle: 'No servers yet',
      defaultDescription: 'Be the first to add your Hytale server to our directory.',
    },
    'no-results': {
      icon: Search,
      defaultTitle: 'No servers found',
      defaultDescription: 'Try adjusting your search or filters to find what you\'re looking for.',
    },
    error: {
      icon: Frown,
      defaultTitle: 'Something went wrong',
      defaultDescription: 'We couldn\'t load the servers. Please try again.',
    },
  };

  const config = configs[variant];
  const Icon = config.icon;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <Icon style={{ width: '24px', height: '24px', color: '#6b7c8f' }} />
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#f0f4f8',
          marginBottom: '8px',
        }}
      >
        {title || config.defaultTitle}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '0.875rem',
          color: '#6b7c8f',
          maxWidth: '320px',
          lineHeight: 1.5,
          marginBottom: '24px',
        }}
      >
        {description || config.defaultDescription}
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        {/* Error retry */}
        {variant === 'error' && onRetry && (
          <button
            onClick={onRetry}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'white',
              background: 'linear-gradient(135deg, #5b8def 0%, #4a7bd4 100%)',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Try Again
          </button>
        )}

        {/* No results actions */}
        {variant === 'no-results' && onClearFilters && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '10px 20px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: hasActiveFilters ? '#c8d4e0' : '#4a5d73',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                cursor: hasActiveFilters ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                opacity: hasActiveFilters ? 1 : 0.5,
              }}
            >
              {hasActiveFilters ? 'Clear filters' : 'No filters active'}
            </button>
          </div>
        )}

        {/* Add server CTA - shown below filter actions */}
        {(variant === 'no-servers' || variant === 'no-results') && (
          <div style={{ marginTop: '8px' }}>
            {isLoggedIn ? (
              <Link
                href="/servers/new"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8125rem',
                  color: '#5b8def',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
              >
                <span>Add a server</span>
                <span style={{ fontSize: '1rem' }}>→</span>
              </Link>
            ) : (
              <Link
                href="/login?redirect=/servers/new"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8125rem',
                  color: '#6b7c8f',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
              >
                <span>Sign in to add a server</span>
                <span style={{ fontSize: '1rem' }}>→</span>
              </Link>
            )}
          </div>
        )}
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '10px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <Icon style={{ width: '20px', height: '20px', color: '#6b7c8f' }} />
      </div>
      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#f0f4f8', marginBottom: '4px' }}>
        {title}
      </h4>
      {description && (
        <p style={{ fontSize: '0.8125rem', color: '#6b7c8f', maxWidth: '280px' }}>
          {description}
        </p>
      )}
    </div>
  );
}
