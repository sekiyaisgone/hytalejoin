'use client';

import { AlertTriangle, Info, CheckCircle, XCircle, Star } from 'lucide-react';
import Modal from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  const config = {
    danger: {
      icon: <XCircle style={{ width: '28px', height: '28px' }} />,
      iconColor: '#ef4444',
      iconBg: 'rgba(239, 68, 68, 0.15)',
      buttonBg: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      buttonShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
    },
    warning: {
      icon: <AlertTriangle style={{ width: '28px', height: '28px' }} />,
      iconColor: '#f59e0b',
      iconBg: 'rgba(245, 158, 11, 0.15)',
      buttonBg: 'linear-gradient(135deg, #d97706, #b45309)',
      buttonShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
    },
    info: {
      icon: <Info style={{ width: '28px', height: '28px' }} />,
      iconColor: '#5b8def',
      iconBg: 'rgba(91, 141, 239, 0.15)',
      buttonBg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      buttonShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
    },
    success: {
      icon: <Star style={{ width: '28px', height: '28px' }} />,
      iconColor: '#d4a033',
      iconBg: 'rgba(212, 160, 51, 0.15)',
      buttonBg: 'linear-gradient(135deg, #d4a033, #a67c20)',
      buttonShadow: '0 4px 14px rgba(212, 160, 51, 0.3)',
    },
  };

  const { icon, iconColor, iconBg, buttonBg, buttonShadow } = config[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '8px 0' }}>
        {/* Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            color: iconColor,
          }}
        >
          {icon}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#f1f5f9',
            marginBottom: '12px',
          }}
        >
          {title}
        </h3>

        {/* Message */}
        <p
          style={{
            fontSize: '0.9375rem',
            color: '#8fa3b8',
            lineHeight: 1.6,
            marginBottom: '28px',
            maxWidth: '320px',
          }}
        >
          {message}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.03)',
              color: '#c8d4e0',
              fontSize: '0.9375rem',
              fontWeight: 500,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: '10px',
              border: 'none',
              background: buttonBg,
              color: '#fff',
              fontSize: '0.9375rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              boxShadow: buttonShadow,
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isLoading && (
              <svg
                style={{
                  width: '16px',
                  height: '16px',
                  animation: 'spin 1s linear infinite',
                }}
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{ opacity: 0.25 }}
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {confirmText}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        button:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }
      `}</style>
    </Modal>
  );
}
