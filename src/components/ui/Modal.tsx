'use client';

import { useEffect, useCallback, useState } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizes = {
    sm: '420px',
    md: '520px',
    lg: '680px',
    xl: '900px',
  };

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      setIsAnimating(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          animation: isAnimating ? 'fadeIn 0.15s ease-out' : undefined,
        }}
      />

      {/* Modal content */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(180deg, #15243a 0%, #12161c 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          width: '100%',
          maxWidth: sizes[size],
          maxHeight: '90vh',
          overflow: 'auto',
          animation: isAnimating ? 'slideIn 0.2s ease-out' : undefined,
        }}
      >
        {/* Header */}
        {title && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <h2
              id="modal-title"
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#f1f5f9',
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#8fa3b8',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              aria-label="Close modal"
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: title ? '24px' : '24px' }}>
          {!title && (
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#8fa3b8',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                zIndex: 1,
              }}
              aria-label="Close modal"
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>
          )}
          {children}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
}
