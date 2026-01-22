'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        duration: 3500,
        style: {
          background: '#12161c',
          color: '#f0f4f8',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '14px 18px',
          fontSize: '0.875rem',
          fontWeight: 500,
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          maxWidth: '360px',
        },
        success: {
          style: {
            background: '#12161c',
            border: '1px solid rgba(34, 197, 94, 0.2)',
          },
          iconTheme: {
            primary: '#22c55e',
            secondary: '#12161c',
          },
        },
        error: {
          style: {
            background: '#12161c',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#12161c',
          },
        },
      }}
    />
  );
}
