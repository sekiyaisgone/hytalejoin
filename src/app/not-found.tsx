'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '480px',
      }}>
        {/* 404 Number */}
        <div style={{
          fontSize: '8rem',
          fontWeight: 800,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #5b8def 0%, #4a7bd4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px',
        }}>
          404
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#f1f5f9',
          marginBottom: '12px',
        }}>
          Page Not Found
        </h1>

        {/* Message */}
        <p style={{
          fontSize: '1rem',
          color: '#8899aa',
          marginBottom: '32px',
          lineHeight: 1.6,
        }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
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
              <Home style={{ width: '16px', height: '16px' }} />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              style={{
                display: 'flex',
                alignItems: 'center',
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
              <ArrowLeft style={{ width: '16px', height: '16px' }} />
              Go Back
            </button>
          </div>

          {/* Browse servers link */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '16px',
              fontSize: '0.875rem',
              color: '#6b7c8f',
              textDecoration: 'none',
            }}
          >
            <Search style={{ width: '14px', height: '14px' }} />
            Browse servers instead
          </Link>
        </div>
      </div>
    </div>
  );
}
