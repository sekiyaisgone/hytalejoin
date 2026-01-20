'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1a2f4a',
          color: '#e8f0f8',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          padding: '12px 16px',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#e8f0f8',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#e8f0f8',
          },
        },
      }}
    />
  );
}
