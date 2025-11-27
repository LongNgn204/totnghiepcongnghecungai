import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  showClose?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClass: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children, showClose = true, size = 'md' }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="overlay z-50" role="dialog" aria-modal="true">
      <div className={`absolute-center w-full ${sizeClass[size]} px-4`}>
        <div className="bg-surface border border-border rounded-2xl shadow-xl">
          {(title || showClose) && (
            <div className="flex-between px-4 py-3 border-b border-border">
              <h3 className="text-h5">{title}</h3>
              {showClose && (
                <button onClick={onClose} className="btn-icon" aria-label="Đóng">
                  <X size={18} />
                </button>
              )}
            </div>
          )}
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

