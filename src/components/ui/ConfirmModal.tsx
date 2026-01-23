'use client';

import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

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
  const icons = {
    danger: <XCircle className="w-6 h-6 text-red-400" />,
    warning: <AlertTriangle className="w-6 h-6 text-yellow-400" />,
    info: <Info className="w-6 h-6 text-blue-400" />,
    success: <CheckCircle className="w-6 h-6 text-green-400" />,
  };

  const iconBg = {
    danger: 'bg-red-500/10',
    warning: 'bg-yellow-500/10',
    info: 'bg-blue-500/10',
    success: 'bg-green-500/10',
  };

  const confirmVariant = variant === 'danger' ? 'danger' : 'primary';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`w-14 h-14 rounded-full ${iconBg[variant]} flex items-center justify-center mb-4`}>
          {icons[variant]}
        </div>
        <h3 className="text-lg font-semibold text-[#e8f0f8] mb-2">{title}</h3>
        <p className="text-[#8fa3b8] mb-6">{message}</p>
        <div className="flex gap-3 w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            fullWidth
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            isLoading={isLoading}
            fullWidth
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
