'use client';

import { useEffect, useCallback } from 'react';
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
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
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
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className={`
          relative bg-[#15243a] border border-[rgba(255,255,255,0.08)]
          rounded-xl shadow-2xl w-full ${sizes[size]}
          animate-fade-in
        `}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)]">
            <h2 id="modal-title" className="text-xl font-semibold text-[#e8f0f8]">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#8fa3b8] hover:text-[#e8f0f8] hover:bg-[#1a2f4a] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className={title ? 'p-6' : 'p-6 pt-4'}>
          {!title && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg text-[#8fa3b8] hover:text-[#e8f0f8] hover:bg-[#1a2f4a] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at document body level
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
}
