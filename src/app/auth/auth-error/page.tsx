'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function AuthErrorPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center',
      }}>
        {/* Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <AlertTriangle style={{ width: '32px', height: '32px', color: '#f87171' }} />
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#f1f5f9',
          marginBottom: '12px',
        }}>
          Authentication Error
        </h1>

        {/* Message */}
        <p style={{
          fontSize: '0.9375rem',
          color: '#8899aa',
          marginBottom: '8px',
          lineHeight: 1.6,
        }}>
          We couldn&apos;t complete your sign-in. This can happen if:
        </p>

        <ul style={{
          textAlign: 'left',
          fontSize: '0.875rem',
          color: '#6b7c8f',
          margin: '16px 0 24px',
          paddingLeft: '24px',
          lineHeight: 1.8,
        }}>
          <li>The confirmation link expired</li>
          <li>The link was already used</li>
          <li>There was a network issue</li>
        </ul>

        {/* Actions */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <Link
            href="/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '44px',
              padding: '0 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #5b8def 0%, #4a7bd4 100%)',
              color: 'white',
              fontSize: '0.9375rem',
              fontWeight: 500,
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(91, 141, 239, 0.25)',
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Back to Login
          </Link>

          <button
            onClick={() => window.location.reload()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '44px',
              padding: '0 24px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#c8d4e0',
              fontSize: '0.9375rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <RefreshCw style={{ width: '16px', height: '16px' }} />
            Try Again
          </button>
        </div>

        {/* Help text */}
        <p style={{
          marginTop: '24px',
          fontSize: '0.8125rem',
          color: '#6b7c8f',
        }}>
          Still having trouble?{' '}
          <Link href="/contact" style={{ color: '#5b8def', textDecoration: 'none' }}>
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
